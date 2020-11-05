<template>
  <div>
    <a-col :md="24" :sm="24">
      <table>
        <thead>
        <tr>
          <th colspan="7">
            <a-button icon="plus" @click="add('detailList')">
              新增
            </a-button>
          </th>
        </tr>
        <tr>
          <th>操作</th>
          <th>款项类型</th>
          <th>款项用途</th>
          <th>本期支付金额</th>
          <th>收款单位</th>
          <th>开户银行</th>
          <th>账号</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            <a-button @click="del(index)" :disabled="type === 'view'" icon="close">
              删除
            </a-button>
          </td>
          <td>

          </td>
          <td>

          </td>
          <td>

          </td>
          <td>

          </td>
          <td>

          </td>
          <td>

          </td>
        </tr>
        <tr>
          <td colspan="3">合计</td>
          <td colspan="4">合计金额</td>
        </tr>
        </tbody>
      </table>
    </a-col>
  </div>
</template>

<script>
    export default {
        name: 'PaymentInfo'
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
        &:first-child {
          th {
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