import { defineConfig } from 'vite'
import jsx from '@vitejs/plugin-vue-jsx'

// @ts-ignore
export default () => {
  return defineConfig({
    plugins: [jsx()]
  })
}
