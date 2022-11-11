import { defineConfig } from 'vitepress'
import { demoBlockPlugin } from 'vitepress-theme-demoblock'

export default defineConfig({
  // lang: 'en-US',
  title: 'Vitepress',
  description: '一个基于 Vitepress 的主题插件，它可以帮助你在编写文档的时候增加 Vue 示例。',

  lastUpdated: true,
  cleanUrls: 'without-subfolders',

  // base: '/',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]
  ],

  markdown: {
    headers: {
      level: [0, 0]
    },

    // options for markdown-it-anchor
    anchor: { permalink: false },

    // options for markdown-it-toc
    toc: { includeLevel: [1, 2] },

    // light: #f9fafb, dark: --vp-code-block-bg
    // theme: { light: 'github-light', dark: 'github-dark' },

    config: (md) => {
      md.use(demoBlockPlugin, {
        customClass: 'demoblock-custom',
        cssPreprocessor: 'less',
        // customStyleTagName: 'style lang="less"',
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
  },

  themeConfig: {
    outlineTitle: '本页目录',
    lastUpdatedText: '上次更新',
    logo: '/logo.svg',

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
    },

    // nav
    nav: [
      { text: '文档', link: '/guide/' }
    ],

    // sidebar
    sidebar: { '/guide/': [
        {
          text: '文档',
          collapsible: false,
          items: [
            {
              text: '指南',
              link: '/guide/'
            },
            {
              text: '组件',
              link: '/guide/card'
            },
            {
              text: '第三方',
              link: '/guide/other'
            }
          ]
        }
      ]
    },

    editLink: {
      pattern: 'https://github.com/xinlei3166/vitepress-theme-demoblock/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/xinlei3166/vitepress-theme-demoblock' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present 君惜'
    }
  }
})
