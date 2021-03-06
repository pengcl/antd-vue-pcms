<template>
  <a-modal
    :visible="visible"
    width="90%"
    title="预算调整确认"
    @cancel="handleCancel"
    @ok="handleOk"
    :closable="false"
    :maskClosable="false"
    :confirm-loading="loading"
  >
    <div>
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-radio-group v-model="useStore" button-style="solid" :disabled="useStore > 0 && stage==='VO'">
              <a-radio v-for="item in selection.storeTypes" :key="item.id" :value="item.id">
                {{ item.nameCN }}（<span class="redText">余额：<span>{{ item.balance | NumberFormat }}</span>元</span>）
              </a-radio>
            </a-radio-group>
          </a-col>
          <a-col :md="24" :sm="24">
            <s-table
              :style="useStore !== 108 ? 'display : none' : ''"
              rowKey="index"
              :columns="columns"
              :showPagination="false"
              :data="usePlanLoadData"
              bordered
              :alert="false"
              ref="usePlanTable" >
              <template slot="alterPlan" slot-scope="text,record">
                <a-input-number :value="record.alterPlan" :disabled="true"></a-input-number>
              </template>
              <template slot="voUseAmount" slot-scope="text,record">
                <a-input-number
                  :max="record.alterPlan"
                  :min="-record.alterPlan"
                  v-model="record.voUseAmount"
                  @change="changeVoUseAmount(record)"
                  :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="(value) => value.replace(/\元\s?|(,*)/g, '')"
                  :precision="2"
                ></a-input-number>
              </template>
              <template slot="balanceAmount" slot-scope="text">
                <span v-if="text >= 0">0</span>
                <label v-if="text < 0" style="color:red">(预算不足)</label>
              </template>
            </s-table>
            <s-table
              :style="useStore !== 109 ? 'display : none' : ''"
              :row-key="record => JSON.stringify(record)"
              :columns="surplusColumns"
              :showPagination="false"
              :data="surplusLoadData"
              bordered
              ref="surplusTable" >
              <template slot="surplusAmount" slot-scope="text,record">
                <a-input-number
                  :value="record.surplusAmount"
                  :disabled="true"
                  :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="(value) => value.replace(/\\s?|(,*)/g, '')"
                  :precision="2"></a-input-number>
              </template>
              <template slot="voUseAmount" slot-scope="text,record">
                <a-input-number
                  :max="record.alterPlan"
                  :min="-record.alterPlan"
                  v-model="record.voUseAmount"
                  @change="changeVoUseAmount(record)"
                  :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="(value) => value.replace(/\\s?|(,*)/g, '')"
                  :precision="2"
                ></a-input-number>
              </template>
              <template slot="balanceAmount" slot-scope="text">
                <span v-if="text >= 0">0</span>
                <label v-if="text < 0" style="color:red">(预算不足)</label>
              </template>
            </s-table>
            <s-table
              :style="useStore !== 110 ? 'display : none' : ''"
              :row-key="record => JSON.stringify(record)"
              :columns="generalTradeColumns"
              :showPagination="false"
              :data="generalTradeLoadData"
              bordered
              ref="generalTradeTable" >
              <template slot="alterPlan" slot-scope="text,record">
                <a-input-number :value="record.alterPlan" :disabled="true"></a-input-number>
              </template>
              <template slot="voUseAmount" slot-scope="text,record">
                <a-input-number
                  :max="record.alterPlan"
                  :min="-record.alterPlan"
                  v-model="record.voUseAmount"
                  @change="changeVoUseAmount(record)"
                  :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="(value) => value.replace(/\元\s?|(,*)/g, '')"
                  :precision="2"
                ></a-input-number>
              </template>
              <template slot="balanceAmount" slot-scope="text">
                <span v-if="text >= 0">0</span>
                <label v-if="text < 0" style="color:red">(预算不足)</label>
              </template>
            </s-table>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  import { ChangeService } from '@/views/change/change.service'
  import { ContractService } from '@/views/contract/contract.service'

  const columns = [
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
      dataIndex: 'voUseAmount',
      scopedSlots: { customRender: 'voUseAmount' }
    },
    {
      title: '差额',
      dataIndex: 'balanceAmount',
      scopedSlots: { customRender: 'balanceAmount' }
    }
  ]

  const surplusColumns = [
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
      dataIndex: 'voUseAmount',
      scopedSlots: { customRender: 'voUseAmount' }
    },
    {
      title: '差额',
      dataIndex: 'balanceAmount',
      scopedSlots: { customRender: 'balanceAmount' }
    }
  ]

  const generalTradeColumns = [
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
      dataIndex: 'alterPlan',
      scopedSlots: { customRender: 'alterPlan' }
    },
    {
      title: '本次使用金额',
      dataIndex: 'voUseAmount',
      scopedSlots: { customRender: 'voUseAmount' }
    },
    {
      title: '差额',
      dataIndex: 'balanceAmount',
      scopedSlots: { customRender: 'balanceAmount' }
    }
  ]

  const actions = {
    108: {
      'create': 'createVoUsePlan',
      'update': 'updateVoUsePlan',
      'table': 'usePlanTable',
      'list': 'voUsePlanlst'
    },
    109: {
      'create': 'createVOUseSurplus',
      'update': 'updateVOUseSurplus',
      'table': 'surplusTable',
      'list': 'voUseSurpluslst'
    },
    110: {
      'create': 'createVoUsePlan',
      'update': 'updateVoUsePlan',
      'table': 'generalTradeTable',
      'list': 'voUseSurpluslst'
    }
  }

  export default {
    name: 'ContractComputeReplenishBudgets',
    components: {
      STable,
      Ellipsis
    },
    data () {
      columns[0].customRender = this.renderCost
      this.columns = columns
      this.surplusColumns = surplusColumns
      this.generalTradeColumns = generalTradeColumns
      return {
        // create model
        show: false,
        loading: false,
        visible: false,
        confirmLoading: false,
        rowSpans: {},
        selection: {},
        useStore: 0,
        // 高级搜索 展开/关闭
        advanced: false,
        // 加载数据方法 必须为 Promise 对象
        usePlanLoadData: parameter => {
          this.rowSpans = {}
          // 108 预算变更； 109 ： 定标余额； 110: 预算余额
          return ChangeService.getVoBudgetPreSplit({ VOGuid: this.data.voMasterInfo.voGuid, VOType: this.data.voMasterInfo.voType, useStore: 108 })
            .then(res => {
              if (res.result.data == null) {
                return new Promise((resolve, reject) => {
                  resolve({ data: [] })
                })
              }
              res.result.data.sort((a, b) => {
                return a.costCenterId === b.costCenterId ? 0 : a.costCenterId > b.costCenterId ? 1 : -1
              })
              res.result.data.forEach(item => {
                item.voGuid = this.data.voMasterInfo.voGuid
                if (this.rowSpans['cost' + item.costCenterId]) {
                  this.rowSpans['cost' + item.costCenterId]++
                } else {
                  this.rowSpans['cost' + item.costCenterId] = 1
                }
              })
              console.log('results', res.result)
              return res.result
            }).catch((e) => {
              this.$message.error('获取预算变更金额列表错误')
              return new Promise((resolve, reject) => {
                resolve({ data: [] })
              })
            })
        },
        surplusLoadData: parameter => {
          // 108 预算变更； 109 ： 定标余额； 110: 预算余额
          return ChangeService.getVOUseSurplusPreSplit({ VOGuid: this.data.voMasterInfo.voGuid, VOType: this.data.voMasterInfo.voType, useStore: 108 })
            .then(res => {
              if (res.result.data == null) {
                return new Promise((resolve, reject) => {
                  resolve({ data: [] })
                })
              }
              return res.result
            }).catch((e) => {
              this.$message.error('获取定标盈余列表错误')
              return new Promise((resolve, reject) => {
                resolve({ data: [] })
              })
            })
        },
        generalTradeLoadData: parameter => {
          // 108 预算变更； 109 ： 定标余额； 110: 预算余额
          return new Promise((resolve, reject) => {
            resolve({ data: [] })
          })
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    props: {
      data: {
        type: Object,
        default: null
      },
      contractGuid: {
        type: String,
        default: ''
      },
      stage: {
        type: String,
        default: ''
      }
    },
    computed: {

    },
    created () {
      ChangeService.storeTypes().then(res => {
        ChangeService.getVOUseStoreSum(this.contractGuid).then(res2 => {
          if (res2.result.statusCode === 200) {
            res.result.data.forEach(item => {
              switch (item.id) {
                case 108 :
                  item.balance = res2.result.data.alterPlanSumAmount
                  break
                case 109 :
                  item.balance = res2.result.data.surplusSumAmount
                  break
                case 110:
                  item.balance = res2.result.data.generalTradeSumAmount
              }
            })
          } else {
            res.result.data.forEach(item => {
              item.balance = 0
            })
          }
          this.selection.storeTypes = res.result.data
        }).catch((e) => {
          console.log('通过合同编号获取对应的三种变更类型预算余额失败', e)
          res.result.data.forEach(item => {
            item.balance = 0
          })
          this.selection.storeTypes = res.result.data
        })
      })
    },
    watch: {
      'data.contract' (value) {
        this.useStore = this.data.contract.useStore
      }
    },
    mounted () {

    },
    methods: {
      showModal () {
        this.visible = true
      },
      handleCancel () {
        this.visible = false
        this.$router.push('/contract/list')
      },
      loadData () {
        return ChangeService.bqList(this.contract.contractGuid).then(res => {
          this.tableData = res.result.data
        })
      },
      handleOk () {
        this.loading = true
        if (this.useStore !== 108 && this.useStore !== 109 && this.useStore !== 110) {
          this.$message.warn('请选择预算确认类别')
          this.loading = false
          return
        }
        if (this.useStore === 110) {
          this.$message.warn('暂无接口，无法完成预算确认，请选择【变更预留金额】进行操作')
          this.loading = false
          return
        }
        const methodName = this.data.voMasterInfo.budgetIsConfirm ? 'update' : 'create'
        const reqData = {
          voGuid: this.data.voMasterInfo.voGuid,
          useStore: this.useStore,
          budgetIsConfirm: this.data.voMasterInfo.budgetIsConfirm
        }
        reqData[actions[this.useStore].list] = this.$refs[actions[this.useStore].table].localDataSource
        console.log('reqData', reqData)
        ChangeService[actions[this.useStore][methodName]](reqData).then(res => {
          this.loading = false
          if (res.result.statusCode === 200) {
            this.$message.success('预算确认成功')
            this.handleCancel()
          }
        }).catch(() => {
          this.loading = false
        })
      },
      changeVoUseAmount (record) {
        const balanceAmount = record.alterPlan - record.voUseAmount
        record.balanceAmount = balanceAmount > 0 ? 0 : balanceAmount
      },
      renderCost (value, row, index) {
        const obj = {
          children: value,
          attrs: {
            rowSpan: this.rowSpans['cost' + row.costCenterId] || 0
          }
        }
        this.rowSpans['cost' + row.costCenterId] = undefined
        return obj
      }
    }
  }
</script>

<style lang="less" scoped>
  .redText {
    color : red;
    background-color : white;
  }
  .search-form {
    background-color: #1E9FF2;
    padding: 20px;
    border-radius: 0.35rem;

    /deep/ .ant-form-item-label label {
      color: #fff;
    }
  }

  /deep/ .ant-table-footer {
    padding-bottom: 0;
  }

</style>
