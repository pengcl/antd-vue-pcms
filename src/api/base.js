import request from '@/utils/request'

const API = {
  secretTypes: '/api/services/app/GeneralType/GetSecretLevelTypes',
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

Base.secretTypes = function list () {
  return request({
    url: API.secretTypes,
    method: 'GET',
    params: {}
  })
}

export { Base }
