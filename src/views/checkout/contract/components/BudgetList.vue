<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <a-radio-group v-if="selection.storeTypes" :value="data.useStore" button-style="solid" :disabled="true">
          <a-radio v-for="item in selection.storeTypes" :key="item.id" :value="item.id">
            {{ item.nameCN }}（<span class="redText">余额：<span>{{ item.balance  | NumberFormat}}</span>元</span>）
          </a-radio>
        </a-radio-group>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-table
          style="margin-top: 10px"
          :style="data.useStore !== 108 ? 'display : none' : ''"
          rowKey="gid"
          :columns="columns"
          :pagination="false"
          :data-source="data.planList"
          bordered
          ref="usePlanTable">
          <label slot="alterPlan" slot-scope="text">{{text | NumberFormat}}</label>
          <label slot="voUseAmount" slot-scope="text">{{text | NumberFormat}}</label>
          <label slot="balanceAmount" slot-scope="text">{{text | NumberFormat}}</label>
        </a-table>
        <a-table
          style="margin-top: 10px"
          :style="data.useStore !== 109 ? 'display : none' : ''"
          row-key="gid"
          :columns="surplusColumns"
          :pagination="false"
          :data-source="data.surplusList"
          bordered
          ref="surplusTable">
          <label slot="surplusAmount" slot-scope="text">{{text | NumberFormat}}</label>
          <label slot="voUseAmount" slot-scope="text">{{text | NumberFormat}}</label>
          <label slot="balanceAmount" slot-scope="text">{{text | NumberFormat}}</label>
        </a-table>
        <a-table
          style="margin-top: 10px"
          :style="data.useStore !== 110 ? 'display : none' : ''"
          row-key="gid"
          :columns="generalTradeColumns"
          :pagination="false"
          :data-source="data.tradeList"
          bordered
          ref="generalTradeTable">
          <label slot="tradeBalanceAmount" slot-scope="text">{{text | NumberFormat}}</label>
          <label slot="voUseAmount" slot-scope="text">{{text | NumberFormat}}</label>
          <label slot="balanceAmount" slot-scope="text">{{text | NumberFormat}}</label>
        </a-table>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
    import { STable, Ellipsis } from '@/components'
    import { ChangeService } from '@/views/change/change.service'

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

    const showKeys = {
        108: {
            'list': 'planList',
        },
        109: {
            'list': 'surplusList',
        },
        110: {
            'list': 'tradeList',
        }
    }

    export default {
        name: 'BudgetList',
        components: {
            STable,
            Ellipsis
        },
        data () {
            this.rowSpans = {}
            this.columns = columns
            this.surplusColumns = surplusColumns
            this.generalTradeColumns = generalTradeColumns
            return {
                selection: { storeTypes: [] }
            }
        },
        created () {

        },
        watch: {
            'selection.storeTypes' () {
                this.$forceUpdate()
            },
            /*'data.useStore' (value) {
                if (value) {
                    if (this.data[showKeys[value].list]) {
                        const usePlanDataTemp = Object.assign([], this.data[showKeys[value].list])
                        usePlanDataTemp.sort((a, b) => {
                            return a.costCenterId === b.costCenterId ? 0 : a.costCenterId > b.costCenterId ? 1 : -1
                        })
                        usePlanDataTemp.forEach(item => {
                            if (this.rowSpans['cost' + item.costCenterId]) {
                                this.rowSpans['cost' + item.costCenterId]++
                            } else {
                                this.rowSpans['cost' + item.costCenterId] = 1
                            }
                        })
                        this.usePlanData = usePlanDataTemp
                    }
                }

            },*/
            'data.contractGID' (value) {
                if (value) {
                    this.getData()
                }
            }
        },
        props: {
            data: {
                type: Object,
                default: null
            },
            type: {
                type: String,
                default: 'view'
            },
            id: {
                type: String,
                default: '0'
            },
            contract: {
                type: Object,
                default: null
            },
            stage: {
                type: String,
                default: 'CIP'
            }
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
    color: red;
    background-color: white;
  }

  table {
    margin: 15px 0;
    width: 100%;
    border-width: 1px 1px 0 0;
    border-radius: 3px 3px 0 0;
    border-style: solid;
    border-color: #ccc;

    thead {
      tr {
        th {
          background-color: #06c;
          color: #fff;
          font-weight: normal;
          border-width: 0 0 1px 1px;
          border-style: solid;
          border-color: #ccc;

          button {
            margin-right: 10px;
          }
        }

      }
    }

    tbody {
      tr {
        td {
          padding: 0.5em 0.6em 0.4em 0.6em !important;
          border-width: 0 0 1px 1px;
          border-style: solid;
          border-color: #ccc;

          button {
            margin-right: 10px;
          }
        }
      }
    }
  }
</style>