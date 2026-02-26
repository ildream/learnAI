# OpenClaw 接入飞书

> 将 OpenClaw AI 助手接入飞书，实现在飞书中直接与 AI 对话。飞书是 OpenClaw 官方支持的渠道之一，支持 WebSocket 长连接，无需公网 IP。

---

## 为什么选择飞书？

| 对比项 | 飞书 ✅ | 钉钉 ❌ |
|--------|--------|--------|
| OpenClaw 官方支持 | ✅ 有 | ❌ 无 |
| 无需公网 IP | ✅ WebSocket | - |
| 流式回复 | ✅ 支持 | - |
| 群聊支持 | ✅ 支持 | - |
| 收发图片/文件 | ✅ 支持 | - |

---

## 前置条件

- 已安装并配置好 OpenClaw（参考 [搭建记录](./setup.md)）
- 拥有飞书账号（企业版或个人版均可）
- 能访问 [飞书开放平台](https://open.feishu.cn/app)

---

## 第一步：安装飞书插件

```bash
openclaw plugins install @openclaw/feishu
```

---

## 第二步：创建飞书应用

### 1. 进入飞书开放平台

访问 [https://open.feishu.cn/app](https://open.feishu.cn/app)，登录后点击 **创建企业自建应用**。

填写：
- 应用名称（如：`我的 AI 助手`）
- 应用描述
- 选择图标

### 2. 获取凭证

进入应用后，在 **凭证与基础信息** 页面，复制：
- **App ID**（格式：`cli_xxx`）
- **App Secret**

> ⚠️ App Secret 请妥善保存，不要泄露

### 3. 配置权限

进入 **权限管理**，点击 **批量导入**，粘贴以下 JSON：

```json
{
  "scopes": {
    "tenant": [
      "aily:file:read",
      "aily:file:write",
      "application:application.app_message_stats.overview:readonly",
      "application:application:self_manage",
      "application:bot.menu:write",
      "contact:user.employee_id:readonly",
      "corehr:file:download",
      "event:ip_list",
      "im:chat.access_event.bot_p2p_chat:read",
      "im:chat.members:bot_access",
      "im:message",
      "im:message.group_at_msg:readonly",
      "im:message.p2p_msg:readonly",
      "im:message:readonly",
      "im:message:send_as_bot",
      "im:resource"
    ],
    "user": [
      "aily:file:read",
      "aily:file:write",
      "im:chat.access_event.bot_p2p_chat:read"
    ]
  }
}
```

### 4. 开启机器人能力

进入 **应用能力** > **机器人**：
1. 开启机器人能力
2. 填写机器人名称

### 5. 配置事件订阅

> ⚠️ 请先完成第三步（OpenClaw 配置）并启动 Gateway，再回来配置事件订阅

进入 **事件订阅**：
1. 选择 **使用长连接接收事件**（WebSocket 模式，无需公网 IP）
2. 添加事件：`im.message.receive_v1`

### 6. 发布应用

进入 **版本管理与发布**：
1. 创建版本
2. 提交审核并发布
3. 等待管理员审批（企业自建应用通常自动审批）

---

## 第三步：配置 OpenClaw

### 方式一：向导配置（推荐）

```bash
openclaw channels add
```

选择 **飞书**，按提示填入 App ID 和 App Secret。

### 方式二：直接编辑配置文件

编辑 `~/.openclaw/openclaw.json`，添加飞书配置：

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "dmPolicy": "pairing",
      "accounts": {
        "main": {
          "appId": "cli_xxx",
          "appSecret": "你的AppSecret",
          "botName": "我的AI助手"
        }
      }
    }
  }
}
```

---

## 第四步：启动并测试

### 1. 启动 Gateway

```bash
openclaw gateway restart
```

### 2. 在飞书中发消息

在飞书里找到你创建的机器人，发送一条消息。

### 3. 审批配对

第一次使用时，机器人会回复一个配对码，在终端运行：

```bash
# 查看待配对列表
openclaw pairing list feishu

# 批准配对
openclaw pairing approve feishu <配对码>
```

配对成功后即可正常聊天 🎉

---

## 群聊配置

### 将机器人加入群组

在飞书群聊中添加机器人后，默认需要 **@机器人** 才会回复。

### 修改群聊行为

编辑 `~/.openclaw/openclaw.json`：

```json
{
  "channels": {
    "feishu": {
      "groupPolicy": "open",
      "groups": {
        "oc_xxx": {
          "requireMention": false
        }
      }
    }
  }
}
```

> 群组 ID（`oc_xxx`）获取方式：启动 Gateway 后 @机器人，查看日志 `openclaw logs --follow` 中的 `chat_id`

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `/status` | 查看机器人状态 |
| `/reset` | 重置当前会话 |
| `/model` | 查看/切换模型 |

> 飞书暂不支持原生命令菜单，直接发送文字即可

---

## 常见问题

**Q: 不需要公网 IP 吗？**
A: 不需要。飞书支持 WebSocket 长连接模式，OpenClaw 主动连接飞书服务器，无需暴露本地端口。

**Q: 机器人没有回复？**
A: 检查以下几点：
1. 应用是否已发布审核通过
2. 事件订阅是否添加了 `im.message.receive_v1`
3. Gateway 是否正在运行：`openclaw gateway status`
4. 查看日志：`openclaw logs --follow`

**Q: 群聊中机器人没有回应？**
A: 默认需要 @机器人，确认已将机器人加入群组并 @它发消息。

**Q: App Secret 泄露了怎么办？**
A: 立即在飞书开放平台重置 App Secret，更新配置文件后重启 Gateway。

---

## 支持的消息类型

| 类型 | 接收 | 发送 |
|------|------|------|
| 文字 | ✅ | ✅ |
| 图片 | ✅ | ✅ |
| 文件 | ✅ | ✅ |
| 音频 | ✅ | ✅ |
| 视频 | ✅ | ✅ |
| 富文本 | ✅ | ⚠️ 部分支持 |
| 表情包 | ✅ | ❌ |
