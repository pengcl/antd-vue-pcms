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
  'menu.dashboard.participate': '我的参与',
  'menu.project': '项目管理',
  'menu.project.list': '项目列表',
  'menu.project.item': '项目详情',
  'menu.project.cost.list': '业态成本中心',
  'menu.project.cost.item': '业态成本详情',
  'menu.contract': '合同管理',
  'menu.contract.list': '合同列表',
  'menu.contract.item': '合同详情',
  'menu.contract.edit': '合同编辑',
  'menu.change': '变更及成本管控',
  'menu.change.pmi': '项目管理指令表',
  'menu.change.cip.list': '合同指令预先批核表',
  'menu.change.cip.item': '合同指令预先批核详细',
  'menu.change.cip.edit': '合同指令预先批核编辑',
  'menu.change.vo.list': '变更指令',
  'menu.change.vo.item': '变更指令详细',
  'menu.change.vo.edit': '变更指令编辑',
  'menu.cost': '成本预算管理',
  'menu.cost.enact.list': '成本预算制定',
  'menu.cost.resolve.list': '行业预算分解',
  'menu.cost.industry.list': '行业分判包',
  'menu.cost.bid.list': '招投标分判包'
}

export default {
  ...components,
  ...locale
}
