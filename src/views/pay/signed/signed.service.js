import request from '@/utils/request'

const API = {
  items: '/api/services/app/Contract/GetContractListForPayBySearch',
  contractAmt: '/api/services/app/Payment/GetPaymentContractAmt',
  paymentList: '/api/services/app/Payment/GetPaymentPage',
  getCreateData: '/api/services/app/Payment/GetPaymentCreatePageData',
  types: '/api/services/app/GeneralType/GetContractCategoryTypes',
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
