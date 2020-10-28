<template>
  <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        流程资料
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="流程编号"></a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="状态"></a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        流程路径
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th style="width: 10%">起草人</th>
            <th style="width: 10%">发起人</th>
            <th style="width: 10%">自选覆核人 1</th>
            <th style="width: 10%">自选覆核人 2</th>
            <th style="width: 10%">覆核人 1</th>
            <th style="width: 10%">覆核人 2</th>
            <th style="width: 10%">覆核人 3</th>
            <th style="width: 10%">覆核人 4</th>
            <th style="width: 10%">覆核人 5</th>
            <th style="width: 10%">审批人 1</th>
            <th style="width: 10%">审批人 2</th>
            <th style="width: 10%">审批人 3</th>
            <th style="width: 10%">审批人 4</th>
            <th style="width: 10%">审批人 5</th>
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
      <a-col :md="24" :sm="24">
        审批记录
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th style="width: 10%">#</th>
            <th style="width: 10%">开始时间</th>
            <th style="width: 10%">完成时间</th>
            <th style="width: 10%">经办人</th>
            <th style="width: 10%">步骤</th>
            <th style="width: 10%">状况</th>
            <th style="width: 10%">用时(天)</th>
            <th style="width: 10%">标准天数</th>
            <th style="width: 10%">用时偏差(天)</th>
            <th style="width: 10%">意见 / 补充备注</th>
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
        name: 'Process',
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