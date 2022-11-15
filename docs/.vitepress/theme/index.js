import DefaultTheme from 'vitepress/theme'
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import { useComponents } from './useComponents'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import cn from 'element-plus/lib/locale/lang/zh-cn'
// import CustomButton from '../customElement'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    ctx.app.use(ElementPlus)
    // ctx.app.use(ElementPlus, { locale: cn, size: 'small' })
    // customElements.define('custom-button', CustomButton)
    useComponents(ctx.app)
  }
}
