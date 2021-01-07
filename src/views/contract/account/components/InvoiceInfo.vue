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
          :data-source="data.billlst"
          :alert="false"
          :pagination="false"
          showPagination="auto"
        >
          <span slot="billAmount" slot-scope="text">
            {{text | NumberFormat}}
          </span>

          <span slot="taxRate" slot-scope="text">
            {{text + '%'}}
          </span>

          <span slot="billDate" slot-scope="text">
            {{text | date}}
          </span>

          <span slot="noTaxAmount" slot-scope="text">
            {{text | NumberFormat}}
          </span>

          <span slot="billFileName" slot-scope="text,record">
            <a :href="record.billFileUrl" target="_blank">{{text}}</a>
          </span>

        </a-table>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
    const columns = [
        {
            title: '票据类型',
            dataIndex: 'billType',
        },
        {
            title: '编号',
            dataIndex: 'billNum',
        },
        {
            title: '发票金额',
            dataIndex: 'billAmount',
            scopedSlots: { customRender: 'billAmount' }
        },
        {
            title: '税率',
            dataIndex: 'taxRate',
            scopedSlots: { customRender: 'taxRate' }
        },
        {
            title: '不含税金额',
            dataIndex: 'noTaxAmount',
            scopedSlots: { customRender: 'noTaxAmount' }
        },
        {
            title: '发票日期',
            dataIndex: 'billDate',
            scopedSlots: { customRender: 'billDate' }
        },
        {
            title: '发票附件',
            dataIndex: 'billFileName',
            scopedSlots: { customRender: 'billFileName' }
        },
        {
            title: '备注',
            dataIndex: 'remark',
        },
    ]

    export default {
        name: 'InvoiceInfo',
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