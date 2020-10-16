import request from '@/utils/request'

const API = {
  list: '/api/services/app/Currency/GetAllList'
}

const Currency = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

Currency.list = function list (id) {
  console.log(API.list)
  return request({
    url: API.list,
    method: 'get',
    params: { Id: id }
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

export { Currency }
