# 使用技巧

> 日常使用 OpenClaw 积累的小技巧和踩坑记录。

## Token 说明

在 TUI 界面看到的 `15k/128k (12%)` 表示：
- **15k**：本次会话已使用的 token 数
- **128k**：模型上下文窗口上限
- **12%**：已用比例

上下文窗口就是 AI 的"短期记忆"，用满了会忘掉早期内容。

## 快捷命令

| 命令 | 说明 |
|------|------|
| `openclaw chat` | 命令行聊天界面 |
| `openclaw tui` | TUI 控制台 |
| `openclaw status` | 查看运行状态 |
| `openclaw logs --follow` | 实时日志 |
| `openclaw gateway restart` | 重启网关服务 |
| `openclaw pairing approve telegram <code>` | 批准 Telegram 配对 |

---

*持续更新中...*
