import request from '@/utils/request'

const API = {
  list: '/api/services/app/Contract/GetContractListBySearch'
}

const ContractService = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

ContractService.list = function list (parameter) {
  return request({
    url: API.list,
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

export { ContractService }
