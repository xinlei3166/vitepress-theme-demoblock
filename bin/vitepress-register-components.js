#!/usr/bin/env node
// 参考 https://github.com/em2046/nova-next
const glob = require('globby')
const camelCase = require('camelcase')
const { format } = require('./help')
const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const path = require('path')
const { red, magenta } = require('kolorist')

const cwd = process.cwd()
const resolve = (...args) => path.resolve(cwd, ...args)
const docsDir = argv.docsDir || 'docs'
const componentsDir = argv.componentsDir || 'components'

if (!fs.existsSync(resolve(docsDir))) {
  console.log(red('docsDir does not exist'))
  process.exit(0)
}

const vitePressDir = `${docsDir}/.vitepress`
const outputPath = 'theme/register-components.js'

function importTemplate(path, componentName) {
  return `import ${componentName} from '../${componentsDir}/${path}'`
}

function registerTemplate(path, componentName) {
  return `app.component('${componentName}', ${componentName})`
}

function componentTemplate(path) {
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

function componentsTemplate(codeImports, codeRegisters) {
  return `${codeImports}
export function registerComponents(app) {
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
  const files = glob.sync('**/*.vue', {
    cwd: dir
  })
  const codes = files.map(file => componentTemplate(file))
  const pkg = require(resolve('package.json'))
  const demoPath =
    pkg.name === 'vitepress-theme-demoblock' ? '../../..' : 'vitepress-theme-demoblock'
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
