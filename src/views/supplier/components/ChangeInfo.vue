<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="7">变更信息</th>
            </tr>
            <tr>
              <th style="width: 10%">审核状态</th>
              <th style="width: 10%">供应商名称</th>
              <th style="width: 10%">变更类型</th>
              <th style="width: 14%">操作人</th>
              <th style="width: 14%">操作时间</th>
              <th style="width: 14%">变更备注</th>
              <th style="width: 14%">审批时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in items" :key="index">
              <td>{{ item.auditStatus }}</td>
              <td>{{ item.vendorName }}</td>
              <td>{{ item.logType }}</td>
              <td>{{ item.logByName }}</td>
              <td>{{ item.logDate }}</td>
              <td>{{ item.logRemark }}</td>
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
  name: 'ChangeInfo',
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
