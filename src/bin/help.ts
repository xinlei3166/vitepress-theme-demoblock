import prettier from 'prettier'
import yaml from 'yaml'
import path from 'path'
import fs from 'fs'
import { getDirname } from '../utils'

// const cwd = process.cwd()
// const resolve = (...args: any[]) => path.resolve(cwd, ...args)

const __dirname = getDirname(import.meta.url)
const resolve = (...args: any[]) => path.resolve(__dirname, ...args)

const prettierConfigPath = '.prettierrc'

export const format = (content: string, userOptions = { parser: 'javascript' }) => {
  // const defaultOptionBuffer = fs.readFileSync(resolve(prettierConfigPath))
  const defaultOptionBuffer = fs.readFileSync(resolve('../../', prettierConfigPath))
  const defaultOptions = yaml.parse(defaultOptionBuffer.toString())
  const options = Object.assign({}, defaultOptions, userOptions)
  return prettier.format(content, options)
}
