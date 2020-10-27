<template>
  <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th colspan="23">
              <a-button :disabled="type === 'view'" icon="plus">
                新增
              </a-button>
              <a-button :disabled="type === 'view'">
                按原合同条款
              </a-button>
            </th>
          </tr>
          <tr>
            <th style="width: 5%" rowspan="2">清单编号</th>
            <th style="width: 5%" rowspan="2">标段</th>
            <th style="width: 5%" rowspan="2">楼栋</th>
            <th style="width: 5%" rowspan="2">分部</th>
            <th style="width: 5%" rowspan="2">分项</th>
            <th style="width: 5%" rowspan="2">预留字段0</th>
            <th style="width: 5%" rowspan="2">预留字段1</th>
            <th style="width: 5%" rowspan="2">变更原因描述</th>
            <th style="width: 5%" rowspan="2">业态成本中心</th>
            <th style="width: 5%" rowspan="2">清单项类别</th>
            <th style="width: 15%" colspan="4">供应</th>
            <th style="width: 15%" colspan="4">安装</th>
            <th style="width: 15%" colspan="4">供应+安装</th>
            <th style="width: 5%" rowspan="2">合计</th>
          </tr>
          <tr>
            <th>单位</th>
            <th>工程量</th>
            <th>单价</th>
            <th>小计</th>
            <th>单位</th>
            <th>工程量</th>
            <th>单价</th>
            <th>小计</th>
            <th>单位</th>
            <th>工程量</th>
            <th>单价</th>
            <th>小计</th>
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
        name: 'CostEstimates'
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