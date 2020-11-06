<template>
  <a-modal
    title="请选择主合同"
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
      rowKey="contractGuid"
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
      title: '合同名称',
      dataIndex: 'contractName',
      scopedSlots: { customRender: 'contractName' }
    },
    {
      title: '合同编号',
      dataIndex: 'contractNo'
    },
    {
      title: '合同金额',
      dataIndex: 'contractAmount',
      scopedSlots: { customRender: 'contractAmount' }
    }
  ]
  export default {
    name: 'SelectMasterContract',
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
          console.log('loadData')
          this.queryParam.ContractCategory = this.category
          this.queryParam.ProjectId = this.data.contract.projectID
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return ContractService.masters(requestParameters).then(res => {
            const items = []
            res.result.data.forEach(item => {
              if (item.contractName.indexOf(this.searchKey) >= 0) {
                items.push(item)
              }
              if (item.contractGuid === this.data.contract.masterContractID) {
                console.log(true)
                setTimeout(() => { this.selected = item }, 100)
              }
            })
            res.result.data = items
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
