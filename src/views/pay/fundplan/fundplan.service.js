import request from '@/utils/request'

const API = {
  currentFiscalYear: '/api/services/app/FundingPlan/GetCurrentFiscalYear',
  currentFiscalMonth: '/api/services/app/FundingPlan/GetCurrentFiscalMonth',
  createFundingPlanYear: '/api/services/app/FundingPlan/CreateFundingPlanYear',
  createFundingPlanMonth: '/api/services/app/FundingPlan/CreateFundingPlanMonth',
  fundingPlanYearList: '/api/services/app/FundingPlan/GetFundingPlanYearList',
  fundingPlanInfo: '/api/services/app/FundingPlan/GetFundingPlannMonthList',
  tenderPacakges: '/api/services/app/TenderPackage/GetTenderPacakgesBySearch',
  versionList: '/api/services/app/FundingPlan/GetFundingPlanVersionList',
  update: '/api/services/app/FundingPlan/UpdateFundingPlannMonth',
  startBPM_Year: '/api/services/app/FundingPlan/StartBPM_Year',
  startBPM_Month: '/api/services/app/FundingPlan/StartBPM_Month',
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

FundPlanService.fundingPlanInfo = function (projectCode, year, month, elementCode) {
  return request({
    url: API.fundingPlanInfo,
    method: 'get',
    params: { projectCode, year, month, elementCode }
  })
}

FundPlanService.tenderPacakges = function (parameter) {
  return request({
    url: API.tenderPacakges,
    method: 'get',
    params: parameter
  })
}

FundPlanService.versionList = function (ProjectCode, year) {
  return request({
    url: API.versionList,
    method: 'get',
    params: { ProjectCode, year }
  })
}

FundPlanService.update = function (parameter) {
  return request({
    url: API.update,
    method: 'PUT',
    data: parameter
  })
}

FundPlanService.startBPM_Year = function (gid) {
  return request({
    url: API.startBPM_Year,
    method: 'POST',
    params: { gid }
  })
}

FundPlanService.startBPM_Month = function (gid) {
  return request({
    url: API.startBPM_Month,
    method: 'POST',
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

export { FundPlanService }
