import request from '@/utils/request'

const API = {
  items: '/api/services/app/Element/GetMainElementList', //成本预算制定列表
  subjectItems: '/api/services/app/BudgetSubPlan/GetBudgetPlanSubListToEditByGUID', //成本预算制定获取成本中心数据接口
  subjectViewItems: '/api/services/app/BudgetSubPlan/GetBudgetPlanDetailTreeByProject',//成本预算制定详情接口
  update: '/api/services/app/BudgetSubPlan/CreateOrEditDetails', //更新成本预算制定接口
  centers: '/api/services/app/ProjectCostCenter/GetProjectCostCentersByGuid' ,//根据项目GUID获取成本中心集合
  industryItems: '/api/services/app/TenderPackage/GetPaged' ,//行业分判包列表
  createIndustry: '/api/services/app/TenderPackage/CreateTenderPackage' ,//添加行业分判包
  industryItem: '/api/services/app/TenderPackage/GetTenderPackageById',//通过主键获取行业分判包数据
  budgetTypeItems: '/api/services/app/GeneralType/GetBudgetItemTypeTypes'//获取科目类型集合
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

CostService.subjectItems = function (parameter) {
  return request({
    url: API.subjectItems,
    method: 'get',
    params: parameter
  })
}

CostService.subjectViewItems = function (parameter) {
  return request({
    url: API.subjectViewItems,
    method: 'get',
    params: parameter
  })
}

CostService.industryItems = function (parameter) {
  return request({
    url: API.industryItems,
    method: 'get',
    params: parameter
  })
}

CostService.industryItem = function (parameter) {
  return request({
    url: API.industryItem,
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

CostService.createIndustry = function (parameter) {
  return request({
    url: API.createIndustry,
    method: 'POST',
    data: parameter
  })
}

CostService.update = function (parameter) {
  console.log(parameter)
  return request({
    url: API.update,
    method: 'POST',
    data: parameter
  })
}

CostService.centers = function (parameter) {
  return request({
    url: API.centers,
    method: 'get',
    params: parameter
  })
}

CostService.budgetTypeItems = function (parameter) {
  return request({
    url: API.budgetTypeItems,
    method: 'get',
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
