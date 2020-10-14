import request from '@/utils/request'

const API = {
  paged: '/api/services/app/RegionalOffice/GetPaged',
  list: '/api/services/app/Project/GetProjects'
}

const ProjectService = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

ProjectService.list = function list (parameter) {
  return request({
    url: API.list,
    method: 'GET',
    data: parameter
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
ProjectService.paged = function (parameter) {
  return request({
    url: API.paged,
    method: 'get',
    data: parameter
  })
}

export { ProjectService }
