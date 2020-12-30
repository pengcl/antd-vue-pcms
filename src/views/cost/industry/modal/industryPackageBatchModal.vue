<template>
  <a-modal
    title="请选择招行业分判包"
    width="90%"
    :visible="visible"
    :maskClosable="false"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-input-search  @search="onSearch" placeholder="按分判包名称进行搜索" />
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
      :rowSelection="{selectedRowKeys : selectedRowKeys ,onChange : onChange }"
    >
      <template slot="costCenters" slot-scope="text">
        <span v-for="item in text"  :key="JSON.stringify(item)">
          {{item.costCenterName}};
        </span>
      </template>
      <span slot="budgetAmount" slot-scope="text">{{text | NumberFormat}}</span>
    </s-table>
  </a-modal>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  import { CostService } from '@/views/cost/cost.service'
  import { fixedList } from '@/utils/util'
  const columns = [
    {
      title: '行业分判包编号',
      dataIndex: 'tradePackageCode'
    },
    {
      title: '描述',
      dataIndex: 'packageTitle',
      scopedSlots: { customRender: 'packageTitle' }
    },
    {
      title: '范围',
      dataIndex: 'costCenters',
      scopedSlots: { customRender: 'costCenters' }
    },
    {
      title: '金额',
      dataIndex: 'budgetAmount',
      scopedSlots: { customRender: 'budgetAmount' }
    }
  ]
  export default {
    name: 'IndustryPackageBatch',
    components: {
      STable,
      Ellipsis
    },
    data () {
      return {
        columns: columns,
        queryParam: {},
        selectedRowKeys : [],
        selectedRows : [],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          this.queryParam.ProjectGUID = this.ProjectGUID
          this.queryParam.isAudit = false
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return CostService.bidIndustryItems(requestParameters).then(res => {
            return fixedList(res, requestParameters)
          })
        }
      }
    },
    computed: {
    },
    props: {
      project: {
        type: String,
        default: null
      },
      selecteds: {
        type: Array,
        default: null
      },
      visible: {
        type: Boolean,
        required: true
      },
      ProjectGUID: {
        type : String,
        default : null
      }
    },
    watch :{
      'selecteds'(values){
        this.selectedRows = values
        this.selectedRowKeys = []
        this.selectedRows.forEach(item =>{
          this.selectedRowKeys.push(item.id)
        })
      }
    },
    methods: {
      onChange (keys,rows) {
        this.selectedRows = rows
        this.selectedRowKeys = keys
      },
      onSearch(value) {
        this.queryParam.packageTitle = value
        this.$refs.table.refresh()
      }
    }
  }
</script>
