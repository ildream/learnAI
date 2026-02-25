import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { onMounted } from 'vue'

export default {
  ...DefaultTheme,
  setup() {
    onMounted(() => {
      // 创建 lightbox DOM
      const lightbox = document.createElement('div')
      lightbox.className = 'mermaid-lightbox'

      const closeBtn = document.createElement('div')
      closeBtn.className = 'mermaid-lightbox-close'
      closeBtn.innerHTML = '✕'

      const hint = document.createElement('div')
      hint.className = 'mermaid-lightbox-hint'
      hint.textContent = '点击遮罩或按 ESC 关闭'

      lightbox.appendChild(closeBtn)
      lightbox.appendChild(hint)
      document.body.appendChild(lightbox)

      const closeLightbox = () => {
        lightbox.classList.remove('active')
        // 移除克隆的 svg
        const cloned = lightbox.querySelector('svg')
        if (cloned) lightbox.removeChild(cloned)
      }

      // 点击遮罩背景关闭
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === closeBtn) {
          closeLightbox()
        }
      })

      // ESC 关闭
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox()
      })

      // 监听 Mermaid 图表点击
      const attachClickHandlers = () => {
        const svgs = document.querySelectorAll('.vp-mermaid svg, .mermaid svg')
        svgs.forEach((svg) => {
          if (svg.dataset.lightboxAttached) return
          svg.dataset.lightboxAttached = 'true'
          svg.style.cursor = 'zoom-in'
          svg.addEventListener('click', () => {
            const cloned = svg.cloneNode(true)
            cloned.style.cursor = 'default'
            cloned.style.width = 'auto'
            cloned.style.minWidth = '0'
            // 插入到 close 按钮后面
            lightbox.insertBefore(cloned, hint)
            lightbox.classList.add('active')
          })
        })
      }

      // 页面加载后 + 路由切换后都挂载
      attachClickHandlers()
      const observer = new MutationObserver(attachClickHandlers)
      observer.observe(document.body, { childList: true, subtree: true })
    })
  }
}
