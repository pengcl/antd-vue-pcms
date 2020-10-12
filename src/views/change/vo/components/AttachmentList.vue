<template>
  <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th colspan="5">
              <a-upload
              >
                <a-button>请选择</a-button>
              </a-upload>
            </th>
          </tr>
          <tr>
            <th style="width: 20%">操作</th>
            <th style="width: 20%">附件</th>
            <th style="width: 20%">附件类型</th>
            <th style="width: 20%">附件页数</th>
            <th style="width: 20%">最后修改日期</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              <a-button type="danger" icon="delete"></a-button>
            </td>
            <td></td>
            <td>
              <a-select
                placeholder="请选择"
                v-decorator="['paymentUser', { rules: [{required: true, message: '请选择'}] }]">
                <a-select-option value="1">指令附件</a-select-option>
                <a-select-option value="2">审批附件</a-select-option>
              </a-select>
            </td>
            <td></td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
    export default {
        name: 'AttachmentList',
        data () {
            return {
                form: this.$form.createForm(this),
                loading: false
            }
        },
        props: {

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
