import request from '@/utils/request'

const API = {
  list: '/api/services/app/Balance/GetBalanceCertificatePage',
  createInitData: '/api/services/app/Balance/GetBalanceCertificateCreateInitData',
  certificateInfo: '/api/services/app/Balance/GetBalanceCertificate',
  partyList: '/api/services/app/Balance/GetBalanceContractPartyList',
  createBalanceCertificate: '/api/services/app/Balance/CreateBalanceCertificate',
  updateBalanceCertificate: '/api/services/app/Balance/UpdateBalanceCertificate',
  startBPM_BalanceCertificate: '/api/services/app/Balance/StartBPM_BalanceCertificate',
  doc: '/api/services/app/Balance/GetBalanceCertificateDoc',
  contractCreateInitData: '/api/services/app/Balance/GetBalanceContractCreateInitData',
  contractInfo: '/api/services/app/Balance/GetBalanceContractCreate',
  createBalanceContract: '/api/services/app/Balance/CreateBalanceContract',
  updateBalanceContract: '/api/services/app/Balance/UpdateBalanceContract',
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

CheckoutService.certificateInfo = function (GID) {
  return request({
    url: API.certificateInfo,
    method: 'get',
    params: { GID }
  })
}

CheckoutService.contractInfo = function (GID) {
  return request({
    url: API.contractInfo,
    method: 'get',
    params: { GID }
  })
}

CheckoutService.contractCreateInitData = function (BalanceCertificateGID) {
  return request({
    url: API.contractCreateInitData,
    method: 'get',
    params: { BalanceCertificateGID }
  })
}

CheckoutService.partyList = function (contractGID) {
  return request({
    url: API.partyList,
    method: 'get',
    params: { contractGID }
  })
}

CheckoutService.createBalanceCertificate = function (parameter) {
  return request({
    url: API.createBalanceCertificate,
    method: 'POST',
    data: parameter
  })
}

CheckoutService.updateBalanceCertificate = function (parameter) {
  return request({
    url: API.updateBalanceCertificate,
    method: 'PUT',
    data: parameter
  })
}

CheckoutService.startBPM_BalanceCertificate = function (gid) {
  return request({
    url: API.startBPM_BalanceCertificate,
    method: 'POST',
    params: { gid }
  })
}

CheckoutService.createBalanceContract = function (parameter) {
  return request({
    url: API.createBalanceContract,
    method: 'POST',
    data: parameter
  })
}

CheckoutService.updateBalanceContract = function (parameter) {
  return request({
    url: API.updateBalanceCertificate,
    method: 'PUT',
    data: parameter
  })
}

CheckoutService.doc = function () {
  return request({
    url: API.doc,
    method: 'get',
    params: {}
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
