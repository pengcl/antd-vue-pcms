import antdEnUS from 'ant-design-vue/es/locale-provider/en_US'
import momentEU from 'moment/locale/eu'

const components = {
  antLocale: antdEnUS,
  momentName: 'eu',
  momentLocale: momentEU
}

const locale = {
  'message': '-',
  'menu.home': 'Home',
  'menu.dashboard': 'Dashboard',
  'menu.dashboard.tasks': 'Tasks',
  'menu.dashboard.participate': 'Participate',
  'menu.project': 'Project',
  'menu.project.list': 'Projects',
  'menu.project.item': 'Project detail',
  'menu.project.cost.list': 'Project costs',
  'menu.project.cost.item': 'Project cost detail',

  'menu.supplier': 'Supplier',
  'menu.supplier.purchase': 'Purchase supplier',
  'menu.supplier.purchase.list': 'Supplier list',
  'menu.supplier.purchase.item': 'Supplier detail',
  'menu.supplier.purchase.edit': 'Supplier Edit',
  'menu.supplier.other': 'Other supplier',
  'menu.supplier.other.list': 'Other Supplier list',
  'menu.supplier.other.item': 'Other Supplier detail',

  'menu.contract': 'Contract',
  'menu.contract.list': 'Contracts',
  'menu.contract.item': 'Contract detail',
  'menu.contract.edit': 'Contract edit',
  'menu.contract.account': 'Contract account',
  'menu.contract.account.list': 'Contract account',
  'menu.contract.account.item': 'Account detail',

  'menu.change': 'Changes',
  'menu.change.cip.list': 'CIP',
  'menu.change.cip.item': 'CIP detail',
  'menu.change.account.list': 'VO',
  'menu.change.account.item': 'VO detail',
  'menu.change.certificate': 'Certificate',

  'menu.cost': 'Costs',
  'menu.cost.enact.list': 'Enact List',
  'menu.cost.enact.item': 'Enact Detail',
  'menu.cost.resolve.list': 'Resolve List',
  'menu.cost.resolve.item': 'Resolve Detail',
  'menu.cost.industry.list': 'Industry List',
  'menu.cost.industry.edit': 'Industry Edit',
  'menu.cost.industry.item': 'Industry Detail',
  'menu.cost.bid.list': 'Bid List',
  'menu.cost.bid.edit': 'Bid Edit',
  'menu.cost.bid.item': 'Bid Detail',
  'menu.cost.type.list': 'Cost Type List',
  'menu.cost.type.item': 'Cost Type Detail',

  'menu.pay': 'Pay',
  'menu.pay.signed.list': 'Pay Signed',
  'menu.pay.signed.item': 'Pay Signed detail',
  'menu.pay.signed.invoice': 'Pay Invoice',
  'menu.pay.unsigned.list': 'Pay Unsigned',
  'menu.pay.unsigned.edit': 'Pay Unsigned Edit',
  'menu.pay.unsigned.item': 'Pay unsigned detail',
  'menu.pay.fundplan.list': 'Pay fundplan',
  'menu.pay.fundplan.item': 'Pay fundplan detail',

  'menu.checkout': 'Checkout',
  'menu.checkout.contract.list': 'Checkout contract list',
  'menu.checkout.contract.item': 'Checkout contract detail',
  'menu.checkout.contract.edit': 'Checkout contract edit',
  'menu.checkout.completed.list': 'Checkout completed list',
  'menu.checkout.completed.item': 'Checkout completed detail',
  'menu.checkout.project.list': 'Checkout project list',
  'menu.checkout.project.item': 'Checkout project item',
  'menu.checkout.finance.list': 'Checkout finance list',
  'menu.checkout.finance.item': 'Checkout finance detail',

  'menu.report': 'Report',

  'menu.data.list': 'Data List',
  'menu.data.item': 'Data Item',

  'menu.settings': 'Settings',
  'menu.settings.base': 'Settings base',
  'menu.settings.security': 'Settings security',
  'menu.settings.custom': 'Settings custom',
  'menu.settings.binding': 'Settings binding',
  'menu.settings.notification': 'Settings notification',

  'system.logout.title': 'Message',
  'system.logout.content': 'Do you really log-out.',

  'app.setting.pagestyle': 'Page style setting',
  'app.setting.pagestyle.light': 'Light style',
  'app.setting.pagestyle.dark': 'Dark style',
  'app.setting.pagestyle.realdark': 'RealDark style',
  'app.setting.themecolor': 'Theme Color',
  'app.setting.navigationmode': 'Navigation Mode',
  'app.setting.content-width': 'Content Width',
  'app.setting.fixedheader': 'Fixed Header',
  'app.setting.fixedsidebar': 'Fixed Sidebar',
  'app.setting.sidemenu': 'Side Menu Layout',
  'app.setting.topmenu': 'Top Menu Layout',
  'app.setting.content-width.fixed': 'Fixed',
  'app.setting.content-width.fluid': 'Fluid',
  'app.setting.othersettings': 'Other Settings',
  'app.setting.weakmode': 'Weak Mode',
  'app.setting.copy': 'Copy Setting',
  'app.setting.loading': 'Loading theme',
  'app.setting.copyinfo': 'copy success，please replace defaultSettings in src/models/setting.js',
  'app.setting.production.hint': 'Setting panel shows in development environment only, please manually modify'
}

export default {
  ...components,
  ...locale
}
