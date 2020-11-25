<template>
  <a-modal
    title="预算调整"
    :width="900"
    :visible="visible"
    :closable="false"
  >
    <template slot="footer">
      <a-button key="back" @click="() => { $emit('cancel') }">
        关闭
      </a-button>
      <a-button
        :disabled="statusCode !== 200 || (amount === 0 && data.data.length === 0)"
        key="submit"
        type="primary"
        @click="() => { $emit('ok') }">
        预算确认
      </a-button>
    </template>
    <div>
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col v-for="(item, index) in form.balances" :key="item.key" :md="12" :sm="24">
            <a-form-model-item
              required
              :prop="'balances.' + index + '.value'"
              :rules="[{ type: 'number', required: true, message: '请输入项目名称(中文)' },{ type: 'number', max: 0.01, min:-0.01, message: item.key + '必须等于0' }]"
              :label="item.key">
              <a-input-number
                :disabled="true"
                v-model="item.value"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :precision="2"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <a-radio-group v-model="queryParam.useStore" button-style="solid">
        <a-radio v-for="item in selection.storeTypes" :key="item.id" :value="item.id">
          {{ item.nameCN }}
        </a-radio>
      </a-radio-group>
    </div>
    <s-table
      style="margin-top: 5px"
      ref="table"
      size="default"
      rowKey="index"
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
          :precision="2"/>
      </template>
      <template slot="tenderSurplus" slot-scope="text, record">
        <a-input-number
          :disabled="true"
          :value="record.tenderSurplus"
          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :precision="2"/>
      </template>
      <template slot="alterPlan" slot-scope="text, record">
        <a-input-number
          :disabled="true"
          :value="record.alterPlan"
          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :precision="2"/>
      </template>
      <template slot="balanceAmount" slot-scope="text, record">
        <a-form-model-item>
          <a-input-number
            style="margin-top: 18px"
            :disabled="true"
            :value="record.balanceAmount"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :precision="2"/>
        </a-form-model-item>
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
        data: { data: [] },
        total: {},
        balance: {},
        balances: [],
        selection: {},
        queryParam: { useStore: '' },
        statusCode: 200,
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          this.queryParam.contractGuid = this.contractGuid
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return ContractService.computeBudgets(requestParameters).then(res => {
            this.statusCode = res.result.statusCode
            this.total = {}
            this.balance = {}
            this.balances = []
            res.result.data.forEach((item, index) => {
              item.index = index
            })
            this.getTotal(res.result.data)
            this.getBalance(res.result.data)
            this.getBalances()
            this.data = fixedList(res, requestParameters)
            return this.data
          })
        },
        rules: {
          value: [
            { type: 'number', required: true, message: '请输入项目名称(中文)' }
          ]
        },
        form: {
          balances: []
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
      },
      amount: {
        default: 0
      }
    },
    computed: {},
    created () {
      ContractService.storeTypes().then(res => {
        this.selection.storeTypes = res.result.data
        this.queryParam.useStore = res.result.data[0].id
        this.$forceUpdate()
      })
    },
    watch: {
      'visible' (value) {
        if (value && this.$refs.table) {
          this.$refs.table.refresh()
        }
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
        if (items) {
          items.forEach(item => {
            if (this.total[item.costCenterCode]) {
              this.total[item.costCenterCode] = this.total[item.costCenterCode] + item.contractSplitAmount
            } else {
              this.total[item.costCenterCode] = item.contractSplitAmount
            }
          })
        }
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
          this.balance[key] = this.getBalanceItem(key, items)
        }
      },
      getBalances () {
        const balances = []
        for (const key in this.balance) {
          balances.push({
            key,
            value: this.balance[key]
          })
        }
        this.form.balances = balances
        console.log(balances)
        this.$forceUpdate()
      }
    }
  }
</script>
