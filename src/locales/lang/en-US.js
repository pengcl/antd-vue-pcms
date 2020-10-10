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
