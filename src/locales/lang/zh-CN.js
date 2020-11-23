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

  'menu.supplier': '供应商管理',
  'menu.supplier.purchase': '采购类供应商',
  'menu.supplier.purchase.list': '采购类供应商',
  'menu.supplier.purchase.item': '供应商详情',
  'menu.supplier.purchase.edit': '供应商信息编辑',
  'menu.supplier.other': '其他类供应商',
  'menu.supplier.other.list': '其他类供应商',
  'menu.supplier.other.item': '其他类供应商详情',

  'menu.contract': '合同及成本控制',
  'menu.contract.list': '合同信息及成本控制',
  'menu.contract.item': '合同详情',
  'menu.contract.edit': '合同编辑',
  'menu.contract.account': '合同台账',
  'menu.contract.account.list': '合同台账',
  'menu.contract.account.item': '合同详情',

  'menu.change': '变更及成本管控',
  'menu.change.cip.list': '合同变更',
  'menu.change.cip.item': '变更合同详细',
  'menu.change.account.list': '变更台账',
  'menu.change.account.item': '变更台账详细',
  'menu.change.certificate': '现场签证',
  'menu.change.constructionOrganizeDesign': '施工组织设计',

  'menu.cost': '成本预算管理',
  'menu.cost.enact.list': '成本预算制定',
  'menu.cost.enact.item': '成本预算编制',
  'menu.cost.resolve.list': '行业预算分解',
  'menu.cost.resolve.item': '行业预算查看',
  'menu.cost.industry.list': '行业分判包',
  'menu.cost.industry.edit': '新增行业分判包',
  'menu.cost.industry.item': '行业分判包详细',
  'menu.cost.bid.list': '招投标分判包',
  'menu.cost.bid.edit': '新增招投标分判包',
  'menu.cost.bid.item': '招投标分判包详细',
  'menu.cost.type.list': '行业档案管理',
  'menu.cost.type.item': '行业档案详情',

  'menu.pay': '付款管理',
  'menu.pay.signed.list': '合同付款申请',
  'menu.pay.signed.item': '新增合同付款',
  'menu.pay.signed.invoice': '合同付款发票管理',
  'menu.pay.unsigned.list': '非合同付款申请',
  'menu.pay.unsigned.edit': '非合同付款申请新增',
  'menu.pay.unsigned.item': '非合同付款申请新增',
  'menu.pay.unsigned.approval': '非合同付款审批',
  'menu.pay.signed.apply': '付款申请',
  'menu.pay.account.list': '付款台账',
  'menu.pay.account.item': '付款详情页',
  'menu.pay.fundplan.list': '资金计划',
  'menu.pay.fundplan.item': '资金计划详情',

  'menu.checkout': '结算管理',
  'menu.checkout.contract.list': '合同结算',
  'menu.checkout.contract.item': '合同结算详情',
  'menu.checkout.contract.edit': '合同结算新增',
  'menu.checkout.completed.list': '竣工证书',
  'menu.checkout.completed.item': '竣工证书详情',
  'menu.checkout.project.list': '工程结算书',
  'menu.checkout.project.item': '工程结算书详情',
  'menu.checkout.finance.list': '财务结算书',
  'menu.checkout.finance.item': '财务结算书详情',

  'menu.report': '报表管理',

  'menu.data.list': '基础数据设置',
  'menu.data.item': '基础数据设置',

  'menu.settings': '系统设置',
  'menu.settings.base': '基本设置',
  'menu.settings.security': '案例设置',
  'menu.settings.custom': '个性化设置',
  'menu.settings.binding': '账户绑定',
  'menu.settings.notification': '消息通知',

  'system.logout.title': '系统提示',
  'system.logout.content': '您需要退出系统吗'
}

export default {
  ...components,
  ...locale
}
