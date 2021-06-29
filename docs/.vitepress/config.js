const base = process.env.BASE || '/'

module.exports = {
  title: 'VitePress',
  description: 'Life is short, Keep it simple.',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]
  ],
  base: base,
  themeConfig: {
    repo: 'xinlei3166/vitepress-theme-demoblock',
    logo: '/logo.svg',
    docsDir: 'docs',
    docsBranch: 'master',

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
      md.use(demoBlockPlugin)
    }
  }
}
