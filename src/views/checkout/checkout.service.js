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
  contractInfo: '/api/services/app/Balance/GetBalanceContract',
  createBalanceContract: '/api/services/app/Balance/CreateBalanceContract',
  updateBalanceContract: '/api/services/app/Balance/UpdateBalanceContract',
  startBPM_BalanceContract: '/api/services/app/Balance/StartBPM_BalanceContract',
  budgetList_108: '/api/services/app/Balance/GetBalanceContractPlanBudgetPreSplit',
  budgetList_109: '/api/services/app/Balance/GetBalanceContractSurplusPreSplit',
  budgetList_110: '/api/services/app/Balance/GetBalanceContractTradePreSplitByVOGuid',
  create_108: '/api/services/app/Balance/CreateBalanceContractPlan',
  create_109: '/api/services/app/Balance/CreateBalanceContractSurplus',
  create_110: '/api/services/app/Balance/CreateBalanceContractTrade',
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

CheckoutService.budgetList_108 = function (GID) {
  return request({
    url: API.budgetList_108,
    method: 'get',
    params: { GID }
  })
}

CheckoutService.budgetList_109 = function (GID) {
  return request({
    url: API.budgetList_109,
    method: 'get',
    params: { GID }
  })
}

CheckoutService.budgetList_110 = function (GID) {
  return request({
    url: API.budgetList_110,
    method: 'get',
    params: { GID }
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


CheckoutService.startBPM_BalanceContract = function (gid) {
  return request({
    url: API.startBPM_BalanceContract,
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

CheckoutService.create_108 = function (parameter) {
  return request({
    url: API.create_108,
    method: 'POST',
    data: parameter
  })
}

CheckoutService.create_109 = function (parameter) {
  return request({
    url: API.create_109,
    method: 'POST',
    data: parameter
  })
}

CheckoutService.create_110 = function (parameter) {
  return request({
    url: API.create_110,
    method: 'POST',
    data: parameter
  })
}

CheckoutService.updateBalanceContract = function (parameter) {
  return request({
    url: API.updateBalanceContract,
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
