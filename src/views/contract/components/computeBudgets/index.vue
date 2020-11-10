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
    <div>
      <a-form-model
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col v-for="item in balances" :key="item.key" :md="12" :sm="24">
            <a-form-model-item
              required
              :label="item.key">
              <a-input-number :disabled="true" v-model="item.value" :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :precision="2" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
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
          @change="change(record)"
          :min="0"
          :max="record.budgetPlanDetailAmount"
          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :precision="2" />
      </template>
      <template slot="tenderSurplus" slot-scope="text, record">
        <a-input-number
          :disabled="true"
          :value="record.tenderSurplus"
          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :precision="2" />
      </template>
      <template slot="alterPlan" slot-scope="text, record">
        <a-input-number
          :disabled="true"
          :value="record.alterPlan"
          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :precision="2" />
      </template>
      <template slot="balanceAmount" slot-scope="text, record">
        <a-input-number
          :disabled="true"
          :value="record.balanceAmount"
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
      dataIndex: 'tenderSurplus',
      scopedSlots: { customRender: 'tenderSurplus' }
    },
    {
      title: '预计变更(e)',
      dataIndex: 'alterPlan',
      scopedSlots: { customRender: 'alterPlan' }
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
        balance: {},
        balances: [],
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          this.queryParam.contractGuid = this.contractGuid
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return ContractService.computeBudgets(requestParameters).then(res => {
            this.getTotal(res.result.data)
            this.getBalance(res.result.data)
            this.getBalances()
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
    computed: {
    },
    watch: {
      'contractGuid' (value) {
        console.log(value)
        console.log(this.contractGuid)
      }
    },
    methods: {
      change (record) {
        setTimeout(() => {
          if (record.budgetPlanDetailAmount - record.contractSplitAmount >= record.contractSplitAmount * 0.05) {
            record.alterPlan = record.contractSplitAmount * 0.05
          } else {
            const alterPlan = record.budgetPlanDetailAmount - record.contractSplitAmount
            record.alterPlan = alterPlan >= 0 ? alterPlan : 0
          }

          const tenderSurplus = record.budgetPlanDetailAmount - record.contractSplitAmount - record.alterPlan
          record.tenderSurplus = tenderSurplus >= 0 ? tenderSurplus : 0
          record.balanceAmount = record.budgetPlanDetailAmount - record.contractSplitAmount - record.tenderSurplus - record.alterPlan
          this.getBalance(this.$refs.table.localDataSource)
          this.getBalances()
        }, 100)
      },
      getTotal (items) {
        items.forEach(item => {
          if (this.total[item.costCenterCode]) {
            this.total[item.costCenterCode] = this.total[item.costCenterCode] + item.contractSplitAmount
          } else {
            this.total[item.costCenterCode] = item.contractSplitAmount
          }
        })
      },
      getBalanceItem (key, items) {
        let max = this.total[key]
        items.forEach(item => {
          max = max - item.contractSplitAmount
        })
        return max
      },
      getBalance (records) {
        for (const key in this.total) {
          let items = JSON.parse(JSON.stringify(records))
          items = items.filter((data) => data.costCenterCode === key)
          console.log(items)
          this.balance[key] = this.getBalanceItem(key, items)
        }
        console.log(this.balance)
      },
      getBalances () {
        const balances = []
        for (const key in this.balance) {
          balances.push({
            key,
            value: this.balance[key]
          })
        }
        this.balances = balances
      }
    }
  }
</script>
