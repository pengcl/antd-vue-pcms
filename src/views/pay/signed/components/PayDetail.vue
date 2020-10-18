<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <a-form-item label="合同名称">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="合同编号">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="合约价">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="同意更改后的合约价">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="预计结算金额">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="8">已支付款项明细</th>
            </tr>
            <tr>
              <th>期数</th>
              <th>截至最后已批准银价</th>
              <th>该次施工单位申请银价</th>
              <th>该次批准银价</th>
              <th>累计共批银价</th>
              <th>共批准百分比(%)</th>
              <th>累计共支付银价</th>
              <th>共支付百分比(%)</th>
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
            </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th>承包单位送单时间</th>
            <th>现场确认时间</th>
            <th>出估值时间</th>
            <th>项目审定时间</th>
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
        name: 'PayDetail'
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