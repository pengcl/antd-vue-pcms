import request from '@/utils/request'

const API = {
  items: '/api/services/app/PaymentOther/GetPaymentOtherPage',
  item: '/api/services/app/PaymentOther/GetPaymentOtherInfo',
  payTypeList: '/api/services/app/PaymentOther/GetPaymentBusinessTypeList',
  expenseAccountTypeList: '/api/services/app/PaymentOther/GetExpenseAccountTypeList',
  moneyTypes: '/api/services/app/PaymentOther/GetPaymenTypeList',
  billTypes: '/api/services/app/PaymentOther/GetPaymentBillTypeList',
  vendorTypes: '/api/services/app/PaymentOther/GetPaymentOtherVendor',
  create: '/api/services/app/PaymentOther/CreatePaymentOther',
  update: '/api/services/app/PaymentOther/UpdatePaymentOther',
  delete: '/api/services/app/PaymentOther/DeletePaymentOther',
  approve: '/api/services/app/PaymentOther/StartBPM',
  initData: '/api/services/app/PaymentOther/GetPaymentOtherInitData',
  tradeBudgetTree: '/api/services/app/TradeBudget/GetProjectTradeBudgetTree',
  costCenterBudgetItems: '/api/services/app/TradeBudget/GetPaymentOtherAddCostCenterBudgetItems',
  addTradeBudgets: '/api/services/app/TradeBudget/PaymentOtherBatchAddTradeBudgets',
  useTradeBudgets: '/api/services/app/TradeBudget/PaymentOtherBatchUseTradeBudgets',
  audit: '/api/services/app/PaymentOther/OneClickAudit',
  cancelAudit: '/api/services/app/PaymentOther/OneClickUnAudit',
  oaPay: '/api/services/app/PaymentOther/PaymentOtherManualAyncToOA',
}

const UnSignedService = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

UnSignedService.items = function (parameter) {
  return request({
    url: API.items,
    method: 'get',
    params: parameter
  })
}

UnSignedService.item = function (gid) {
  return request({
    url: API.item,
    method: 'get',
    params: { gid }
  })
}

UnSignedService.initData = function (projectGUID) {
  return request({
    url: API.initData,
    method: 'get',
    params: { projectGUID }
  })
}

UnSignedService.audit = function (gid) {
  return request({
    url: API.audit,
    method: 'POST',
    params: { gid }
  })
}

UnSignedService.oaPay = function (paymentOtherGUID) {
  return request({
    url: API.oaPay,
    method: 'POST',
    params: { paymentOtherGUID }
  })
}

UnSignedService.cancelAudit = function (gid) {
  return request({
    url: API.cancelAudit,
    method: 'POST',
    params: { gid }
  })
}

UnSignedService.payTypeList = function () {
  return request({
    url: API.payTypeList,
    method: 'get',
    params: {}
  })
}

UnSignedService.expenseAccountTypeList = function () {
  return request({
    url: API.expenseAccountTypeList,
    method: 'get',
    params: {}
  })
}

UnSignedService.moneyTypes = function () {
  return request({
    url: API.moneyTypes,
    method: 'get',
    params: {}
  })
}

UnSignedService.billTypes = function () {
  return request({
    url: API.billTypes,
    method: 'get',
    params: {}
  })
}

UnSignedService.vendorTypes = function (vendorCodeOrName) {
  return request({
    url: API.vendorTypes,
    method: 'get',
    params: { vendorCodeOrName }
  })
}

UnSignedService.tradeBudgetTree = function (ProjectGUID, ElementTypeId) {
  return request({
    url: API.tradeBudgetTree,
    method: 'get',
    params: { ProjectGUID, ElementTypeId }
  })
}

UnSignedService.costCenterBudgetItems = function (ProjectGUID, ElementTypeId) {
  return request({
    url: API.costCenterBudgetItems,
    method: 'get',
    params: { ProjectGUID, ElementTypeId }
  })
}

UnSignedService.addTradeBudgets = function (parameter) {
  return request({
    url: API.addTradeBudgets,
    method: 'POST',
    data: parameter
  })
}

UnSignedService.useTradeBudgets = function (parameter) {
  return request({
    url: API.useTradeBudgets,
    method: 'POST',
    data: parameter
  })
}

UnSignedService.create = function (parameter) {
  return request({
    url: API.create,
    method: 'POST',
    data: parameter
  })
}

UnSignedService.update = function (parameter) {
  return request({
    url: API.update,
    method: 'PUT',
    data: parameter
  })
}

UnSignedService.delete = function (gid) {
  return request({
    url: API.delete,
    method: 'DELETE',
    params: { gid }
  })
}

UnSignedService.approve = function (gid) {
  return request({
    url: API.approve,
    method: 'POST',
    params: { gid }
  })
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */

export { UnSignedService }
