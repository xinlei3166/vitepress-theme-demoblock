/**
 * js节流
 * @param method
 * @param delay
 * @return {Function}
 */
export function throttle(method, delay) {
  let timer = null
  let begin = new Date()
  return function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this,
      args = arguments
    const current = new Date()
    const remaining = delay - (current - begin)
    clearTimeout(timer)
    if (remaining <= 0) {
      method.apply(context, args)
      begin = new Date()
    } else {
      timer = setTimeout(function () {
        method.apply(context, args)
      }, remaining)
    }
  }
}

/**
 * 函数防抖
 * @param method
 * @param delay
 * @return {Function}
 */
export function debounce(method, delay) {
  let timer = null
  return function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this,
      args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      method.call(context, args)
    }, delay)
  }
}
