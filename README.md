# vitepress-theme-demoblock

## 简介

vitepress-theme-demoblock 是一个基于 Vitepress 的主题插件，它可以帮助你在编写文档的时候增加 Vue 示例，它的诞生初衷是为了降低编写组件文档时增加一些相关示例的难度。

使用 Vitepress 编写组件示例有以下不足之处：
  * 1.组件示例和示例代码本质上一样，却需要写两遍。
  * 2.Vitepress 无法渲染 Markdown 中的 script 和 style 代码块。

vitepress-theme-demoblock 参考了 [Element UI](https://github.com/element-plus/element-plus) 的文档渲染，实现了和它一样的，可在 Markdown 中直接编写示例的语法。

[查看Demo](https://xinlei3166.github.io/vitepress-demo/)



## 安装

```bash
npm install -D vitepress-theme-demoblock
yarn add -D vitepress-theme-demoblock
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

markdown 中的vue代码包含的style内容，会被组合成一个style统一处理，如果需要使用css预处理器，需要提前指定并且手动安装使用的css预处理器。
```js
markdown: {
  config: (md) => {
    const { demoBlockPlugin } = require('vitepress-theme-demoblock')
    md.use(demoBlockPlugin, {
      cssPreprocessor: 'less'
    })
  }
}
```


markdown 中的vue代码被编译为了 vue 函数组件，需要把 import 转换为 require，这里可附加一些其他的转换。
```js
markdown: {
  config: (md) => {
    const { demoBlockPlugin } = require('vitepress-theme-demoblock')
    md.use(demoBlockPlugin, {
      scriptImports: ["import * as ElementPlus from 'element-plus'"],
      scriptReplaces: [
        { searchValue: /const ({ defineComponent as _defineComponent }) = Vue/g,
          replaceValue: 'const { defineComponent: _defineComponent } = Vue'
        },
        { searchValue: /import ({.*}) from 'element-plus'/g,
          replaceValue: (s, s1) => `const ${s1} = ElementPlus`
        }
      ]
    })
  }
}
```


.vitepress/theme/index.js中使用vitepress-theme-demoblock主题，并注册组件(包含主题中默认的组件)。

```js
import theme from 'vitepress/dist/client/theme-default'
import 'vitepress-theme-demoblock/theme/styles/index.css'
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



## 多语言

.vitepress/config.js文件中增加demoblock字段来支持多语言 (默认中文)

```js
themeConfig: {
  // demoblock locales
  demoblock: {
    '/': {
      'hide-text': 'Hide', 
      'show-text': 'Expand',
      'copy-button-text': 'Copy',
      'copy-success-text': 'Copy success'
    },
    '/zh': {
      'hide-text': '隐藏代码',
      'show-text': '显示代码',
      'copy-button-text': '复制代码片段',
      'copy-success-text': '复制成功'
    }
  }
}
```


## 使用第三方组件库

这个插件主要是针对自己的组件库来使用的，第三方的组件库直接导入使用即可(例如element-plus)。

在 .vuepress/theme/index.js 文件中加入以下代码：
```js
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export default {
  ...theme,
  enhanceApp({ app, router, siteData }) {
    app.use(ElementPlus)
  }
}
```

使用的时候，不用导入element组件，直接使用即可：
```vue
<template>
  <div class="card-wrap">
    <div class="card">{{ title }}</div>
    <el-button type="primary" @click="onClick">点击</el-button>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'

const title = ref('vitepress-theme-demoblock')

const instance = getCurrentInstance()

const onClick = () => {
  instance.appContext.config.globalProperties.$message.success('消息')
}
</script>
```


