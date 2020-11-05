<template>
  <page-header-wrapper :title="type === 'view' ? '查看合同付款' : type === 'update' ? '编辑合同付款' : '新增合同付款'">
    <a-card :bordered="false">
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="项目名称">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="付款单位">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="申请部门">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="申请人">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="付款类型">
              <a-select>
                <a-select-option></a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="申请日期">
              <a-date-picker style="width: 100%"></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="付款说明">
              <a-textarea></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="付款凭证">
              <a-select>
                <a-select-option></a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="申请付款金额">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;text-decoration: underline">支付明细</a-col>
          <payment-info></payment-info>
          <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;text-decoration: underline">预算列表</a-col>
          <budget-list></budget-list>
          <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;text-decoration: underline">发票管理</a-col>
          <bill-list></bill-list>
          <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;text-decoration: underline">附件管理</a-col>
          <attachment-list></attachment-list>
        </a-row>
      </a-form>

      <a-row :gutter="48">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group>
            <a-button :disabled="type === 'view'" @click="approve()" type="success">
              启动审批流程
            </a-button>
          </a-button-group>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-button-group v-if="type !== 'view'">
            <a-button @click="save" type="success">
              储存
            </a-button>
          </a-button-group>
          <a-button-group>
            <a-button @click="back" type="danger">
              关闭
            </a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>

    import PaymentInfo from '@/views/pay/unsigned/components/PaymentInfo'
    import BudgetList from '@/views/pay/unsigned/components/BudgetList'
    import BillList from '@/views/pay/unsigned/components/BillList'
    import AttachmentList from '@/views/pay/unsigned/components/AttachmentList'
    export default {
        name: 'Item',
        components: { AttachmentList, BillList, BudgetList, PaymentInfo },
        data () {
            return {
                selection: {},
                loading: false,
            }
        },
        watch: {
            /*'data.masterID' (value) {
                console.log(value)
            }*/
        },
        created () {

        },
        props: {
            data: {
                type: Object,
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
        },
        methods: {}
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
