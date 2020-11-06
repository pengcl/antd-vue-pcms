import request from '@/utils/request'
import { SignedService } from '@/views/pay/signed/signed.service'

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
    method: 'POST',
    data: parameter
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
