import request from '@/utils/request'

const API = {
  items: '/api/services/app/Contract/GetContractBookListBySearch',
  exportExcel: '/api/services/app/Contract/ExportContractBook',
  contractBookInfo: '/api/services/app/Contract/GetContractBookDetail',
}

const AccountService = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

AccountService.items = function (parameter) {
  return request({
    url: API.items,
    method: 'get',
    params: parameter
  })
}

AccountService.contractBookInfo = function (contractGuid) {
  return request({
    url: API.contractBookInfo,
    method: 'get',
    params: { contractGuid }
  })
}

AccountService.exportExcel = function (parameter) {
  return request({
    url: API.exportExcel,
    method: 'get',
    params: parameter
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

export { AccountService }
