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
          :data-source="data.balancelst"
          :alert="false"
          :pagination="false"
          showPagination="auto"
          :scroll="{ x: 'calc(700px + 50%)'}"
        >
          <span slot="completionDate" slot-scope="text">
          {{text | date}}
        </span>

          <span slot="file_PdfPath" slot-scope="text,record">
            <a :href="record.file_PdfPathUrl" target="_blank">{{text}}</a>
        </span>

          <span slot="isLastBalance" slot-scope="text">
          {{text ? '是' : '否'}}
        </span>

          <span slot="progressBalanceDate" slot-scope="text">
         {{text | date}}
        </span>

          <span slot="progressBalanceAmount" slot-scope="text">
          {{text | NumberFormat}}
        </span>

          <span slot="creationTime" slot-scope="text">
         {{text | date}}
        </span>

          <span slot="bContractCreationTime" slot-scope="text">
         {{text | date}}
        </span>

          <span slot="bProjectCreationTime" slot-scope="text">
         {{text | date}}
        </span>

          <span slot="bFinanceCreationTime" slot-scope="text">
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
            title: '竣工证书',
            children: [
                {
                    title: '竣工日期',
                    width: 110,
                    dataIndex: 'completionDate',
                    scopedSlots: { customRender: 'completionDate' }
                },
                {
                    title: '竣工证书',
                    dataIndex: 'file_PdfPath',
                    width: 200,
                    scopedSlots: { customRender: 'file_PdfPath' }
                },
                {
                    title: '是否最终竣工',
                    dataIndex: 'isLastBalance',
                    width: 110,
                    align: 'center',
                    scopedSlots: { customRender: 'isLastBalance' }
                },
                {
                    title: '发起日期',
                    width: 110,
                    dataIndex: 'creationTime',
                    scopedSlots: { customRender: 'creationTime' }
                },
                {
                    title: '审批状态',
                    width: 78,
                    dataIndex: 'auditStatus',
                    scopedSlots: { customRender: 'auditStatus' }
                }
            ]
        },
        {
            title: '合同结算',
            children: [
                {
                    title: '结算日期',
                    width: 110,
                    dataIndex: 'progressBalanceDate',
                    scopedSlots: { customRender: 'progressBalanceDate' }
                },
                {
                    title: '结算申请金额',
                    dataIndex: 'progressBalanceAmount',
                    align: 'center',
                    width: 180,
                    scopedSlots: { customRender: 'progressBalanceAmount' }
                },
                {
                    title: '发起日期',
                    width: 110,
                    dataIndex: 'bContractCreationTime',
                    scopedSlots: { customRender: 'bContractCreationTime' }
                },
                {
                    title: '审批状态',
                    width: 78,
                    dataIndex: 'bContractAuditStatus',
                    scopedSlots: { customRender: 'bContractAuditStatus' }
                }
            ]
        },
        {
            title: '工程结算',
            children: [
                {
                    title: '发起日期',
                    dataIndex: 'bProjectCreationTime',
                    width: 110,
                    scopedSlots: { customRender: 'bProjectCreationTime' }
                },
                {
                    title: '审批状态',
                    width: 90,
                    dataIndex: 'bProjectAuditStatus',
                    scopedSlots: { customRender: 'bProjectAuditStatus' }
                }
            ]
        },
        {
            title: '财务结算',
            children: [
                {
                    title: '发起日期',
                    dataIndex: 'bFinanceCreationTime',
                    width: 110,
                    scopedSlots: { customRender: 'bFinanceCreationTime' }
                },
                {
                    title: '审批状态',
                    width: 90,
                    dataIndex: 'bFinanceAuditStatus',
                    scopedSlots: { customRender: 'bFinanceAuditStatus' }
                }
            ]
        }
    ]

    export default {
        name: 'BillingInfo',
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
        watch: {
            'data.balancelst' (value) {
                if (value && value.length > 0) {
                    this.data.balancelst.forEach(item => {
                        if (item.file_PdfPath) {
                            item.file_PdfPathUrl = process.env.VUE_APP_API_BASE_URL + '/' + item.file_PdfPath
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>