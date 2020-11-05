<template>
  <div>
    <a-col :md="24" :sm="24">
      保险：
    </a-col>
    <a-col :md="24" :sm="24">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th colspan="8">
                <a-button @click="add()" :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
                <a-button @click="clear()" :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 10%">操作</th>
              <th style="width: 10%">保险金额</th>
              <th style="width: 10%">保险类型</th>
              <th style="width: 10%">保险条款</th>
              <th style="width: 10%">保险信函状态</th>
              <th style="width: 10%">保险到期日</th>
              <th style="width: 20%">延长工程综合保险有效日期</th>
              <th style="width: 20%">保险延期状况</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!item.isDeleted" v-for="(item, index) in data.contractInsuarancelst" :key="index">
              <td>
                <a-button @click="del(index)" :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </td>
              <td>
                <a-input-number
                  :disabled="type === 'view'"
                  v-model="item.insuranceAmount"
                  :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                  :precision="2"></a-input-number>
              </td>
              <td>
                <a-select
                  :disabled="type === 'view'"
                  placeholder="请选择"
                  v-model="item.insuranceType"
                  v-decorator="['item.insuranceType', { rules: [{required: true, message: '请选择'}] }]">
                  <a-select-option :value="1">承建商工程全险</a-select-option>
                  <a-select-option :value="2">第三者保险</a-select-option>
                </a-select>
              </td>
              <!-- todo:保险类别 -->
              <td>
                <a-input :disabled="type === 'view'" v-model="item.insuranceTerms"></a-input>
              </td>
              <td>
                <a-select
                  :disabled="type === 'view'"
                  placeholder="请选择"
                  v-model="item.insuranceStatus"
                  v-decorator="['paymentUser', { rules: [{required: true, message: '请选择'}] }]">
                  <a-select-option :value="1">已提交</a-select-option>
                  <a-select-option :value="0">未提交</a-select-option>
                </a-select>
              </td>
              <td>
                <a-date-picker :disabled="type === 'view'" :format="dateFormat" v-model="item.insuranceExpirationDate"></a-date-picker>
              </td>
              <td>
                <a-date-picker :disabled="type === 'view'" :format="dateFormat" v-model="item.insuranceExtendedExpirationDate"></a-date-picker>
              </td>
              <td>
                <a-select
                  :disabled="type === 'view'"
                  placeholder="请选择"
                  v-model="item.insuranceExtensionStatus"
                  v-decorator="['paymentUser', { rules: [{required: true, message: '请选择'}] }]">
                  <a-select-option :value="1">已提交</a-select-option>
                  <a-select-option :value="0">未提交</a-select-option>
                </a-select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </a-col>
  </div>
</template>
<script>
  import { addItem, clearItems, removeItem, dateFormat } from '@/api/base'
  import { SwaggerService } from '@/api/swagger.service'

  export default {
    name: 'ContractInfoInsurance',
    data () {
      return {
        dateFormat,
        date: null,
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
    methods: {
      add () {
        const item = SwaggerService.getForm('ContractInsuaranceDto')
        item.id = 0
        item.contractID = this.id === '0' ? '' : this.id
        addItem(item, this.data.contractInsuarancelst)
      },
      del (index) {
        const items = this.data.contractInsuarancelst
        removeItem(index, items)
      },
      clear () {
        clearItems(this.data.contractInsuarancelst)
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
