import request from '@/utils/request'

const API = {
  items: '/api/services/app/Contract/GetContractBookListBySearch',
  exportExcel: '/api/services/app/Contract/ContractBQExportExcel',
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

AccountService.exportExcel = function (contractGuid) {
  return request({
    url: API.exportExcel,
    method: 'POST',
    params: {contractGuid}
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
