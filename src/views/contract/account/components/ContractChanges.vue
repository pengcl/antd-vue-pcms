<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <a-table
          ref="table"
          size="default"
          rowKey="id"
          bordered
          :columns="columns"
          :data-source="data"
          :alert="false"
          :pagination="false"
          showPagination="auto"
        >
          <span slot="cipAmount" slot-scope="text">
            {{text | NumberFormat}}
          </span>

          <span slot="voNo" slot-scope="text,record">
            <a @click="handToCip(record.cipGuid)">{{text}}</a>
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
            title: '审核状态',
            dataIndex: 'auditStatus',
        },
        {
            title: '变更编号',
            dataIndex: 'voNo',
            scopedSlots: { customRender: 'voNo' }
        },
        {
            title: '申请金额',
            dataIndex: 'cipAmount',
            scopedSlots: { customRender: 'cipAmount' }
        },
        {
            title: '申请日期',
            dataIndex: 'createTime',
            scopedSlots: { customRender: 'createTime' }
        },
        {
            title: '变更类型',
            dataIndex: 'voType',
        },
        {
            title: '变更确认',
            dataIndex: 'voStatus',
        },
        {
            title: '相关现场签证',
            dataIndex: 'signID',
        },
    ]

    export default {
        name: 'ContractChanges',
        data () {
            this.columns = columns
            return {}
        },
        props: {
            data: {
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
        },
        methods: {
            handToCip (id) {
                this.$router.push({ path: `/change/cip/item/${id}?contractGuid=${this.id}&type=view&stage=CIP` })
            }
        }
    }
</script>

<style scoped>

</style>