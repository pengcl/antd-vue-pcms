import request from '@/utils/request'

const API = {
  items: '/api/services/app/VO/GetContractListForVO',
  changeItems : '/api/services/app/VO/GetVOListByContractGuid',
  changeItem : '/api/services/app/Contract/GetContractByGuid',
  item: '/api/services/app/VO/GetVOAllInfoByGuid',
  voItem : '/api/services/app/VO/GetVOAllInfoByGuidForVIPToVO',
  create: '/api/services/app/VO/CreateAllVoInfo',
  update: '/api/services/app/VO/UpdateVOAllInfo',
  contractParty : '/api/services/app/VO/GetPartyByContract',
  sendCopyParty : '/api/services/app/VO/GetSendCopyParty',
  accumulateAmount : '/api/services/app/VO/GetAccumulateAmount',
  bqAmount : '/api/services/app/VO/GetVOAmountByBQList',
  retentions : '/api/services/app/Contract/GetContractRetentionlstByContractGuid',
  releases : '/api/services/app/Contract/GetContractRetentionReleaselstByContractGuid',
  bqList : '/api/services/app/Contract/GetContractBQlstForVO',
  bondList : '/api/services/app/Contract/GetContractBondlstByContractGuid',
  fluctuationClauseList : '/api/services/app/Contract/GetContractFluctuationClauselstByContractGuid',
  insuaranceList : '/api/services/app/Contract/GetContractInsuarancelstByContractGuid',
  materialQualityGuaranteeList : '/api/services/app/Contract/GetContractMaterialQualityGuaranteelstByContractGuid',
  paymentTermsList : '/api/services/app/Contract/GetContractPaymentTermslstByContractGuid',
  fileTypes : '/api/services/app/GeneralType/GetVOFileTypes',
  delete : '/api/services/app/VO/DeleteVOAllInfo',
  startBMP : '/api/services/app/VO/StartBPM',
  createPMI : '/api/services/app/VO/CreatePMIFile',
  viewPMI : '/api/services/app/VO/PMIIsCreate',
  buildingDesignItem : '/api/services/app/Contract/GetContractBuildingDesign',//根据合同GUID获取合同施工组织设计
  createBuildingDesign : '/api/services/app/Contract/CreateContractBuildingDesign',//新增施工组织设计
  updateBuildingDesign : '/api/services/app/Contract/UpdateContractBuildingDesign',//修改施工组织设计
  contractPartyForBd : '/api/services/app/Contract/GetContractPartyForBD',//获取施工单位列表（合同乙方、其他方）
  startBuildingDesignBPM : '/api/services/app/Contract/StartContractBDBPM',//发起流程-施工组织设计
  getCostCenters : '/api/services/app/VO/GetProjectTenderPackageCostCenters',//获取造价估算成本中心列表
  getVoBudgetPreSplit : '/api/services/app/VO/GetVoBudgetPreSplitByVOGuid',//变更预分解（针对预计变更金额）
  createVoUsePlan : '/api/services/app/VO/CreateVOUsePlan',//预算确认（针对预计结算金额）
  updateVoUsePlan : '/api/services/app/VO/UpdateVOUsePlan',//更新变更预算调整
  storeTypes: '/api/services/app/GeneralType/GetSAorVOUseStoreTypes',//补充合同或变更余额使用类型
  getSourceTypes : '/api/services/app/GeneralType/GetVOValueSoruceTypes',//估值来源
  getVOUseStoreSum : '/api/services/app/ProjectTenderPackage/GetContractVOUseStoreSum'//通过合同编号获取对应的三种变更类型预算余额
}

const ChangeService = {}

/**
 * 获取合同列表
 * parameter: null
 * @param parameter
 * @returns {*}
 */
ChangeService.items = function (parameter) {
  return request({
    url: API.items,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取合同变更列表
 * parameter: null
 * @param parameter
 * @returns {*}
 */
ChangeService.changeItems = function (parameter) {
  return request({
    url: API.changeItems,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取合同详情
 */
ChangeService.changeItem = function (parameter) {
  return request({
    url: API.changeItem,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取变更信息详情
 * 对应swagger VOAllInfoDto
 */
ChangeService.item = function (voGuid) { 
  return request({
    url: API.item,
    method: 'get',
    params: { voGuid }
  })
}


/**
 * 获取变更VO信息详情
 * 对应swagger VOAllInfoDto
 */
ChangeService.voItem = function (voGuid) { 
	return request({
	  url: API.voItem,
	  method: 'get',
	  params: { voGuid }
	})
  }

/**
 * 创建合同变更信息
 */
ChangeService.create = function (parameter) {
  return request({
    url: API.create,
    method: 'POST',
    data: parameter
  })
}

/**
 * 修改合同变更信息
 */
ChangeService.update = function (parameter) {
  return request({
    url: API.update,
    method: 'PUT',
    data: parameter
  })
}

/**
 * 获取合同变更承包/顾问信息 接收公司列表
 */
ChangeService.contractParty = function(parameter){
	return request({
	    url: API.contractParty,
	    method: 'get',
	    params: parameter
	  })
}

/**
 * 获取合同变更抄送公司列表
 */
ChangeService.sendCopyParty = function(parameter){
	return request({
	    url: API.sendCopyParty,
	    method: 'get',
	    params: parameter
	  })
}


/**
 * 获取合同变更相关累计金额信息
 */
ChangeService.accumulateAmount = function(contractGuid){
	return request({
	    url: API.accumulateAmount,
	    method: 'get',
	    params: {contractGuid}
	  })
}

/**
 * 计算造价估算金额
 */
ChangeService.bqAmount = function(parameter){
	return request({
	    url: API.bqAmount,
	    method: 'post',
	    data: parameter
	  })
}

/**
 * 获取合同保修金/保留金列表
 */
ChangeService.retentions = function(contractGuid){
	return request({
	    url: API.retentions,
	    method: 'get',
	    params: {contractGuid}
	  })
}

/**
 * 获取合同保修金/保留金返还列表
 */
ChangeService.releases = function(contractGuid){
	return request({
	    url: API.releases,
	    method: 'get',
	    params: {contractGuid}
	  })
}

/**
 * 获取合同清单列表
 */
ChangeService.bqList = function(contractGuid){
	return request({
	    url: API.bqList,
	    method: 'get',
	    params: {contractGuid}
	  })
}

/**
 * 根据合同guid获取调差补偿列表
 */
ChangeService.fluctuationClauseList = function(contractGuid){
	return request({
	    url: API.fluctuationClauseList,
	    method: 'get',
	    params: {contractGuid}
	  })
}

/**
 * 根据合同guid获取履约保函列表
 */
ChangeService.bondList = function(contractGuid){
	return request({
	    url: API.bondList,
	    method: 'get',
	    params: {contractGuid}
	  })
}

/**
 * 根据合同guid获取履约保险列表
 */
ChangeService.insuaranceList = function(contractGuid){
	return request({
	    url: API.insuaranceList,
	    method: 'get',
	    params: {contractGuid}
	  })
}

/**
 * 根据合同guid获取质量保证列表
 */
ChangeService.materialQualityGuaranteeList = function(contractGuid){
	return request({
	    url: API.materialQualityGuaranteeList,
	    method: 'get',
	    params: {contractGuid}
	  })
}

/**
 * 根据合同guid获取付款条款列表
 */
ChangeService.paymentTermsList = function(contractGuid){
	return request({
	    url: API.paymentTermsList,
	    method: 'get',
	    params: {contractGuid}
	  })
}

/**
 * 获取变更附件类型
 */
ChangeService.fileTypes = function(){
	return request({
	    url: API.fileTypes,
	    method: 'get',
	    params: {}
	  })
}

/**
 * 废弃变更信息
 */
ChangeService.delete = function(voguid){
	return request({
	    url: API.delete,
	    method: 'delete',
	    params: {voguid}
	  })
}

/**
 * 发起流程
 */
ChangeService.startBMP = function(parameter){
	return request({
		url: API.startBMP,
		method: 'post',
		params: parameter
	})
}

/**
 * 通过cip生成pmi
 */
ChangeService.createPMI = function(parameter){
	return request({
	    url: API.createPMI,
	    method: 'post',
	    params: parameter
	  })
}

/**
 * 通过cip生成pmi
 */
ChangeService.viewPMI = function(CIPGuid){
	return request({
	    url: API.viewPMI,
	    method: 'post',
	    params: {CIPGuid}
	  })
}

/**
 * 根据合同GUID获取合同施工组织设计
 */
ChangeService.buildingDesignItem = function(contractGuid){
	return request({
	    url: API.buildingDesignItem,
	    method: 'get',
	    params: {contractGuid}
	  })
}

/**
 * 通过cip生成pmi
 */
ChangeService.createBuildingDesign = function(parameter){
	return request({
	    url: API.createBuildingDesign,
	    method: 'post',
	    data: parameter
	  })
}

/**
 * 通过cip生成pmi
 */
ChangeService.updateBuildingDesign = function(parameter){
	return request({
	    url: API.updateBuildingDesign,
	    method: 'put',
	    data: parameter
	  })
}

/**
 * 获取施工单位列表（合同乙方、其他方）
 */
ChangeService.contractPartyForBd = function(contractGuid){
	return request({
	    url: API.contractPartyForBd,
	    method: 'get',
	    params: {contractGuid}
	  })
}

/**
 * 发起流程-施工组织设计
 */
ChangeService.startBuildingDesignBPM = function(parameter){
	return request({
	    url: API.startBuildingDesignBPM,
	    method: 'post',
	    params: parameter
	  })
}


/**
 * 获取施工单位列表（合同乙方、其他方）
 */
ChangeService.getCostCenters = function(contractGuid){
	return request({
	    url: API.getCostCenters,
	    method: 'get',
	    params: {contractGuid}
	  })
}

/**
 * 变更预分解（针对预计变更金额）
 */
ChangeService.getVoBudgetPreSplit = function(parameter){
	return request({
	    url: API.getVoBudgetPreSplit,
	    method: 'get',
	    params: parameter
	  })
}


/**
 * 预算确认（针对预计结算金额）
 */
ChangeService.createVoUsePlan = function(parameter){
	return request({
	    url: API.createVoUsePlan,
	    method: 'post',
	    data: parameter
	  })
}


/**
 * 更新变更预算调整
 */
ChangeService.updateVoUsePlan = function(parameter){
	return request({
	    url: API.updateVoUsePlan,
	    method: 'put',
	    data: parameter
	  })
}

/**
 * 补充合同或变更余额使用类型
 */
ChangeService.storeTypes = function(){
	return request({
	    url: API.storeTypes,
	    method: 'get',
	    params: {}
	  })
}

/**
 * 估值来源
 */
ChangeService.getSourceTypes = function(){
	return request({
	    url: API.getSourceTypes,
	    method: 'get',
	    params: {}
	  })
}

/**
 * 通过合同编号获取对应的三种变更类型预算余额
 */
ChangeService.getVOUseStoreSum = function(contractGuid){
	return request({
	    url: API.getVOUseStoreSum,
	    method: 'get',
	    params: {Id : contractGuid}
	  })
}

export { ChangeService }
