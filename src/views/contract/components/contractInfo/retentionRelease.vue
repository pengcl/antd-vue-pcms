<template>
  <div>
    <a-col :md="24" :sm="24">
      保修金/保固金/保留金返还：
    </a-col>
    <a-col :md="24" :sm="24">
      <table>
        <thead>
          <tr>
            <th colspan="4">
              <a-button @click="add('contractRetentionReleaselst')" :disabled="type === 'view'" icon="plus">
                新增
              </a-button>
              <a-button @click="clear('contractRetentionReleaselst')" :disabled="type === 'view'" icon="stop">
                重置
              </a-button>
            </th>
          </tr>
          <tr>
            <th style="width: 20%">操作</th>
            <th style="width: 20%">描述</th>
            <th style="width: 30%">保修金/保固金/保留金返还条款</th>
            <th style="width: 30%">保修金/保固金/保留金比率</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!item.isDeleted" v-for="(item,index) in data.contractRetentionReleaselst" :key="index">
            <td>
              <a-button @click="del(index)" :disabled="type === 'view'" icon="close">
                删除
              </a-button>
            </td>
            <td>
              <a-input :disabled="type === 'view'" v-model="item.description"></a-input>
            </td>
            <td>
              <a-input :disabled="type === 'view'" v-model="item.releaseTerms"></a-input>
            </td>
            <td>
              <a-input-number :disabled="type === 'view'" v-model="item.percentage" :min="0"></a-input-number>
            </td>
          </tr>
        </tbody>
      </table>
    </a-col>
  </div>
</template>
<script>
  import { addItem, removeItem, clearItems } from '@/api/base'
  export default {
    name: 'ContractInfoRetentionRelease',
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
        const item = {
          id: 0,
          retentionGuid: '',
          contractID: this.id === '0' ? '' : this.id,
          description: '',
          percentage: ''
        }
        addItem(item, this.data.contractRetentionReleaselst)
      },
      del (index) {
        const items = this.data.contractRetentionReleaselst
        removeItem(index, items)
      },
      clear () {
        clearItems(this.data.contractRetentionReleaselst)
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
