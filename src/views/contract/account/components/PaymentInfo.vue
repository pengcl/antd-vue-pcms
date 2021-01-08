<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <a-table
          ref="table"
          size="default"
          rowKey="gid"
          bordered
          :columns="columns"
          :data-source="data.paymentlst"
          :alert="false"
          :pagination="false"
          showPagination="auto"
        >
          <span slot="paymentRequestAmount" slot-scope="text">
            {{text | NumberFormat}}
          </span>

          <span slot="creationTime" slot-scope="text">
            {{text | date}}
          </span>

          <span slot="paymentAmount" slot-scope="text">
            {{text | NumberFormat}}
          </span>

          <span slot="auditTime" slot-scope="text">
            {{text | date}}
          </span>

        </a-table>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
    const columns = [
        {
            title: '期数',
            dataIndex: 'paymentPhase',
        },
        {
            title: '申请日期',
            dataIndex: 'creationTime',
            scopedSlots: { customRender: 'creationTime' }
        },
        {
            title: '付款单号',
            dataIndex: 'paymentCode',
        },
        {
            title: '申请批准金额',
            dataIndex: 'paymentRequestAmount',
            scopedSlots: { customRender: 'paymentRequestAmount' }
        },
        {
            title: '支付金额',
            dataIndex: 'paymentAmount',
            scopedSlots: { customRender: 'paymentAmount' }
        },
        {
            title: '支付日期',
            dataIndex: 'auditTime',
            scopedSlots: { customRender: 'auditTime' }
        },
        {
            title: '付款状态',
            dataIndex: 'auditStatus',
        },
    ]

    export default {
        name: 'PaymentInfo',
        data () {
            this.columns = columns
            return {}
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
    }
</script>

<style scoped>

</style>