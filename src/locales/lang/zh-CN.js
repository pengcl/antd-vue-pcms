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
  'menu.project': '项目信息',
  'menu.project.list': '项目列表',
  'menu.project.item': '项目详情',
  'menu.project.cost.list': '业态成本中心',
  'menu.project.cost.item': '业态成本详情',

  'menu.supplier': '供应商信息管理',
  'menu.supplier.purchase': '采购类供应商',
  'menu.supplier.purchase.list': '供应商列表',
  'menu.supplier.purchase.item': '供应商详情',
  'menu.supplier.other': '其他类供应商',
  'menu.supplier.other.list': '供应商列表',
  'menu.supplier.other.item': '供应商详情',

  'menu.contract': '合同及成本控制',
  'menu.contract.list': '合同信息及成本控制',
  'menu.contract.item': '合同详情',
  'menu.contract.edit': '合同编辑',
  'menu.contract.account': '合同台账',
  'menu.contract.account.list': '合同台账',
  'menu.contract.account.item': '合同详情',
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
  'menu.cost.bid.list': '招投标分判包',

  'menu.pay': '付款管理',
  'menu.pay.signed': '合同付款申请',
  'menu.pay.signed.ongoing.list': '进度款申报列表',
  'menu.pay.signed.ongoing.item': '进度款申报列详情',
  'menu.pay.signed.ongoing.approval': '进度款申报审定',
  'menu.pay.signed.upcoming.list': '资金计划列表',
  'menu.pay.signed.upcoming.item': '资金计划列详情',
  'menu.pay.unsigned.list': '非合同付款申请',
  'menu.pay.unsigned.item': '非合同付款详情',
  'menu.pay.unsigned.approval': '非合同付款审批',
  'menu.pay.signed.apply': '付款申请',
  'menu.pay.account.list': '付款台账',
  'menu.pay.account.item': '付款详情页'
}

export default {
  ...components,
  ...locale
}
