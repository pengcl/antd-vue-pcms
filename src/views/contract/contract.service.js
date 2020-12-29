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
  centers: '/api/services/app/ProjectTenderPackage/GetProjectTenderPackageCostCenters',
  amount: '/api/services/app/Contract/GetContractAmountNewByBQList',
  tenders: '/api/services/app/ProjectTenderPackage/GetProjectTenderPackagesByProjectToContract',
  viewBudgets: '/api/services/app/Contract/GetContractBudgetAdjustByContractGuid',
  computeBudgets: '/api/services/app/Contract/ComputeContractBudgetByContractGuid',
  computeBudgets_108: '/api/services/app/Contract/GetContractUsePlanPreSplitByContractGuid',
  computeBudgets_109: '/api/services/app/Contract/GetContrcatUseSurplusPreSplitByContractGuid',
  computeBudgets_110: '/api/services/app/Contract/GetContractGeneralTradePreSplitByContractGuid',
  createBudgets: '/api/services/app/Contract/CreateContractBudget',
  updateBudgets: '/api/services/app/Contract/UpdateContractBudget',
  createBudgets_108: '/api/services/app/Contract/CreateContrcatUsePlan',
  updateBudgets_108: '/api/services/app/Contract/UpdateContractUsePlan',
  createBudgets_109: '/api/services/app/Contract/CreateVOUseSurplus',
  updateBudgets_109: '/api/services/app/Contract/UpdateContractUseSurplus',
  createBudgets_110: '/api/services/app/Contract/CreateContrcatUseGeneralTrade',
  updateBudgets_110: '/api/services/app/Contract/UpdateContractUseGeneralTrade',
  bpm: '/api/services/app/Contract/StartBPM',
  review: '/api/services/app/Contract/ContractORGNSCResetBudget',
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
    data: params
  })
}

ContractService.computeBudgets_108 = function (params) {
  return request({
    url: API.computeBudgets_108,
    method: 'GET',
    params: params
  })
}

ContractService.computeBudgets_109 = function (params) {
  return request({
    url: API.computeBudgets_109,
    method: 'GET',
    params: params
  })
}

ContractService.computeBudgets_110 = function (params) {
  return request({
    url: API.computeBudgets_110,
    method: 'GET',
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

ContractService.createBudgets_108 = function (params) {
  return request({
    url: API.createBudgets_108,
    method: 'POST',
    data: params
  })
}

ContractService.updateBudgets_108 = function (params) {
  return request({
    url: API.updateBudgets_108,
    method: 'PUT',
    data: params
  })
}

ContractService.createBudgets_109 = function (params) {
  return request({
    url: API.createBudgets_109,
    method: 'POST',
    data: params
  })
}

ContractService.updateBudgets_109 = function (params) {
  return request({
    url: API.updateBudgets_109,
    method: 'PUT',
    data: params
  })
}

ContractService.createBudgets_110 = function (params) {
  return request({
    url: API.createBudgets_110,
    method: 'POST',
    data: params
  })
}

ContractService.updateBudgets_110 = function (params) {
  return request({
    url: API.updateBudgets_110,
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


ContractService.review = function (contractGuid) {
  return request({
    url: API.review,
    method: 'POST',
    params: { contractGuid }
  })
}

ContractService.filterParties = function (partyType, list) {
  const items = []
  if (list.forEach) {
    list.forEach(item => {
      if (item.partyType === partyType && !item.isDeleted) {
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
