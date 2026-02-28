# 资深 iOS 开发工程师面试题库（含答案）

> 整理时间：2026-02-28  
> 适用岗位：资深 iOS 开发工程师  
> 语言要求：Swift / Objective-C

---

## 一、基础知识

---

### Q1. Swift 中 `struct` 和 `class` 的核心区别是什么？在实际项目中如何选择？

**区别：**

| | struct | class |
|---|---|---|
| 类型 | 值类型 | 引用类型 |
| 内存 | 栈（通常） | 堆 |
| 继承 | ❌ | ✅ |
| ARC | ❌ | ✅ |
| 拷贝 | 深拷贝（Copy-on-Write） | 浅拷贝（共享引用） |

**Copy-on-Write（COW）：** Swift 的 Array/Dictionary/String 都是 struct，但只有真正修改时才触发复制，读操作共享内存，性能开销极低。

**选择原则：**
- 用 `struct`：数据模型（Model）、几何结构（CGRect）、无需继承、线程安全的场景
- 用 `class`：需要继承、需要共享状态、与 OC 互操作、生命周期需要管理（delegate）

> 苹果官方建议：**优先 struct，除非明确需要 class 的特性**

---

### Q2. OC 中 `@property` 的修饰符有哪些？`copy` 修饰 NSString 的原因？

**常见修饰符：**
- `strong`：强引用，引用计数+1，用于对象类型
- `weak`：弱引用，不增加引用计数，对象释放后自动置 nil，用于 delegate、IBOutlet
- `copy`：拷贝一份新对象，用于 NSString、Block
- `assign`：直接赋值，用于基本数据类型（int/float/BOOL）
- `nonatomic`：非原子操作，不加锁，性能更好（iOS 开发几乎都用）
- `atomic`：原子操作，加锁，线程安全但性能差

**`copy` 修饰 NSString 的原因：**

```objc
// 如果用 strong：
NSMutableString *mStr = [NSMutableString stringWithString:@"hello"];
self.name = mStr;
[mStr appendString:@" world"];
NSLog(@"%@", self.name); // 输出 "hello world"，被意外修改！

// 如果用 copy：
self.name = mStr;
[mStr appendString:@" world"];
NSLog(@"%@", self.name); // 输出 "hello"，安全
```

> Block 也必须用 `copy`，因为 Block 默认在栈上，`copy` 将其移到堆上，防止栈帧销毁后访问野指针。

---

### Q3. Swift 的 `Optional` 本质是什么？各种解包方式适用场景？

**本质：** Optional 是一个枚举

```swift
enum Optional<Wrapped> {
    case none
    case some(Wrapped)
}
```

**解包方式对比：**

```swift
// ❌ 强解包 — 确定不为 nil 时才用，否则崩溃
let len = name!.count

// ✅ if let — 局部作用域内使用
if let name = name {
    print(name)
}

// ✅ guard let — 提前退出，后续代码可直接用（推荐）
guard let name = name else { return }
print(name)

// ✅ ?? 空合运算符 — 提供默认值
let display = name ?? "匿名"

// ✅ 可选链 — 链式调用，任意一环为 nil 则整体为 nil
let count = user?.profile?.name?.count
```

**最佳实践：** 优先 `guard let`，禁止随意 `!` 强解包。

---

### Q4. UIView 和 CALayer 的关系是什么？为什么这样设计？

- `UIView` 负责：**事件响应**（触摸、手势）、**布局**（frame/autolayout）
- `CALayer` 负责：**渲染显示**（内容绘制、动画、合成）

**为什么分开设计？**
1. **职责分离**：渲染和交互逻辑解耦，各自独立优化
2. **跨平台复用**：macOS 上是 `NSView + CALayer`，渲染层完全复用
3. **性能**：Layer 的动画在独立的 Render Server 进程中完成，不阻塞主线程

```swift
// 注意：同时设置 cornerRadius 和 shadow 会触发离屏渲染
view.layer.cornerRadius = 8
view.layer.shouldRasterize = true
view.layer.rasterizationScale = UIScreen.main.scale
```

---

### Q5. GCD 和 NSOperationQueue 各自的优缺点？

| | GCD | NSOperationQueue |
|---|---|---|
| 级别 | 底层 C API | 基于 GCD 的 OC 封装 |
| 依赖关系 | ❌ | ✅ `addDependency` |
| 取消操作 | ❌ | ✅ `cancel()` |
| 最大并发数 | ❌ | ✅ `maxConcurrentOperationCount` |
| KVO 监听 | ❌ | ✅ 可监听 isFinished/isExecuting |
| 代码简洁性 | ✅ 更简洁 | 相对复杂 |

**选择原则：**
- 简单异步任务、一次性并发 → **GCD**
- 需要依赖、取消、进度监控、复杂任务流 → **NSOperationQueue**

---

## 二、底层原理

---

### Q6. OC Runtime 消息发送机制 / objc_msgSend 完整流程

OC 方法调用 `[obj method]` 编译后变成：`objc_msgSend(obj, @selector(method))`

**完整查找流程：**

```
1. receiver 为 nil → 直接返回（nil 消息安全）
2. 方法缓存查找（cache_t）→ 命中直接调用（汇编，极快）
3. 方法列表查找 → 当前类 → 沿 superclass 链逐级向上 → 找到后写入 cache
4. 动态方法解析 → +resolveInstanceMethod: 可动态添加方法实现
5. 消息转发（快速）→ -forwardingTargetForSelector: 转给其他对象
6. 消息转发（完整）→ -methodSignatureForSelector: + -forwardInvocation:
7. 以上均失败 → doesNotRecognizeSelector: → Crash
```

> Method Swizzling 就是利用 runtime 在步骤3替换方法实现（IMP）。

---

### Q7. `weak` 指针的实现原理

**底层结构：**
- Runtime 维护全局 `SideTables`（64个，哈希分散锁竞争）
- 每个 `SideTable` 包含：引用计数表（`RefcountMap`）+ 弱引用表（`weak_table_t`）
- `weak_table_t` 是哈希表，key 是对象地址，value 是所有 weak 指针地址数组

**对象释放时：**
```
dealloc → objc_destructInstance
  → weak_clear_no_lock() → 遍历 weak_table，将所有 weak 指针置 nil
  → 从引用计数表移除 → free(obj)
```

---

### Q8. Swift ARC vs OC ARC，循环引用排查

**区别：**
- OC ARC：编译器插入 `retain/release`，运行时处理
- Swift ARC：值类型（struct/enum）完全不参与 ARC，只有 class 才有引用计数

**循环引用解决：**

```swift
// 闭包捕获 self
closure = { [weak self] in
    guard let self = self else { return }
    print(self.title)
}

// delegate 声明为 weak
weak var delegate: SomeDelegate?
```

**排查工具：**
- Xcode Memory Graph Debugger（Debug → Memory Graph）
- Instruments → Leaks / Allocations
- `deinit` 打印确认对象是否释放

**`[weak self]` vs `[unowned self]`：**
- `weak`：安全，self 可能 nil（异步回调首选）
- `unowned`：self 生命周期一定长于闭包，访问 nil 会崩溃（谨慎使用）

---

### Q9. Runloop 本质、与线程的关系、应用场景

**本质：** 事件驱动的循环，没事件时 `mach_msg` 让内核挂起线程，比 `while(true)` 消耗极低。

**与线程的关系：**
- 每个线程有且只有一个 Runloop，懒加载创建
- 主线程 Runloop 自动启动，子线程默认没有 Runloop

**事件源：**
- `Source0`：非系统事件，需手动触发
- `Source1`：系统事件，基于 mach port（触摸事件底层）
- `Timer`：NSTimer、CADisplayLink
- `Observer`：监听 Runloop 状态变化

**实际应用：**

```swift
// NSTimer 加入 Common mode，解决滑动时停止问题
RunLoop.main.add(timer, forMode: .common)

// 常驻子线程
RunLoop.current.add(NSMachPort(), forMode: .default)
RunLoop.current.run()

// 监听空闲时机做耗时任务（如图片解码）
CFRunLoopObserverCreate(..., .beforeWaiting, ...)
```

---

### Q10. Tagged Pointer 是什么？

**背景：** 64 位系统指针 8 字节，NSNumber 存个 `@1` 也要 malloc，效率低。

**原理：** 将对象的**值直接编码在指针本身**中，最高位标记区分。

```
普通指针：0x000060000123abc0 → 指向堆上对象
Tagged Pointer：0x8000000000000013 → 最高位=1，低位存值
```

**适用类型：** NSNumber、NSDate、短 NSString（≤9个ASCII字符）

**好处：** 无堆分配、不参与 ARC、访问速度快（直接读指针，无需解引用）

---

### Q11. dyld 加载流程 & App 启动优化

**Pre-main 阶段：**
```
1. 加载动态库（dylib）
2. Rebase（修正内部指针偏移）& Bind（绑定外部符号）
3. ObjC Setup（注册类、处理 category、执行 +load）
4. Initializer（C++ 静态构造函数）
```

**启动优化方向：**

| 阶段 | 优化手段 |
|------|---------|
| 减少动态库 | 合并 framework，苹果建议 < 6个自定义库 |
| 减少 +load | 改用 +initialize 或 dispatch_once 懒加载 |
| 减少 ObjC 类 | 删除无用类/category，Swift 类比 OC 快 |
| 减少启动任务 | 首帧只做必要初始化，其余延迟/异步 |
| 二进制重排 | Clang 插桩收集启动符号顺序，减少 Page Fault |

**测量工具：** `DYLD_PRINT_STATISTICS=1`，Instruments → App Launch

---

### Q12. OC `isa` 指针 & Non-pointer isa

**Non-pointer isa（64位优化）：** isa 是 64 位位域结构：

```
[0]     nonpointer        = 1（表示这是 non-pointer isa）
[3-35]  shiftcls          类对象地址
[42]    weakly_referenced 是否有 weak 引用
[43]    deallocating      是否正在释放
[44]    has_sidetable_rc  引用计数是否溢出到 SideTable
[45-63] extra_rc          引用计数（直接存 isa，不查表，快）
```

**好处：** 常见对象引用计数直接从 isa 读取，不需要查 SideTable，性能提升明显。

---

## 三、实际开发 · 资深技术点

---

### Q13. 架构设计：MVC / MVVM / VIPER 及从零设计思路

- **MVC**：小项目/快速原型，iOS 中 VC 职责过重（Massive ViewController）
- **MVVM**：ViewModel 承担业务逻辑，结合 Combine/RxSwift，适合中大型项目+单元测试
- **VIPER**：职责极度清晰，适合超大型团队，缺点是文件多、模板代码多

**从零设计中大型 App 架构建议：**
1. **分层**：网络层 / 数据层 / 业务层 / UI层，单向依赖
2. **模块化**：按业务域拆分（用户、订单、支付），CocoaPods 私有库
3. **路由**：统一路由层解耦跳转
4. **基础设施**：日志、埋点、网络、存储下沉到基础库
5. **可测试**：ViewModel/Interactor 不依赖 UIKit，可单元测试

---

### Q14. 私有 Pod 库建立与维护

**建立流程：**
```bash
pod repo add MySpecs https://git.company.com/ios/specs.git
pod lib create MyLibrary
```

**关键 podspec 字段：**
```ruby
Pod::Spec.new do |s|
  s.name         = 'MyLibrary'
  s.version      = '1.2.0'
  s.source       = { :git => 'https://...git', :tag => s.version }
  s.source_files = 'MyLibrary/Classes/**/*'
  s.dependency   'Alamofire', '~> 5.0'
  s.subspec 'Core' do |core|
    core.source_files = 'MyLibrary/Core/**/*'
  end
end
```

**版本发布：**
```bash
git tag 1.2.0 && git push origin 1.2.0
pod repo push MySpecs MyLibrary.podspec --allow-warnings
```

**灰度分发：** 使用 pre-release 版本（`1.3.0-beta.1`），Podfile 中指定版本测试。

---

### Q15. 组件化 / 路由设计

**三种路由方案对比：**

| 方案 | 代表 | 优点 | 缺点 |
|------|------|------|------|
| URL Router | JLRoutes | 支持 H5/推送跳转 | 参数类型不安全 |
| Protocol Router | 自定义 | 编译时安全，接口清晰 | 需维护协议注册表 |
| Target-Action | CTMediator | 解耦彻底 | 字符串硬编码，运行时才报错 |

**推荐方案：** URL Router 处理外部跳转，Protocol Router 处理内部模块调用

```swift
// 接口协议放独立库，防止循环依赖
protocol UserModuleService {
    func makeProfileViewController(userId: String) -> UIViewController
}
ServiceLocator.register(UserModuleService.self, impl: UserModuleServiceImpl())
let vc = ServiceLocator.resolve(UserModuleService.self).makeProfileViewController(userId: "123")
```

---

### Q16. App 性能优化体系

**CPU 优化：**
- 耗时操作（网络/IO/解码）移到子线程
- 减少主线程计算，列表预计算 cell 高度
- 工具：Instruments → Time Profiler

**GPU / 渲染优化：**
- 避免**离屏渲染**：`cornerRadius + masksToBounds` 改用 `CAShapeLayer` 或预绘制
- 不透明 view 设 `opaque = true` 减少图层混合
- 工具：模拟器 Debug → Color Blended Layers

**内存优化：**
- 大图在子线程解码后传给主线程
- `imageWithContentsOfFile` 代替 `imageNamed`（不缓存）
- 监听 `UIApplicationDidReceiveMemoryWarningNotification` 及时清缓存

**电量优化：**
- 减少不必要的定位（降低精度）
- 批量网络请求
- 避免高频 Timer

---

### Q17. 包大小优化

**代码层：**
- 删除无用代码（LinkMap 分析）
- Swift 开启 Whole Module Optimization
- 编译器优化级别：`-Oz`
- `Strip Debug Symbols During Copy = YES`

**资源层：**
- 图片压缩：tinypng / WebP（比 PNG 小 30%+）
- 删除无用资源（LSUnusedResources 工具扫描）
- 大资源走 CDN 按需下载，不打进包

**系统能力：**
- App Thinning（Slicing）：按设备分发对应架构和分辨率资源
- On Demand Resources：资源放服务器，用时下载

---

### Q18. Swift 面向协议编程（POP）

**核心思想：** Protocol + Extension 默认实现替代基类继承，实现代码复用（Mixin 模式）

```swift
// 给任意 VC 注入 Loading 能力，无需继承 BaseViewController
protocol Loadable: AnyObject {
    func showLoading()
    func hideLoading()
}

extension Loadable where Self: UIViewController {
    func showLoading() { /* 展示 HUD */ }
    func hideLoading() { /* 隐藏 HUD */ }
}

class LoginVC: UIViewController, Loadable {}
```

---

### Q19. 通用网络层设计

**分层架构：**
```
业务层 → 请求构建层 → 拦截器链（鉴权/日志/重试/Mock）→ URLSession → 响应处理
```

**关键设计点：**

```swift
// 1. 接口协议化，便于 Mock
protocol NetworkService {
    func request<T: Decodable>(_ endpoint: Endpoint) -> AnyPublisher<T, NetworkError>
}

// 2. Token 自动刷新拦截器
class AuthInterceptor: RequestInterceptor {
    func adapt(_ request: URLRequest) -> URLRequest {
        var req = request
        req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        return req
    }
}

// 3. SSL Pinning（防中间人攻击）
let evaluator = PinnedCertificatesTrustEvaluator()
let session = Session(serverTrustManager: ServerTrustManager(
    evaluators: ["api.example.com": evaluator]
))
```

---

### Q20. 最复杂的技术挑战（开放题）

**面试官考察点：**
1. 问题的复杂度（是否真正的难题）
2. 排查方法论：复现 → 定位 → 假设 → 验证 → 修复
3. 技术深度（是否涉及底层原理）
4. 复盘总结（根因分析和预防）

**回答结构：** 背景 → 问题现象 → 排查过程 → 根因 → 解决方案 → 后续预防

**常见"亮点"素材：**
- non-main thread UIKit 操作导致线上崩溃
- OOM：Memory Graph 发现多层循环引用
- 启动时间从 3s 优化到 1.2s（二进制重排 + 减少 +load）
- 复杂动画帧率问题，Instruments 定位离屏渲染
- 私有库版本依赖冲突，重新设计依赖树

---

## 附：追问参考

| 题目 | 好的追问 |
|------|---------|
| Q6 消息发送 | Method Swizzling 有什么风险？+load 里 swizzle 安全吗？ |
| Q7 weak 原理 | `__weak` 和 `__unsafe_unretained` 的区别？ |
| Q9 Runloop | CADisplayLink 怎么用 Runloop 实现？ |
| Q11 启动优化 | 二进制重排的原理？Page Fault 怎么导致卡顿？ |
| Q15 组件化 | 组件化后如何统一处理登录态？ |
| Q19 网络层 | 如何防止 Token 并发刷新（多个请求同时 401）？ |
