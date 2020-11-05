import request from '@/utils/request'

const API = {
  items: '/api/services/app/PaymentOther/GetPaymentOtherPage',
  item: '/api/services/app/PaymentOther/GetPaymentOtherInfo',
}

const UnSignedService = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

UnSignedService.items = function (parameter) {
  return request({
    url: API.items,
    method: 'get',
    params: parameter
  })
}

UnSignedService.item = function (gid) {
  return request({
    url: API.item,
    method: 'get',
    params: { gid }
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

export { UnSignedService }
