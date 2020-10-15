import request from '@/utils/request'
import { isArray } from 'ant-design-vue/lib/_util/vue-types/utils'

const API = {
  swagger: '/swagger/v1/swagger.json'
}

const SwaggerService = { CONFIG: null }

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

SwaggerService.getConfig = function () {
  return request({
    url: API.swagger,
    method: 'get',
    params: {}
  })
}

SwaggerService.set = function (config) {
  SwaggerService.CONFIG = config
}

SwaggerService.getDto = function (name) {
  return {
    dto: SwaggerService.CONFIG.components.schemas[name + 'Dto'],
    inputDto: SwaggerService.CONFIG.components.schemas[name + 'InputDto'],
    outputDto: SwaggerService.CONFIG.components.schemas[name + 'OutputDto']
  }
}

SwaggerService.getDtoItem = function (name, key) {
  return SwaggerService.CONFIG.components.schemas[name + 'Dto'].properties[key]
}

SwaggerService.getForm = function (name) {
  const obj = SwaggerService.CONFIG.components.schemas[name + 'InputDto'].properties
  const forItem = {}
  for (const key in obj) {
    if (obj[key]) {
      forItem[key] = null
    }
  }
  return forItem
}

SwaggerService.getValue = function (valueDto, data) {
  const value = {}
  for (const key in valueDto) {
    if (typeof valueDto[key] === 'object' && valueDto[key] !== null) {
      if (isArray(data[key])) { // 是否Array类型
        value[key] = []
        data[key].forEach(item => {
          value[key].push(SwaggerService.getValue(valueDto[key], item))
        })
      } else {
        value[key] = SwaggerService.getValue(valueDto[key], data[key])
      }
    } else {
      value[key] = data[key]
    }
  }
  return value
}

SwaggerService.getValueItem = function (data, key) {
  return data[key]
}

export { SwaggerService }
