import request from '@/utils/request'

const API = {
  items: '/api/services/app/Payment/GetPaymentBookPage',
  exportPaymentBook: '/api/services/app/Payment/ExportPaymentBook',
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

PaymentBookService.exportPaymentBook = function (parameter) {
  return request({
    url: API.exportPaymentBook,
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
