<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="12" :sm="24">
        <a-form-item
          label="保修金/保固金/保留金条款类型"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择"
            v-model="data.retentionAndTermsType"
            v-decorator="['paymentUser', { rules: [{required: true, message: ' 请输入保修金/保固金/保留金条款类型\n'}] }]">
            <a-select-option v-for="option in selection.retentionTypes" :key="option.id" :value="option.id">{{
              option.nameCN }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="3">
                <a-button @click="add()" :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
                <a-button @click="clear()" :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 30%">操作</th>
              <th style="width: 40%">描述</th>
              <th style="width: 40%">累计百分比</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!item.isDeleted" v-for="(item,index) in data.contractPaymentTermslst" :key="index">
              <td>
                <a-button @click="del(index)" :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </td>
              <td>
                <a-input v-model="item.description"></a-input>
              </td>
              <td>
                <a-input-number v-model="item.percentage" :min="0" :max="getMax(index)"></a-input-number>
              </td>
            </tr>
          </tbody>
        </table>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
  import { Base as BaseService } from '@/api/base'

  export default {
    name: 'PayInfo',
    data () {
      return {
        selection: {},
        loading: false
      }
    },
    created () {
      BaseService.retentionTypes().then(res => {
        this.selection.retentionTypes = res.result.data
        this.$forceUpdate()
      })
    },
    methods: {
      getMax (index) {
        let max = 100
        this.data.contractPaymentTermslst.forEach((item, i) => {
          if (index !== i) {
            max = max - item.percentage
          }
        })
        console.log(max)
        return max
      },
      add () {
        const item = {
          isTemp: true,
          contractID: this.id,
          description: '',
          id: 0,
          isDeleted: false,
          paymentTermsGuid: '',
          percentage: 0
        }
        this.data.contractPaymentTermslst.push(item)
        this.$forceUpdate()
      },
      del (index) {
        const item = this.data.contractPaymentTermslst[index]
        if (item.isTemp) {
          this.data.contractPaymentTermslst.splice(index, 1)
        } else {
          item.isDeleted = true
        }
        this.$forceUpdate()
      },
      clear (items) {
        items.forEach(item => {
          item.isDeleted = true
        })
        this.$forceUpdate()
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
        &:first-child {
          th {
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
