import request from '@/utils/request'

const API = {
  items: '/api/services/app/Vendor/GetVendorPage', // 项目列表
  item: '/api/services/app/Vendor/GetVendor', // 项目详情forEdit
  update: '/api/services/app/Vendor/UpdateVendorChange',
  check: '/api/services/app/Vendor/CheckVendor',
  banks: '/api/services/app/Vendor/GetVendorBankList',
  bank: '/api/services/app/Vendor/GetVendorBank',
  updateBank: '/api/services/app/Vendor/CreateVendorBankChange',
  types: '/api/services/app/Vendor/GetVendorPackageTree'
}

const SupplierService = {}

SupplierService.items = function list (parameter) {
  return request({
    url: API.items,
    method: 'GET',
    params: parameter
  })
}

SupplierService.item = function list (GID) {
  return request({
    url: API.item,
    method: 'GET',
    params: { GID }
  })
}

SupplierService.update = function list (parameter) {
  return request({
    url: API.update,
    method: 'PUT',
    data: parameter
  })
}

SupplierService.check = function (VendorName) {
  return request({
    url: API.check,
    method: 'POST',
    data: { VendorName }
  })
}

SupplierService.banks = function (VendorGID) {
  return request({
    url: API.banks,
    method: 'GET',
    data: { VendorGID }
  })
}

SupplierService.bank = function (GID) {
  return request({
    url: API.bank,
    method: 'GET',
    data: { GID }
  })
}

SupplierService.types = function list () {
  return request({
    url: API.types,
    method: 'GET',
    params: {}
  })
}

export { SupplierService }
