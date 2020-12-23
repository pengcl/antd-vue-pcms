<template>
  <a-modal
    :visible="visible"
    :width="900"
    title="预算调整确认"
    @cancel="handleCancel"
    @ok="handleOk"
    :closable="false"
    :maskClosable="false"
    :confirm-loading="loading"
    :okButtonProps="{ props: { disabled: okDisabled }}"
  >
    <div>
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-radio-group v-model="useStore" button-style="solid"
                           @change="changeStore">
              <a-radio v-for="item in selection.storeTypes" :key="item.id" :value="item.id">
                {{ item.nameCN }}（<span class="redText"><span v-if="item.showBalance > 0">余额：{{item.showBalance | NumberFormat}}元</span><span
                v-if="item.showBalance <= 0">余额不足</span></span>）
              </a-radio>
            </a-radio-group>
          </a-col>
          <a-col :md="24" :sm="24">
            <s-table
              rowKey="elementId"
              :style="useStore !== 108 ? 'display : none' : ''"
              :columns="columns"
              :showPagination="false"
              :data="usePlanLoadData"
              bordered
              :alert="false"
              ref="usePlanTable">
              <template slot="alterPlan" slot-scope="text,record">
                <a-input-number :value="record.alterPlan"
                                :disabled="true"
                                :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :precision="2"></a-input-number>
              </template>
              <template slot="voUseAmount" slot-scope="text,record">
                <a-input-number
                  :max="record.alterPlan"
                  v-model="record.voUseAmount"
                  @change="changeVoUseAmount(record,'alterPlan')"
                  :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :precision="2"
                ></a-input-number>
              </template>
              <template slot="balanceAmount" slot-scope="text">
                <span v-if="text >= 0">0</span>
                <label v-if="text < 0" style="color:red">(预算不足)</label>
              </template>
            </s-table>
            <s-table
              rowKey="id"
              :style="useStore !== 109 ? 'display : none' : ''"
              :columns="surplusColumns"
              :showPagination="false"
              :data="surplusLoadData"
              bordered
              :alert="false"
              ref="surplusTable">
              <template slot="surplusAmount" slot-scope="text,record">
                <a-input-number :value="record.surplusAmount"
                                :disabled="true"
                                :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :precision="2"></a-input-number>
              </template>
              <template slot="voUseAmount" slot-scope="text,record">
                <a-input-number
                  :max="record.surplusAmount"
                  v-model="record.voUseAmount"
                  @change="changeVoUseAmount(record,'surplusAmount')"
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
              rowKey="elementId"
              :style="useStore !== 110 ? 'display : none' : ''"
              :columns="generalTradeColumns"
              :showPagination="false"
              :data="generalTradeLoadData"
              :alert="false"
              bordered
              ref="generalTradeTable">
              <template slot="tradeBalanceAmount" slot-scope="text,record">
                <a-input-number :value="record.tradeBalanceAmount"
                                :disabled="true"
                                :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :precision="2"></a-input-number>
              </template>
              <template slot="voUseAmount" slot-scope="text,record">
                <a-input-number
                  :max="record.tradeBalanceAmount"
                  v-model="record.voUseAmount"
                  @change="changeVoUseAmount(record,'tradeBalanceAmount')"
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
    import moment from 'moment'
    import { STable, Ellipsis } from '@/components'
    import { ChangeService } from '@/views/change/change.service'
    import { fixedList } from '@/utils/util'
    import { CheckoutService } from '../../checkout.service'

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
            title: '预计变更金额',
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
            dataIndex: 'tradeBalanceAmount',
            scopedSlots: { customRender: 'tradeBalanceAmount' }
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
            'list': 'planList',
            'table': 'usePlanTable'
        },
        109: {
            'list': 'surplusList',
            'table': 'surplusTable'
        },
        110: {
            'list': 'tradeList',
            'table': 'generalTradeTable'
        }
    }

    export default {
        name: 'ComputeBudgets',
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
                okDisabled: false,
                // 高级搜索 展开/关闭
                advanced: false,
                // 加载数据方法 必须为 Promise 对象
                usePlanLoadData: parameter => {
                    this.rowSpans = {}
                    // 108 预算变更； 109 ： 定标余额； 110: 预算余额
                    if (this.useStore === 108) {
                        return CheckoutService['budgetList_' + this.useStore](this.gid)
                            .then(res => {
                                if (res.result.statusCode === 900) {
                                    this.refreshStoreBalance(108, true)
                                    return new Promise((resolve, reject) => {
                                        resolve({ data: [] })
                                    })
                                }

                                this.refreshStoreBalance(108, false)
                                res.result.data.sort((a, b) => {
                                    return a.costCenterId === b.costCenterId ? 0 : a.costCenterId > b.costCenterId ? 1 : -1
                                })
                                res.result.data.forEach(item => {
                                    if (this.rowSpans['cost' + item.costCenterId]) {
                                        this.rowSpans['cost' + item.costCenterId]++
                                    } else {
                                        this.rowSpans['cost' + item.costCenterId] = 1
                                    }
                                })
                                return res.result
                            }).catch((e) => {
                                this.$message.error('获取预算变更金额列表错误')
                                this.refreshStoreBalance(108, true)
                                return new Promise((resolve, reject) => {
                                    resolve({ data: [] })
                                })
                            })
                    } else {
                        return new Promise((resolve, reject) => {
                            resolve({ data: [] })
                        })
                    }
                },
                surplusLoadData: parameter => {
                    // 108 预算变更； 109 ： 定标余额； 110: 预算余额
                    if (this.useStore === 109) {
                        return CheckoutService['budgetList_' + this.useStore](this.gid)
                            .then(res => {
                                if (res.result.statusCode === 900) {

                                    this.refreshStoreBalance(109, true)
                                    return new Promise((resolve, reject) => {
                                        resolve({ data: [] })
                                    })
                                }
                                res.result.data.forEach((item, index) => {
                                    item.id = index
                                })

                                this.refreshStoreBalance(109, false)
                                return res.result
                            }).catch((e) => {
                                this.$message.error('获取定标盈余列表错误')
                                this.refreshStoreBalance(109, true)
                                return new Promise((resolve, reject) => {
                                    resolve({ data: [] })
                                })
                            })
                    } else {
                        return new Promise((resolve, reject) => {
                            resolve({ data: [] })
                        })
                    }
                },
                generalTradeLoadData: parameter => {
                    // 108 预算变更； 109 ： 定标余额； 110: 预算余额
                    if (this.useStore === 110) {
                        return CheckoutService['budgetList_' + this.useStore](this.gid)
                            .then(res => {
                                if (res.result.statusCode == 900) {
                                    this.refreshStoreBalance(110, true)
                                    return new Promise((resolve, reject) => {
                                        resolve({ data: [] })
                                    })
                                }

                                this.refreshStoreBalance(110, false)
                                return res.result
                            }).catch((e) => {
                                this.$message.error('获取预算余额列表错误')
                                this.refreshStoreBalance(110, true)
                                return new Promise((resolve, reject) => {
                                    resolve({ data: [] })
                                })
                            })
                    } else {
                        return new Promise((resolve, reject) => {
                            resolve({ data: [] })
                        })
                    }
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
                default: 'CIP'
            }
        },
        computed: {},
        created () {
        },
        watch: {
            'data.voMasterInfo' (value) {
                this.useStore = this.data.voMasterInfo.useStore
            },
            'contractGuid' (value) {
                if (value) {
                    this.getData()
                }
            }

        },
        mounted () {

        },
        methods: {
            getData () {
                ChangeService.storeTypes().then(res => {
                    ChangeService.getVOUseStoreSum(this.data.contractGID).then(res2 => {
                        if (res2.result.statusCode === 200) {
                            res.result.data.forEach(item => {
                                switch (item.id) {
                                    case 108 :
                                        item.balance = res2.result.data.alterPlanSumAmount
                                        item.showBalance = item.balance
                                        break
                                    case 109 :
                                        item.balance = res2.result.data.surplusSumAmount
                                        item.showBalance = item.balance
                                        break
                                    case 110:
                                        item.balance = res2.result.data.generalTradeSumAmount
                                        item.showBalance = item.balance
                                }
                            })
                        } else {
                            res.result.data.forEach(item => {
                                item.balance = 0
                                item.showBalance = item.balance
                            })
                        }
                        this.selection.storeTypes = res.result.data
                    }).catch((e) => {
                        console.log('通过合同编号获取对应的三种变更类型预算余额失败', e)
                        res.result.data.forEach(item => {
                            item.balance = 0
                            item.showBalance = item.balance
                        })
                        this.selection.storeTypes = res.result.data
                    })
                })
            },
            showModal (value) {
                this.gid = value
                this.visible = true
            },
            handleCancel () {
                this.visible = false
            },
            handleOk () {
                this.loading = true
                if (this.useStore !== 108 && this.useStore !== 109 && this.useStore !== 110) {
                    this.$message.warn('请选择预算确认类别')
                    this.loading = false
                    return
                }
                const params = {
                    balanceContractGID: this.gid,
                    useStore: this.useStore,
                    budgetIsConfirm: true,
                }
                params[actions[this.useStore].list] = this.$refs[actions[this.useStore].table].localDataSource
                CheckoutService['create_' + this.useStore](params).then(res => {
                    this.loading = false
                    if (res.result.statusCode === 200) {
                        this.$message.success('预算确认成功')
                        this.handleCancel()
                        this.$router.push({ path: '/checkout/contract/list' })
                    }
                }).catch(() => {
                    this.loading = false
                })
            },
            changeVoUseAmount (record, attr) {
                const balanceAmount = record[attr] - record.voUseAmount
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
            },
            changeStore (obj) {
                const value = obj.target.value
                if (value === 108) {
                    this.$refs.usePlanTable.refresh()
                } else if (value === 109) {
                    this.$refs.surplusTable.refresh()
                } else if (value === 110) {
                    this.$refs.generalTradeTable.refresh()
                }
            },
            refreshStoreBalance (id, disabled) {
                this.selection.storeTypes.forEach(item => {
                    if (item.id === id) {
                        if (disabled) {
                            this.okDisabled = true
                            item.showBalance = 0
                        } else {
                            this.okDisabled = false
                            item.showBalance = item.balance
                        }
                    }
                })
                this.$forceUpdate()
            }
        }
    }
</script>

<style lang="less" scoped>
  .redText {
    color: red;
    background-color: white;
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
