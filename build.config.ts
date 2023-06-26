import { defineBuildConfig, BuildEntry } from 'unbuild'

// import { path } from 'path'
// import { findFiles, getDirname } from './src/utils'
// const __dirname = getDirname(import.meta.url)
// const clientFiles = findFiles(path.resolve(__dirname, 'src/client'))

const dirs = ['client', 'hooks', 'utils', 'theme']
export default defineBuildConfig({
  entries: [
    {
      input: 'src/node/index',
      name: 'node/index'
    },
    {
      input: 'src/bin/vitepress-register-components',
      name: 'bin/vitepress-register-components'
    },
    ...dirs.map(dir => ({
      input: `src/${dir}/`,
      outDir: `dist/${dir}/`
    }))
  ],
  clean: true,
  declaration: true,
  externals: ['vite'],
  rollup: {
    emitCJS: true
  }
})
