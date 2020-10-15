import request from '@/utils/request'

const API = {
  list: '/api/services/app/Contract/GetContractListBySearch',
  item: '/api/services/app/Contract/GetAllContractInfo',
  types: '/api/services/app/GeneralType/GetContractCategoryTypes'
}

const ContractService = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

ContractService.list = function (parameter) {
  return request({
    url: API.list,
    method: 'get',
    params: parameter
  })
}

ContractService.item = function (contractGuid) {
  return request({
    url: API.item,
    method: 'get',
    params: { contractGuid }
  })
}

ContractService.types = function () {
  return request({
    url: API.types,
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

export { ContractService }
