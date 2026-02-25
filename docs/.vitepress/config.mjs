import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Jay's Knowledge Base",
  description: "AI 学习笔记 & 技术知识库",
  base: '/learn/',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'OpenClaw', link: '/openclaw/' },
      { text: 'AI 基础', link: '/ai-fundamentals/' },
      { text: 'LLM', link: '/llm/' },
      { text: '工具', link: '/tools/' },
    ],
    sidebar: {
      '/openclaw/': [
        {
          text: 'OpenClaw',
          items: [
            { text: '介绍', link: '/openclaw/' },
            { text: '搭建记录', link: '/openclaw/setup' },
            { text: 'Skills', link: '/openclaw/skills' },
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
          ]
        }
      ],
      '/tools/': [
        {
          text: 'AI 工具',
          items: [
            { text: '介绍', link: '/tools/' },
          ]
        }
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ildream/learn' }
    ],
    search: {
      provider: 'local'
    },
    footer: {
      message: '记录学习，积累成长'
    }
  },
  markdown: {
    config: (md) => {},
  }
})
