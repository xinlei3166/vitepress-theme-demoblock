const prettier = require('prettier')
const yaml = require('yaml')
const path = require('path')
const fs = require('fs')

const prettierConfigPath = '../.prettierrc'
exports.format = (content, userOptions = { parser: 'javascript' }) => {
  const defaultOptionBuffer = fs.readFileSync(path.resolve(__dirname, prettierConfigPath))
  const defaultOptions = yaml.parse(defaultOptionBuffer.toString())
  const options = Object.assign({}, defaultOptions, userOptions)
  return prettier.format(content, options)
}
