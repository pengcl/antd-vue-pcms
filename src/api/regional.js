import request from '@/utils/request'

const API = {
  paged: '/api/services/app/RegionalOffice/GetPaged',
  list: '/api/services/app/RegionalOffice/GetAllList'
}

const Regional = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

Regional.list = function list () {
  return request({
    url: API.list,
    method: 'get',
    data: {}
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
Regional.paged = function (parameter) {
  return request({
    url: API.paged,
    method: 'get',
    data: parameter
  })
}

export { Regional }
