import theme from '../../../theme'
import { registerComponents } from './register-components'

export default {
  ...theme,
  enhanceApp({ app, router, siteData }) {
    registerComponents(app)
  }
}
