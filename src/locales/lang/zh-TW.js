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
  'menu.dashboard.participate': '监控页',
  'menu.project': '项目管理',
  'menu.project.list': '项目列表',
  'menu.project.item': '项目详情',
  'menu.project.cost.list': '业态成本中心',
  'menu.project.cost.item': '业态成本详情',
  'menu.contract': '合同管理',
  'menu.contract.list': '合同列表',
  'menu.contract.item': '合同详情'
}

export default {
  ...components,
  ...locale
}
