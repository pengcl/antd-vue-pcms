import storage from 'store'
import { login, getInfo, logout } from '@/views/user/user.service'
import { ACCESS_TOKEN, DEPARTMENT } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
/* import { info } from '@/mock/services/user' */

const DASHBOARD = {
  'roleId': 'admin',
  'permissionId': 'dashboard',
  'permissionName': '任务管理',
  'actions': [{ 'action': 'add', 'defaultCheck': false, 'describe': '新增' }, {
    'action': 'query',
    'defaultCheck': false,
    'describe': '查询'
  }, { 'action': 'get', 'defaultCheck': false, 'describe': '详情' }, {
    'action': 'update',
    'defaultCheck': false,
    'describe': '修改'
  }, { 'action': 'delete', 'defaultCheck': false, 'describe': '删除' }],
  'actionEntitySet': [
    {
      'action': 'add',
      'describe': '新增',
      'defaultCheck': false
    },
    {
      'action': 'query',
      'describe': '查询',
      'defaultCheck': false
    },
    {
      'action': 'get',
      'describe': '详情',
      'defaultCheck': false
    },
    {
      'action': 'update',
      'describe': '修改',
      'defaultCheck': false
    },
    {
      'action': 'delete',
      'describe': '删除',
      'defaultCheck': false
    }
  ],
  'actionList': null,
  'dataAccess': null
}

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.result
          storage.set(ACCESS_TOKEN, result.data.accessToken, 7 * 24 * 60 * 60 * 1000)
          storage.set(DEPARTMENT, result.data.tenantOrgs)
          commit('SET_TOKEN', result.data.accessToken)
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        /* const response = INFO
       const result = response.result

       if (result.role && result.role.permissions.length > 0) {
         const role = result.role
         role.permissions = result.role.permissions
         role.permissions.map(per => {
           if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
             const action = per.actionEntitySet.map(action => {
               return action.action
             })
             per.actionList = action
           }
         })
         role.permissionList = role.permissions.map(permission => {
           return permission.permissionId
         })
         commit('SET_ROLES', result.role)
         commit('SET_INFO', result)
       } else {
         reject(new Error('getInfo: roles must be a non-null array !'))
       }

       commit('SET_NAME', { name: result.name, welcome: welcome() })
       commit('SET_AVATAR', result.avatar)

       resolve(response) */
        getInfo().then((response) => {
          response.result = response.result.data
          const result = response.result
          result.role.permissions.push(DASHBOARD)
          result.role.permissions.forEach(item => {
            item.permissionId = item.permissionCode
          })
          if (result.role && result.role.permissions.length > 0) {
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => {
                  return action.action
                })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => {
              return permission.permissionId
            })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        storage.remove(ACCESS_TOKEN)
        resolve()
      })
    }
  }
}

export default user
