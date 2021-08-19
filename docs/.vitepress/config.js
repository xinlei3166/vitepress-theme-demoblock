const base = process.env.BASE || '/'

module.exports = {
  title: 'VitePress',
  description: 'Life is short, Keep it simple.',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]
  ],
  base: base,
  // locales: {
  //   '/': { lang: 'en-US' },
  //   '/zh/': { lang: 'zh-CN'},
  // },
  themeConfig: {
    repo: 'xinlei3166/vitepress-theme-demoblock',
    logo: '/logo.svg',
    docsDir: 'docs',
    docsBranch: 'master',

    // locales
    // locales: {
    //   '/': { label: 'English' },
    //   '/zh/' : { label: '简体中文' },
    // },

    // demoblock locales
    demoblock: {
      '/': {
        'hide-text': 'Hide',
        'show-text': 'Expand',
        'copy-button-text': 'Copy',
        'copy-button-text-success': 'Copy success!'
      },
      '/zh': {
        'hide-text': '隐藏代码',
        'show-text': '显示代码',
        'copy-button-text': '复制代码片段',
        'copy-button-text-success': '复制成功！'
      }
    },

    // nav
    nav: [
      { text: '文档', link: '/guide/' }
    ],

    // sidebar
    sidebar: { '/guide/': [
        {
          text: '指南',
          children: [
            {
              text: '组件',
              link: '/guide/card'
            }
          ]
        }
      ]
    },

    // page meta
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
  },
  markdown: {
    // options for markdown-it-anchor
    anchor: { permalink: false },

    // options for markdown-it-toc
    toc: { includeLevel: [1, 2] },

    config: (md) => {
      const { demoBlockPlugin } = require('../../demoblock')
      md.use(demoBlockPlugin, {
        scriptImports: [
          { searchValue: /const ({ defineComponent as _defineComponent }) = Vue/g,
            replaceValue: 'const { defineComponent: _defineComponent } = Vue'
          }
        ]
      })
    }
  }
}
