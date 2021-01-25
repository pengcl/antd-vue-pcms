import request from '@/utils/request'

const API = {
  tasks: '/api/services/app/Bpm/UserTask', // 项目列表
  task: '/api/services/app/Bpm/GetBPMAuditInfo',
  participates: '/api/services/app/Bpm/UserAuditTasks', // 项目详情forEdit
  updateEntity: '/api/services/app/Vendor/GetVendorChangeEntity',
  generate: '/api/services/app/Vendor/CreateVendorChangeBG',
  update: '/api/services/app/Vendor/UpdateVendorChange',
  add: '/api/services/app/Vendor/CreateVendorChangeZR',
  check: '/api/services/app/Vendor/CheckVendor',
  banks: '/api/services/app/Vendor/GetVendorBankList',
  bank: '/api/services/app/Vendor/GetVendorBank',
  updateBank: '/api/services/app/Vendor/CreateVendorBankChange',
  types: '/api/services/app/Vendor/GetVendorPackageTree'
}

const TaskService = {}

TaskService.tasks = function list (parameter) {
  return request({
    url: API.tasks,
    method: 'POST',
    data: parameter
  })
}

TaskService.task = function list (BusinessGUID) {
  return request({
    url: API.task,
    method: 'GET',
    params: { BusinessGUID }
  })
}

TaskService.participates = function list (parameter) {
  return request({
    url: API.participates,
    method: 'POST',
    data: parameter
  })
}

TaskService.updateEntity = function list (LogGID) {
  return request({
    url: API.updateEntity,
    method: 'GET',
    params: { LogGID }
  })
}

TaskService.generate = function (vendorGID) {
  return request({
    url: API.generate + '?vendorGID=' + vendorGID,
    method: 'POST',
    data: {}
  })
}

TaskService.create = function list (parameter) {
  return request({
    url: API.add,
    method: 'POST',
    data: parameter
  })
}

export { TaskService }
