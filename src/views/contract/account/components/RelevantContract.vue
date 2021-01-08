<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <a-table
          ref="table"
          size="default"
          rowKey="contractGuid"
          bordered
          :columns="columns"
          :data-source="data.contractlst"
          :alert="false"
          :pagination="false"
          showPagination="auto"
        >
          <span slot="contractAmount" slot-scope="text">
            {{text | NumberFormat}}
          </span>

          <span slot="creationTime" slot-scope="text">
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
            title: '合同编号',
            dataIndex: 'contractNo',
        },
        {
            title: '合同金额',
            dataIndex: 'contractAmount',
            scopedSlots: { customRender: 'contractAmount' }
        },
        {
            title: '申请日期',
            dataIndex: 'creationTime',
            scopedSlots: { customRender: 'creationTime' }
        },
        {
            title: '审批状态',
            dataIndex: 'auditStatus'
        }
    ]

    export default {
        name: 'RelevantContract',
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

<style lang="less" scoped>

</style>