import theme from 'vitepress/dist/client/theme-default'
import '../../../theme/styles/index.css'
import { registerComponents } from './register-components'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import cn from 'element-plus/lib/locale/lang/zh-cn'

export default {
  ...theme,
  enhanceApp({ app, router, siteData }) {
    app.use(ElementPlus)
    // app.use(ElementPlus, { locale: cn, size: 'small' })
    registerComponents(app)
  }
}
