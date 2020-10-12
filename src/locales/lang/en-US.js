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
  'menu.supplier.other': 'Other supplier',
  'menu.supplier.other.list': 'Supplier list',
  'menu.supplier.other.item': 'Supplier detail',

  'menu.contract': 'Contract',
  'menu.contract.list': 'Contracts',
  'menu.contract.item': 'Contract detail',
  'menu.contract.edit': 'Contract edit',
  'menu.contract.account': 'Contract account',
  'menu.contract.account.list': 'Contract account',
  'menu.contract.account.item': 'Account detail',

  'menu.change': 'Changes',
  'menu.change.pmi': 'PMI',
  'menu.change.cip.list': 'CIP',
  'menu.change.cip.item': 'CIP detail',
  'menu.change.cip.edit': 'CIP edit',
  'menu.change.vo.list': 'VO',
  'menu.change.vo.item': 'VO detail',
  'menu.change.vo.edit': 'VO edit',
  'menu.cost': 'Costs',
  'menu.cost.enact.list': 'Enact',
  'menu.cost.resolve.list': 'Resolve',
  'menu.cost.industry.list': 'Industry',
  'menu.cost.bid.list': 'Bid',

  'menu.pay': 'Pay',
  'menu.pay.signed': 'Pay signed',
  'menu.pay.signed.ongoing.list': 'Pay signed ongoing list',
  'menu.pay.signed.ongoing.item': 'Pay signed ongoing detail',
  'menu.pay.signed.ongoing.approval': 'Pay signed ongoing approval',
  'menu.pay.signed.upcoming.list': 'Pay signed upcoming list',
  'menu.pay.signed.upcoming.item': 'Pay signed upcoming detail',
  'menu.pay.unsigned.list': 'Pay unsigned list',
  'menu.pay.unsigned.item': 'Pay unsigned detail',
  'menu.pay.unsigned.approval': 'Pay unsigned approval',
  'menu.pay.signed.apply': 'Pay signed apply',
  'menu.pay.account.list': 'Pay account list',
  'menu.pay.account.item': 'Pay account item',

  'menu.checkout': 'Checkout',
  'menu.checkout.contract.list': 'Checkout contract list',
  'menu.checkout.contract.item': 'Checkout contract detail',
  'menu.checkout.completed.list': 'Checkout completed list',
  'menu.checkout.completed.item': 'Checkout completed detail',
  'menu.checkout.project.list': 'Checkout project list',
  'menu.checkout.project.item': 'Checkout project item',
  'menu.checkout.finance.list': 'Checkout finance list',
  'menu.checkout.finance.item': 'Checkout finance detail',

  'menu.report': 'Report',
  'menu.data': 'Data',

  'menu.settings': 'Settings',
  'menu.settings.base': 'Settings base',
  'menu.settings.security': 'Settings security',
  'menu.settings.custom': 'Settings custom',
  'menu.settings.binding': 'Settings binding',
  'menu.settings.notification': 'Settings notification',

  'layouts.usermenu.dialog.title': 'Message',
  'layouts.usermenu.dialog.content': 'Do you really log-out.',

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
