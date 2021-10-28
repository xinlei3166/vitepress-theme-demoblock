const { compileTemplate, TemplateCompiler, compileScript, parse } = require('@vue/compiler-sfc')

function stripScript(content, id) {
  const result = content.match(/<(script)(?:.* \bsetup\b)?[^>]*>([\s\S]+)<\/\1>/)
  const source = result && result[0] ? result[0].trim() : ''
  if (source) {
    const { descriptor } = parse(source)
    const { content: scriptContent } = compileScript(descriptor, {
      refSugar: true,
      id
    })
    return scriptContent
  }
  return source
}

function stripStyle(content) {
  const result = content.match(/<(style)[^>]*>([\s\S]+)<\/\1>/)
  return result && result[2] ? result[2].trim() : ''
}

// 编写例子时不一定有 template。所以采取的方案是剔除其他的内容
function stripTemplate(content) {
  content = content.trim()
  if (!content) {
    return content
  }
  return content.replace(/<(script|style)[\s\S]+<\/\1>/g, '').trim()
}

function pad(source) {
  return source
    .split(/\r?\n/)
    .map(line => `  ${line}`)
    .join('\n')
}

const templateReplaceRegex = /<template>([\s\S]+)<\/template>/g

function genInlineComponentText(template, script, options) {
  let source = template
  if (templateReplaceRegex.test(source)) {
    source = source.replace(templateReplaceRegex, '$1')
  }
  const finalOptions = {
    source: `<div>${source}</div>`,
    filename: 'inline-component', // TODO：这里有待调整
    compiler: TemplateCompiler,
    compilerOptions: {
      mode: 'function'
    }
  }
  const compiled = compileTemplate(finalOptions)
  // tips
  if (compiled.tips && compiled.tips.length) {
    compiled.tips.forEach(tip => {
      console.warn(tip)
    })
  }
  // errors
  if (compiled.errors && compiled.errors.length) {
    console.error(
      `\n  Error compiling template:\n${pad(compiled.source)}\n` +
        compiled.errors.map(e => `  - ${e}`).join('\n') +
        '\n'
    )
  }
  let demoComponentContent = `
    ${compiled.code.replace('return function render', 'function render')}
  `
  // todo: 这里采用了硬编码有待改进
  script = script.trim()
  if (script) {
    script = script
      .replace(/export\s+default/, 'const democomponentExport =')
      .replace(/import ({.*}) from 'vue'/g, (s, s1) => `const ${s1} = Vue`)
      .replace(
        /const ({ defineComponent as _defineComponent }) = Vue/g,
        'const { defineComponent: _defineComponent } = Vue'
      )

    // 因为 vue 函数组件需要把 import 转换为 require，这里可附加一些其他的转换。
    if (options?.scriptReplaces) {
      for (const s of options.scriptReplaces) {
        script = script.replace(s.searchValue, s.replaceValue)
      }
    }
  } else {
    script = 'const democomponentExport = {}'
  }
  demoComponentContent = `(function() {
    ${demoComponentContent}
    ${script}
    return {
      render,
      ...democomponentExport
    }
  })()`
  return demoComponentContent
}

module.exports = {
  stripScript,
  stripStyle,
  stripTemplate,
  genInlineComponentText
}
