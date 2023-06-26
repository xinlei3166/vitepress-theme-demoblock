import mdContainer from 'markdown-it-container'
import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token'
import type Renderer from 'markdown-it/lib/renderer'
import type { DemoblockPluginOptions } from '../types'

export const blockPlugin = (md: MarkdownIt, options: DemoblockPluginOptions) => {
  md.use(mdContainer, 'demo', {
    validate(params: string) {
      return params.trim().match(/^demo\s*(.*)$/)
    },
    render(tokens: Token[], idx: number) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
      if (tokens[idx].nesting === 1) {
        const componentName = m && m.length > 1 ? m[1] : ''
        const content = tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : ''
        const contents = content.replace('<client-only>', '').replace('</client-only>', '')
        // return `<demo customClass="${options?.customClass || ''}" sourceCode="${md.utils.escapeHtml(
        //   contents
        // )}">${content ? `<!--vue-demo:${content}:vue-demo-->` : ''}`
        return `<demo customClass="${options?.customClass || ''}" sourceCode="${md.utils.escapeHtml(
          contents
        )}"><${componentName} />`
      }
      return '</demo>'
    }
  })
}

export const codePlugin = (md: MarkdownIt, options: DemoblockPluginOptions) => {
  const defaultRender = md.renderer.rules.fence
  md.renderer.rules.fence = (
    tokens: Token[],
    idx: number,
    options: MarkdownIt.Options,
    env: any,
    self: Renderer
  ) => {
    const token = tokens[idx]
    // 判断该 fence 是否在 :::demo 内
    const prevToken = tokens[idx - 1]
    const isInDemoContainer =
      prevToken && prevToken.nesting === 1 && prevToken.info.trim().match(/^demo\s*(.*)$/)
    const lang = token.info.trim()
    if (isInDemoContainer) {
      const content = token.content.replace('<client-only>', '').replace('</client-only>', '')
      return `
        <template #highlight>
          <div v-pre class="language-${lang} vp-adaptive-theme">
            <span class="lang">${lang}</span>
            ${md.options.highlight?.(content, lang, '') || ''}
          </div>
        </template>`
    }
    return defaultRender?.(tokens, idx, options, env, self) as string
  }
}

export const demoblock = (md: MarkdownIt, options: DemoblockPluginOptions = {}) => {
  md.use(blockPlugin, options)
  md.use(codePlugin, options)
}
