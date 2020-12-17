import request from '@/utils/request'

const API = {
  list: '/api/services/app/Balance/GetBalanceCertificatePage',
  createInitData: '/api/services/app/Balance/GetBalanceCertificateCreateInitData',
  partyList:'/api/services/app/Balance/GetBalanceContractPartyList',
}

const CheckoutService = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

CheckoutService.list = function (contractGID) {
  return request({
    url: API.list,
    method: 'get',
    params: { contractGID }
  })
}

CheckoutService.createInitData = function (contractGID) {
  return request({
    url: API.createInitData,
    method: 'get',
    params: { contractGID }
  })
}

CheckoutService.partyList = function (contractGID) {
  return request({
    url: API.partyList,
    method: 'get',
    params: { contractGID }
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

export { CheckoutService }
