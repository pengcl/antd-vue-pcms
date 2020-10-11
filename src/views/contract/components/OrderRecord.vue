<template>
  <a-form :form="form">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th style="width: 10%">Stage</th>
            <th style="width: 10%">编码</th>
            <th style="width: 10%">CIP编码</th>
            <th style="width: 10%">CIP金额</th>
            <th style="width: 10%">CIP状态</th>
            <th style="width: 10%">PMI编码</th>
            <th style="width: 10%">PMI状态</th>
            <th style="width: 10%">VO编码</th>
            <th style="width: 10%">VO金额</th>
            <th style="width: 10%">VO状态</th>
            <th style="width: 10%">VO编码</th>
          </tr>
          </thead>
          <tbody>
          <tr>
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
        name: 'OrderRecord',
        data () {
            return {
                form: this.$form.createForm(this),
                loading: false
            }
        },
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