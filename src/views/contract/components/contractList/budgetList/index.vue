<template>
  <a-modal
    title="请选择招投标分判包"
    :width="800"
    :visible="visible"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-input-search v-model="searchKey" @change="change" placeholder="按合同名称/编号进行搜索" />
    <s-table
      style="margin-top: 5px"
      ref="table"
      size="default"
      rowKey="id"
      bordered
      :columns="columns"
      :data="loadData"
      :alert="false"
      showPagination="auto"
      :rowSelection="rowSelection"
    >
    </s-table>
  </a-modal>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  import { ContractService } from '@/views/contract/contract.service'
  import { fixedList } from '@/utils/util'
  const columns = [
    {
      title: '招投标分判包名称',
      dataIndex: 'packageTitle',
      scopedSlots: { customRender: 'packageTitle' }
    },
    {
      title: '编号',
      dataIndex: 'tradePackageCode'
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      scopedSlots: { customRender: 'auditStatus' }
    },
    {
      title: '分类',
      dataIndex: 'itemTypeNameCN',
      scopedSlots: { customRender: 'itemTypeNameCN' }
    },
    {
      title: '金额',
      dataIndex: 'budgetAmount',
      scopedSlots: { customRender: 'budgetAmount' }
    }
  ]
  export default {
    name: 'ContractBudgetList',
    components: {
      STable,
      Ellipsis
    },
    data () {
      return {
        columns: columns,
        queryParam: {},
        selected: null,
        searchKey: '',
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          this.queryParam.ProjectGUID = this.project.projectGUID
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return ContractService.tenders(requestParameters).then(res => {
            console.log(res)
            const items = []
            res.result.data.items.forEach(item => {
              if (item.packageTitle.indexOf(this.searchKey) >= 0) {
                items.push(item)
              }
            })
            res.result.data.items = items
            res.result.data.totalCount = items.length
            console.log(fixedList(res, requestParameters))
            return fixedList(res, requestParameters)
          })
        }
      }
    },
    computed: {
      rowSelection () {
        const that = this
        return {
          type: 'radio',
          onSelect: function (record, selected, selectRows, nativeEvent) {
            that.selected = record
          }
        }
      }
    },
    props: {
      project: {
        type: Object,
        default: null
      },
      data: {
        type: Object,
        default: null
      },
      visible: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      change (e) {
        this.$refs.table.refresh()
      }
    }
  }
</script>
