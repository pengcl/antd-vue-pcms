import request from '@/utils/request'

const API = {
  items: '/api/services/app/Payment/GetPaymentBookPage',
}

const PaymentBookService = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

PaymentBookService.items = function (parameter) {
  return request({
    url: API.items,
    method: 'get',
    params: parameter
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

export { PaymentBookService }
