import request from '@/utils/request'

const API = {
  items: '/api/services/app/VO/GetContractListForVO',
  changeItems : '/api/services/app/VO/GetVOListByContractGuid',
  changeItem : '/api/services/app/Contract/GetContractByGuid',
  item: '/api/services/app/VO/GetVOAllInfoByGuid',
  create: '/api/services/app/VO/CreateAllVoInfo',
  update: '/api/services/app/VO/UpdateVOAllInfo',
  contractParty : '/api/services/app/VO/GetPartyByContract',
  sendCopyParty : '/api/services/app/VO/GetSendCopyParty',
  accumulateAmount : '/api/services/app/VO/GetAccumulateAmount',
  bqAmount : '/api/services/app/VO/GetVOAmountByBQList',
  retentions : '/api/services/app/Contract/GetContractRetentionlstByContractGuid',
  releases : '/api/services/app/Contract/GetContractRetentionReleaselstByContractGuid',
  bqList : '/api/services/app/Contract/GetContractBQByContractGuid'
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

export { ChangeService }