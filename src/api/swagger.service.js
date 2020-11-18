import request from '@/utils/request'
import { isArray } from 'ant-design-vue/lib/_util/vue-types/utils'

const API = {
  swagger: '/swagger.json?v=' + Date.parse(new Date().toString())
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
  const obj = SwaggerService.CONFIG.components.schemas[name].properties
  const forItem = {}
  for (const key in obj) {
    const item = obj[key]
    if (item.$ref) {
      const dto = item.$ref.split('/').reverse()[0]
      forItem[key] = SwaggerService.getForm(dto)
    } else {
      if (item.type === 'array') {
        forItem[key] = []
      } else {
        forItem[key] = ''
        /* if (item.format === 'int32') {
          forItem[key] = 0
        } else {
          forItem[key] = ''
        } */
      }
    }
  }
  return forItem
}

SwaggerService.getValue = function (valueDto, data) {
  const value = {}
  for (const key in valueDto) {
    if (typeof valueDto[key] === 'object' && valueDto[key] !== '') {
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
