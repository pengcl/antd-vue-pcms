<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="7">合同信息</th>
            </tr>
            <tr>
              <th style="width: 20%">合同编号</th>
              <th style="width: 20%">合同名称</th>
              <th style="width: 20%">审核状态</th>
              <th style="width: 20%">签约日期</th>
              <th style="width: 10%">币种</th>
              <th style="width: 10%">合同金额</th>
              <th style="width: 10%">结算状态</th>
            </tr>
          </thead>
          <!--
          auditStatus: "已审核"
contractAmount: 12
contractName: "测试补充合同"
contractNo: "C-CGZU07-[2020]PD合0001号（补7）"
currencyID: 3
id: 26
signDate: "2020-10-10T06:21:29.682"
          -->
          <tbody>
            <tr v-for="(item,index) in items" :key="index">
              <td>{{item.contractNo}}</td>
              <td>{{item.contractName}}</td>
              <td>{{item.auditStatus}}</td>
              <td>{{item.signDate | moment}}</td>
              <td>{{item.currencyID}}</td>
              <td>{{item.contractAmount}}</td>
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
  name: 'ContractInfo',
  props: {
    items: {
      type: Array,
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
