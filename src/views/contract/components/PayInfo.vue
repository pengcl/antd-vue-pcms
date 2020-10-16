<template>
  <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="12" :sm="24">
        <a-form-item
          label="保修金/保固金/保留金条款类型"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择"
            v-decorator="['paymentUser', { rules: [{required: true, message: ' 请输入保修金/保固金/保留金条款类型\n'}] }]">
            <a-select-option value="1">自定付款</a-select-option>
            <a-select-option value="2">分段付款</a-select-option>
          </a-select>
        </a-form-item>
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
              <th style="width: 40%">描述</th>
              <th style="width: 40%">累计百分比</th>
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
                <a-input></a-input>
              </td>
              <td>
                <a-input-number></a-input-number>
              </td>
            </tr>
          </tbody>
        </table>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
    export default {
        name: 'PayInfo',
        data () {
            return {
                form: this.$form.createForm(this),
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
