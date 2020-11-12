import request from '@/utils/request'

const API = {
  secretTypes: '/api/services/app/GeneralType/GetSecretLevelTypes',
  unitTypes: '/api/services/app/GeneralType/GetUnitTypes',
  itemTypes: '/api/services/app/Contract/GetItemTypes',
  full: '/api/services/app/City/GetProvinceCityAreaTree',
  cities: '/api/services/app/City/GetProvinceCityTree',
  retentionTypes: '/api/services/app/GeneralType/GetRetentionTermTypes',
  upload: '/api/services/app/UploadAppservice/CommonUpload',
  masterID: '/api/services/app/UploadAppservice/GetMasterIDByBusinessGuid',
  fileList: '/api/services/app/UploadAppservice/GetFileList',
  removeFile: '/api/services/app/UploadAppservice/FileDeleteByID',
  centerTags: '/api/services/app/PropertyType/GetPropertyTypeTree',
  centerTypes: '/api/services/app/GeneralType/GetDevPurposeGeneralTypes'
}

const Base = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

Base.secretTypes = function () {
  return request({
    url: API.secretTypes,
    method: 'GET',
    params: {}
  })
}

Base.unitTypes = function () {
  return request({
    url: API.unitTypes,
    method: 'GET',
    params: {}
  })
}

Base.itemTypes = function (sType) {
  return request({
    url: API.itemTypes,
    method: 'GET',
    params: { sType }
  })
}

Base.retentionTypes = function () {
  return request({
    url: API.retentionTypes,
    method: 'GET',
    params: {}
  })
}

Base.centerTags = function () {
  return request({
    url: API.centerTags,
    method: 'GET',
    params: {}
  })
}

Base.centerTypes = function () {
  return request({
    url: API.centerTypes,
    method: 'GET',
    params: {}
  })
}

Base.upload = function (formData) {
  return request({
    url: API.upload,
    method: 'POST',
    processData: false,
    data: formData
  })
}

Base.masterID = function (BusinessGuid) {
  return request({
    url: API.masterID,
    method: 'get',
    params: { BusinessGuid }
  })
}

Base.fileList = function (masterID, businessID, sSubInfo1, sSubInfo2) {
  return request({
    url: API.fileList,
    method: 'get',
    params: { masterID, businessID, sSubInfo1, sSubInfo2 }
  })
}

Base.removeFile = function (ifileDetialID) {
  return request({
    url: API.removeFile,
    method: 'POST',
    params: { ifileDetialID }
  })
}

function addItem (obj, items) {
  items.push(Object.assign(obj, { isTemp: true, isDeleted: false }))
}

function removeItem (index, items) {
  if (items[index].isTemp) {
    items.splice(index, 1)
  } else {
    items[index].isDeleted = true
  }
}
//update by huya 2020-11-13 增加返回
//因使用data[target] 传参方式后，本方法进行修改赋值不会同步修改data[target]，所以增加返回进行外部覆盖
function clearItems (items) {
  const list = []
  items.forEach(item => {
    if (!item.isTemp) {
      item.isDeleted = true
      list.push(item)
    }
  })
  items = list
  return items
}

const dateFormat = ''
const datetimeFormat = 'YYYY/MM/DD'
const DIALOGCONFIG = {
  visible: false,
  fn: () => {
  },
  show: (config, fn) => {
    console.log(config, DIALOGCONFIG)
    DIALOGCONFIG.visible = config.visible || true
    DIALOGCONFIG.title = config.title || ''
    DIALOGCONFIG.content = config.content || ''
    DIALOGCONFIG.confirmText = config.confirmText || ''
    DIALOGCONFIG.cancelText = config.cancelText || ''
    DIALOGCONFIG.fn = fn
  },
  content: '',
  title: '',
  confirmText: '',
  cancelText: '',
  confirm: () => {
    DIALOGCONFIG.visible = false
    DIALOGCONFIG.fn(true)
  },
  cancel: () => {
    DIALOGCONFIG.visible = false
    DIALOGCONFIG.fn(false)
  }
}

const numberFilter = (value) => {
  if (!value) return '0.00'
  const intPart = Number(value).toFixed(0) // 获取整数部分
  const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  let floatPart = '.00' // 预定义小数部分
  const value2Array = value.split('.')
  if (value2Array.length === 2) { // =2表示数据有小数位
    floatPart = value2Array[1].toString() // 拿到小数部分
    if (floatPart.length === 1) { // 补0,实际上用不着
      return intPartFormat + '.' + floatPart + '0'
    } else {
      return intPartFormat + '.' + floatPart
    }
  } else {
    return intPartFormat + floatPart
  }
}

export { Base, dateFormat, datetimeFormat, DIALOGCONFIG, numberFilter, addItem, removeItem, clearItems }
