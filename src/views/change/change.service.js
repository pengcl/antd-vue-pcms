import request from '@/utils/request'

const API = {
  items: '/api/services/app/VO/GetContractListForVO',
  changeItems : '/api/services/app/VO/GetVOListByContractGuid',
  changeItem : '/api/services/app/Contract/GetContractByGuid',
  item: '/api/services/app/VO/GetVOAllInfoByGuid',
  create: '/api/services/app/Contract/CreateContractAllInfo',
  update: '/api/services/app/Contract/UpdateContractAllInfo'
}

const ChangeService = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

ChangeService.items = function (parameter) {
  return request({
    url: API.items,
    method: 'get',
    params: parameter
  })
}


/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

ChangeService.changeItems = function (parameter) {
  return request({
    url: API.changeItems,
    method: 'get',
    params: parameter
  })
}


ChangeService.changeItem = function (parameter) {
  return request({
    url: API.changeItem,
    method: 'get',
    params: parameter
  })
}

/**
 * item func
 * 对应swagger VOAllInfoDto
 */
ChangeService.item = function (voGuid) { 
  return request({
    url: API.item,
    method: 'get',
    params: { voGuid }
  })
}

ChangeService.create = function (parameter) {
  return request({
    url: API.create,
    method: 'POST',
    data: parameter
  })
}

ChangeService.update = function (parameter) {
  return request({
    url: API.update,
    method: 'PUT',
    data: parameter
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

export { ChangeService }
