import { defineConfig } from 'vite'
import jsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

// @ts-ignore
export default () => {
  return defineConfig({
    plugins: [jsx()],
    resolve: {
      alias: {
        '@docs': path.join(__dirname)
      }
    }
  })
}
