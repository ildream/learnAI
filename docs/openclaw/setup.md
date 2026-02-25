# OpenClaw 搭建记录

> 记录从零开始安装、配置 OpenClaw，并搭建个人知识库网站的完整过程。

## 环境

- macOS (Apple Silicon)
- Node.js v25.5.0
- npm 11.8.0

---

## 一、安装 OpenClaw

```bash
# 通过 npm 全局安装
npm install -g openclaw

# 验证安装
openclaw --version
```

---

## 二、初始化配置

运行向导完成初始化：

```bash
openclaw onboard
```

向导会引导你：
1. 选择 AI 模型（GitHub Copilot / OpenAI 等）
2. 配置聊天渠道（Telegram / WhatsApp 等）
3. 设置 workspace 目录

---

## 三、配置 Telegram 渠道

1. 去 Telegram 找 **@BotFather**，创建新 Bot
2. 拿到 Bot Token
3. 在 OpenClaw 配置中填入 Token：

```json
"channels": {
  "telegram": {
    "enabled": true,
    "dmPolicy": "pairing",
    "botToken": "你的token"
  }
}
```

4. 重启 gateway：

```bash
openclaw gateway restart
```

### 配对新用户

其他 Telegram 账号发消息时，会收到配对码，在本机运行：

```bash
openclaw pairing approve telegram <配对码>
```

---

## 四、日常使用

```bash
# 打开命令行聊天界面
openclaw chat

# 打开 TUI 控制台
openclaw tui

# 查看状态
openclaw status

# 查看日志
openclaw logs --follow
```

Gateway 作为 **LaunchAgent 后台服务**运行，关闭终端不影响，重启电脑自动启动。

---

## 五、搭建个人知识库网站（VitePress + GitHub Pages）

### 1. 安装 VitePress

```bash
mkdir learn && cd learn
npm init -y
npm install vitepress --save-dev
```

### 2. 创建目录结构

```
learn/
├── docs/
│   ├── .vitepress/
│   │   └── config.mjs      # 网站配置
│   ├── index.md             # 首页
│   ├── openclaw/
│   ├── ai-fundamentals/
│   ├── llm/
│   └── tools/
└── package.json
```

### 3. 配置 package.json

```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  }
}
```

### 4. 本地预览

```bash
npm run docs:dev
# 打开 http://localhost:5173/learn/
```

### 5. 部署到 GitHub Pages

在 GitHub 仓库 `ildream/learn` 下创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy VitePress to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run docs:build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/.vitepress/dist
```

推送代码后，GitHub Actions 自动构建并部署，网站地址：

```
https://ildream.github.io/learn/
```

---

## 六、多台电脑同步 Workspace

使用 GitHub 私有仓库同步两台 Mac 的 OpenClaw 数据（记忆、笔记、配置等）。

### 1. 主机（第一台 Mac）初始化

```bash
cd ~/.openclaw/workspace
git init
git remote add origin https://github.com/ildream/openclaw-workspace.git
git add .
git commit -m "init: openclaw workspace"
git push -u origin main
```

### 2. 第二台 Mac 克隆

安装好 OpenClaw 之后：

```bash
# 克隆 workspace
git clone https://github.com/ildream/openclaw-workspace.git ~/.openclaw/workspace

# 拉取子模块（如 learnAI）
cd ~/.openclaw/workspace
git submodule update --init --recursive
```

### 3. 日常同步

**推送（主机上）：**

```bash
cd ~/.openclaw/workspace
git add .
git commit -m "sync"
git push
```

**拉取（第二台 Mac）：**

```bash
cd ~/.openclaw/workspace
git pull
```

> 💡 推荐让 AI 助手定期自动 push，加入 HEARTBEAT 任务即可，无需手动操作。

### 4. 从第二台 Mac 同步回主机

在 Mac mini 上做了改动后，先 push：

```bash
# Mac mini 上
cd ~/.openclaw/workspace
git add .
git commit -m "sync from mac mini"
git push
```

然后在主 Mac 上拉取：

```bash
# 主 Mac 上
cd ~/.openclaw/workspace
git pull
```

反向操作完全一样，两台对等，没有主次之分。

---

### 5. 处理冲突

两台电脑**同时修改了同一个文件**，就会产生冲突。比如两台都改了 `MEMORY.md`，push 时后一台会报错：

```
! [rejected] main -> main (fetch first)
error: failed to push some refs
```

**解决步骤：**

**第一步：先拉取对方的改动**

```bash
git pull --rebase
```

**第二步：查看冲突文件**

冲突的文件里会出现这样的标记：

```
<<<<<<< HEAD
这是你本地的内容
=======
这是对方的内容
>>>>>>> origin/main
```

**第三步：手动选择保留哪部分**

编辑文件，删掉标记符号，保留你想要的内容，或者把两部分合并。

**第四步：提交并推送**

```bash
git add .
git rebase --continue
git push
```

---

### 6. 避免冲突的最佳实践

> 最好的解决冲突方式是**尽量不产生冲突**。

#### 自动 Push（已配置）

在 `HEARTBEAT.md` 中加入以下任务，AI 助手每 30 分钟自动将 workspace 改动 push 到 GitHub：

```markdown
每次心跳时运行：
cd ~/.openclaw/workspace
git add .
git -c commit.gpgsign=false commit -m "auto-sync: $(date '+%Y-%m-%d %H:%M')"
git push
```

没有改动时自动跳过，push 失败时才通知你。

#### 手动 Pull（建议手动）

Pull **不建议自动化** — 因为可能产生冲突，自动处理不当会丢数据。

切换到另一台电脑时，手动运行一次：

```bash
cd ~/.openclaw/workspace
git pull
```

**最佳习惯：开始工作前先 pull，AI 助手帮你定期 push，冲突概率极低。**

---

## 常见问题

**Q: 关闭终端后 Bot 还能用吗？**
A: 可以，Gateway 是后台服务，一直运行。

**Q: 另一个 Telegram 账号发消息没有回应？**
A: 需要先配对，运行 `openclaw pairing approve telegram <配对码>`。

**Q: 怎么查看 Bot 是否是自己创建的？**
A: 查看 `openclaw.json` 中 token 的前缀数字，与 Bot ID 一致即可确认。
