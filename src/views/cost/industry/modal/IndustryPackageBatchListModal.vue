<template>
  <a-modal
    title="请选择对应批次"
    width="90%"
    :visible="visible"
    :maskClosable="false"
    @ok="onOk"
    @cancel="onCancel"
  >
    <s-table
      style="margin-top: 5px"
      ref="table"
      size="default"
      rowKey="id"
      bordered
      :columns="columns"
      :data="loadData"
      :alert="false"
      :scroll="{ y : 300}"
      showPagination="auto"
      :rowSelection="rowSelection"
    >
      <span slot="creationTime" slot-scope="text">{{text | moment}}</span>
    </s-table>
  </a-modal>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  import { CostService } from '@/views/cost/cost.service'
  import { fixedList } from '@/utils/util'
  const columns = [
    {
      title: '批次编号',
      dataIndex: 'batchCode'
    },
    {
      title: '状态',
      dataIndex: 'auditStatus',
      scopedSlots: { customRender: 'auditStatus' }
    },
    {
      title: '编制时间',
      dataIndex: 'creationTime',
      scopedSlots: { customRender: 'creationTime' },
    },
    {
      title: '编制人',
      dataIndex: 'creatorUser',
      scopedSlots: { customRender: 'creatorUser' }
    }
  ]
  export default {
    name: 'IndustryPackageBatchListModal',
    components: {
      STable,
      Ellipsis
    },
    data () {
      return {
        columns: columns,
        queryParam: {},
        visible : false,
        selected : null,
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          this.queryParam.ProjectGUID = this.ProjectGUID
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          requestParameters.sorting = "creationTime"
          requestParameters.sortOrder = "desc"
          return CostService.getProjectTenderPackageBatchRegs(requestParameters).then(res => {
            return fixedList(res, requestParameters)
          })
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    computed: {
      rowSelection () {
        const that = this
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange,
          type: 'radio',
          onSelect: function (record, selected, selectRows, nativeEvent) {
            that.selected = record
          }
        }
      }
    },
    props: {
      ProjectGUID: {
        type : String,
        default : null
      }
    },
    watch :{
      'ProjectGUID'(values){
        this.selected = null
      }
    },
    methods: {
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      onOk(){
        if (this.selected) {
          this.visible = false
          this.$refs.table.clearSelected()
          this.$router.push({ path: `/cost/industry/batch/${this.selected.tenderPackageBatchGUID}?ProjectGUID=${this.ProjectGUID}&type=view` })
        } else {
          this.$message.warn('请选择对应批次')
        }
      },
      onCancel(){
        this.visible = false
      }
    }
  }
</script>
