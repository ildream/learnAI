import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: "Jay's Knowledge Base",
  description: "AI 学习笔记 & 技术知识库",
  base: '/learnAI/',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'AI 基础', link: '/ai-fundamentals/' },
      { text: 'OpenClaw', link: '/openclaw/' },
      { text: 'LLM', link: '/llm/' },
      { text: '工具', link: '/tools/' },
    ],
    sidebar: {
      '/openclaw/': [
        {
          text: 'OpenClaw',
          items: [
            { text: '介绍', link: '/openclaw/' },
            { text: 'OpenClaw 是什么？', link: '/openclaw/what-is-openclaw' },
            { text: '工作原理', link: '/openclaw/how-it-works' },
            { text: '搭建记录', link: '/openclaw/setup' },
            { text: 'Skills', link: '/openclaw/skills' },
            { text: '接入通义千问', link: '/openclaw/qwen-setup' },
            { text: '接入飞书', link: '/openclaw/feishu-setup' },
            { text: '使用技巧', link: '/openclaw/tips' },
          ]
        }
      ],
      '/ai-fundamentals/': [
        {
          text: 'AI 基础',
          items: [
            { text: '介绍', link: '/ai-fundamentals/' },
          ]
        }
      ],
      '/llm/': [
        {
          text: '大语言模型',
          items: [
            { text: '介绍', link: '/llm/' },
            { text: '核心概念全景图', link: '/llm/ai-concepts-evolution' },
            { text: 'AI 工程师能力图谱', link: '/llm/ai-engineer-roadmap' },
          ]
        }
      ],
      '/tools/': [
        {
          text: 'AI 工具',
          items: [
            { text: '介绍', link: '/tools/' },
            { text: 'A股日报系统', link: '/tools/astock-daily' },
          ]
        }
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ildream/learnAI' }
    ],
    search: {
      provider: 'local'
    },
    footer: {
      message: '记录学习，积累成长'
    }
  },
  mermaid: {
    securityLevel: 'loose',
  },
}))
