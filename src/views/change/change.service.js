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
  bqAmount : '/api/services/app/VO/GetVOAmountByBQNewList',
  retentions : '/api/services/app/Contract/GetContractRetentionlstByContractGuid',
  releases : '/api/services/app/Contract/GetContractRetentionReleaselstByContractGuid',
  bqList : '/api/services/app/Contract/GetContractBQNewlstForVO',
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
  getVOUseStoreSum : '/api/services/app/ProjectTenderPackage/GetContractVOUseStoreSum',//通过合同编号获取对应的三种变更类型预算余额
  getVOUseSurplusPreSplit : '/api/services/app/VO/GetVOUseSurplusPreSplitByVOGuid',//变更预分解（针对定标盈余）
  createVOUseSurplus : '/api/services/app/VO/CreateVOUseSurplus',//预算确认（针对定标盈余）
  updateVOUseSurplus : '/api/services/app/VO/UpdateVOUseSurplus',//更新变更预算调整（针对定标盈余）
  getVOCBudgetPreSplitByVOGuid : '/api/services/app/VO/GetVOCBudgetPreSplitByVOGuid',//VO-变更预分解（针对预计变更金额）
  createVOCUsePlan : '/api/services/app/VO/CreateVOCUsePlan',//VO-预算确认（针对预计变更金额）
  updateVOCUsePlan : '/api/services/app/VO/UpdateVOCUsePlan',//VO-更新变更预算调整（针对预计结算金额）

  getVOCUseSurplusPreSplitByVOGuid : '/api/services/app/VO/GetVOCUseSurplusPreSplitByVOGuid',//VO-变更预分解（针对定标盈余）
  createVOCUseSurplus : '/api/services/app/VO/CreateVOCUseSurplus',//VO-预算确认（针对定标盈余）
  updateVOCUseSurplus : '/api/services/app/VO/UpdateVOCUseSurplus',//VO-更新变更预算调整（针对定标盈余）
  getCIPTypes: '/api/services/app/GeneralType/GetCIPTypes',//CIP类型
  getVOUseGeneralTradePreSplitByVOGuid : '/api/services/app/VO/GetVOUseGeneralTradePreSplitByVOGuid',//CIP-变更预分解（针对预算余额）
  createVOUseGeneralTrade : '/api/services/app/VO/CreateVOUseGeneralTrade',//CIP-预算确认（针对预算余额）
  updateVOGeneralTrade : '/api/services/app/VO/UpdateVOGeneralTrade',//CIP-更新变更预算调整（针对预算余额）

  getVOCUseGeneralTradePreSplitByVOGuid : '/api/services/app/VO/GetVOCUseGeneralTradePreSplitByVOGuid',//VO-变更预分解（针对预算余额）
  createVOCUseGeneralTrade : '/api/services/app/VO/CreateVOCUseGeneralTrade',//VO-预算确认（针对预算余额）
  updateVOCGeneralTrade : '/api/services/app/VO/UpdateVOCGeneralTrade',//VO-更新变更预算调整（针对预算余额）
  getVOTypeTree : '/api/services/app/VO/GetVOTypeTree',//根据ciptype获取voType树信息

  //现场签证相关
  getSpotVisaListByVoGuid: '/api/services/app/VO/GetSpotVisaListByVoGuid',//根据变更Guid获取现场签证列表数据
  createSpotVisa: '/api/services/app/VO/CreateSpotVisa',//新增现场签证
  updateSpotVisa: '/api/services/app/VO/UpdateSpotVisa',//更新现场签证
  deleteSpotVisa: '/api/services/app/VO/DeleteSpotVisa',//废弃现场签证
  getVOInfoForSpotVisa: '/api/services/app/VO/GetVOInfoForSpotVisa',//针对现场签证获取VO相关信息
  getSpotVisaByGuid: '/api/services/app/VO/GetSpotVisaByGuid',//根据GUID获取现场签证信息

  //变更台账
  getVoBookInfoBySearch: '/api/services/app/VO/GetVoBookInfoBySearch',//变更台账列表
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
 * CIP-变更预分解（针对预计变更金额）
 */
ChangeService.getVoBudgetPreSplit = function(parameter){
	return request({
	    url: API.getVoBudgetPreSplit,
	    method: 'get',
	    params: parameter
	  })
}


/**
 * CIP-预算确认（针对预计结算金额）
 */
ChangeService.createVoUsePlan = function(parameter){
	return request({
	    url: API.createVoUsePlan,
	    method: 'post',
	    data: parameter
	  })
}


/**
 * CIP-更新变更预算调整
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

/**
 * CIP-变更预分解（针对定标盈余）
 */
ChangeService.getVOUseSurplusPreSplit = function(parameter){
	return request({
	    url: API.getVOUseSurplusPreSplit,
	    method: 'get',
	    params: parameter
	  })
}

/**
 * CIP-预算确认（针对定标盈余）
 */
ChangeService.createVOUseSurplus = function(parameter){
	return request({
	    url: API.createVOUseSurplus,
	    method: 'post',
	    data: parameter
	  })
}


/**
 * CIP-更新变更预算调整（针对定标盈余）
 */
ChangeService.updateVOUseSurplus = function(parameter){
	return request({
	    url: API.updateVOUseSurplus,
	    method: 'put',
	    data: parameter
	  })
}

/**
 * VO-变更预分解（针对预计变更金额）
 */
ChangeService.getVOCBudgetPreSplitByVOGuid = function(parameter){
	return request({
	    url: API.getVOCBudgetPreSplitByVOGuid,
	    method: 'get',
	    params: parameter
	  })
}

/**
 * VO-预算确认（针对预计变更金额）
 */
ChangeService.createVOCUsePlan = function(parameter){
	return request({
	    url: API.createVOCUsePlan,
	    method: 'post',
	    data: parameter
	  })
}


/**
 * VO-更新变更预算调整（针对预计结算金额）
 */
ChangeService.updateVOCUsePlan = function(parameter){
	return request({
	    url: API.updateVOCUsePlan,
	    method: 'put',
	    data: parameter
	  })
}

/**
 * VO-变更预分解（针对定标盈余）
 */
ChangeService.getVOCUseSurplusPreSplitByVOGuid = function(parameter){
	return request({
	    url: API.getVOCUseSurplusPreSplitByVOGuid,
	    method: 'get',
	    params: parameter
	  })
}

/**
 * VO-预算确认（针对定标盈余）
 */
ChangeService.createVOCUseSurplus = function(parameter){
	return request({
	    url: API.createVOCUseSurplus,
	    method: 'post',
	    data: parameter
	  })
}

/**
 * VO-更新变更预算调整（针对定标盈余）
 */
ChangeService.updateVOCUseSurplus = function(parameter){
	return request({
	    url: API.updateVOCUseSurplus,
	    method: 'put',
	    data: parameter
	  })
}

/**
 * 变更类型
 */
ChangeService.getCIPTypes = function(){
	return request({
	    url: API.getCIPTypes,
	    method: 'get',
	    params: {}
	  })
}

/**
 * CIP-变更预分解（针对预算余额）
 */
ChangeService.getVOUseGeneralTradePreSplitByVOGuid = function(parameter){
	return request({
	    url: API.getVOUseGeneralTradePreSplitByVOGuid,
	    method: 'get',
	    params: parameter
	  })
}

/**
 * CIP-预算确认（针对预算余额）
 */
ChangeService.createVOUseGeneralTrade = function(parameter){
	return request({
	    url: API.createVOUseGeneralTrade,
	    method: 'post',
	    data: parameter
	  })
}


/**
 * CIP-更新变更预算调整（针对预算余额）
 */
ChangeService.updateVOGeneralTrade = function(parameter){
	return request({
	    url: API.updateVOGeneralTrade,
	    method: 'put',
	    data: parameter
	  })
}

/**
 * VO-变更预分解（针对预算余额）
 */
ChangeService.getVOCUseGeneralTradePreSplitByVOGuid = function(parameter){
	return request({
	    url: API.getVOCUseGeneralTradePreSplitByVOGuid,
	    method: 'get',
	    params: parameter
	  })
}

/**
 * VO-预算确认（针对预算余额）
 */
ChangeService.createVOCUseGeneralTrade = function(parameter){
	return request({
	    url: API.createVOCUseGeneralTrade,
	    method: 'post',
	    data: parameter
	  })
}

/**
 * VO-更新变更预算调整（针对预算余额）
 */
ChangeService.updateVOCGeneralTrade = function(parameter){
	return request({
	    url: API.updateVOCGeneralTrade,
	    method: 'put',
	    data: parameter
	  })
}

/**
 * 根据cipType获取VOType
 */
ChangeService.getVOTypeTree = function(cipType){
	return request({
	    url: API.getVOTypeTree,
	    method: 'get',
	    params: {cipType}
	  })
}

 /**
 * 根据变更Guid获取现场签证列表数据
 */
ChangeService.getSpotVisaListByVoGuid = function(voGuid){
	return request({
	    url: API.getSpotVisaListByVoGuid,
	    method: 'get',
	    params: {voGuid}
	  })
}

/**
 * 根据GUID获取现场签证信息
 */
ChangeService.getSpotVisaByGuid = function(SVGuid){
	return request({
	    url: API.getSpotVisaByGuid,
	    method: 'get',
	    params: {SVGuid}
	  })
}

/**
 * 新增现场签证
 */
ChangeService.createSpotVisa = function(parameter){
	return request({
	    url: API.createSpotVisa,
	    method: 'post',
	    data: parameter
	  })
}


/**
 * 更新现场签证
 */
ChangeService.updateSpotVisa = function(parameter){
	return request({
	    url: API.updateSpotVisa,
	    method: 'put',
	    data: parameter
	  })
}

/**
 * 废弃现场签证
 */
ChangeService.deleteSpotVisa = function(SVGuid){
	return request({
	    url: API.deleteSpotVisa,
	    method: 'delete',
	    data: {SVGuid}
	  })
}

/**
 * 针对现场签证获取VO相关信息
 */
ChangeService.getVOInfoForSpotVisa = function(voGuid){
	return request({
	    url: API.getVOInfoForSpotVisa,
	    method: 'get',
	    params: {voGuid}
	  })
}

/**
 * 针对现场签证获取VO相关信息
 */
ChangeService.getVoBookInfoBySearch = function(params){
	return request({
	    url: API.getVoBookInfoBySearch,
	    method: 'get',
	    params: params
	  })
}
export { ChangeService }
