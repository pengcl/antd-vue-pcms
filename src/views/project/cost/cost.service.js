import request from '@/utils/request'

const API = {
  list: '/api/services/app/ProjectCostCenter/GetPaged_NEW',
  item: '/api/services/app/ProjectCostCenter/GetById_NEW',
  create: '/api/services/app/ProjectCostCenter/Create_NEW',
  update: '/api/services/app/ProjectCostCenter/Update_NEW',
  delete: '/api/services/app/ProjectCostCenter/Delete',
  bpm: '/api/services/app/ProjectCostCenter/StartBPM',
  secCostAllocateTypes: '/api/services/app/GeneralType/GetSecCostAllocateTypes',
  bpmVersion: '/api/services/app/ProjectCostCenter/GetAuditVersion', // 审批记录
  bpmProjectHistory: '/api/services/app/ProjectCostCenter/GetProjectCostCenterVersionList' // 查看历史版本
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

CostService.secCostAllocateTypes = function () {
  return request({
    url: API.secCostAllocateTypes,
    method: 'GET',
    params: {}
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

CostService.bpmVersion = function (parameter) {
  return request({
    url: API.bpmVersion,
    method: 'get',
    params: parameter
  })
}

CostService.bpmProjectHistory = function (parameter) {
  return request({
    url: API.bpmProjectHistory,
    method: 'get',
    params: parameter
  })
}

export { CostService }
