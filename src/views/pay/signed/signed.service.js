import request from '@/utils/request'

const API = {
  items: '/api/services/app/Contract/GetContractListForPayBySearch',
  contractAmt: '/api/services/app/Payment/GetPaymentContractAmt',
  paymentList: '/api/services/app/Payment/GetPaymentPage',
  getCreateData: '/api/services/app/Payment/GetPaymentCreatePageData',
  paymentTypes: '/api/services/app/Payment/GetPaymentBusinessTypeList',
  moneyTypes: '/api/services/app/Payment/GetPaymenTypeList',
  certificateTypes: '/api/services/app/Payment/GetExpenseAccountTypeList',
  vendorTypes: '/api/services/app/Payment/GetPaymentContractVendor',
  viewInfo: '/api/services/app/Payment/GetPaymentViewInfo',
  updateInfo: '/api/services/app/Payment/GetPaymentUpdateInfo',
  masters: '/api/services/app/Contract/GetMasterContractInfo',
  create: '/api/services/app/Contract/CreateContractAllInfo',
  update: '/api/services/app/Contract/UpdateContractAllInfo'
}

const SignedService = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

SignedService.items = function (parameter) {
  return request({
    url: API.items,
    method: 'get',
    params: parameter
  })
}

SignedService.contractAmt = function (contractGid) {
  return request({
    url: API.contractAmt,
    method: 'get',
    params: { contractGid }
  })
}

SignedService.paymentList = function (contractGid) {
  return request({
    url: API.paymentList,
    method: 'get',
    params: { contractGid }
  })
}

SignedService.getCreateData = function (contractGid) {
  return request({
    url: API.getCreateData,
    method: 'get',
    params: { contractGid }
  })
}

SignedService.paymentTypes = function () {
  return request({
    url: API.paymentTypes,
    method: 'get',
    params: {}
  })
}

SignedService.moneyTypes = function () {
  return request({
    url: API.moneyTypes,
    method: 'get',
    params: {}
  })
}

SignedService.certificateTypes = function () {
  return request({
    url: API.certificateTypes,
    method: 'get',
    params: {}
  })
}

SignedService.vendorTypes = function (contractGid) {
  return request({
    url: API.vendorTypes,
    method: 'get',
    params: { contractGid }
  })
}

SignedService.viewInfo = function (GID) {
  return request({
    url: API.viewInfo,
    method: 'get',
    params: { GID }
  })
}

SignedService.updateInfo = function (GID) {
  return request({
    url: API.updateInfo,
    method: 'get',
    params: { GID }
  })
}

SignedService.create = function (parameter) {
  return request({
    url: API.create,
    method: 'POST',
    data: parameter
  })
}

SignedService.update = function (parameter) {
  return request({
    url: API.update,
    method: 'PUT',
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

export { SignedService }
