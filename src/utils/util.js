export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {
  }
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export function fixedList (res, params) {
  const total = typeof res.result.data.totalCount === 'number' ? res.result.data.totalCount : res.result.data.length
  const items = res.result.data.items ? res.result.data.items : res.result.data
  const result = {}
  result.pageSize = params.pageSize
  result.pageNo = params.pageNo
  result.totalPage = Math.ceil(total / params.pageSize)
  result.totalCount = total
  result.data = items
  return result
}

export function nullFixedList (params) {
  const total = 0
  const items = []
  const result = {}
  result.pageSize = params.pageSize
  result.pageNo = params.pageNo
  result.totalPage = Math.ceil(total / params.pageSize)
  result.totalCount = total
  result.data = items
  return new Promise((resolve, reject) => {
    resolve(result)
  })
}

export function formatTree (data, keys) {
  const items = []
  data.forEach(item => {
    keys.forEach(key => {
      const keyArr = key.split(':')
      item[keyArr[0]] = item[keyArr[1]]
    })
    items.push(item)
    if (item.children) {
      item.children = formatTree(item.children, keys)
    }
  })
  return items
}

export function compare (a, b) {
  if (a === b) {
    return 0
  }

  const aComponents = a.split('.')
  const bComponents = b.split('.')

  const len = Math.min(aComponents.length, bComponents.length)

  // loop while the components are equal
  for (let i = 0; i < len; i++) {
    // A bigger than B
    if (parseInt(aComponents[i]) > parseInt(bComponents[i])) {
      return 1
    }

    // B bigger than A
    if (parseInt(aComponents[i]) < parseInt(bComponents[i])) {
      return -1
    }
  }

  // If one's a prefix of the other, the longer one is greater.
  if (aComponents.length > bComponents.length) {
    return 1
  }

  if (aComponents.length < bComponents.length) {
    return -1
  }

  // Otherwise they are the same.
  return 0
}

/* export function getLabel(values, value) {
  let label = '';
  values.forEach(item => {
    if(item.nameCN === 'value'){
      label = item.nameCN;
    }
  });
} */

export const currencyFormat = 'value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, \',\')'
export const currencyParser = 'value => value.replace(/\$\s?|(,*)/g, \'\')'
