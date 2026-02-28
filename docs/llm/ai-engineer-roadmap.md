# AI 开发工程师 / AI 专家能力图谱

> 想成为一个真正能做事的 AI 工程师，需要什么？这里是一份诚实的清单。

---

## 总览：能力地图

```mermaid
mindmap
  root((AI 工程师))
    基础底座
      编程能力
      数学基础
      工程素养
    模型理解
      LLM 原理
      训练与微调
      评估与测试
    应用开发
      Prompt 工程
      RAG 系统
      Agent 开发
      工具与集成
    工程化
      MLOps
      部署与服务化
      监控与安全
    产品思维
      需求拆解
      用户体验
      成本意识
```

---

## 第一层：基础底座

这是地基，没有它，上面的一切都是空中楼阁。

### 1.1 编程能力

| 技能 | 说明 | 优先级 |
|------|------|--------|
| **Python** | AI 开发的第一语言，必须熟练 | ⭐⭐⭐ 必须 |
| 异步编程（async/await） | 调 API、处理流式输出都需要 | ⭐⭐⭐ |
| JavaScript / TypeScript | 前端集成、Node.js 服务、很多 AI 工具是 JS 生态 | ⭐⭐ 重要 |
| Git & 版本控制 | 基本工程素养 | ⭐⭐⭐ 必须 |
| HTTP / REST / WebSocket | 调 API、流式输出、理解通信协议 | ⭐⭐⭐ |
| Docker & 容器化 | 部署模型和服务的基础 | ⭐⭐ |

### 1.2 数学基础

不需要推导公式，但要理解概念：

- **线性代数**：向量、矩阵乘法（Embedding 的本质）
- **概率统计**：理解模型输出的概率分布、temperature 的作用
- **微积分基础**：理解梯度下降（微调时需要）

> **实用主义建议**：3Blue1Brown 的《线性代数的本质》和《神经网络》系列，够用了。

### 1.3 工程素养

- 读懂 API 文档，快速上手新工具
- 会写测试，知道怎么验证 AI 输出质量
- 理解成本（Token 计费、API 调用次数）
- 能写清晰的注释和文档

---

## 第二层：模型理解

你不需要自己训练大模型，但你需要理解它是怎么工作的。

### 2.1 LLM 基础原理

- **Transformer 架构**：理解 Attention 机制的直觉（不需要手推）
- **Token 化**：什么是 Token，为什么中文 Token 比英文贵
- **Context Window**：为什么有限制，如何高效利用
- **Temperature & Top-P**：控制输出的随机性
- **Embedding**：把文字变成向量意味着什么

### 2.2 主流模型认知

> 截至 2026 年 Q1，以下是生产环境主流选型。这个领域更新极快，关注官方渠道保持同步。

**闭源商业模型**

| 公司 | 当前主力模型 | 特点 |
|------|------------|------|
| OpenAI | GPT-4o、o3、o3-mini | o3 是目前综合推理最强；GPT-4o 性价比高；生态最广 |
| Anthropic | Claude 3.7 Sonnet | 支持 Extended Thinking（深度推理模式）；代码和长文档最强 |
| Google | Gemini 2.0 Flash / Pro | Flash 极快极便宜；Pro 多模态强；支持 100 万 Token Context |
| xAI | Grok 3 | 推理能力强，实时联网，马斯克生态 |
| Moonshot | Kimi k1.5 | 长 Context + 推理；国内中文场景表现好 |

**开源 / 可本地部署模型**

| 公司 | 当前主力模型 | 特点 |
|------|------------|------|
| Meta | Llama 3.3 70B / 3.1 405B | 开源扛把子，社区生态最丰富 |
| 阿里 | Qwen 2.5 / Qwen 2.5-Coder / QwQ-32B | 中文最强开源；Coder 系列代码极强；QwQ 是开源推理模型 |
| DeepSeek | DeepSeek-V3 / R1 | R1 是最强开源推理模型，成本极低，震动行业 |
| Mistral | Mistral Large 2 / Codestral | 欧洲系，Codestral 专门为代码优化 |
| 智谱 | GLM-4 | 国内开源，中英双语均衡 |
| MiniMax | MiniMax-01 | 长 Context（100 万 Token），多模态 |

**2025-2026 最大新趋势：推理模型（Reasoning Models）**

从"直接回答"进化为"先深度思考再回答"：

| 模型 | 特点 |
|------|------|
| OpenAI o3 / o3-mini | 用于数学、代码、逻辑推理的专用系列 |
| Claude 3.7 Extended Thinking | 可控的深度思考模式，透明度高 |
| Gemini 2.0 Flash Thinking | Google 的推理版本 |
| DeepSeek-R1 | 开源推理模型的最强选项，成本是 o1 的 1/30 |
| QwQ-32B | 阿里开源推理模型，32B 参数可本地跑 |
| Kimi k1.5 | 国内推理模型代表 |

> **关键认知**：推理模型不是"更好的 GPT"，是架构级变化 —— 用更多计算换更高质量。适合复杂任务，不适合简单问答（太贵太慢）。

### 2.3 微调（Fine-tuning）基础

- 什么时候需要微调 vs RAG vs Prompt（三者怎么选）
- **LoRA / QLoRA**：低成本微调方法，概念要懂
- 数据准备：格式（JSONL）、数量、质量比数量更重要
- 常用平台：OpenAI Fine-tuning API、Hugging Face + PEFT

### 2.4 多模态

模型已不再只处理文字，2025-2026 年多模态是标配：

- **图像理解（Vision）**：GPT-4o Vision、Claude 3.7、Gemini 2.0 均原生支持
- **图像生成**：GPT-4o 原生图像生成（2025 新增）、DALL·E 3、Stable Diffusion
- **语音（STT/TTS）**：OpenAI Whisper（语音转文字）、OpenAI TTS、ElevenLabs（拟真语音）
- **视频理解**：Gemini 2.0 支持视频输入分析
- **实时语音对话**：GPT-4o Realtime API（低延迟语音 ↔ 语音）
- **端到端多模态**：Gemini 2.0 Flash 原生处理文本/图片/音频/视频

---

## 第三层：应用开发（核心战场）

这是 AI 工程师最花时间的地方。

### 3.1 Prompt 工程

- System Prompt 设计：角色、边界、格式要求
- Few-shot 示例构造
- Chain-of-Thought 技巧
- 结构化输出（JSON mode、XML 标签）
- Prompt 版本管理（别用注释乱放，要有系统）

**工具**：PromptLayer、LangSmith（追踪和评估 Prompt）

### 3.2 RAG 系统开发

这是目前企业 AI 应用最常见的形态，必须会。

**核心流程**：
```
文档处理 → 切块（Chunking）→ Embedding → 存向量库 → 检索 → 注入 Context → 生成
```

**关键技能**：
- 文档解析（PDF、Word、网页）
- 切块策略（固定大小 vs 语义切块）
- Embedding 模型选型（OpenAI、BGE、nomic-embed）
- 向量数据库（Chroma 本地开发、Pinecone/Weaviate 生产）
- 检索优化：混合检索、重排序（Rerank）、HyDE
- 评估 RAG 质量（RAGAS 框架）

### 3.3 Agent 开发

- ReAct 模式实现
- Tool / Function Calling 定义与调用
- Memory 管理（短期对话历史 + 长期持久化）
- 错误处理和重试逻辑（模型会出错！）
- Multi-Agent 协作（CrewAI、LangGraph、OpenAI Swarm）

### 3.4 主流框架

| 框架 | 适用场景 | 学习优先级 |
|------|---------|----------|
| OpenAI SDK / Anthropic SDK | 直接调 API，最简单 | ⭐⭐⭐ 必须 |
| LangChain | 复杂链和 RAG | ⭐⭐ |
| LangGraph | 有状态 Agent、复杂工作流 | ⭐⭐⭐ 重要 |
| LlamaIndex | RAG 专精框架 | ⭐⭐ |
| CrewAI | 多 Agent 协作 | ⭐⭐ |
| OpenAI Agents SDK | OpenAI 官方 Agent 框架（2025 新） | ⭐⭐⭐ |
| Dify / Coze | 低代码 AI 应用，快速验证 | ⭐⭐ |
| Vercel AI SDK | 前端/全栈 AI 集成，TypeScript 生态 | ⭐⭐ |

### 3.5 AI 编程工具（2025-2026 新必备）

这是 2025 年最大的生产力变化，AI 工程师必须会用：

| 工具 | 说明 | 优先级 |
|------|------|--------|
| **Cursor** | AI 原生代码编辑器，内置 Agent 模式，目前最主流 | ⭐⭐⭐ 必须 |
| **GitHub Copilot** | VS Code 插件，微软 + OpenAI，企业最广泛 | ⭐⭐⭐ |
| **Windsurf** | Codeium 出品，Cascade Agent 模式强 | ⭐⭐ |
| **Claude Code** | Anthropic 官方 CLI，终端里的 Agent | ⭐⭐ |
| **Gemini Code Assist** | Google 出品，深度集成 GCP | ⭐ |
| **v0.dev** | Vercel 出品，前端 UI 生成 | ⭐⭐ |
| **Bolt.new** | 全栈 Web 应用生成，适合快速原型 | ⭐⭐ |

> 2026 年的 AI 工程师：用 Cursor/Copilot 写代码效率提升 3-5 倍是基本操作，不会用这些工具已经在竞争上落后了。

### 3.6 MCP 与工具集成

- 理解 MCP 协议，能搭建 MCP Server
- 常用 MCP Server：文件系统、数据库、GitHub、Slack、浏览器控制
- 在支持 MCP 的客户端（Claude Desktop、Cursor、Windsurf）中调试
- 2026 年 MCP 已成为主流标准，新工具优先看是否支持 MCP

---

## 第四层：工程化能力

能做出来 ≠ 能用于生产。

### 4.1 部署与服务化

- **API 服务**：FastAPI / Flask 封装 LLM 调用
- **流式输出**（Streaming）：Server-Sent Events，让用户看到逐字输出
- **本地模型部署**：Ollama、vLLM、llama.cpp
- **云端部署**：AWS Bedrock、Azure OpenAI、阿里云百炼

### 4.2 性能与成本优化

- Token 用量监控，避免超支
- 缓存策略（Prompt Cache、语义缓存）
- 批处理（Batch API）
- 模型选型：大模型用于复杂任务，小模型处理简单任务，省钱

### 4.3 可观测性（Observability）

生产环境必须有监控：
- **LangSmith**：追踪每次 LLM 调用、Prompt、输出、延迟
- **Langfuse**：开源替代，支持自部署
- 关键指标：延迟（P50/P99）、Token 用量、错误率、用户满意度

### 4.4 安全与合规

- **Prompt Injection**：用户试图绕过系统指令
- **输出过滤**：防止有害内容、个人信息泄露
- **数据隐私**：用户数据是否发给第三方 API？
- **幻觉处理**：引导模型说"不知道"而不是编造

---

## 第五层：产品与领域思维

技术之外，让你从工程师变成专家的东西。

### 5.1 产品感

- 能拆解用户需求，判断"用 AI 做这个值不值"
- 理解 AI 的边界：什么能做，什么容易翻车
- 快速原型验证（Dify/Coze 先跑通再工程化）
- 知道什么时候**不用** AI（别为了 AI 而 AI）

### 5.2 评估能力

AI 应用最难的不是做出来，是**验证它好不好用**：

- 构建评估集（evals）
- 自动化评估（LLM-as-judge）
- A/B 测试不同 Prompt / 模型
- 人工标注与质量审核

### 5.3 持续学习能力

这个领域三个月一个大变化，能跟上才是核心竞争力：

- 关注：Andrej Karpathy、Simon Willison、LangChain 博客、Hugging Face 论文速读
- 动手：看到新技术先跑一遍，比看十篇文章强
- 社区：Discord（LangChain、OpenAI）、Reddit r/LocalLLaMA、Twitter/X AI 圈

---

## 学习路径建议

### 🟢 入门（0 → 3 个月）

1. Python 基础（如果还不会）
2. OpenAI / DeepSeek API 调用，理解 Prompt / Context / Token
3. 做一个简单 RAG：PDF → 向量库 → 问答
4. 理解 Function Calling，调一个真实 API（天气/搜索）
5. 上手 Cursor 或 Copilot，体验 AI 辅助编程
6. 用 Dify 或 Coze 做一个完整应用，体验工作流

**目标**：能独立做出一个可用的 AI 应用

### 🟡 进阶（3 → 12 个月）

1. 深入 RAG：评估、优化检索质量、生产化
2. Agent 开发：LangGraph 有状态 Agent，处理复杂任务
3. 微调入门：用 Qwen 2.5 或 Llama 3.3 做 LoRA 微调
4. 部署：FastAPI + Docker + 云部署，跑一个真实服务
5. 可观测性：LangSmith 接入，开始监控生产质量
6. 理解推理模型（o3/R1/Claude 3.7 Extended Thinking）的使用场景

**目标**：能把 AI 应用从 demo 推向生产

### 🔴 专家（1 年以上）

1. 深入某个垂直领域（代码生成、法律、医疗、金融）
2. Multi-Agent 系统设计（LangGraph + CrewAI）
3. 大规模 RAG 系统（百万文档、Graph RAG）
4. 模型评估体系建设（evals + LLM-as-judge）
5. AI 安全与对齐实践（Prompt Injection 防御、幻觉控制）
6. 推理模型深度应用：理解 Chain-of-Thought 与 Test-time Compute 原理
7. 跟进前沿：精读核心论文（Attention Is All You Need → RLHF → Constitutional AI → o1）

**目标**：能设计系统、培养团队、判断技术方向

---

## 工具箱速查

### 开发常用

| 类型 | 工具 |
|------|------|
| **LLM API（闭源）** | OpenAI、Anthropic、Google AI Studio、xAI Grok |
| **LLM API（国内）** | 阿里云百炼（Qwen）、DeepSeek、月之暗面（Kimi）、智谱 GLM |
| **本地模型运行** | Ollama（最易用）、LM Studio（有 GUI）、vLLM（生产级） |
| **AI 编程助手** | Cursor、GitHub Copilot、Windsurf、Claude Code |
| **RAG 框架** | LlamaIndex、LangChain |
| **向量数据库** | Chroma（本地开发）、Pinecone（云端）、Qdrant（开源生产） |
| **Agent 框架** | LangGraph、OpenAI Agents SDK、CrewAI |
| **低代码平台** | Dify（开源自部署）、Coze（字节）、n8n（工作流自动化） |
| **监控可观测性** | LangSmith、Langfuse（开源） |
| **评估框架** | RAGAS、DeepEval |
| **前端 AI 集成** | Vercel AI SDK、Next.js + AI |

### 学习资源

**视频课程**

| 资源 | 说明 |
|------|------|
| [Andrej Karpathy YouTube](https://youtube.com/@AndrejKarpathy) | 《Neural Networks: Zero to Hero》，最值得看的 LLM 原理课 |
| [deeplearning.ai 短课程](https://learn.deeplearning.ai) | Andrew Ng 出品，RAG/Agent/MCP 系列持续更新，大量免费 |
| [fast.ai](https://fast.ai) | 实践派深度学习，从代码到原理 |
| [Weights & Biases 课程](https://www.wandb.courses) | LLM 工程、微调、评估，实战性强 |

**文档 & 博客**

| 资源 | 说明 |
|------|------|
| [Simon Willison's Blog](https://simonwillison.net) | AI 工具实战，更新最快，必订阅 |
| [Hugging Face 文档](https://huggingface.co/docs) | Transformers、PEFT、数据集，开源模型圣经 |
| [LangChain 博客](https://blog.langchain.dev) | Agent/RAG 工程实践 |
| [Anthropic Research](https://www.anthropic.com/research) | 提示工程、安全、模型理解 |
| [OpenAI Cookbook](https://cookbook.openai.com) | 官方示例代码，实用性高 |

**中文资源**

| 资源 | 说明 |
|------|------|
| [动手学深度学习](https://zh.d2l.ai) | 李沐出品，中文最好的深度学习教材 |
| [李沐论文精读 YouTube](https://youtube.com/@MuLi) | 带你读最重要的 AI 论文 |
| 极客时间 AI 专栏 | 工程化向，中文体系化 |
| B站 @跟李沐学AI | 中文 AI 学习最高质量视频 |

**信息流（保持前沿）**

| 渠道 | 说明 |
|------|------|
| Twitter/X | 关注：@karpathy、@sama、@anthropicai、@ylecun |
| Reddit r/LocalLLaMA | 本地模型、开源 AI 社区最活跃 |
| Hugging Face Daily Papers | 每天最新 AI 论文速览 |
| The Batch（deeplearning.ai 周报） | Andrew Ng 的 AI 周刊，适合了解大局 |

---

## 一句话总结

> AI 工程师 = **扎实的工程基础** × **对 LLM 的直觉理解** × **快速构建和验证的能力**  
> AI 专家在此基础上加上：**领域深度** + **系统设计能力** + **持续跟进前沿**

技术在变，但"快速学习、动手验证、以终为始"这三点永远不过时。

---

*Last updated: 2026-02-28（模型列表同步至 2026 Q1）| by Dream 🌙*
