# 接入通义千问（阿里云百炼）

> 在 OpenClaw 中接入阿里云百炼的千问系列模型，实现 Claude 和千问的自由切换。

---

## 效果

配置完成后，可以随时在对话中切换模型：

```
/model dashscope/qwen-plus     # 切换到千问 Plus
/model dashscope/qwen-max      # 切换到千问 Max
/model github-copilot/claude-sonnet-4.6  # 切回 Claude
```

**推荐用法：**
- 代码 / 技术问题 → Claude Sonnet
- A股分析 / 生活问答 → 千问 Plus
- 复杂深度分析 → 千问 Max

---

## 第一步：申请 API Key

1. 访问 [阿里云百炼控制台](https://bailian.console.aliyun.com/)
2. 注册 / 登录阿里云账号
3. 左侧菜单 → **API Key 管理** → 创建 API Key
4. 复制保存，格式为 `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

> 新用户有免费额度，够日常使用一段时间。

---

## 第二步：修改两个配置文件

OpenClaw 有两个需要修改的配置文件，都在 `~/.openclaw/` 目录下：

| 文件 | 作用 |
|------|------|
| `openclaw.json` | 主配置，存 API Key 和模型白名单 |
| `models.json` | 模型定义，告诉 OpenClaw 怎么连接千问 |

### 修改 openclaw.json

文件路径：`~/.openclaw/openclaw.json`

在文件中添加两处内容：

**① 添加 API Key 到 env：**
```json
{
  "env": {
    "DASHSCOPE_API_KEY": "sk-你的APIKey"
  },
  ...
}
```

**② 在 `agents.defaults.models` 中添加千问模型白名单：**
```json
"models": {
  "github-copilot/claude-sonnet-4.6": {},
  "dashscope/qwen-plus": {},
  "dashscope/qwen-max": {},
  "dashscope/qwen-turbo": {},
  "dashscope/qwen3-235b-a22b": {}
}
```

### 新建 models.json

文件路径：`~/.openclaw/models.json`（新建文件）

完整内容：

```json
{
  "mode": "merge",
  "providers": {
    "dashscope": {
      "baseUrl": "https://dashscope.aliyuncs.com/compatible-mode/v1",
      "apiKey": "${DASHSCOPE_API_KEY}",
      "api": "openai-completions",
      "models": [
        {
          "id": "qwen-plus",
          "name": "千问 Plus",
          "reasoning": false,
          "input": ["text"],
          "contextWindow": 1000000,
          "maxTokens": 8192,
          "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 }
        },
        {
          "id": "qwen-max",
          "name": "千问 Max",
          "reasoning": false,
          "input": ["text"],
          "contextWindow": 262144,
          "maxTokens": 8192,
          "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 }
        },
        {
          "id": "qwen-turbo",
          "name": "千问 Turbo",
          "reasoning": false,
          "input": ["text"],
          "contextWindow": 1000000,
          "maxTokens": 8192,
          "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 }
        },
        {
          "id": "qwen3-235b-a22b",
          "name": "Qwen3 235B",
          "reasoning": false,
          "input": ["text"],
          "contextWindow": 131072,
          "maxTokens": 8192,
          "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 }
        }
      ]
    }
  }
}
```

**配置要点说明：**

| 字段 | 说明 |
|------|------|
| `baseUrl` | 阿里云百炼的 OpenAI 兼容接口地址，固定值 |
| `apiKey` | 引用 env 中的变量，不要直接写明文 |
| `api` | `openai-completions` 表示用 OpenAI 兼容格式调用 |
| `id` | 模型 ID，与阿里云官方保持一致 |
| `contextWindow` | 最大上下文长度（Token 数） |

---

## 第三步：重启 Gateway

```bash
openclaw gateway restart
```

看到 `gateway reconnected | idle` 表示重启成功。

---

## 第四步：验证

```bash
# 查看模型列表，确认千问出现
openclaw models list | grep dashscope
```

也可以直接切换测试：

```
/model dashscope/qwen-plus
```

发一条消息，能正常回复就配置成功了。

---

## 千问模型选择指南

| 模型 | 适合场景 | 上下文 | 价格（国内） |
|------|---------|--------|-------------|
| **qwen-plus** ⭐ | 日常首选，中文理解强 | 100万 Token | 输入 0.8元/百万 |
| **qwen-max** | 复杂深度分析 | 26万 Token | 输入 2.5元/百万 |
| **qwen-turbo** | 快速简单查询 | 100万 Token | 输入 0.15元/百万 |
| **qwen3-235b-a22b** | 开源旗舰，推理强 | 13万 Token | 按量计费 |

---

## 添加更多模型

千问还有其他模型，在 `models.json` 的 `models` 数组中添加即可：

```json
{
  "id": "qwen3-72b",
  "name": "Qwen3 72B",
  "reasoning": false,
  "input": ["text"],
  "contextWindow": 131072,
  "maxTokens": 8192,
  "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 }
}
```

同时在 `openclaw.json` 的 `models` 白名单中加上 `"dashscope/qwen3-72b": {}`，重启 Gateway 即可。

完整模型列表参考：[阿里云百炼模型列表](https://help.aliyun.com/zh/model-studio/models)

---

## 注意事项

- API Key 请勿提交到公开 Git 仓库（`openclaw.json` 已在 `.gitignore` 中）
- 千问模型按实际用量计费，新用户有免费额度
- `configured,missing` 是 OpenClaw 的显示问题，不影响实际调用
