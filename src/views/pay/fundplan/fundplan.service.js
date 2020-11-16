import request from '@/utils/request'

const API = {
  currentFiscalYear: '/api/services/app/FundingPlan/GetCurrentFiscalYear',
  currentFiscalMonth: '/api/services/app/FundingPlan/GetCurrentFiscalMonth',
  createFundingPlanYear: '/api/services/app/FundingPlan/CreateFundingPlanYear',
  createFundingPlanMonth: '/api/services/app/FundingPlan/CreateFundingPlanMonth',
  fundingPlanYearList: '/api/services/app/FundingPlan/GetFundingPlanYearList',
}

const FundPlanService = {}

/**
 * list func
 * parameter: null
 * @param parameter
 * @returns {*}
 */

FundPlanService.currentFiscalYear = function () {
  return request({
    url: API.currentFiscalYear,
    method: 'get',
    params: {}
  })
}

FundPlanService.currentFiscalMonth = function () {
  return request({
    url: API.currentFiscalMonth,
    method: 'get',
    params: {}
  })
}

FundPlanService.createFundingPlanYear = function (parameter) {
  return request({
    url: API.createFundingPlanYear,
    method: 'POST',
    data: parameter
  })
}

FundPlanService.createFundingPlanMonth = function (parameter) {
  return request({
    url: API.createFundingPlanMonth,
    method: 'POST',
    data: parameter
  })
}

FundPlanService.fundingPlanYearList = function (projectCode) {
  return request({
    url: API.fundingPlanYearList,
    method: 'get',
    params: { projectCode }
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

export { FundPlanService }
