<template>
  <div>
    <a-col :md="24" :sm="24">
      履约保函：
    </a-col>
    <a-col :md="24" :sm="24">
      <div style="overflow-x: auto">
        <table style="min-width: 100%;width: auto">
          <thead>
            <tr>
              <th colspan="14">
                <a-button :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
                <a-button :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 5%">操作</th>
              <th style="width: 5%">单位</th>
              <th style="width: 5%">数量</th>
              <th style="width: 5%">单价</th>
              <th style="width: 5%">履约保函金额</th>
              <th style="width: 5%">履约保函金额条款</th>
              <th style="width: 5%">描述</th>
              <th style="width: 5%">履约保函提供状态</th>
              <th style="width: 10%">履约保函提交限期</th>
              <th style="width: 10%">履约保函提交限期条款</th>
              <th style="width: 10%">履约保函届满日期</th>
              <th style="width: 10%">履约保函延长届满日期</th>
              <th style="width: 10%">履约保函届满日期条款</th>
              <th style="width: 10%">延长履约保函提供状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data.contractBondlst" :key="index">
              <td>
                <a-button :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </td>
              <td>
                <a-select
                  placeholder="请选择"
                  v-model="item.bondUnit"
                  v-decorator="['item.bondUnit', { rules: [{required: true, message: '请选择'}] }]">
                  <a-select-option v-for="(item, index) in selection.unitTypes" :key="index" :value="item.id">{{ item.nameCN }}
                  </a-select-option>
                </a-select>
              </td>
              <td>
                <a-input-number v-model="item.bondQty" :min="0"></a-input-number>
              </td>
              <td>
                <a-input-number v-model="item.bondUnitPrice"></a-input-number>
              </td>
              <td>
                <a-input-number v-model="item.bondAmount"></a-input-number>
              </td>
              <td>
                <a-input v-model="item.bondAmountTerms"></a-input>
              </td>
              <td>
                <a-input v-model="item.description"></a-input>
              </td>
              <td>
                <a-select
                  placeholder="请选择"
                  v-model="item.bondStatus"
                  v-decorator="['item.bondStatus', { rules: [{required: true, message: '请选择'}] }]">
                  <a-select-option :value="1">已提交</a-select-option>
                  <a-select-option :value="0">未提交</a-select-option>
                </a-select>
              </td>
              <td>
                <a-input-number v-model="item.bondGracePeriod"></a-input-number>
              </td>
              <td>
                <a-input v-model="item.bondGracePeriodTerms"></a-input>
              </td>
              <td>
                <a-date-picker v-model="item.bondExpirationDate"></a-date-picker>
              </td>
              <td>
                <a-date-picker v-model="item.bondExtendedExpirationDate"></a-date-picker>
              </td>
              <td>
                <a-input v-model="item.bondExpirationDateTerms"></a-input>
              </td>
              <td>
                <a-select
                  placeholder="请选择"
                  v-model="item.bondExtensionStatus"
                  v-decorator="['item.bondExtensionStatus', { rules: [{required: true, message: '请选择'}] }]">
                  <a-select-option :value="1">已审批</a-select-option>
                  <a-select-option :value="0">已拒绝</a-select-option>
                </a-select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </a-col>
    <a-col :md="24" :sm="24">
      <a-form-item
        label="履约保函总额">
        <a-input-number :disabled="true" :value="total"></a-input-number>
      </a-form-item>
    </a-col>
  </div>
</template>
<script>
  import { Base as BaseService } from '@/api/base'
  export default {
    name: 'ContractInfoBond',
    data () {
      return {
        total: 0,
        selection: {},
        loading: false
      }
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
    created () {
      BaseService.unitTypes().then(res => {
        this.selection.unitTypes = res.result.data
        this.$forceUpdate()
      })
      let total = 0
      this.data.contractBondlst.forEach(item => {
        total = total + (item.bondQty * item.bondUnitPrice)
      })
      this.total = total
    },
    methods: {
      add (target) {
        const item = {
          id: 0,
          isDeleted: false,
          retentionGuid: 0,
          contractID: this.id,
          description: '',
          percentage: ''
        }
        this.data[target].push(item)
      },
      del (item) {
        item.isDisabled = true
      },
      clear (target) {
        this.data[target].forEach(item => {
          item.isDisabled = true
        })
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
        &:first-child{
          th{
            background-color: #f5f5f5;
          }
        }
        th {
          background-color: #06c;
          color: #fff;
          font-weight: normal;
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
