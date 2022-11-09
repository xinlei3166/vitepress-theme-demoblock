// 参考 https://github.com/em2046/nova-next
import fs from 'fs'
import path from 'path'
import glob from 'globby'
import camelCase from 'camelcase'
import minimist from 'minimist'
import pico from 'picocolors'
import { format } from './help'

const { red, magenta } = pico
const argv = minimist(process.argv.slice(2))
const cwd = process.cwd()
const resolve = (...args: any[]) => path.resolve(cwd, ...args)
const docsDir = argv.docsDir || 'docs'
const componentsDir = argv.componentsDir || 'components'
console.log('docsDir::', resolve(docsDir))
if (!fs.existsSync(resolve(docsDir))) {
  console.log(red('docsDir does not exist'))
  process.exit(0)
}

const vitePressDir = `${docsDir}/.vitepress`
const outputPath = 'theme/useComponents.js'

function importTemplate(path: string, componentName: string) {
  return `import ${componentName} from '../${componentsDir}/${path}'`
}

function registerTemplate(path: string, componentName: string) {
  return `app.component('${componentName}', ${componentName})`
}

function componentTemplate(path: string) {
  let componentName = camelCase(path.slice(0, -4).replace(/[/\\]/g, '-'), { pascalCase: true })
  // 去掉Index，例如DemoIndex替换为Demo
  if (componentName.includes('Index')) {
    const endIndex = componentName.indexOf('Index')
    componentName = componentName.substring(0, endIndex)
  }
  return {
    import: importTemplate(path, componentName),
    register: registerTemplate(path, componentName)
  }
}

function componentsTemplate(codeImports: string, codeRegisters: string) {
  return `
  // Don't remove this file, because it registers the demo components.
  ${codeImports}

  export function useComponents(app) {
    ${codeRegisters}
  }
  `
}

function registerComponents() {
  // if (!fs.existsSync(resolve(vitePressDir, componentsDir))) {
  //   console.log(magenta('componentsDir does not exist, ignore to register components'))
  //   return
  // }
  const dir = path.join(vitePressDir, componentsDir)
  const files = glob.sync('**/*.{vue,ts}', {
    cwd: dir
  })
  const codes = files.map(file => componentTemplate(file))
  const demoPath = 'vitepress-theme-demoblock/dist/client'
  codes.push({
    import: `import Demo from '${demoPath}/components/Demo.vue'`,
    register: "app.component('Demo', Demo)"
  })
  codes.push({
    import: `import DemoBlock from '${demoPath}/components/DemoBlock.vue'`,
    register: "app.component('DemoBlock', DemoBlock)"
  })
  const codeImports = codes.map(code => code.import).join('\n')
  const codeRegisters = codes.map(code => code.register).join('\n')
  const content = componentsTemplate(codeImports, codeRegisters)
  const formattedContent = format(content, { parser: 'babel' })

  fs.writeFileSync(path.join(vitePressDir, outputPath), formattedContent)
}

registerComponents()
