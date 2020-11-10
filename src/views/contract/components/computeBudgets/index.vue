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
    <!--<a-form-model>

    </a-form-model>-->
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
      <template slot="contractSplitAmount" slot-scope="text, record">
        <a-input-number
          v-model="record.contractSplitAmount"
          :min="0"
          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :precision="2" />
      </template>
      <template slot="balanceAmount" slot-scope="text, record">
        <a-input-number
          :disabled="true"
          :value="record.budgetPlanDetailAmount - record.contractSplitAmount - record.tenderSurplus - record.alterPlan"
          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :precision="2" />
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
      dataIndex: 'elementName'
    },
    {
      title: '行业',
      dataIndex: 'itemTypeName'
    },
    {
      title: '业态',
      dataIndex: 'costCenterName'
    },
    {
      title: '预算余额(a)',
      dataIndex: 'generalTradeAmount'
    },
    {
      title: '行业预算(b)',
      dataIndex: 'budgetPlanDetailAmount'
    },
    {
      title: '合同金额(c)',
      dataIndex: 'contractSplitAmount',
      scopedSlots: { customRender: 'contractSplitAmount' }
    },
    {
      title: '定标盈余(d)',
      dataIndex: 'tenderSurplus'
    },
    {
      title: '预计变跟(e)',
      dataIndex: 'alterPlan'
    },
    {
      title: '差额(f)',
      dataIndex: 'balanceAmount',
      scopedSlots: { customRender: 'balanceAmount' }
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
        total: {},
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          this.queryParam.contractGuid = this.contractGuid
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return ContractService.computeBudgets(requestParameters).then(res => {
            console.log(res)
            res.result.data.forEach(item => {
              if (this.total[item.costCenterCode]) {
                this.total[item.costCenterCode] = this.total[item.costCenterCode] + item.contractSplitAmount
              } else {
                this.total[item.costCenterCode] = item.contractSplitAmount
              }
            })
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
      getMax (key, id) {
        let max = this.total[key]
        const items = this.$refs.table.localDataSource.filter((data) => data.costCenterCode === key)
        items.forEach(item => {
          if (item.id !== id) {
            max = max - item.contractSplitAmount
          }
        })
        console.log(max)
        return max
      }
    }
  }
</script>
