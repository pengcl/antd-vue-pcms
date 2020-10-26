import request from '@/utils/request'

const API = {
  list: '/api/services/app/Company/GetAllCompanys',
  byCityList: '/api/services/app/Company/GetCityCompanys',
  item: '/api/services/app/Company/GetByCode'
}

const Company = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

Company.list = function (id) {
  return request({
    url: id ? API.byCityList : API.list,
    method: 'get',
    params: { Id: id }
  })
}

Company.item = function (projectCode) {
  return request({
    url: API.item,
    method: 'get',
    params: { Id: projectCode }
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
