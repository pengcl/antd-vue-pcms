import request from '@/utils/request'
import { API_PREFIX } from '@/api/prefix'

const API = {
  paged: API_PREFIX.prod + '/api/services/app/RegionalOffice/GetPaged',
  list: API_PREFIX.prod + '/api/services/app/Project/GetProjects'
}

const Project = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

Project.list = function list () {
  console.log(API.list)
  return request({
    url: API.list,
    method: 'get',
    data: {}
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
Project.paged = function (parameter) {
  return request({
    url: API.paged,
    method: 'get',
    data: parameter
  })
}

export { Project }
