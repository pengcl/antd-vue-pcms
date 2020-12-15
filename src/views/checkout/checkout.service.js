import request from '@/utils/request'

const API = {
  balanceCertificateList: '/api/services/app/Balance/GetBalanceCertificatePage',
}

const CheckoutService = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

CheckoutService.balanceCertificateList = function (contractGID) {
  return request({
    url: API.balanceCertificateList,
    method: 'get',
    params: { contractGID }
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

export { CheckoutService }
