<template>
  <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th colspan="4">
              <a-upload
              >
                <a-button>请选择</a-button>
              </a-upload>
            </th>
          </tr>
          <tr>
            <th style="width: 25%">操作</th>
            <th style="width: 25%">附件</th>
            <th style="width: 25%">备注</th>
            <th style="width: 25%">最后修改日期</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              <a-button type="danger" icon="delete"></a-button>
            </td>
            <td></td>
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
