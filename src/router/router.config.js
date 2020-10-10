import { UserLayout, BasicLayout } from '@/layouts'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard/tasks',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/tasks',
        component: RouteView,
        meta: { title: 'menu.dashboard', keepAlive: true, icon: 'home', permission: ['dashboard'] },
        children: [
          {
            path: '/dashboard/tasks',
            name: 'Tasks',
            component: () => import('@/views/dashboard/Tasks'),
            meta: { title: 'menu.dashboard.tasks', keepAlive: false, permission: ['dashboard'] }
          },
          {
            path: '/dashboard/participate',
            name: 'Participate',
            component: () => import('@/views/dashboard/Participate'),
            meta: { title: 'menu.dashboard.participate', keepAlive: true, permission: ['dashboard'] }
          }
        ]
      },

      // project
      {
        path: '/project',
        name: 'project',
        redirect: '/project/list',
        component: RouteView,
        meta: { title: 'menu.project', icon: 'project', permission: ['project'] },
        children: [
          {
            path: '/project/list',
            name: 'ProjectList',
            component: () => import('@/views/project/List'),
            meta: { title: 'menu.project.list', keepAlive: true, permission: ['project'] }
          },
          {
            path: '/project/item/:id',
            name: 'ProjectItem',
            component: () => import('@/views/project/Item'),
            hidden: true,
            meta: { title: 'menu.project.item', keepAlive: false, permission: ['project'] }
          },
          {
            path: '/project/cost/list',
            name: 'ProjectCostList',
            component: () => import('@/views/project/cost/List'),
            meta: { title: 'menu.project.cost.list', keepAlive: true, permission: ['project'] }
          },
          {
            path: '/project/cost/item/:id',
            name: 'ProjectCostItem',
            component: () => import('@/views/project/cost/Item'),
            hidden: true,
            meta: { title: 'menu.project.cost.item', keepAlive: true, permission: ['project'] }
          }
        ]
      },

      // supplier
      {
        path: '/supplier',
        name: 'supplier',
        redirect: '/supplier/purchase/list',
        component: RouteView,
        meta: { title: 'menu.supplier', icon: 'team', permission: ['supplier'] },
        children: [
          {
            path: '/supplier/purchase/list',
            name: 'SupplierPurchaseList',
            component: () => import('@/views/supplier/purchase/List'),
            meta: { title: 'menu.supplier.purchase.list', keepAlive: true, permission: ['supplier'] }
          },
          {
            path: '/supplier/purchase/item/:id',
            name: 'SupplierPurchaseItem',
            hidden: true,
            component: () => import('@/views/supplier/purchase/Item'),
            meta: { title: 'menu.supplier.purchase.item', keepAlive: true, permission: ['supplier'] }
          },
          {
            path: '/supplier/other/list',
            name: 'SupplierOtherList',
            component: () => import('@/views/supplier/other/List'),
            meta: { title: 'menu.supplier.other.list', keepAlive: true, permission: ['supplier'] }
          },
          {
            path: '/supplier/other/item/:id',
            name: 'SupplierOtherItem',
            hidden: true,
            component: () => import('@/views/supplier/other/Item'),
            meta: { title: 'menu.supplier.other.item', keepAlive: true, permission: ['supplier'] }
          }
        ]
      },

      // cost
      {
        path: '/cost',
        name: 'cost',
        redirect: '/cost/enact/list',
        component: RouteView,
        meta: { title: 'menu.cost', icon: 'property-safety', permission: ['cost'] },
        children: [
          {
            path: '/cost/enact/list',
            name: 'CostEnactList',
            component: () => import('@/views/cost/enact/List'),
            meta: { title: 'menu.cost.enact.list', keepAlive: true, permission: ['cost'] }
          },
          {
            path: '/cost/resolve/list',
            name: 'CostResolveList',
            component: () => import('@/views/cost/resolve/List'),
            meta: { title: 'menu.cost.resolve.list', keepAlive: true, permission: ['cost'] }
          },
          {
            path: '/cost/industry/list',
            name: 'CostIndustryList',
            component: () => import('@/views/cost/industry/List'),
            meta: { title: 'menu.cost.industry.list', keepAlive: true, permission: ['cost'] }
          },
          {
            path: '/cost/bid/list',
            name: 'CostBidList',
            component: () => import('@/views/cost/bid/List'),
            meta: { title: 'menu.cost.bid.list', keepAlive: true, permission: ['cost'] }
          }
        ]
      },
      // contract
      {
        path: '/contract',
        name: 'contract',
        redirect: '/contract/list',
        component: RouteView,
        meta: { title: 'menu.contract', icon: 'audit', permission: ['contract'] },
        children: [
          {
            path: '/contract/list',
            name: 'ContractList',
            component: () => import('@/views/contract/List'),
            meta: { title: 'menu.contract.list', keepAlive: true, permission: ['contract'] }
          },
          {
            path: '/contract/item/:id',
            name: 'ContractItem',
            component: () => import('@/views/contract/Item'),
            hidden: true,
            meta: { title: 'menu.contract.item', keepAlive: false, permission: ['contract'] }
          },
          {
            path: '/contract/edit/:id',
            name: 'ContractEdit',
            hidden: true,
            component: () => import('@/views/contract/Edit'),
            meta: { title: 'menu.contract.edit', keepAlive: true, permission: ['contract'] }
          },
          {
            path: '/contract/account/list',
            name: 'ContractAccountList',
            component: () => import('@/views/contract/account/List'),
            meta: { title: 'menu.contract.account.list', keepAlive: false, permission: ['contract'] }
          },
          {
            path: '/contract/account/item/:id',
            name: 'ContractAccountItem',
            component: () => import('@/views/contract/account/Item'),
            hidden: true,
            meta: { title: 'menu.contract.account.item', keepAlive: false, permission: ['contract'] }
          } // Account
        ]
      },
      {
        path: '/change',
        name: 'change',
        redirect: '/change/pmi',
        component: RouteView,
        meta: { title: 'menu.change', icon: 'switcher', permission: ['change'] },
        children: [
          {
            path: '/change/pmi',
            name: 'ChangePmi',
            component: () => import('@/views/change/Pmi'),
            meta: { title: 'menu.change.pmi', keepAlive: true, permission: ['change'] }
          },
          {
            path: '/change/cip/list',
            name: 'ChangeCipList',
            component: () => import('@/views/change/cip/List'),
            meta: { title: 'menu.change.cip.list', keepAlive: true, permission: ['change'] }
          },
          {
            path: '/change/cip/item/:id',
            name: 'ChangeCipItem',
            hidden: true,
            component: () => import('@/views/change/cip/Item'),
            meta: { title: 'menu.change.cip.item', keepAlive: true, permission: ['change'] }
          },
          {
            path: '/change/cip/edit/:id',
            name: 'ChangeCipEdit',
            hidden: true,
            component: () => import('@/views/change/cip/Edit'),
            meta: { title: 'menu.change.cip.edit', keepAlive: true, permission: ['change'] }
          },
          {
            path: '/change/vo/list',
            name: 'ChangeVoList',
            component: () => import('@/views/change/vo/List'),
            meta: { title: 'menu.change.vo.list', keepAlive: true, permission: ['change'] }
          },
          {
            path: '/change/vo/item/:id',
            name: 'ChangeVoItem',
            hidden: true,
            component: () => import('@/views/change/vo/Item'),
            meta: { title: 'menu.change.vo.item', keepAlive: true, permission: ['change'] }
          },
          {
            path: '/change/vo/edit/:id',
            name: 'ChangeVoEdit',
            hidden: true,
            component: () => import('@/views/change/vo/Edit'),
            meta: { title: 'menu.change.vo.edit', keepAlive: true, permission: ['change'] }
          }
        ]
      },
      // pay
      {
        path: '/pay',
        name: 'pay',
        redirect: '/pay/list',
        component: RouteView,
        meta: { title: 'menu.pay', icon: 'audit', permission: ['pay'] },
        children: [
          {
            path: '/pay/signed',
            name: 'PaySigned',
            redirect: '/pay/signed/ongoing/list',
            component: RouteView,
            meta: { title: 'menu.pay.signed', keepAlive: true, permission: ['pay'] },
            children: [
              {
                path: '/pay/signed/ongoing/list',
                name: 'PaySignedOngoingList',
                component: () => import('@/views/contract/List'),
                meta: { title: 'menu.pay.signed.ongoing.list', keepAlive: true, permission: ['pay'] }
              },
              {
                path: '/pay/signed/ongoing/item/:id',
                name: 'PaySignedOngoingItem',
                component: () => import('@/views/contract/List'),
                hidden: true,
                meta: { title: 'menu.pay.signed.ongoing.item', keepAlive: true, permission: ['pay'] }
              },
              {
                path: '/pay/signed/ongoing/approval/:id',
                name: 'PaySignedOngoingApproval',
                component: () => import('@/views/contract/List'),
                hidden: true,
                meta: { title: 'menu.pay.signed.ongoing.approval', keepAlive: true, permission: ['pay'] }
              },
              {
                path: '/pay/signed/upcoming/list',
                name: 'PaySignedUpcomingList',
                component: () => import('@/views/contract/Item'),
                meta: { title: 'menu.pay.signed.upcoming.list', keepAlive: false, permission: ['pay'] }
              },
              {
                path: '/pay/signed/upcoming/item/:id',
                name: 'PaySignedUpcomingItem',
                component: () => import('@/views/contract/Item'),
                hidden: true,
                meta: { title: 'menu.pay.signed.upcoming.item', keepAlive: false, permission: ['pay'] }
              },
              {
                path: '/pay/signed/apply',
                name: 'PaySignedApply',
                hidden: true,
                component: () => import('@/views/contract/Edit'),
                meta: { title: 'menu.pay.signed.apply', keepAlive: true, permission: ['pay'] }
              }
            ]
          },
          {
            path: '/pay/unsigned/list',
            name: 'PayUnsignedList',
            component: () => import('@/views/contract/Edit'),
            meta: { title: 'menu.pay.unsigned.list', keepAlive: true, permission: ['pay'] }
          },
          {
            path: '/pay/unsigned/item/:id',
            name: 'PayUnsignedList',
            hidden: true,
            component: () => import('@/views/contract/Edit'),
            meta: { title: 'menu.pay.unsigned.item', keepAlive: true, permission: ['pay'] }
          },
          {
            path: '/pay/unsigned/approval/:id',
            name: 'PayUnsignedList',
            hidden: true,
            component: () => import('@/views/contract/Edit'),
            meta: { title: 'menu.pay.unsigned.approval', keepAlive: true, permission: ['pay'] }
          },
          {
            path: '/pay/account/list',
            name: 'PayUnsignedList',
            component: () => import('@/views/contract/Edit'),
            meta: { title: 'menu.pay.account.list', keepAlive: true, permission: ['pay'] }
          },
          {
            path: '/pay/account/item/:id',
            name: 'PayUnsignedList',
            hidden: true,
            component: () => import('@/views/contract/Edit'),
            meta: { title: 'menu.pay.account.item', keepAlive: true, permission: ['pay'] }
          }
        ]
      }

      // budget
      /* {
        path: '/budget',
        name: 'budget',
        component: RouteView,
        redirect: '/budget/custom',
        meta: { title: '成本预算管理', icon: 'table', permission: ['budget'] },
        children: [
          {
            path: '/budget/custom',
            name: 'BudgetCustom',
            component: RouteView,
            redirect: '/budget/custom/detailed/list',
            meta: { title: '成本预算制定', keepAlive: true, permission: ['budget'] },
            children: [
              {
                path: '/budget/custom/detailed/list',
                name: 'BudgetCustomDetailedList',
                component: () => import('@/views/list/BasicList'),
                meta: { title: '详细项目成本分类预算', keepAlive: true, permission: ['budget'] }
              },
              {
                path: '/budget/custom/detailed/item/:id',
                name: 'BudgetCustomDetailedItem',
                component: () => import('@/views/list/BasicList'),
                meta: { title: '详细项目成本分类预算详情', keepAlive: true, permission: ['budget'] }
              }
            ]
          },
          {
            path: '/budget/decompose',
            name: 'BudgetDecompose',
            component: RouteView,
            redirect: '/budget/custom/detailed/list',
            meta: { title: '成本预算分解', keepAlive: true, permission: ['budget'] },
            children: [
              {
                path: '/budget/decompose/budget/list',
                name: 'BudgetCustomDetailedList',
                component: () => import('@/views/list/BasicList'),
                meta: { title: '行业预算表', keepAlive: true, permission: ['budget'] }
              },
              {
                path: '/budget/decompose/budget/item/:id',
                name: 'BudgetCustomDetailedItem',
                component: () => import('@/views/list/BasicList'),
                meta: { title: '行业分判包', keepAlive: true, permission: ['budget'] }
              },
              {
                path: '/budget/decompose/budget/item/:id',
                name: 'BudgetCustomDetailedItem',
                component: () => import('@/views/list/BasicList'),
                meta: { title: '招投标分判包及招标计划', keepAlive: true, permission: ['budget'] }
              }
            ]
          },
          {
            path: '/list/card',
            name: 'CardList',
            component: () => import('@/views/list/CardList'),
            meta: { title: '卡片列表', keepAlive: true, permission: ['table'] }
          },
          {
            path: '/list/search',
            name: 'SearchList',
            component: () => import('@/views/list/search/SearchLayout'),
            redirect: '/list/search/article',
            meta: { title: '搜索列表', keepAlive: true, permission: ['table'] },
            children: [
              {
                path: '/list/search/article',
                name: 'SearchArticles',
                component: () => import('../views/list/search/Article'),
                meta: { title: '搜索列表（文章）', permission: ['table'] }
              },
              {
                path: '/list/search/project',
                name: 'SearchProjects',
                component: () => import('../views/list/search/Projects'),
                meta: { title: '搜索列表（项目）', permission: ['table'] }
              },
              {
                path: '/list/search/application',
                name: 'SearchApplications',
                component: () => import('../views/list/search/Applications'),
                meta: { title: '搜索列表（应用）', permission: ['table'] }
              }
            ]
          }
        ]
      }, */

      // profile
      /* {
        path: '/profile',
        name: 'profile',
        component: RouteView,
        redirect: '/profile/basic',
        meta: { title: '详情页', icon: 'profile', permission: ['profile'] },
        children: [
          {
            path: '/profile/basic',
            name: 'ProfileBasic',
            component: () => import('@/views/profile/basic/index'),
            meta: { title: '基础详情页', permission: ['profile'] }
          },
          {
            path: '/profile/advanced',
            name: 'ProfileAdvanced',
            component: () => import('@/views/profile/advanced/Advanced'),
            meta: { title: '高级详情页', permission: ['profile'] }
          }
        ]
      }, */

      // result
      /* {
        path: '/result',
        name: 'result',
        component: RouteView,
        redirect: '/result/success',
        meta: {title: '结果页', icon: 'check-circle-o', permission: ['result']},
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/!* webpackChunkName: "result" *!/ '@/views/result/Success'),
            meta: {title: '成功', keepAlive: false, hiddenHeaderContent: true, permission: ['result']}
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/!* webpackChunkName: "result" *!/ '@/views/result/Error'),
            meta: {title: '失败', keepAlive: false, hiddenHeaderContent: true, permission: ['result']}
          }
        ]
      }, */

      // Exception
      /* {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning', permission: ['exception'] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/!* webpackChunkName: "fail" *!/ '@/views/exception/403'),
            meta: { title: '403', permission: ['exception'] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/!* webpackChunkName: "fail" *!/ '@/views/exception/404'),
            meta: { title: '404', permission: ['exception'] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/!* webpackChunkName: "fail" *!/ '@/views/exception/500'),
            meta: { title: '500', permission: ['exception'] }
          }
        ]
      }, */

      // account
      /* {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: '个人页', icon: 'user', keepAlive: true, permission: ['user'] }
      } */

      // other
      /*
      {
        path: '/other',
        name: 'otherPage',
        component: PageView,
        meta: { title: '其他组件', icon: 'slack', permission: [ 'dashboard' ] },
        redirect: '/other/icon-selector',
        children: [
          {
            path: '/other/icon-selector',
            name: 'TestIconSelect',
            component: () => import('@/views/other/IconSelectorView'),
            meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/other/list',
            component: RouteView,
            meta: { title: '业务布局', icon: 'layout', permission: [ 'support' ] },
            redirect: '/other/list/tree-list',
            children: [
              {
                path: '/other/list/tree-list',
                name: 'TreeList',
                component: () => import('@/views/other/TreeList'),
                meta: { title: '树目录表格', keepAlive: true }
              },
              {
                path: '/other/list/edit-table',
                name: 'EditList',
                component: () => import('@/views/other/TableInnerEditList'),
                meta: { title: '内联编辑表格', keepAlive: true }
              },
              {
                path: '/other/list/user-list',
                name: 'UserList',
                component: () => import('@/views/other/UserList'),
                meta: { title: '用户列表', keepAlive: true }
              },
              {
                path: '/other/list/role-list',
                name: 'RoleList',
                component: () => import('@/views/other/RoleList'),
                meta: { title: '角色列表', keepAlive: true }
              },
              {
                path: '/other/list/system-role',
                name: 'SystemRole',
                component: () => import('@/views/role/RoleList'),
                meta: { title: '角色列表2', keepAlive: true }
              },
              {
                path: '/other/list/permission-list',
                name: 'PermissionList',
                component: () => import('@/views/other/PermissionList'),
                meta: { title: '权限列表', keepAlive: true }
              }
            ]
          }
        ]
      }
      */
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
