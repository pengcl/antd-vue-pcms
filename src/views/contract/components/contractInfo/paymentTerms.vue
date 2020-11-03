<template>
  <div>
    <a-col :md="24" :sm="24">
      调差补偿：
    </a-col>
    <a-col :md="24" :sm="24">
      <table>
        <thead>
          <tr>
            <th colspan="5">
              <a-button @click="add()" :disabled="type === 'view'" icon="plus">
                新增
              </a-button>
              <a-button @click="clear()" :disabled="type === 'view'" icon="stop">
                重置
              </a-button>
            </th>
          </tr>
          <tr>
            <th style="width: 20%">操作</th>
            <th style="width: 20%">描述</th>
            <th style="width: 20%">调差上下限额条款</th>
            <th style="width: 20%">调差上下限额</th>
            <th style="width: 20%">调差时间節點</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!item.isDeleted" v-for="(item, index) in data.contractFluctuationClauselst" :key="index">
            <td>
              <a-button @click="del(index)" :disabled="type === 'view'" icon="close">
                删除
              </a-button>
            </td>
            <td>
              <a-input :disabled="type === 'view'" v-model="item.fluctuationName"></a-input>
            </td>
            <td>
              <a-input :disabled="type === 'view'" v-model="item.adjustableRangeTerm"></a-input>
            </td>
            <td>
              <a-input-number :disabled="type === 'view'" v-model="item.adjustableRange"></a-input-number>
            </td>
            <td>
              <a-input-number :disabled="type === 'view'" v-model="item.adjustmentInterval"></a-input-number>
            </td>
          </tr>
        </tbody>
      </table>
    </a-col>
  </div>
</template>
<script>
  import { addItem, clearItems, removeItem } from '@/api/base'
  import { SwaggerService } from '@/api/swagger.service'

  export default {
    name: 'ContractInfoPaymentTerms',
    data () {
      return {
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
        const item = SwaggerService.getForm('ContractFluctuationClauseDto')
        item.id = 0
        item.contractID = this.id === '0' ? '' : this.id
        addItem(item, this.data.contractFluctuationClauselst)
      },
      del (index) {
        const items = this.data.contractFluctuationClauselst
        removeItem(index, items)
      },
      clear () {
        clearItems(this.data.contractFluctuationClauselst)
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
