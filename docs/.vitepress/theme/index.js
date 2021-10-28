import theme from 'vitepress/dist/client/theme-default'
import '../../../theme/styles/index.css'
import { registerComponents } from './register-components'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export default {
  ...theme,
  enhanceApp({ app, router, siteData }) {
    app.use(ElementPlus)
    registerComponents(app)
  }
}
