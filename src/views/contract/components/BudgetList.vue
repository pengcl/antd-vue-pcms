<template>
  <a-form :form="form">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th style="width: 10%">科目</th>
            <th style="width: 10%">行业</th>
            <th style="width: 10%">业态</th>
            <th style="width: 10%">预算余额(a)</th>
            <th style="width: 10%">行业预算(b)</th>
            <th style="width: 10%">合同金额(c)</th>
            <th style="width: 10%">定标盈余(d)</th>
            <th style="width: 10%">预计变更(e)</th>
            <th style="width: 10%">差额(f)</th>
            <th style="width: 10%">调动预算余额(g)</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
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
        name: 'BudgetList',
        data () {
            return {
                form: this.$form.createForm(this),
                loading: false
            }
        },
        props: {}
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
