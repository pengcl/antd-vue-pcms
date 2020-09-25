// eslint-disable-next-line
import {UserLayout, BasicLayout, BlankLayout} from '@/layouts';

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
        meta: { title: 'menu.dashboard', keepAlive: true, icon: 'menu', permission: ['dashboard'] },
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
        meta: { title: 'menu.project', icon: 'form', permission: ['project'] },
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
            path: '/project/cost',
            name: 'ProjectCost',
            component: () => import('@/views/project/Cost'),
            meta: { title: 'menu.project.cost', keepAlive: true, permission: ['project'] }
          }
        ]
      },
      // project
      {
        path: '/contract',
        name: 'contract',
        redirect: '/contract/list',
        component: RouteView,
        meta: { title: '合同管理', icon: 'transaction', permission: ['contract'] },
        children: [
          {
            path: '/contract/list',
            name: 'ContractList',
            component: () => import('@/views/contract/List'),
            meta: { title: '合同列表', keepAlive: true, permission: ['contract'] }
          },
          {
            path: '/contract/item/:id',
            name: 'ContractItem',
            component: () => import('@/views/contract/Item'),
            hidden: true,
            meta: { title: '合同详情', keepAlive: false, permission: ['contract'] }
          },
          {
            path: '/contract/edit/:id',
            name: 'ContractEdit',
            hidden: true,
            component: () => import('@/views/contract/Edit'),
            meta: { title: '合同编辑', keepAlive: true, permission: ['contract'] }
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
