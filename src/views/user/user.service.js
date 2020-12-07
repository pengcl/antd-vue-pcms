import request from '@/utils/request'
import user from '@/store/modules/user'

const userApi = {
  Login: '/api/TokenAuth/Authenticate',
  list: '/api/services/app/RegionalOffice/GetAllList',
  Logout: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/api/TokenAuth/GetUserRoleInfo',
  UserMenu: '/user/nav'
}

/**
 * login func
 * parameter: {
 *     userNameOrEmailAddress: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get'
  })
}

export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post'
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}

// 获取当前所有action权限
export function acs (route) {
  const permissions = (() => {
    const _permissions = []
    route.meta.permission.forEach(id => {
      user.state.roles.permissions.forEach(permission => {
        if (id === permission.permissionId) {
          _permissions.push(permission)
        }
      })
    })
    return _permissions
  })()
  const actions = []
  permissions.forEach(permission => {
    permission.actions.forEach(action => {
      if (actions.indexOf(action.action) === -1) {
        actions.push(action.action)
      }
    })
  })
  return actions
}

// 查看是否有action 权限 return true|false
export function ac (action, route) {
  const actions = acs(route)
  return actions.indexOf(action) !== -1
}
