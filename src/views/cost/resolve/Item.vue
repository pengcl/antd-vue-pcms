<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
            <a-col :md="12" :sm="24">
                <a-form-item label="项目">
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                    <a-select-option value="1">广佛新世界第一期</a-select-option>
                  </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
          <a-col :md="12" :sm="24">
            工程行业预算
            <a-button type="success" style="margin-left: 20px">审批记录</a-button>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-checkbox>Budget Re-allocation</a-checkbox>
          </a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
              <tr>
                <th style="width: 20%" rowspan="2"></th>
                <th style="width: 20%" rowspan="2">行业名称</th>
                <th style="width: 20%" rowspan="2">行业名称</th>
                <th style="width: 20%">居酒屋 (SS2) 商业 出租</th>
                <th style="width: 20%">垃圾站 (CD) 商业 出租</th>
              </tr>
              <tr>
                <th>Budget Value</th>
                <th>Budget Value</th>
              </tr>
              </thead>
              <tbody>
              <tr>
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
    </a-card>
  </page-header-wrapper>
</template>

<script>
    export default {
        name: 'Item'
    }
</script>

<style  lang="less" scoped>
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