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
        meta: { title: 'menu.dashboard', keepAlive: false, icon: 'home' },
        children: [
          {
            path: '/dashboard/tasks',
            name: 'Tasks',
            component: () => import('@/views/dashboard/Tasks'),
            meta: { title: 'menu.dashboard.tasks', keepAlive: false }
          },
          {
            path: '/dashboard/participate',
            name: 'Participate',
            component: () => import('@/views/dashboard/Participate'),
            meta: { title: 'menu.dashboard.participate', keepAlive: false }
          }
        ]
      },

      // project
      {
        path: '/project',
        name: 'project',
        redirect: '/project/list',
        component: RouteView,
        meta: { title: 'menu.project', icon: 'project', permission: ['ProjectInfo', 'CostCenter'] },
        children: [
          {
            path: '/project/list',
            name: 'ProjectList',
            component: () => import('@/views/project/List'),
            meta: { title: 'menu.project.list', keepAlive: false, permission: ['ProjectInfo'] }
          },
          {
            path: '/project/item/:id',
            name: 'ProjectItem',
            component: () => import('@/views/project/Item'),
            hidden: true,
            meta: { title: 'menu.project.item', keepAlive: false, permission: ['ProjectInfo'] }
          },
          {
            path: '/project/cost/list',
            name: 'ProjectCostList',
            component: () => import('@/views/project/cost/List'),
            meta: { title: 'menu.project.cost.list', keepAlive: false, permission: ['CostCenter'] }
          },
          {
            path: '/project/cost/item/:id',
            name: 'ProjectCostItem',
            component: () => import('@/views/project/cost/Item'),
            hidden: true,
            meta: { title: 'menu.project.cost.item', keepAlive: false, permission: ['CostCenter'] }
          }
        ]
      },
      // supplier
      {
        path: '/supplier',
        name: 'supplier',
        redirect: '/supplier/purchase/list',
        component: RouteView,
        meta: { title: 'menu.supplier', icon: 'team', permission: ['VendorCG', 'VendorOT'] },
        children: [
          {
            path: '/supplier/purchase/list',
            name: 'SupplierPurchaseList',
            component: () => import('@/views/supplier/purchase/List'),
            meta: { title: 'menu.supplier.purchase.list', keepAlive: false, permission: ['VendorCG'] }
          },
          {
            path: '/supplier/purchase/item/:id',
            name: 'SupplierPurchaseItem',
            hidden: true,
            component: () => import('@/views/supplier/purchase/Item'),
            meta: { title: 'menu.supplier.purchase.item', keepAlive: false, permission: ['VendorCG'] }
          },
          {
            path: '/supplier/other/list',
            name: 'SupplierOtherList',
            component: () => import('@/views/supplier/other/List'),
            meta: { title: 'menu.supplier.other.list', keepAlive: false, permission: ['VendorOT'] }
          },
          {
            path: '/supplier/other/item/:id',
            name: 'SupplierOtherItem',
            hidden: true,
            component: () => import('@/views/supplier/other/Item'),
            meta: { title: 'menu.supplier.other.item', keepAlive: false, permission: ['VendorOT'] }
          }
        ]
      },
      // cost
      {
        path: '/cost',
        name: 'cost',
        redirect: '/cost/enact/list',
        component: RouteView,
        meta: {
          title: 'menu.cost',
          icon: 'property-safety',
          permission: ['CostBudgetEnact', 'CostBudgetResolve', 'CostBudgetIndustry', 'CostBudgetBid', 'CostBudgetType']
        },
        children: [
          {
            path: '/cost/enact/list',
            name: 'CostEnactList',
            component: () => import('@/views/cost/enact/List'),
            meta: { title: 'menu.cost.enact.list', keepAlive: true, permission: ['CostBudgetEnact'] }
          },
          {
            path: '/cost/enact/item/:id',
            hidden: true,
            name: 'CostEnactItem',
            component: () => import('@/views/cost/enact/Item'),
            meta: { title: 'menu.cost.enact.item', keepAlive: false, permission: ['CostBudgetEnact'] }
          },
          {
            path: '/cost/enact/collect',
            hidden: true,
            name: 'CostEnactCollect',
            component: () => import('@/views/cost/enact/Collect'),
            meta: { title: 'menu.cost.enact.collect', keepAlive: false, permission: ['CostBudgetEnact'] }
          },
          {
            path: '/cost/enact/import',
            hidden: true,
            name: 'CostEnactImport',
            component: () => import('@/views/cost/enact/Import'),
            meta: { title: 'menu.cost.enact.import', keepAlive: false, permission: ['CostBudgetEnact'] }
          },
          {
            path: '/cost/enact/subimport',
            hidden: true,
            name: 'CostEnactSubImport',
            component: () => import('@/views/cost/enact/SubImport'),
            meta: { title: 'menu.cost.enact.subimport', keepAlive: false, permission: ['CostBudgetEnact'] }
          },
          {
            path: '/cost/resolve/list',
            name: 'CostResolveList',
            component: () => import('@/views/cost/resolve/List'),
            meta: { title: 'menu.cost.resolve.list', keepAlive: true, permission: ['CostBudgetResolve'] }
          },
          {
            path: '/cost/resolve/item/:id',
            name: 'CostResolveItem',
            hidden: true,
            component: () => import('@/views/cost/resolve/Item'),
            meta: { title: 'menu.cost.resolve.item', keepAlive: false, permission: ['CostBudgetResolve'] }
          },
          {
            path: '/cost/industry/list',
            name: 'CostIndustryList',
            component: () => import('@/views/cost/industry/List'),
            meta: { title: 'menu.cost.industry.list', keepAlive: true, permission: ['CostBudgetIndustry'] }
          },
          {
            path: '/cost/industry/batch/:id',
            name: 'CostIndustryBatch',
            hidden: true,
            component: () => import('@/views/cost/industry/Batch'),
            meta: { title: 'menu.cost.industry.batch', keepAlive: false, permission: ['CostBudgetIndustry'] }
          },
          {
            path: '/cost/industry/item/:id',
            name: 'CostIndustryItem',
            hidden: true,
            component: () => import('@/views/cost/industry/Item'),
            meta: { title: 'menu.cost.industry.item', keepAlive: false, permission: ['CostBudgetIndustry'] }
          },
          {
            path: '/cost/bid/list',
            name: 'CostBidList',
            component: () => import('@/views/cost/bid/List'),
            meta: { title: 'menu.cost.bid.list', keepAlive: true, permission: ['CostBudgetBid'] }
          },
          {
            path: '/cost/bid/item/:id',
            name: 'CostBidItem',
            hidden: true,
            component: () => import('@/views/cost/bid/Item'),
            meta: { title: 'menu.cost.bid.item', keepAlive: false, permission: ['CostBudgetBid'] }
          },
          {
            path: '/cost/type/list',
            name: 'CostTypeList',
            component: () => import('@/views/cost/type/List'),
            meta: { title: 'menu.cost.type.list', keepAlive: true, permission: ['CostBudgetType'] }
          },
          {
            path: '/cost/type/item/:id',
            name: 'CostTypeItem',
            hidden: true,
            component: () => import('@/views/cost/type/Item'),
            meta: { title: 'menu.cost.type.item', keepAlive: false, permission: ['CostBudgetType'] }
          }
        ]
      },
      // contract
      {
        path: '/contract',
        name: 'contract',
        redirect: '/contract/list',
        component: RouteView,
        meta: { title: 'menu.contract', icon: 'audit', permission: ['ContractInfo', 'ContractBook'] },
        children: [
          {
            path: '/contract/list',
            name: 'ContractList',
            component: () => import('@/views/contract/List'),
            meta: { title: 'menu.contract.list', keepAlive: false, permission: ['ContractInfo'] }
          },
          {
            path: '/contract/item/:id',
            name: 'ContractItem',
            component: () => import('@/views/contract/Item'),
            hidden: true,
            meta: { title: 'menu.contract.item', keepAlive: false, permission: ['ContractInfo'] }
          },
          {
            path: '/contract/account/list',
            name: 'ContractAccountList',
            component: () => import('@/views/contract/account/List'),
            meta: { title: 'menu.contract.account.list', keepAlive: false, permission: ['ContractBook'] }
          },
          {
            path: '/contract/account/item/:id',
            name: 'ContractAccountItem',
            component: () => import('@/views/contract/account/Item'),
            hidden: true,
            meta: { title: 'menu.contract.account.item', keepAlive: false, permission: ['ContractBook'] }
          } // Account
        ]
      },
      {
        path: '/change',
        name: 'change',
        redirect: '/change/cip/list',
        component: RouteView,
        meta: { title: 'menu.change', icon: 'switcher', permission: ['VOInfo'] },
        children: [
          {
            path: '/change/cip/list',
            name: 'ChangeCipList',
            component: () => import('@/views/change/cip/List'),
            meta: { title: 'menu.change.cip.list', keepAlive: true, permission: ['VOInfo'] }
          },
          {
            path: '/change/cip/item/:id',
            name: 'ChangeCipItem',
            hidden: true,
            component: () => import('@/views/change/cip/Item'),
            meta: { title: 'menu.change.cip.item', keepAlive: false, permission: ['VOInfo'] }
          },
          {
            path: '/change/vo/item/:id',
            name: 'ChangeCipVO',
            hidden: true,
            component: () => import('@/views/change/cip/Item'),
            meta: { title: 'menu.change.vo.item', keepAlive: false, permission: ['VOInfo'] }
          },
          {
            path: '/change/account/list',
            name: 'ChangeAccountList',
            component: () => import('@/views/change/account/List'),
            meta: { title: 'menu.change.account.list', keepAlive: true, permission: ['VOInfo'] }
          },
          {
            path: '/change/cip/certificate/list/:id',
            name: 'ChangeCipCertificateList',
            hidden: true,
            component: () => import('@/views/change/cip/certificate/List'),
            meta: { title: 'menu.change.certificate.list', keepAlive: false, permission: ['VOInfo'] }
          },
          {
            path: '/change/cip/certificate/item/:id',
            name: 'ChangeCipCertificateItem',
            hidden: true,
            component: () => import('@/views/change/cip/certificate/Item'),
            meta: { title: 'menu.change.certificate.item', keepAlive: false, permission: ['VOInfo'] }
          },
          {
            path: '/change/cip/constructionOrganizeDesign/:contractGuid',
            name: 'ChangeConstructionOrganizeDesign',
            hidden: true,
            component: () => import('@/views/change/cip/components/ConstructionOrganizeDesign'),
            meta: { title: 'menu.change.constructionOrganizeDesign', keepAlive: false, permission: ['VOInfo'] }
          },
          {
            path: '/change/cip/latent/list/:id',
            name: 'ChangeCipLatentList',
            hidden: true,
            component: () => import('@/views/change/cip/latent/List'),
            meta: { title: 'menu.change.latent.list', keepAlive: false, permission: ['VOInfo'] }
          },
          {
            path: '/change/cip/latent/item/:id',
            name: 'ChangeCipLatentItem',
            hidden: true,
            component: () => import('@/views/change/cip/latent/Item'),
            meta: { title: 'menu.change.latent.item', keepAlive: false, permission: ['VOInfo'] }
          }
        ]
      },
      // pay
      {
        path: '/pay',
        name: 'pay',
        redirect: '/pay/list',
        component: RouteView,
        meta: { title: 'menu.pay', icon: 'transaction', permission: ['FundingPlan', 'PaymentContract','PaymentBook','PaymentOther'] },
        children: [
          {
            path: '/pay/fundplan/list',
            name: 'PayFundPlanList',
            component: () => import('@/views/pay/fundplan/List'),
            meta: { title: 'menu.pay.fundplan.list', keepAlive: false, permission: ['FundingPlan'] }
          },
          {
            path: '/pay/fundplan/item/:id',
            name: 'PayFundPlanItem',
            hidden: true,
            component: () => import('@/views/pay/fundplan/Item'),
            meta: { title: 'menu.pay.fundplan.item', keepAlive: false, permission: ['FundingPlan'] }
          },
          {
            path: '/pay/signed/list',
            name: 'PaySignedList',
            component: () => import('@/views/pay/signed/List'),
            meta: { title: 'menu.pay.signed.list', keepAlive: false, permission: ['PaymentContract'] }
          },
          {
            path: '/pay/signed/item/:id',
            name: 'PaySignedItem',
            hidden: true,
            component: () => import('@/views/pay/signed/Item'),
            meta: { title: 'menu.pay.signed.item', keepAlive: false, permission: ['PaymentContract'] }
          },
          {
            path: '/pay/signed/invoice/list/:id',
            name: 'PaySignedInvoiceList',
            hidden: true,
            component: () => import('@/views/pay/signed/invoice/List'),
            meta: { title: 'menu.pay.signed.invoice', keepAlive: false, permission: ['PaymentContract'] }
          },
          {
            path: '/pay/paymentbook/list',
            name: 'PayPaymentBookList',
            component: () => import('@/views/pay/paymentbook/List'),
            meta: { title: 'menu.pay.paymentbook.list', keepAlive: false, permission: ['PaymentBook'] }
          },
          {
            path: '/pay/unsigned/list',
            name: 'PayUnsignedList',
            component: () => import('@/views/pay/unsigned/List'),
            meta: { title: 'menu.pay.unsigned.list', keepAlive: false, permission: ['PaymentOther'] }
          },
          {
            path: '/pay/unsigned/item/:id',
            name: 'PayUnsignedItem',
            hidden: true,
            component: () => import('@/views/pay/unsigned/Item'),
            meta: { title: 'menu.pay.unsigned.item', keepAlive: false, permission: ['PaymentOther'] }
          }
        ]
      },

      // checkout
      {
        path: '/checkout',
        name: 'checkout',
        redirect: '/checkout/contract/list',
        component: RouteView,
        meta: { title: 'menu.checkout', icon: 'block', permission: ['BalanceAndCertificate'] },
        children: [
          {
            path: '/checkout/contract/list',
            name: 'CheckoutContractList',
            component: () => import('@/views/checkout/contract/List'),
            meta: { title: 'menu.checkout.contract.list', keepAlive: false, permission: ['BalanceAndCertificate'] }
          },
          {
            path: '/checkout/contract/item/:id',
            name: 'CheckoutContractItem',
            hidden: true,
            component: () => import('@/views/checkout/contract/Item'),
            meta: { title: 'menu.checkout.contract.item', keepAlive: false, permission: ['BalanceAndCertificate'] }
          },
          {
            path: '/checkout/completed/list/:id',
            name: 'CheckoutCompletedList',
            hidden: true,
            component: () => import('@/views/checkout/completed/List'),
            meta: { title: 'menu.checkout.completed.list', keepAlive: false, permission: ['BalanceAndCertificate'] }
          },
          {
            path: '/checkout/project/list/:id',
            name: 'CheckoutProjectList',
            hidden: true,
            component: () => import('@/views/checkout/project/List'),
            meta: { title: 'menu.checkout.project.list', keepAlive: false, permission: ['BalanceAndCertificate'] }
          },
          {
            path: '/checkout/finance/list/:id',
            name: 'CheckoutFinanceList',
            hidden: true,
            component: () => import('@/views/checkout/finance/List'),
            meta: { title: 'menu.checkout.finance.list', keepAlive: false, permission: ['BalanceAndCertificate'] }
          }
        ]
      },
      // report
      {
        path: '/report',
        name: 'report',
        meta: { title: 'menu.report', icon: 'fund', permission: ['ProjectContractBookReport'] },
        redirect: '/report/contract',
        component: RouteView,
        children: [
          {
            path: '/report/contract',
            name: 'ReportContract',
            component: () => import('@/views/report/Item'),
            meta: { title: 'menu.report.contract', keepAlive: false, permission: ['ProjectContractBookReport'] }
          },
          {
            path: '/report/audit',
            name: 'ReportAudit',
            component: () => import('@/views/report/Audit'),
            meta: { title: 'menu.report.audit', keepAlive: false, permission: ['PaymentApprovalTrackingReport'] }
          },
          {
            path: '/report/tracking',
            name: 'ReportTracking',
            component: () => import('@/views/report/Tracking'),
            meta: { title: 'menu.report.tracking', keepAlive: false, permission: ['ProjectPaymentTrackingReport'] }
          },
          {
            path: '/report/first',
            name: 'ReportFirst',
            component: () => import('@/views/report/First'),
            meta: { title: 'menu.report.first', keepAlive: false, permission: ['CostExpenseFirstLevelReport'] }
          },
          {
            path: '/report/end',
            name: 'ReportEnd',
            component: () => import('@/views/report/End'),
            meta: { title: 'menu.report.end', keepAlive: false, permission: ['CostExpenseEndLevelReport'] }
          }
        ]
      },
      // data
      // checkout
      {
        path: '/role',
        name: 'role',
        redirect: '/role/project',
        component: RouteView,
        meta: { title: 'menu.role', icon: 'database', permission: ['NwDataRoleProjectSetting'] },
        children: [
          {
            path: '/role/project',
            name: 'ProjectRoles',
            component: () => import('@/views/role/project/ProjectRoles'),
            meta: { title: 'menu.role.project', permission: ['NwDataRoleProjectSetting'] }
          },
          {
            path: '/role/post',
            name: 'PostRoles',
            component: () => import('@/views/role/PostRoles'),
            meta: { title: 'menu.role.post', permission: ['data'] }
          }
        ]
      },
      {
        path: '/data/list',
        name: 'DataList',
        component: () => import('@/views/data/List'),
        meta: { title: 'menu.data.list', icon: 'database', permission: ['Setting'] }
      },
      {
        path: '/data/item/:id',
        name: 'DataItem',
        hidden: true,
        component: () => import('@/views/data/Item'),
        meta: { title: 'menu.data.item', icon: 'database', permission: ['Setting'] }
      }
      // settings
      /* {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/settings/Index'),
        meta: { title: 'menu.settings', icon: 'appstore', permission: ['settings'] },
        redirect: '/settings/base',
        hideChildrenInMenu: true,
        children: [
          {
            path: '/settings/base',
            name: 'BaseSettings',
            component: () => import('@/views/settings/BaseSetting'),
            meta: { title: 'menu.settings.base', hidden: true, permission: ['settings'] }
          },
          {
            path: '/settings/security',
            name: 'SecuritySettings',
            component: () => import('@/views/settings/Security'),
            meta: { title: 'menu.settings.security', hidden: true, keepAlive: true, permission: ['settings'] }
          },
          {
            path: '/settings/custom',
            name: 'CustomSettings',
            component: () => import('@/views/settings/Custom'),
            meta: { title: 'menu.settings.custom', hidden: true, keepAlive: true, permission: ['settings'] }
          },
          {
            path: '/settings/binding',
            name: 'BindingSettings',
            component: () => import('@/views/settings/Binding'),
            meta: { title: 'menu.settings.binding', hidden: true, keepAlive: true, permission: ['settings'] }
          },
          {
            path: '/settings/notification',
            name: 'NotificationSettings',
            component: () => import('@/views/settings/Notification'),
            meta: { title: 'menu.settings.notification', hidden: true, keepAlive: true, permission: ['settings'] }
          }
        ]
      } */

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
                meta: { title: '专业分判包', keepAlive: true, permission: ['budget'] }
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
