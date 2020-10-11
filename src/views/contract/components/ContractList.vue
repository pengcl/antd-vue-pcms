<template>
  <a-form :form="form">
    <a-row :gutter="48">
      <a-col :md="12" :sm="24">
        <a-button type="success">按编码排序</a-button>
        <a-button type="success" style="margin-left: 5px">恢复原来排序</a-button>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-button type="success" style="float: right">导入导出</a-button>
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th style="width: 5%" rowspan="2">清单编号</th>
            <th style="width: 5%" rowspan="2">标段</th>
            <th style="width: 5%" rowspan="2">楼栋</th>
            <th style="width: 5%" rowspan="2">分部</th>
            <th style="width: 5%" rowspan="2">分项</th>
            <th style="width: 5%" rowspan="2">预留字段0</th>
            <th style="width: 5%" rowspan="2">预留字段1</th>
            <th style="width: 5%" rowspan="2">清单描述</th>
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
        name: 'ContractList',
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
