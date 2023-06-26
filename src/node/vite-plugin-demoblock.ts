import type { Plugin } from 'vite'
import path from 'path'
import fs from 'node:fs'
import { codePattern, Demoblocks, transformCodeToComponent } from './remark'

export interface DemoblockOptions {
  env: 'vite' | 'vitepress'
  root: string
}

export function VitePluginDemoblock(): Plugin {
  let vuePlugin: any = null
  const options: DemoblockOptions = {
    env: 'vitepress',
    root: ''
  }

  return {
    name: 'vite-plugin-demoblock',
    enforce: 'pre',
    async configResolved(config) {
      const isVitepress = config.plugins.find(p => p.name === 'vitepress')
      vuePlugin = config.plugins.find(p => p.name === 'vite:vue')
      options.env = isVitepress ? 'vitepress' : 'vite'
      options.root = config.root
    },
    resolveId(id) {
      if (codePattern.test(id)) {
        return id
      }
    },
    load(id) {
      if (codePattern.test(id)) {
        const blockId = '/' + path.relative(options.root, id)
        return Demoblocks.get(id) || Demoblocks.get(blockId)
      }
    },
    async transform(code, id) {
      if (id.endsWith('.md')) {
        const { code: transformedCode } = await transformCodeToComponent(id, code, options)
        return { code: transformedCode, map: null }
      }
    },
    async handleHotUpdate(ctx) {
      const { file, server, timestamp } = ctx
      const { moduleGraph } = server
      if (file.endsWith('.md')) {
        const updates: any[] = []
        const { blocks } = await transformCodeToComponent(
          file,
          fs.readFileSync(file, 'utf8'),
          options
        )
        for (const block of blocks) {
          const blockId = block.absId

          const mod = moduleGraph.getModuleById(blockId)
          if (mod) {
            const result = await vuePlugin.handleHotUpdate({
              file: blockId,
              timestamp: timestamp,
              modules: [mod],
              read: () => block.value,
              server: server
            })

            updates.push(...(result || []))
          }
        }
        if (updates.length > 0) {
          return updates.filter(Boolean)
        }
      }
    }
  }
}
