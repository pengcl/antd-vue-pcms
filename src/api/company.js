import request from '@/utils/request'

const API = {
  list: '/api/services/app/Company/GetAllCompanys',
  byCityList: '/api/services/app/Company/GetCityCompanys'
}

const Company = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

Company.list = function list (id) {
  return request({
    url: id ? API.byCityList : API.list,
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

export { Company }
