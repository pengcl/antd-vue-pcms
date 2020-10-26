import request from '@/utils/request'

const API = {
  secretTypes: '/api/services/app/GeneralType/GetSecretLevelTypes',
  unitTypes: '/api/services/app/GeneralType/GetUnitTypes',
  full: '/api/services/app/City/GetProvinceCityAreaTree',
  cities: '/api/services/app/City/GetProvinceCityTree'
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

const dateFormat = 'YYYY/MM/DD'
const datetimeFormat = 'YYYY/MM/DD'

export { Base, dateFormat, datetimeFormat }
