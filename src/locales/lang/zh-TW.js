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
  'menu.change.cip.item': '合同指令预先批核详细',
  'menu.change.vo.item': '变更指令详细（VO）',
  'menu.change.account.list': '变更指令',
  'menu.change.account.item': '变更指令详细',
  'menu.change.certificate.list': '现场签证',
  'menu.change.certificate.item': '现场签证详情',
  'menu.change.constructionOrganizeDesign': '施工组织设计',

  'menu.cost': '成本预算管理',
  'menu.cost.enact.list': '成本预算制定',
  'menu.cost.enact.item': '成本预算编制',
  'menu.cost.enact.collect': '成本预算汇总',
  'menu.cost.enact.import': '成本预算导入',
  'menu.cost.resolve.list': '预算分解',
  'menu.cost.resolve.item': '专业预算查看',
  'menu.cost.industry.list': '专业分判包',
  'menu.cost.industry.batch': '专业分判包审批',
  'menu.cost.industry.item': '专业分判包详细',
  'menu.cost.bid.list': '招投标分判包',
  'menu.cost.bid.edit': '新增招投标分判包',
  'menu.cost.bid.item': '招投标分判包详细',
  'menu.cost.type.list': '管理',
  'menu.cost.type.item': '行业预算类型详情',

  'menu.pay': '付款管理',
  'menu.pay.signed.list': '合同付款申请',
  'menu.pay.signed.item': '新增合同付款',
  'menu.pay.signed.invoice': '合同付款发票管理',
  'menu.pay.unsigned.list': '非合同付款申请',
  'menu.pay.unsigned.item': '非合同付款详情',
  'menu.pay.unsigned.approval': '非合同付款审批',
  'menu.pay.signed.apply': '付款申请',
  'menu.pay.account.list': '付款台账',
  'menu.pay.account.item': '付款详情页',
  'menu.pay.fundplan.list': '资金计划',
  'menu.pay.fundplan.item': '资金计划详情',

  'menu.checkout': '结算管理',
  'menu.checkout.contract.list': '合同结算',
  'menu.checkout.contract.item': '合同结算详情',
  'menu.checkout.completed.list': '竣工证书',
  'menu.checkout.completed.item': '竣工证书详情',
  'menu.checkout.project.list': '工程结算书',
  'menu.checkout.project.item': '工程结算书详情',
  'menu.checkout.finance.list': '财务结算书',
  'menu.checkout.finance.item': '财务结算书详情',

  'menu.report': '报表管理',
  'menu.report.contract': '项目合同台账表',
  'menu.report.audit': '付款审批情况追踪表',
  'menu.report.tracking': '项目付款跟踪情况汇总分析表',
  'menu.report.first': '成本开支报表(末级科目)',
  'menu.report.end': '成本开支报表(一级科目)',

  'menu.data.list': '基础数据设置',
  'menu.data.item': '基础数据设置',

  'menu.role': '数据权限',
  'menu.role.project': '岗位项目授权',
  'menu.role.post': '项目岗位授权',

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
