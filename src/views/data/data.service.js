import request from '@/utils/request'

const API = {
  items: '/api/services/app/GeneralType/GetPaged',
  item: '/api/services/app/GeneralType/GetForEdit'
}

const DataService = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

DataService.items = function (parameter) {
  return request({
    url: API.items,
    method: 'get',
    params: parameter
  })
}

DataService.item = function (contractGuid) {
  return request({
    url: API.item,
    method: 'get',
    params: { contractGuid }
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

export { DataService }
