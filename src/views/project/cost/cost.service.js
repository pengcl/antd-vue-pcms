import request from '@/utils/request'

const API = {
  list: '/api/services/app/ProjectCostCenter/GetPaged'
}

const CostService = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

CostService.list = function list (parameter) {
  return request({
    url: API.list,
    method: 'GET',
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
CostService.paged = function (parameter) {
  return request({
    url: API.paged,
    method: 'get',
    data: parameter
  })
}

export { CostService }
