// 拷贝自 vitepress
import path from 'path'
import fs from 'node:fs'

const includesRE = /<!--\s*@include:\s*(.*?)\s*-->/g
const rangeRE = /\{(\d*),(\d*)\}$/

export function processIncludes(code: string, file: string, root: string): string {
  return code.replace(includesRE, (m: string, m1: string) => {
    if (!m1.length) return m

    const range = m1.match(rangeRE)
    range && (m1 = m1.slice(0, -range[0].length))
    const atPresent = m1[0] === '@'
    try {
      const includePath = atPresent
        ? path.join(root, m1.slice(m1[1] === '/' ? 2 : 1))
        : path.join(path.dirname(file), m1)
      let content = fs.readFileSync(includePath, 'utf-8')
      if (range) {
        const [, startLine, endLine] = range
        const lines = content.split(/\r?\n/)
        content = lines
          .slice(
            startLine ? parseInt(startLine, 10) - 1 : undefined,
            endLine ? parseInt(endLine, 10) : undefined
          )
          .join('\n')
      }
      // recursively process includes in the content
      return processIncludes(content, includePath, root)
    } catch (error) {
      return m // silently ignore error if file is not present
    }
  })
}
