<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th colspan="4">银行信息</th>
          </tr>
          <tr>
            <th style="width: 25%">开户银行</th>
            <th style="width: 25%">银行账号</th>
            <th style="width: 25%">银行地址</th>
            <th style="width: 25%">备注</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td></td>
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
        name: 'BankInfo'
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