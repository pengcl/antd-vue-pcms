import request from '@/utils/request'

const API = {
  items: '/api/services/app/Vendor/GetVendorPage', // 项目列表
  viewEntity: '/api/services/app/Vendor/GetVendor', // 项目详情forEdit
  updateEntity: '/api/services/app/Vendor/GetVendorChangeEntity',
  generate: '/api/services/app/Vendor/CreateVendorChangeBG',
  update: '/api/services/app/Vendor/UpdateVendorChange',
  add: '/api/services/app/Vendor/CreateVendorChangeZR',
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

SupplierService.viewEntity = function list (GID) {
  return request({
    url: API.viewEntity,
    method: 'GET',
    params: { GID }
  })
}

SupplierService.updateEntity = function list (LogGID) {
  return request({
    url: API.updateEntity,
    method: 'GET',
    params: { LogGID }
  })
}

SupplierService.generate = function (vendorGID) {
  return request({
    url: API.generate + '?vendorGID=' + vendorGID,
    method: 'POST',
    data: {}
  })
}

SupplierService.create = function list (parameter) {
  return request({
    url: API.add,
    method: 'POST',
    data: parameter
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
