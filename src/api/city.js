import request from '@/utils/request'

export function formatCities (data) {
  const cities = []
  data.forEach(item => {
    if (item.city) {
      item.children = formatCities(item.city)
    }
    cities.push({
      label: item.name,
      value: item.name,
      children: item.children
    })
  })
  return cities
}

const API = {
  list: '/api/services/app/City/GetRegionalOfficeCitys',
  full: '/api/services/app/City/GetProvinceCityAreaTree',
  cities: '/api/services/app/City/GetProvinceCityTree',
  regionals: '/api/services/app/RegionalOffice/GetAllList'
}

const City = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

City.list = function list (id) {
  return request({
    url: API.list,
    method: 'get',
    params: { Id: id }
  })
}

City.full = function list () {
  return request({
    url: API.full,
    method: 'GET',
    params: {}
  })
}

City.cities = function list () {
  return request({
    url: API.cities,
    method: 'GET',
    params: {}
  })
}

City.regionals = function list () {
  return request({
    url: API.regionals,
    method: 'GET',
    params: {}
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

export { City }
