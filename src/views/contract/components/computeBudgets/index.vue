<template>
  <a-modal
    title="预算调整"
    :width="900"
    :visible="visible"
    :okText="'预算确认'"
    :cancelText="'关闭'"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
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
      showPagination="auto"
    >
      <template slot="ContractSplitAmount" slot-scope="record">
        <a-input>{{record.ContractSplitAmount}}</a-input>
      </template>
    </s-table>
  </a-modal>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  import { ContractService } from '@/views/contract/contract.service'
  import { fixedList } from '@/utils/util'
  const columns = [
    {
      title: '科目',
      dataIndex: 'ElementName'
    },
    {
      title: '行业',
      dataIndex: 'ItemTypeName'
    },
    {
      title: '业态',
      dataIndex: 'CostCenterName'
    },
    {
      title: '预算余额(a)',
      dataIndex: 'GeneralTradeAmount'
    },
    {
      title: '行业预算(b)',
      dataIndex: 'BudgetPlanDetailAmount'
    },
    {
      title: '合同金额(c)',
      dataIndex: 'ContractSplitAmount',
      scopedSlots: { customRender: 'ContractSplitAmount' }
    },
    {
      title: '定标盈余(d)',
      dataIndex: 'TenderSurplus'
    },
    {
      title: '预算便跟(e)',
      dataIndex: 'AlterPlan'
    },
    {
      title: '差额(f)',
      dataIndex: 'BalanceAmount'
    }
  ]
  export default {
    name: 'ContractComputeBudgets',
    components: {
      STable,
      Ellipsis
    },
    data () {
      return {
        columns: columns,
        data: null,
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          this.queryParam.contractGuid = this.contractGuid
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return ContractService.computeBudgets(requestParameters).then(res => {
            console.log(res)
            this.data = fixedList(res, requestParameters)
            return this.data
          })
        }
      }
    },
    props: {
      contractGuid: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        required: true
      }
    },
    watch: {
      'contractGuid' (value) {
        console.log(value)
        console.log(this.contractGuid)
      }
    },
    methods: {
      change (e) {
        this.$refs.table.refresh()
      }
    }
  }
</script>
