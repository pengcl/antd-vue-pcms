<template>
  <div>
    <a-col :md="24" :sm="24">
      预付款：
    </a-col>
    <a-col :md="24" :sm="24">
      <table>
        <thead>
          <tr>
            <th colspan="10">
              <a-button :disabled="type === 'view'" icon="plus">
                新增
              </a-button>
              <a-button :disabled="type === 'view'" icon="stop">
                重置
              </a-button>
            </th>
          </tr>
          <tr>
            <th style="width: 10%">操作</th>
            <th style="width: 10%">描述</th>
            <th style="width: 10%">预付款条款</th>
            <th style="width: 10%">预付款回扣条款</th>
            <th style="width: 10%">百分比</th>
            <th style="width: 10%">有预付款履约保函</th>
            <th style="width: 10%">单位</th>
            <th style="width: 10%">数量</th>
            <th style="width: 10%">单价</th>
            <th style="width: 10%">总金额</th>
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
              <a-input :disabled="type === 'view'"></a-input>
            </td>
            <td>
              <a-input :disabled="type === 'view'"></a-input>
            </td>
            <td>
              <a-input :disabled="type === 'view'"></a-input>
            </td>
            <td>
              <a-input-number
                :disabled="type === 'view'"
                :min="0"
                :max="100"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"></a-input-number>
            </td>
            <td>
              <a-select
                :disabled="type === 'view'"
                placeholder="请选择">
                <a-select-option :key="1" :value="1">是</a-select-option>
                <a-select-option :key="0" :value="0">否</a-select-option>
              </a-select>
            </td>
            <td>
              <a-select
                :disabled="type === 'view'"
                placeholder="请选择"
                v-decorator="['item.bondUnit', { rules: [{required: true, message: '请选择'}] }]">
                <a-select-option v-for="(item, index) in selection.unitTypes" :key="index" :value="item.id">{{ item.nameCN }}
                </a-select-option>
              </a-select>
            </td>
            <td>
              <a-input-number :disabled="type === 'view'"></a-input-number>
            </td>
            <td>
              <a-input-number
                :disabled="type === 'view'"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\\s?|(,*)/g, '')"
                :precision="2"></a-input-number>
            </td>
            <td>
              <a-input-number
                :disabled="type === 'view'"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\\s?|(,*)/g, '')"
                :precision="2"></a-input-number>
            </td>
          </tr>
        </tbody>
      </table>
    </a-col>
    <a-col :md="24" :sm="24">
      <a-form-item
        label="预付款总额">
        <a-input-number
          :disabled="type === 'view'"
          :min="0"
          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="value => value.replace(/\\s?|(,*)/g, '')"
          :precision="2"></a-input-number>
      </a-form-item>
    </a-col>
  </div>
</template>
<script>
  import { Base as BaseService } from '@/api/base'

  export default {
    name: 'ContractInfoAdvanceCharge',
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
    created () {
      BaseService.unitTypes().then(res => {
        this.selection.unitTypes = res.result.data
        this.$forceUpdate()
      })
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
