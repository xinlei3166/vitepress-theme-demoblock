import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkDirective from 'remark-directive'
import remarkStringify from 'remark-stringify'
import type { Node } from 'unist'
import { visit } from 'unist-util-visit'
import path from 'path'
import os from 'os'
import h from 'hash-sum'
import { ScriptSetupMatchPattern } from './patterns'

export const demoPattern = /:::demo([\s\S]*?):::/
export const codePattern = /.md.demo.[a-zA-Z0-9]+\.(vue|jsx|tsx)$/
export const hash = (val: string) => h(val)
export const combineVirtualFilename = (id: string, name: string, lang: string) =>
  `${id}.demo.${name}.${lang}`

interface Tree extends Node {
  [key: string]: any
}

export async function transformCodeToComponent(
  id: string,
  code: any,
  options: Record<string, any>
) {
  const blocks: Array<Record<string, any>> = []

  function remarkDemo() {
    return (tree: Tree) => {
      // console.log('tree', tree)
      let seed = 0
      const scriptSetup: Record<string, any> = {
        index: -1,
        content: ''
      }

      visit(tree, (node, index) => {
        if (node.type === 'html') {
          const matches = node.value.match(ScriptSetupMatchPattern)
          if (!matches) return
          scriptSetup.index = index
          scriptSetup.content = matches?.[4] ?? ''
        }

        if (node.type === 'containerDirective' && node.name === 'demo') {
          seed++
          const name = hash(`${id}-demo-${seed}`)
          blocks.push({
            lang: node.children[0]?.lang,
            value: node.children[0]?.value,
            name
          })
          node.name = `demo render-demo-i${name}`
        }
      })

      if (blocks.length <= 0) return
      const appendCode = blocks
        .map(block => {
          const filename = combineVirtualFilename(id, block.name, block.lang)
          return `import RenderDemoI${block.name} from '${filename}'`
        })
        .join(os.EOL)
      if (scriptSetup.index !== -1) {
        const node = tree.children[scriptSetup.index]
        node.value = node.value.replace(
          ScriptSetupMatchPattern,
          (match: string, p1: string, p2: string, p3: string, p4: string, p5: string) =>
            `${p1}${os.EOL}${appendCode}${os.EOL}${p4}${p5}`
        )
      } else {
        tree.children.push({
          type: 'html',
          value: `<script setup>${os.EOL}${appendCode}${os.EOL}</script>`
        })
      }
    }
  }

  const file = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkDirective)
    .use(remarkStringify)
    .use(remarkDemo)
    .process(code)

  // console.log(String(file))

  for (const block of blocks) {
    const filename = combineVirtualFilename(id, block.name, block.lang) // component file id
    const blockId = '/' + path.relative(options.root, filename)
    block.absId = filename
    block.relId = blockId
    Demoblocks.set(blockId, block.value)
  }

  const fileId = '/' + path.relative(options.root, id)
  const _blocks = blocks.map(({ lang, name, id }) => ({ lang, name, id }))
  FileCaches.set(fileId, _blocks)

  const c = String(file).replace(/\\:::/g, ':::')
  return { code: c, blocks }
}

export const Demoblocks = new Map()
export const FileCaches = new Map()
