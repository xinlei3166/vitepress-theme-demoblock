import theme from 'vitepress/dist/client/theme-default'
import '../../../theme/styles/index.css'
import { registerComponents } from './register-components'

export default {
  ...theme,
  enhanceApp({ app, router, siteData }) {
    registerComponents(app)
  }
}
