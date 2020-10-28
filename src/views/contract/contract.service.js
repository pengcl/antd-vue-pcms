import request from '@/utils/request'

const API = {
  items: '/api/services/app/Contract/GetContractListBySearch',
  item: '/api/services/app/Contract/GetAllContractInfo',
  types: '/api/services/app/GeneralType/GetContractCategoryTypes',
  masters: '/api/services/app/Contract/GetMasterContractInfo',
  create: '/api/services/app/Contract/CreateContractAllInfo',
  update: '/api/services/app/Contract/UpdateContractAllInfo',
  vendors: '/api/services/app/Contract/GetVendorList',
  centers: '/api/services/app/ProjectCostCenter/GetProjectCostCenters',
  amount: '/api/services/app/Contract/GetContractAmountByBQList'
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
