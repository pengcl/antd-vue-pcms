<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="12" :sm="24">
        <a-form-item
          label="项目名称(中文)"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择项目名称(中文)"
            v-model="data.contract.projectID"
            v-decorator="[data.contract.projectID, { rules: [{required: true, message: '请选择项目名称(中文)'}] }]">
            <a-select-option :value="data.contract.projectID">ant-design@alipay.com</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="招投标分判包编号"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择地区"
            v-model="data.contract.tenderPackageItemID"
            v-decorator="[data.contract.tenderPackageItemID, { rules: [{required: true, message: '请选择城市'}] }]">
            <a-select-option value="1">ant-design@alipay.com</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="合同类型"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择合同类型"
            v-model="data.contract.contractCategory"
            v-decorator="[data.contract.contractCategory, { rules: [{required: true, message: '请选择合同类型'}] }]">
            <a-select-option
              v-for="type in selection.types"
              :value="type.id"
              :key="type.id">{{ type.nameCN }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="密级"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择密级"
            v-model="data.contract.secretLevelID"
            v-decorator="['paymentUser', { rules: [{required: true, message: '请选择密级'}] }]">
            <a-select-option :value="data.contract.secretLevelID">ant-design@alipay.com</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="选择原合同"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择原合同"
            v-model="data.orgContractGuid"
            v-decorator="[data.orgContractGuid, { rules: [{required: true, message: '请选择原合同'}] }]">
            <a-select-option :value="1">ant-design@alipay.com</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="本地合同编号"
        >
          <a-input
            :disabled="type === 'view'"
            placeholder="请填写本地合同编号"
            v-model="data.contract.localContractNo"
            v-decorator="[data.contract.localContractNo, { initialValue: '', rules: [{required: true, message: '请填写本地合同编号'}] }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="合同名称"
        >
          <a-input
            :disabled="type === 'view'"
            placeholder="请填写合同名称"
            v-model="data.contract.contractName"
            v-decorator="[data.contract.contractName, { initialValue: '', rules: [{required: true, message: '请填写合同名称'}] }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="成本预算分类"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择成本预算分类"
            v-model="data.contract.contractType"
            v-decorator="[data.contract.contractType, { rules: [{required: true, message: '请选择成本预算分类'}] }]">
            <a-select-option value="1">工程</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        合同甲方：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="3">
                <a-button :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
                <a-button :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 30%">操作</th>
              <th style="width: 40%">公司名</th>
              <th style="width: 40%">百分比</th>
            </tr>
          </thead>
          <tbody>
            <tr :v-for="item in data.contractPartylst">
              <td>
                <a-button :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </td>
              <td>
                <a-select
                  :disabled="type === 'view'"
                  placeholder="请选择"
                  v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                  <a-select-option value="1">广州永沛房地产开发有限公司</a-select-option>
                </a-select>
              </td>
              <td>
                <a-input-number placeholder="请填写" :disabled="type === 'view'"></a-input-number>
              </td>
            </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        合同乙方：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="2">
                <a-button :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
                <a-button :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 40%">操作</th>
              <th style="width: 60%">公司名</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a-button :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </td>
              <td>
                <a-select
                  :disabled="type === 'view'"
                  placeholder="请选择"
                  v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                  <a-select-option value="1">广州永沛房地产开发有限公司</a-select-option>
                </a-select>
              </td>
            </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        合同其它方：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="2">
                <a-button :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
                <a-button :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 40%">操作</th>
              <th style="width: 60%">公司名</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a-button :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </td>
              <td>
                <a-select
                  :disabled="type === 'view'"
                  placeholder="请选择"
                  v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                  <a-select-option value="1">广州永沛房地产开发有限公司</a-select-option>
                </a-select>
              </td>
            </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="合同主要内容">
          <a-textarea
            :disabled="type === 'view'"
            rows="4"
            placeholder="请输入合同主要内容"
            v-model="data.contract.contractDetails"
            v-decorator="[
              data.contract.contractDetails,
              {rules: [{ required: false, message: '请输入合同主要内容' }]}
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="备注">
          <a-textarea
            :disabled="type === 'view'"
            rows="4"
            placeholder="请输入备注"
            v-model="data.contract.remarks"
            v-decorator="[
              data.contract.remarks,
              {rules: [{ required: false, message: '请输入备注' }]}
            ]"/>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
  import { ContractService } from '@/views/contract/contract.service'

  export default {
    name: 'BaseInfo',
    data () {
      console.log(this.form)
      return {
        selection: {},
        loading: false
      }
    },
    created () {
      ContractService.types().then(res => {
        this.selection.types = res.result.data
      })
      ContractService.masters().then(res => {
        console.log(res)
      })
    },
    props: {
      data: {
        type: Object,
        default: null
      },
      type: {
        type: String,
        default: 'view'
      },
      id: {
        type: String,
        default: '0'
      }
    },
    methods: {
      filterParties (type) {
        return this.data.contractPartylst.filter(item => item.partyType === type)
      }
    }
  }
</script>
<style lang="less" scoped>
  table {
    margin: 15px 0;
    width: 100%;
    border-width: 1px 1px 0 0;
    border-radius: 3px 3px 0 0;
    border-style: solid;
    border-color: #ccc;

    thead {
      tr {
        th {
          background-color: #f5f5f5;
          border-width: 0 0 1px 1px;
          border-style: solid;
          border-color: #ccc;

          button {
            margin-right: 10px;
          }
        }
      }
    }

    tbody {
      tr {
        td {
          padding: 0.5em 0.6em 0.4em 0.6em !important;
          border-width: 0 0 1px 1px;
          border-style: solid;
          border-color: #ccc;

          button {
            margin-right: 10px;
          }
        }
      }
    }
  }
</style>
