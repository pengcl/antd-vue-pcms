import request from '@/utils/request'

const API = {
  item: '/api/services/app/HighData/GetHighDataReportUrl'
}

const ReportService = {}

ReportService.item = function list (ReportCode) {
  return request({
    url: API.item,
    method: 'GET',
    params: { ReportCode }
  })
}

export { ReportService }
