import request from '@/utils/request'

const API = {
  items: '/api/services/app/Contract/GetContractListBySearch',
  item: '/api/services/app/Contract/GetAllContractInfo',
  types: '/api/services/app/GeneralType/GetContractCategoryTypes',
  masters: '/api/services/app/Contract/GetMasterContractInfo',
  storeTypes: '/api/services/app/GeneralType/GetContractUseStoreTypes',
  create: '/api/services/app/Contract/CreateContractAllInfo',
  update: '/api/services/app/Contract/UpdateContractAllInfo',
  delete: '/api/services/app/Contract/DeleteContractAllInfo',
  vendors: '/api/services/app/Contract/GetVendorList',
  centers: '/api/services/app/ProjectCostCenter/GetProjectCostCenters',
  amount: '/api/services/app/Contract/GetContractAmountByBQList',
  tenders: '/api/services/app/ProjectTenderPackage/GetProjectTenderPackagesByProject',
  viewBudgets: '/api/services/app/Contract/GetContractBudgetAdjustByContractGuid',
  computeBudgets: '/api/services/app/Contract/ComputeContractBudgetByContractGuid',
  createBudgets: '/api/services/app/Contract/CreateContractBudget',
  updateBudgets: '/api/services/app/Contract/UpdateContractBudget',
  bpm: '/api/services/app/Contract/StartBPM'
}

const ContractService = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

ContractService.items = function (parameter) {
  return request({
    url: API.items,
    method: 'get',
    params: parameter
  })
}

ContractService.item = function (contractGuid) {
  return request({
    url: API.item,
    method: 'get',
    params: { contractGuid }
  })
}

ContractService.types = function () {
  return request({
    url: API.types,
    method: 'get',
    params: {}
  })
}

ContractService.masters = function (parameter) {
  return request({
    url: API.masters,
    method: 'get',
    params: parameter
  })
}

ContractService.storeTypes = function (parameter) {
  return request({
    url: API.storeTypes,
    method: 'get',
    params: parameter
  })
}

ContractService.create = function (parameter) {
  return request({
    url: API.create,
    method: 'POST',
    data: parameter
  })
}

ContractService.update = function (parameter) {
  return request({
    url: API.update,
    method: 'PUT',
    data: parameter
  })
}

ContractService.delete = function (contractGuid) {
  return request({
    url: API.delete,
    method: 'DELETE',
    params: { contractGuid }
  })
}

ContractService.vendors = function () {
  return request({
    url: API.vendors,
    method: 'GET',
    params: {}
  })
}

ContractService.centers = function (Id) {
  return request({
    url: API.centers,
    method: 'GET',
    params: { Id }
  })
}

ContractService.amount = function (contractCatrgory, params) {
  console.log(params)
  return request({
    url: API.amount + '?contractCatrgory=' + contractCatrgory,
    method: 'POST',
    data: params
  })
}

ContractService.tenders = function (params) {
  return request({
    url: API.tenders,
    method: 'GET',
    params: params
  })
}

ContractService.viewBudgets = function (params) {
  return request({
    url: API.viewBudgets,
    method: 'GET',
    params: params
  })
}

ContractService.computeBudgets = function (params) {
  return request({
    url: API.computeBudgets,
    method: 'POST',
    params: params
  })
}

ContractService.createBudgets = function (params) {
  return request({
    url: API.createBudgets,
    method: 'POST',
    data: params
  })
}

ContractService.updateBudgets = function (params) {
  return request({
    url: API.updateBudgets,
    method: 'PUT',
    data: params
  })
}

ContractService.bpm = function (ContractGuid, sProjectCode) {
  return request({
    url: API.bpm,
    method: 'POST',
    params: { ContractGuid, sProjectCode }
  })
}

ContractService.filterParties = function (partyType, list) {
  const items = []
  if (list.forEach) {
    list.forEach(item => {
      if (item.partyType === partyType) {
        items.push(item)
      }
    })
  }
  return items
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

export { ContractService }
