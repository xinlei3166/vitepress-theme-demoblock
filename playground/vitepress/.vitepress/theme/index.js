import DefaultTheme from 'vitepress/theme'
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import { useComponents } from './useComponents'
import './style.css'
import 'element-plus/dist/index.css'
// import message from 'vitepress-theme-demoblock/dist/client/components/message'
// import ElementPlus from 'element-plus'
// import cn from 'element-plus/lib/locale/lang/zh-cn'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    // ctx.app.config.globalProperties.message = message
    // ctx.app.use(ElementPlus, { locale: cn })
    useComponents(ctx.app)
  }
}
