import request from '@/utils/request'

const API = {
  list: '/api/services/app/Project/GetCityProjectTree', // 项目列表
  tree: '/api/services/app/Project/GetUserProjectTree',
  item: '/api/services/app/Project/GetProjectEditById', // 项目详情forEdit
  types: '/api/services/app/GeneralType/GetProjectStatusGeneralTypes', // 项目状态合集
  create: '/api/services/app/Project/CreateProject', // 创建
  update: '/api/services/app/Project/UpdateProject', // 更新
  createOrUpdateGroupMember: '/api/services/app/Project/CreateOrUpdateProjectGroupMember', // 添加或更新项目成员
  createStages: '/api/services/app/Project/CreateProjectStages', // 添加项目分期
  createStage: '/api/services/app/Project/CreateProjectStage', // 添加项目阶段
  updateStages: '/api/services/app/Project/UpdateProjectStages', // 添加项目分期
  updateStage: '/api/services/app/Project/UpdateProjectStage' // 添加项目阶段
}

const ProjectService = {}

ProjectService.items = function list (parameter) {
  return request({
    url: API.list,
    method: 'GET',
    params: parameter
  })
}

ProjectService.tree = function list () {
  return request({
    url: API.tree,
    method: 'GET',
    params: {}
  })
}

ProjectService.item = function list (Id) {
  return request({
    url: API.item,
    method: 'GET',
    params: { Id }
  })
}

ProjectService.types = function list () {
  return request({
    url: API.types,
    method: 'GET',
    params: {}
  })
}

ProjectService.create = function (parameter) {
  return request({
    url: API.create,
    method: 'POST',
    data: parameter
  })
}

ProjectService.update = function (parameter) {
  return request({
    url: API.update,
    method: 'PUT',
    data: parameter
  })
}

ProjectService.updateGroupMember = function (parameter) {
  return request({
    url: API.update,
    method: 'POST',
    data: parameter
  })
}

ProjectService.createStages = function (parameter) {
  return request({
    url: API.createStages,
    method: 'POST',
    data: parameter
  })
}

ProjectService.createStage = function (parameter) {
  return request({
    url: API.createStage,
    method: 'POST',
    data: parameter
  })
}

ProjectService.updateStages = function (parameter) {
  return request({
    url: API.updateStages,
    method: 'PUT',
    data: parameter
  })
}

ProjectService.updateStage = function (parameter) {
  return request({
    url: API.updateStage,
    method: 'PUT',
    data: parameter
  })
}

export { ProjectService }
