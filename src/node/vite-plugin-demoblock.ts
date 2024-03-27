import type { Plugin } from 'vite'
import path from 'path'
import fs from 'node:fs'
import { codePattern, Demoblocks, transformCodeToComponent } from './remark'

export interface DemoblockOptions {
  env: 'vite' | 'vitepress'
  root: string
}

export function VitePluginDemoblock(): Plugin {
  const options: DemoblockOptions = {
    env: 'vitepress',
    root: ''
  }

  return {
    name: 'vite-plugin-demoblock',
    enforce: 'pre',
    async configResolved(config) {
      const isVitepress = config.plugins.find(p => p.name === 'vitepress')
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
      if (file.endsWith('.md')) {
        const { blocks } = await transformCodeToComponent(
          file,
          fs.readFileSync(file, 'utf8'),
          options
        )
        const mods = []
        const invalidatedModules = new Set()
        for (const block of blocks) {
          const blockId = block.absId
          const mod = server.moduleGraph.getModuleById(blockId)
          if (mod) {
            mods.push(mod)
            server.moduleGraph.invalidateModule(mod, invalidatedModules, timestamp, true)
            // server.reloadModule(mod)
          }
        }
        // server.ws.send({
        //   type: 'update',
        //   updates: mods
        //     .map(mod => {
        //       if (!mod) return null
        //       return {
        //         acceptedPath: mod.url,
        //         path: mod.url,
        //         timestamp,
        //         type: 'js-update'
        //       }
        //     })
        //     .filter(Boolean)
        // })
      }
    }
  }
}
