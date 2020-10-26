<template>
  <div>
    <a-col :md="24" :sm="24">
      保险：
    </a-col>
    <a-col :md="24" :sm="24">
      <table>
        <thead>
          <tr>
            <th colspan="8">
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
          <tr for>
            <td>
              <a-button :disabled="type === 'view'" icon="close">
                删除
              </a-button>
            </td>
            <td>
              <a-input-number></a-input-number>
            </td>
            <td>
              <a-select
                placeholder="请选择"
                v-decorator="['paymentUser', { rules: [{required: true, message: '请选择'}] }]">
                <a-select-option value="1">承建商工程全险</a-select-option>
                <a-select-option value="2">第三者保险</a-select-option>
              </a-select>
            </td>
            <td>
              <a-input></a-input>
            </td>
            <td>
              <a-select
                placeholder="请选择"
                v-decorator="['paymentUser', { rules: [{required: true, message: '请选择'}] }]">
                <a-select-option value="1">已提交</a-select-option>
                <a-select-option value="2">未提交</a-select-option>
              </a-select>
            </td>
            <td>
              <a-date-picker></a-date-picker>
            </td>
            <td>
              <a-date-picker></a-date-picker>
            </td>
            <td>
              <a-select
                placeholder="请选择"
                v-decorator="['paymentUser', { rules: [{required: true, message: '请选择'}] }]">
                <a-select-option value="1">已提交</a-select-option>
                <a-select-option value="2">未提交</a-select-option>
              </a-select>
            </td>
          </tr>
        </tbody>
      </table>
    </a-col>
  </div>
</template>
<script>
  export default {
    name: 'ContractInfoInsurance',
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
