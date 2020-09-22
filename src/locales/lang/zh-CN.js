import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

const locale = {
  'message': '-',
  'menu.home': '主页',
  'menu.dashboard': '审批工作台',
  'menu.dashboard.tasks': '我的任务',
  'menu.dashboard.participate': '我的参与'
}

export default {
  ...components,
  ...locale
}
