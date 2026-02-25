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

## 常见问题

**Q: 关闭终端后 Bot 还能用吗？**
A: 可以，Gateway 是后台服务，一直运行。

**Q: 另一个 Telegram 账号发消息没有回应？**
A: 需要先配对，运行 `openclaw pairing approve telegram <配对码>`。

**Q: 怎么查看 Bot 是否是自己创建的？**
A: 查看 `openclaw.json` 中 token 的前缀数字，与 Bot ID 一致即可确认。
