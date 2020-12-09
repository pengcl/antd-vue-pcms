import request from '@/utils/request'

const API = {
  //成本预算制定
  items: '/api/services/app/Element/GetMainElementList', //成本预算制定列表
  subjectItems: '/api/services/app/BudgetSubPlan/GetBudgetPlanSubListToEditByGUID', //成本预算制定获取成本中心数据接口
  subjectViewItems: '/api/services/app/BudgetSubPlan/GetBudgetPlanDetailTreeByProject',//成本预算制定详情接口
  update: '/api/services/app/BudgetSubPlan/CreateOrEditDetails', //更新成本预算制定接口
  centers: '/api/services/app/ProjectCostCenter/GetProjectCostCentersByGuid' ,//根据项目GUID获取成本中心集合
  budgetPlanAuditItem: '/api/services/app/BudgetPlan/GetProjectCurrentBudgetPlanPackage' ,//获取项目的当前预算审核包信息
  budgetPlanAuditSave: '/api/services/app/BudgetPlan/ProjectSaveBudgetPlanPackage', //保存项目的预算审核包信息
  budgetTemplateFile: '/api/services/app/BudgetPlan/GetProjectBudgetImportTemplate', //获取预算模板文件
  uploadBudgetFile: '/api/services/app/BudgetSubPlan/ProjectBudgetUpload', //项目预算导入
  //行业分判包
  industryItems: '/api/services/app/TenderPackage/GetPaged' ,//行业分判包列表
  industryCreate: '/api/services/app/TenderPackage/CreateTenderPackage' ,//添加行业分判包
  industryItem: '/api/services/app/TenderPackage/GetTenderPackageById',//通过主键获取行业分判包数据
  budgetItems: '/api/services/app/TenderPackage/GetTenderPackageBudgetItemsById',//行业分判包预算列表
  budgetTypeItems: '/api/services/app/GeneralType/GetBudgetItemTypeTypes',//获取科目类型集合
  industryUpdate : '/api/services/app/TenderPackage/UpdateTenderPackage',//修改行业分判包
  industryRemove : '/api/services/app/TenderPackage/DeleteTenderPackage',//删除行业分判包
  //招投标分判包
  bidItems: '/api/services/app/ProjectTenderPackage/GetProjectTenderPackagesByProject',//根据项目ID获取招投标列表
  bidItem: '/api/services/app/ProjectTenderPackage/GetProjectTenderPackagById',//根据主键获取招标分判包详情
  bidCreate: '/api/services/app/ProjectTenderPackage/CreateProjectTenderPackage',//新增招投标分判包
  bidBudgetCreate: '/api/services/app/TradeBudget/ProjectCostCenterTradeBudgetItems',//创建行业预算
  matterItems: 'api/services/app/ProjectTenderPackage/GetPlanMatterModelList',//工作项列表
  bidIndustryItems: '/api/services/app/TenderPackage/GetTenderPackageList',//行业分判包下拉列表
  //行业预算分解
  resolveTreeItems: '/api/services/app/TradeBudget/GetProjectCostCenterTradeBudgetTree',//获取分解列表数据
  itemTree: '/api/services/app/Element/GetElementTreeList', //获取大类科目里面的子科目树
  elementTradeTypes: '/api/services/app/ElementTradeType/GetElementTradeTypes',//获取预算科目下的行业类型集合
  resolveCreate: '/api/services/app/TradeBudget/ProjectCostCenterTradeBudgetItems',//创建行业预算分解
  createGT: '/api/services/app/TradeBudget/BudgetAuotCreateGeneralTrade',//审批完成后对项目的所有预算科目进行产生GeneralTrade的操作
  removeTradeBudget: '/api/services/app/TradeBudget/ProjectCostCenterDeleteTradeBudgetItems',//删除预算分解
  //新增预算界面
  budegetTree: '/api/services/app/TenderPackage/GetTenderPackageAddBudgetItemElementTree',//通过行业分判包获取添加行业预算时的预算科目树
  budegetTreeItem: '/api/services/app/TenderPackage/GetTenderPackageAddCostCenterBudgetItems',//通过行业分判包获取添加行业预算时的成本中心下预算科目-行业预算数据集合
  addBudgetItem : '/api/services/app/TenderPackage/TenderPackageBatchAddBudgetItem',//行业分判包添加行业预算
  removeBudgetItem : '/api/services/app/TenderPackage/TenderPackageRemoveBudgetItem',//行业分判包移除行业预算
  //行业类型
  typyItems: '/api/services/app/ElementTradeType/GetFullElementTradeTypeTree' ,//获取预算科目下的行业类型集合
  typeCreate: '/api/services/app/ElementTradeType/Create',//添加预算科目的行业类型
  typeItem: '/api/services/app/ElementTradeType/GetById',//返回预算科目行业类型实体对象
  typeUpdate: '/api/services/app/ElementTradeType/Update' //对预算行业类型进行编辑更新
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

CostService.item = function (industryId) {
  return request({
    url: API.item,
    method: 'get',
    params: { industryId }
  })
}

CostService.industryCreate = function (parameter) {
  return request({
    url: API.industryCreate,
    method: 'POST',
    data: parameter
  })
}

CostService.industryUpdate = function (parameter) {
  return request({
    url: API.industryUpdate,
    method: 'put',
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
    params: parameter
  })
}

CostService.budgetItems = function (parameter) {
  return request({
    url: API.budgetItems,
    method: 'get',
    params: parameter
  })
}

CostService.bidItems = function (parameter) {
  return request({
    url: API.bidItems,
    method: 'get',
    params: parameter
  })
}

CostService.bidCreate = function (parameter) {
  return request({
    url: API.bidCreate,
    method: 'POST',
    data: parameter
  })
}

CostService.bidBudgetCreate = function (parameter) {
  return request({
    url: API.bidBudgetCreate,
    method: 'POST',
    data: parameter
  })
}

CostService.bidItem = function (parameter) {
  return request({
    url: API.bidItem,
    method: 'get',
    params: parameter
  })
}

CostService.resolveTreeItems = function (parameter) {
  return request({
    url: API.resolveTreeItems,
    method: 'get',
    params: parameter
  })
}

CostService.itemTree = function (parameter) {
  return request({
    url: API.itemTree,
    method: 'get',
    params: parameter
  })
}

CostService.budegetTree = function (parameter) {
  return request({
    url: API.budegetTree,
    method: 'get',
    params: parameter
  })
}

CostService.budegetTreeItem = function (parameter) {
  return request({
    url: API.budegetTreeItem,
    method: 'get',
    params: parameter
  })
}

CostService.elementTradeTypes = function (parameter) {
  return request({
    url: API.elementTradeTypes,
    method: 'get',
    params: parameter
  })
}

CostService.resolveCreate = function (parameter) {
  return request({
    url: API.resolveCreate,
    method: 'POST',
    data: parameter
  })
}

CostService.addBudgetItem = function (parameter) {
  return request({
    url: API.addBudgetItem,
    method: 'POST',
    data : parameter
  })
}

CostService.removeBudgetItem = function (parameter) {
  return request({
    url: API.removeBudgetItem,
    method: 'POST',
    data: parameter
  })
}

CostService.createGT = function (parameter) {
  return request({
    url: API.createGT,
    method: 'POST',
    data: parameter
  })
}

CostService.typyItems = function (parameter) {
  return request({
    url: API.typyItems,
    method: 'get',
    params: parameter
  })
}

CostService.typeItem = function (parameter) {
  return request({
    url: API.typeItem,
    method: 'get',
    params: parameter
  })
}

CostService.typeCreate = function (parameter) {
  return request({
    url: API.typeCreate,
    method: 'POST',
    data: parameter
  })
}

CostService.typeUpdate = function (parameter) {
  return request({
    url: API.typeUpdate,
    method: 'POST',
    data: parameter
  })
}

CostService.matterItems = function (parameter) {
  return request({
    url: API.matterItems,
    method: 'get',
    params: parameter
  })
}

CostService.bidIndustryItems = function (parameter) {
  return request({
    url: API.bidIndustryItems,
    method: 'get',
    params: parameter
  })
}

CostService.removeTradeBudget = function (parameter) {
  return request({
    url: API.removeTradeBudget,
    method: 'POST',
    data: parameter
  })
}

CostService.industryRemove = function (TenderPackageId) {
  return request({
    url: API.industryRemove,
    method: 'delete',
    params: {TenderPackageId}
  })
}

CostService.budgetPlanAuditItem = function (parameter) {
  return request({
    url: API.budgetPlanAuditItem,
    method: 'get',
    params: parameter
  })
}

CostService.budgetPlanAuditSave = function (parameter) {
  return request({
    url: API.budgetPlanAuditSave,
    method: 'POST',
    data: parameter
  })
}

CostService.budgetTemplateFile = function (parameter) {
  return request({
    url: API.budgetTemplateFile,
    method: 'get',
    params: parameter
  })
}

CostService.uploadBudgetFile = function (parameter) {
  return request({
    url: API.uploadBudgetFile,
    method: 'POST',
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
