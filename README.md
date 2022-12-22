# vitepress-theme-demoblock

> 这是2.x版本的文档，已经采用TypeScript和ESM规范重写，如果使用1.x版本请看[v1文档](v1.md)。

## 简介

vitepress-theme-demoblock 是一个基于 Vitepress 的主题插件，它可以帮助你在编写文档的时候增加 Vue 示例，它的诞生初衷是为了降低编写组件文档时增加一些相关示例的难度。

使用 Vitepress 编写组件示例有以下不足之处：
  * 1.组件示例和示例代码本质上一样，却需要写两遍。
  * 2.Vitepress 无法渲染 Markdown 中的 script 和 style 代码块。

vitepress-theme-demoblock 参考了 [Element UI](https://github.com/element-plus/element-plus) 的文档渲染，实现了和它一样的，可在 Markdown 中直接编写示例的语法。

[查看Demo](https://xinlei3166.github.io/vitepress-demo/)

## 提示
由于vitepress版本更新频繁，目前支持版本为1.0.0-alpha.30。

在vue@3.2.45版本下setup语法报错，锁定vue版本为3.2.44。

## 安装

```bash
npm install -D vitepress-theme-demoblock
yarn add -D vitepress-theme-demoblock
pnpm add -D vitepress-theme-demoblock
```



## 快速上手

.vitepress/config.js文件中使用demoBlockPlugin插件

import { demoBlockPlugin } from 'vitepress-theme-demoblock'

```js
markdown: {
  config: (md) => {
    md.use(demoBlockPlugin)
  }
}
```

.vitepress/theme/index.js中使用vitepress-theme-demoblock主题，并注册组件(包含主题中默认的组件)。

```js
import DefaultTheme from 'vitepress/theme'
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import { useComponents } from './useComponents'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    useComponents(ctx.app)
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


## 更多用法

markdown 中的vue代码包含的style内容，会被组合成一个style统一处理，如果需要使用css预处理器，需要提前指定并且手动安装使用的css预处理器。
```js
markdown: {
  config: (md) => {
    md.use(demoBlockPlugin, {
      cssPreprocessor: 'less'
    })
  }
}
```

自定义style tag name

```js
markdown: {
  config: (md) => {
    md.use(demoBlockPlugin, {
      customStyleTagName: 'style lang="less"' // style标签会解析为<style lang="less"><style>
    })
  }
}
```


markdown 中的vue代码被编译为了 vue 函数组件，需要把 import 转换为 require，这里可附加一些其他的转换。
vue已经内置做了转换，例如 `import { ref } from 'vue'` 会被转换为 `const { ref } = Vue`。
这里编码风格使用的是单引号，如果你使用的是双引号，需自行处理(详见[#21](https://github.com/xinlei3166/vitepress-theme-demoblock/issues/21))。
```js
markdown: {
  config: (md) => {
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


style路径转换
```js
markdown: {
  config: (md) => {
    md.use(demoBlockPlugin, {
      styleReplaces: [
        { searchValue: '@import "docs/styles/index.css";',
          replaceValue: '@import "@docs/styles/index.css";'
        }
      ]
    })
  }
}
```


多style和多script支持

为了把markdown中的代码渲染为组件，内部已经使用了script和style。如果想在md文件中使用script可以使用script setup，参考下面例子：
```markdown
## 多style和多script支持
code snippet ...

<style>
body {
color: red;
}
</style>

<script lang="ts" setup>
console.log('script')
</script>
```


## 多语言

.vitepress/config.js文件中增加demoblock字段来支持多语言 (默认中文)

> vitepress有一个修改多语言支持的PR，详见[1339](https://github.com/vuejs/vitepress/pull/1339)，其更新后此处会同步调整。

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


## 自定义主题

通过配置 customClass 类名称，自定义demoblock样式
```js
markdown: {
  config: (md) => {
    md.use(demoBlockPlugin, {
      customClass: 'demoblock-custom'
    })
  }
}
```

通过配置暴露的 css-variables，自定义demoblock样式

```css
:root {
  --demoblock-border: var(--vp-c-divider-light);
  --demoblock-control: #d3dce6;
  --demoblock-control-bg: var(--vp-c-bg);
  --demoblock-control-bg-hover: #f9fafc;
  --demoblock-description-bg: var(--vp-c-bg);
}

html.dark {
  --demoblock-control: #8b9eb0;
  --demoblock-control-bg-hover: var(--vp-c-bg);
  --demoblock-description-bg: var(--vp-code-bg-color);
}
```

配置主题色
```css
:root {
  --vp-c-brand: #646cff;
  --vp-c-brand-light: #747bff;
  --vp-c-brand-lighter: #9499ff;
  --vp-c-brand-lightest: #bcc0ff;
  --vp-c-brand-dark: #535bf2;
  --vp-c-brand-darker: #454ce1;
}
```


## 使用第三方组件库

这个插件主要是针对自己的组件库来使用的，第三方的组件库直接导入使用即可(例如element-plus)。

在 .vitepress/theme/index.js 文件中加入以下代码：
```js
import DefaultTheme from 'vitepress/theme'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    ctx.app.use(ElementPlus)
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


