import request from '@/utils/request'

const API = {
  list: '/api/services/app/ProjectCostCenter/GetPaged',
  item: '/api/services/app/ProjectCostCenter/GetById',
  create: '/api/services/app/ProjectCostCenter/Create',
  update: '/api/services/app/ProjectCostCenter/Update',
  delete: '/api/services/app/ProjectCostCenter/Delete',
  bpm: '/api/services/app/ProjectCostCenter/StartBPM'
}

const CostService = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

CostService.list = function (parameter) {
  return request({
    url: API.list,
    method: 'GET',
    params: parameter
  })
}

CostService.item = function (Id) {
  return request({
    url: API.item,
    method: 'GET',
    params: { Id }
  })
}

CostService.update = function (parameter) {
  return request({
    url: API.update,
    method: 'PUT',
    data: parameter
  })
}

CostService.create = function (parameter) {
  return request({
    url: API.create,
    method: 'POST',
    data: parameter
  })
}

CostService.delete = function (parameter) {
  return request({
    url: API.delete,
    method: 'DELETE',
    params: parameter
  })
}

CostService.bpm = function (guid) {
  return request({
    url: API.bpm,
    method: 'POST',
    params: { guid }
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
