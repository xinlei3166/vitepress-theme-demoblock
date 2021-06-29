# Vitepress-Theme-Demoblock

## 简介

Vitepress-Theme-Demoblock 是一个基于 Vitepress 的主题插件，它可以帮助你在编写文档的时候增加 Vue 示例，它的诞生初衷是为了降低编写组件文档时增加一些相关示例的难度。

使用 Vitepress 编写组件示例有以下不足之处：
  * 1.组件示例和示例代码本质上一样，却需要写两遍。
  * 2.Vitepress 无法渲染 Markdown 中的 script 和 style 代码块。

Vitepress-Theme-Demoblock 参考了 [Element UI](https://github.com/element-plus/element-plus) 的文档渲染，实现了和它一样的，可在 Markdown 中直接编写示例的语法。

[查看Demo](https://xinlei3166.github.io/vitepress-demo/)



## 安装

```bash
npm install vitepress-theme-demoblock
yarn add vitepress-theme-demoblock
```



## 用法

.vitepress/config.js文件中使用demoBlockPlugin插件

```js
markdown: {
  config: (md) => {
    const { demoBlockPlugin } = require('vitepress-theme-demoblock')
    md.use(demoBlockPlugin)
  }
}
```



.vitepress/theme/index.js中使用vitepress-theme-demoblock主题，并注册组件(包含主题中默认的组件)。

```js
import theme from 'vitepress-theme-demoblock/theme'
import { registerComponents } from './register-components'

export default {
  ...theme,
  enhanceApp({ app, router, siteData }) {
    registerComponents(app)
  }
}
```



package.json配置命令scripts，vitepress-rc用来注册组件(--docsDir 指定docs目录，--componentsDir 指定组件注册目录)

```json
"scripts": {
  "docs:dev": "yarn run register:components && vitepress dev docs",
  "docs:build": "yarn run register:components && vitepress build docs",
  "docs:serve": "vitepress serve docs",
  "register:components": "vitepress-rc"
}
```



