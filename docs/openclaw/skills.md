# Skills 推荐

> Skills 是 OpenClaw 的可插拔能力扩展包，类似 iOS 的 App Store。
> 安装命令：`npx clawhub install <skill-name>`
> 浏览市场：https://clawhub.com

---

## 🍎 iOS 开发者必备

作为 iOS 开发者，以下 Skills 最实用：

### 🐙 github
**管理 GitHub 仓库、PR、Issues、CI**

```bash
npx clawhub install github
```

能做什么：
- 查看 PR 状态、CI 构建结果
- 创建/评论 Issues
- 列出待处理的 PR
- 直接在聊天里管理代码仓库

> iOS 项目常见场景：查看某个 PR 有没有通过 CI、快速创建 Bug Issue

---

### 📦 gh-issues
**自动处理 GitHub Issues，生成修复 PR**

```bash
npx clawhub install gh-issues
```

能做什么：
- 监控仓库 Issues
- 自动派生子 Agent 分析问题并提交 PR
- 监控 PR 的 Review 评论并自动回应

---

### 🧩 coding-agent
**把复杂编码任务委托给专属 Coding Agent**

```bash
npx clawhub install coding-agent
```

能做什么：
- 创建新功能、新模块
- 重构大型代码库
- Review PR（在临时目录中运行）

> 适合：让 AI 帮你写一个 Swift 模块、重构某个 ViewController

---

### 📝 apple-notes
**管理 Apple Notes**

```bash
npx clawhub install apple-notes
```

能做什么：
- 创建、搜索、编辑、删除笔记
- 管理笔记文件夹
- 和 AI 配合快速记录想法

---

### ✅ things-mac
**管理 Things 3 任务**

```bash
npx clawhub install things-mac
```

能做什么：
- 添加任务、项目
- 查看今日/即将到来的任务
- 搜索任务

> 适合：开发过程中的任务管理，直接告诉 AI "帮我加个任务：明天修复登录 Bug"

---

### 📧 himalaya
**命令行管理邮件（IMAP/SMTP）**

```bash
npx clawhub install himalaya
```

能做什么：
- 查看未读邮件
- 发送/回复邮件
- 搜索、整理邮件

---

### 🧾 summarize
**总结 URL、播客、视频内容**

```bash
npx clawhub install summarize
```

能做什么：
- 总结技术文章
- 提取 YouTube 视频字幕并总结
- 快速消化长文档

> 适合：看到一篇长文 → 发给 AI → 让它帮你提炼核心内容

---

### 💎 obsidian
**操作 Obsidian 知识库**

```bash
npx clawhub install obsidian
```

能做什么：
- 在 Obsidian vault 中创建/搜索笔记
- 自动化笔记整理

---

### 🔐 1password
**1Password CLI 集成**

```bash
npx clawhub install 1password
```

能做什么：
- 读取/注入密码和密钥
- 管理多账号

> 开发场景：自动把 API Key 注入脚本，不用明文存密钥

---

### 🌤️ weather（已内置）
**天气查询**，无需安装，开箱即用。

---

## 🛠 效率工具

| Skill | 用途 |
|-------|------|
| `notion` | 操作 Notion 页面和数据库 |
| `session-logs` | 搜索历史对话记录 |
| `trello` | 管理 Trello 看板 |
| `tmux` | 远程控制终端 tmux 会话 |
| `slack` | 操作 Slack 消息、频道 |
| `video-frames` | 用 ffmpeg 提取视频帧/片段 |
| `nano-pdf` | 用自然语言编辑 PDF |
| `openai-whisper` | 本地语音转文字（无需 API Key） |

---

## 🎮 娱乐 / 生活

| Skill | 用途 |
|-------|------|
| `spotify-player` | 控制 Spotify 播放 |
| `sag` | ElevenLabs 语音合成（TTS） |
| `xurl` | 操作 X（Twitter）API |
| `blogwatcher` | 监控博客/RSS 更新 |

---

## 安装方法

```bash
# 搜索 Skill
npx clawhub search <关键词>

# 安装 Skill
npx clawhub install <skill-name>

# 更新所有 Skill
npx clawhub sync

# 查看已安装
openclaw skills list
```
