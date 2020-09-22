import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentTW from 'moment/locale/zh-tw'

const components = {
  antLocale: antd,
  momentName: 'zh-tw',
  momentLocale: momentTW
}

const locale = {
  'message': '-',
  'menu.home': '主页',
  'menu.dashboard': '仪表盘',
  'menu.dashboard.tasks': '分析页',
  'menu.dashboard.participate': '监控页'
}

export default {
  ...components,
  ...locale
}
