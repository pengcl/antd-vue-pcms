import request from '@/utils/request'

const API = {
  items: '/api/services/app/NwUser/GetNwDataRoleProjectList',
  dps: '/api/services/app/NwUser/GetNwOrgTree',
  posts: '/api/services/app/NwUser/GetNwDataRoleList',
  save: '/api/services/app/NwUser/InsertOrUpdateNwDataRoleProject'
}

const ProjectRolesService = {}

ProjectRolesService.items = function list (RoleId) {
  return request({
    url: API.items,
    method: 'GET',
    params: { RoleId }
  })
}

ProjectRolesService.dps = function list (TenantGID) {
  return request({
    url: API.dps,
    method: 'GET',
    params: { TenantGID }
  })
}

ProjectRolesService.posts = function list (OrgGID) {
  return request({
    url: API.posts,
    method: 'GET',
    params: { OrgGID }
  })
}

ProjectRolesService.save = function list (body) {
  return request({
    url: API.save,
    method: 'POST',
    data: body
  })
}

export { ProjectRolesService }
