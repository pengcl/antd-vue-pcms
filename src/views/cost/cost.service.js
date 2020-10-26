import request from '@/utils/request'

const API = {
  items: '/api/services/app/Element/GetMainElementList',
  subjectItems: '/api/services/app/BudgetSubPlan/GetBudgetPlanSubListToEdit'
  // item: '/api/services/app/Contract/GetAllContractInfo',
  // create: '/api/services/app/Contract/CreateContractAllInfo',
  // update: '/api/services/app/Contract/UpdateContractAllInfo'6
}

const CostService = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

CostService.items = function (parameter) {
  return request({
    url: API.items,
    method: 'get',
    params: parameter
  })
}

CostService.item = function (contractGuid) {
  return request({
    url: API.item,
    method: 'get',
    params: { contractGuid }
  })
}

CostService.create = function (parameter) {
  return request({
    url: API.create,
    method: 'POST',
    data: parameter
  })
}

CostService.update = function (parameter) {
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

export { CostService }
