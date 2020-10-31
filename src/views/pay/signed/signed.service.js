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
  attachmentList: '/api/services/app/Payment/GetPaymentAttachmentList',
  masters: '/api/services/app/Contract/GetMasterContractInfo',
  create: '/api/services/app/Contract/CreateContractAllInfo',
  update: '/api/services/app/Contract/UpdateContractAllInfo',
  progressByContract: '/api/services/app/Payment/GetPaymentProgressByContract',
  progressInfo: '/api/services/app/Payment/GetPaymentProgress',
  progressById: '/api/services/app/Payment/GetPaymentProgressByID',
  billList: '/api/services/app/Payment/GetPaymentBillTypeList',
  attachmentTypeList: '/api/services/app/Payment/GetPaymentAttachmentModuleTypeList',
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

SignedService.viewInfo = function (gid) {
  return request({
    url: API.viewInfo,
    method: 'get',
    params: { gid }
  })
}

SignedService.updateInfo = function (GID) {
  return request({
    url: API.updateInfo,
    method: 'get',
    params: { GID }
  })
}

SignedService.attachmentList = function (paymentGID, mainContractGID, secondaryContractGID) {
  return request({
    url: API.attachmentList,
    method: 'get',
    params: { paymentGID, mainContractGID, secondaryContractGID }
  })
}

SignedService.progressInfo = function (paymentGID) {
  return request({
    url: API.progressInfo,
    method: 'get',
    params: { paymentGID }
  })
}

SignedService.progressById = function (id) {
  return request({
    url: API.progressById,
    method: 'get',
    params: { id }
  })
}

SignedService.progressByContract = function (contractGID, progressNum) {
  return request({
    url: API.progressByContract,
    method: 'get',
    params: { contractGID, progressNum }
  })
}

SignedService.billList = function (contractGID, paymentGID) {
  return request({
    url: API.billList,
    method: 'get',
    params: { contractGID, paymentGID }
  })
}

SignedService.attachmentTypeList = function () {
  return request({
    url: API.attachmentTypeList,
    method: 'get',
    params: {}
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
