<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="招投标包编号">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="日期">
              <a-date-picker></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="工程名称">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="说明">
              <a-checkbox-group>
                <a-checkbox>分期</a-checkbox>
                <a-checkbox>阶段</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="金额">
              <a-input placeholder="汇总明细项金额"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
              <tr>
                <th colspan="5">
                  <a-button :disabled="type === 'view'" icon="plus" type="success">
                    新增行业分判包
                  </a-button>
                </th>
              </tr>
              <tr>
                <th style="width: 20%">操作</th>
                <th style="width: 20%">行业分判包编号</th>
                <th style="width: 20%">描述</th>
                <th style="width: 20%">范围</th>
                <th style="width: 20%">金额</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>
                  <a-button :disabled="type === 'view'" icon="delete" type="danger"></a-button>
                </td>
                <td>
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                    <a-select-option value="1">广州永沛房地产开发有限公司</a-select-option>
                  </a-select>
                </td>
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
                <th colspan="5">
                  <a-button :disabled="type === 'view'" icon="plus" type="success">
                    招投标计划
                  </a-button>
                </th>
              </tr>
              <tr>
                <th style="width: 20%">工作项</th>
                <th style="width: 20%">计划开始时间</th>
                <th style="width: 20%">计划完成时间</th>
                <th style="width: 20%">实际完成时间</th>
                <th style="width: 20%">备注</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>
                  <a-button :disabled="type === 'view'" icon="delete" type="danger"></a-button>
                </td>
                <td>
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                    <a-select-option value="1">广州永沛房地产开发有限公司</a-select-option>
                  </a-select>
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              </tbody>
            </table>
          </a-col>
        </a-row>
      </a-form>

      <footer-tool-bar>
        <a-button-group disabled>
          <a-button :disabled="type === 'view'" @click="approve()" type="success">
            启动审批流程
          </a-button>
        </a-button-group>
        <a-button-group>
          <a-button :disabled="type === 'view'" @click="handleToEdit()" type="success">
            储存
          </a-button>
        </a-button-group>
        <a-button-group>
          <a-button @click="back()" type="danger">
            关闭
          </a-button>
        </a-button-group>
      </footer-tool-bar>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import { FooterToolBar } from '@/components'

    export default {
        name: 'Edit',
        components: { FooterToolBar }
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
  .ant-btn-group {
    margin-right: 8px;
  }
</style>