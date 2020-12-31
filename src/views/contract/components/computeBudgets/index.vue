<template>
  <a-modal
    title="预算调整"
    width="90%"
    :maskClosable="false"
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
        <a-row :gutter="48" v-if="this.contract.contractCategory !== 16">
          <a-col v-for="(item, index) in form.balances" :key="item.key" :md="12" :sm="24">
            <a-form-model-item
              required
              :prop="'balances.' + index + '.value'"
              :rules="[{ type: 'number', required: true, message: '请输入项目名称(中文)' },{ type: 'number', max: 0.01, min:-0.01, message: item.key + '必须等于0' }]"
              :label="item.name">
              <a-input-number
                :disabled="true"
                v-model="item.value"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :precision="2"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <a-radio-group @change="storeChange" v-model="queryParam.useStore" button-style="solid">
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
      :showPagination="false"
    >
      <template slot="generalTradeAmount" slot-scope="text">
        {{text | NumberFormat}}
      </template>

      <template slot="budgetPlanDetailAmount" slot-scope="text">
        {{text | NumberFormat}}
      </template>

      <template slot="contractSplitAmount" slot-scope="text, record">
        <a-input-number
          v-model="record.contractSplitAmount"
          @change="change(record)"
          :min="0"
          :max="record.contractSplitAmount"
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
      <template slot="surplusAmount" slot-scope="text, record">
        <a-input-number
          :disabled="true"
          :value="record.surplusAmount"
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
      <template slot="temporaryAlterPlan" slot-scope="text, record">
        <a-input-number
          :disabled="true"
          :value="record.temporaryAlterPlan"
          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :precision="2"/>
      </template>
      <template slot="addedUseAmount" slot-scope="text, record">
        <a-form-model-item>
          <a-input-number
            style="margin-top: 18px"
            :max="record.alterPlan || record.surplusAmount || record.tradeBalanceAmount"
            v-model="record.addedUseAmount"
            @change="subChange(record)"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :precision="2"/>
        </a-form-model-item>
      </template>
      <template slot="useBalanceAmount" slot-scope="text, record">
        <a-form-model-item>
          <a-input-number
            style="margin-top: 18px"
            :disabled="true"
            :value="record.useBalanceAmount"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :precision="2"/>
        </a-form-model-item>
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
      <template slot="tradeBalanceAmount" slot-scope="text, record">
        <a-form-model-item>
          <a-input-number
            style="margin-top: 18px"
            :disabled="true"
            :value="record.tradeBalanceAmount"
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
  import { ChangeService } from '@/views/change/change.service'

  const columns = [
    {
      title: '科目',
      dataIndex: 'elementName',
      width: '30%'
    },
    {
      title: '行业',
      dataIndex: 'itemTypeName',
      width: '140px'
    },
    {
      title: '业态',
      dataIndex: 'costCenterName',
      width: '140px'
    },
    {
      title: '预算余额(a)',
      dataIndex: 'generalTradeAmount',
      scopedSlots: { customRender: 'generalTradeAmount' }
    },
    {
      title: '行业预算(b)',
      dataIndex: 'budgetPlanDetailAmount',
      scopedSlots: { customRender: 'budgetPlanDetailAmount' }
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
      title: '变更预留-固定(e1)',
      dataIndex: 'alterPlan',
      scopedSlots: { customRender: 'alterPlan' }
    },
    {
      title: '变更预留-暂定(e2)',
      dataIndex: 'temporaryAlterPlan',
      scopedSlots: { customRender: 'temporaryAlterPlan' }
    },
    {
      title: '差额(f)',
      dataIndex: 'useBalanceAmount',
      scopedSlots: { customRender: 'useBalanceAmount' }
    }
  ]
  const _columns = {
    108: [
      {
        title: '业态',
        dataIndex: 'costCenterName'
      },
      {
        title: '科目',
        dataIndex: 'elementName'
      },
      {
        title: '变更预留金额',
        dataIndex: 'alterPlan',
        scopedSlots: { customRender: 'alterPlan' }
      },
      {
        title: '本次使用金额',
        dataIndex: 'addedUseAmount',
        scopedSlots: { customRender: 'addedUseAmount' }
      },
      {
        title: '差额',
        dataIndex: 'balanceAmount',
        scopedSlots: { customRender: 'balanceAmount' }
      }
    ],
    109: [
      {
        title: '业态',
        dataIndex: 'costCenterName'
      },
      {
        title: '定标盈余',
        dataIndex: 'surplusAmount',
        scopedSlots: { customRender: 'surplusAmount' }
      },
      {
        title: '本次使用金额',
        dataIndex: 'addedUseAmount',
        scopedSlots: { customRender: 'addedUseAmount' }
      },
      {
        title: '差额',
        dataIndex: 'balanceAmount',
        scopedSlots: { customRender: 'balanceAmount' }
      }
    ],
    110: [
      {
        title: '业态',
        dataIndex: 'costCenterName'
      },
      {
        title: '科目',
        dataIndex: 'elementName'
      },
      {
        title: '预算余额',
        dataIndex: 'tradeBalanceAmount',
        scopedSlots: { customRender: 'tradeBalanceAmount' }
      },
      {
        title: '本次使用金额',
        dataIndex: 'addedUseAmount',
        scopedSlots: { customRender: 'addedUseAmount' }
      },
      {
        title: '差额',
        dataIndex: 'balanceAmount',
        scopedSlots: { customRender: 'balanceAmount' }
      }
    ]
  }

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
        queryParam: { useStore: this.contract.useStore },
        statusCode: 200,
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          this.queryParam.contractGuid = this.contractGuid
          const e = { target: {
            value: this.queryParam.useStore
          } }
          this.storeChange(e, true)
          if (this.contract.contractCategory === 16) {
            if (this.queryParam.useStore === 108) {
              return ContractService.computeBudgets_108(this.queryParam).then(res => {
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
                return res.result
              })
            }
            if (this.queryParam.useStore === 109) {
              return ContractService.computeBudgets_109(this.queryParam).then(res => {
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
                return res.result
              })
            }
            if (this.queryParam.useStore === 110) {
                  return ContractService.computeBudgets_110(this.queryParam).then(res => {
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
                      return res.result
                  })
              }
          } else {
            return ContractService.computeBudgets(this.queryParam).then(res => {
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
              return res.result
            })
          }
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
      },
      contract: {
        type: Object,
        default: null
      }
    },
    computed: {},
    created () {
    },
    watch: {
      'visible' (value) {
        if (value && this.$refs.table) {
          this.$refs.table.refresh()
        }
      },
      'contract.contractCategory' (value) {
        if (value === 16) {
          ChangeService.storeTypes().then(res => {
            this.selection.storeTypes = res.result.data
            this.queryParam.useStore = this.getStoreType(this.selection.storeTypes, this.queryParam.useStore)
            this.$forceUpdate()
          })
        } else {
          ContractService.storeTypes().then(res => {
            this.selection.storeTypes = res.result.data
            this.queryParam.useStore = this.getStoreType(this.selection.storeTypes, this.queryParam.useStore)
            this.$forceUpdate()
          })
        }
      }
    },
    methods: {
      getStoreType (items, value) {
        let index = 0
        items.forEach((item, i) => {
          if (item.id === value) {
            index = i
          }
        })
        return items[index].id
      },
      change (record) {
        setTimeout(() => {
          if (record.budgetPlanDetailAmount - record.contractSplitAmount >= record.contractSplitAmount * 0.05) {
            record.alterPlan = record.contractSplitAmount * 0.05
            record.TemporaryAlterPlan = record.contractSplitAmount * 0.05
          } else {
            const alterPlan = record.budgetPlanDetailAmount - record.contractSplitAmount
            record.alterPlan = alterPlan >= 0 ? alterPlan : 0
            const TemporaryAlterPlan = record.budgetPlanDetailAmount - record.contractSplitAmount
            record.TemporaryAlterPlan = TemporaryAlterPlan >= 0 ? TemporaryAlterPlan : 0
          }
          /* if (this.queryParam.useStore !== 106) { */
          const tenderSurplus = record.budgetPlanDetailAmount - record.contractSplitAmount - record.alterPlan - record.TemporaryAlterPlan
          record.tenderSurplus = tenderSurplus >= 0 ? tenderSurplus : 0
          /* } */
          record.balanceAmount = record.budgetPlanDetailAmount - record.contractSplitAmount - record.tenderSurplus - record.alterPlan - record.TemporaryAlterPlan
          this.getBalance(this.$refs.table.localDataSource)
          this.getBalances()
        }, 100)
      },
      subChange (record) {
        let balanceAmount = 0
        if (this.queryParam.useStore === 108) {
          balanceAmount = record.alterPlan - record.addedUseAmount
        }
        if (this.queryParam.useStore === 109) {
          balanceAmount = record.surplusAmount - record.addedUseAmount
        }
        record.balanceAmount = balanceAmount > 0 ? 0 : balanceAmount
      },
      getTotal (items) {
        if (items) {
          items.forEach(item => {
            if (this.total[item.costCenterCode]) {
              this.total[item.costCenterCode].value = this.total[item.costCenterCode].value + item.contractSplitAmount
            } else {
              this.total[item.costCenterCode] = { name: item.costCenterName, value: item.contractSplitAmount }
            }
          })
        }
      },
      getBalanceItem (key, items) {
        let max = this.total[key].value
        items.forEach(item => {
          max = max - item.contractSplitAmount
        })
        return { name: this.total[key].name, value: max }
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
            name: this.balance[key].name,
            value: this.balance[key].value
          })
        }
        this.form.balances = balances
        this.$forceUpdate()
      },
      storeChange (e, nonRefresh) {
        this.queryParam.useStore = e.target.value
        if (this.contract.contractCategory === 16) {
          this.columns = _columns[this.queryParam.useStore]
        } else {
          this.columns = columns
        }
        if (!nonRefresh) {
          this.$refs.table.refresh()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/ table {
    td {
      min-width: 150px;
    }
  }
</style>
