import request from '@/utils/request'

const API = {
  posts: '/api/TokenAuth/UserAuthorityList',
  projects: '/api/TokenAuth/UserMenuList'
}

const RoleService = {}

RoleService.posts = function (params) {
  return request({
    url: API.posts,
    method: 'GET',
    params: params
  })
}

RoleService.projects = function (params) {
  return request({
    url: API.projects,
    method: 'GET',
    params: params
  })
}

export { RoleService }
