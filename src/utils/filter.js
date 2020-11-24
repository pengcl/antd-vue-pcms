import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0.00'
  }
  const intPartFormat = value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') // 将整数部分逢三一断
  // intPartFormat = Math.floor(Number(intPartFormat) * 100 / 100)
  return intPartFormat
})

Vue.filter('dayjs', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (dataStr) {
    return moment(dataStr).format(pattern)
  } else {
    return ''
  }
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (dataStr) {
    return moment(dataStr).format(pattern)
  } else {
    return ''
  }
})

Vue.filter('date', function (dataStr, pattern = 'YYYY-MM-DD') {
  if (dataStr) {
    return moment(dataStr).format(pattern)
  } else {
    return ''
  }
})
