<template>
  <page-header-wrapper :title="type === 'view' ? '查看资金计划分类' : type === 'update' ? '修改资金计划分类' : '新增资金计划'">
    <a-card :bordered="false">
      <a-row :gutter="48">
        <a-col :md="24" :sm="24">
          <a-button :disabled="type === 'view'" v-if="ac('EDIT')" type="success" @click="handleAddIndustry">
            引入专业分判包
          </a-button>
          <a-button type="success"
                    style="margin-left: 10px"
                    v-if="ac('VIEW')"
                    @click="handleViewHistoryVersion">查看历史版本
          </a-button>
        </a-col>
      </a-row>

      <a-table
        v-if="fundingPlanInfo.length > 0"
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="id"
        bordered
        :columns="columns"
        :defaultExpandAllRows="true"
        :data-source="fundingPlanInfo"
        :alert="false"
        :pagination="false"
        showPagination="auto"
        :expandIconColumnIndex="0"
        :scroll="{ x: 3500}"
      >
        <span slot="businessAmt" slot-scope="text">
          {{text | NumberFormat}}
        </span>

        <span slot="businessPayAmt" slot-scope="text">
          {{text | NumberFormat}}
        </span>

        <span slot="planTotalAmount" slot-scope="text,record"
              :style="{color: record.planTotalAmount > record.businessAmt ? 'red' : ''}">
          {{text | NumberFormat}}
        </span>

        <span slot="month_7" slot-scope="text,record">
          <a-input-number :value="text"
                          :style="{backgroundColor: record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_7') === -1 ) ? '' : 'skyblue'}"
                          @change="e => onChange(e,record,'month_7')"
                          :disabled="record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_7') === -1 )"
                          :min="0"
                          :max="record.businessAmt"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </span>

        <span slot="month_8" slot-scope="text,record">
          <a-input-number :value="text"
                          :style="{backgroundColor: record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_8') === -1 ) ? '' : 'skyblue'}"
                          @change="e => onChange(e,record,'month_8')"
                          :disabled="record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_8') === -1 )"
                          :min="0"
                          :max="record.businessAmt"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </span>

        <span slot="month_9" slot-scope="text,record">
          <a-input-number :value="text"
                          :style="{backgroundColor: record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_9') === -1 ) ? '' : 'skyblue'}"
                          @change="e => onChange(e,record,'month_9')"
                          :disabled="record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_9') === -1 )"
                          :min="0"
                          :max="record.businessAmt"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </span>

        <span slot="month_10" slot-scope="text,record">
          <a-input-number :value="text"
                          :style="{backgroundColor: record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_10') === -1 ) ? '' : 'skyblue'}"
                          @change="e => onChange(e,record,'month_10')"
                          :disabled="record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_10') === -1 )"
                          :min="0"
                          :max="record.businessAmt"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </span>

        <span slot="month_11" slot-scope="text,record">
          <a-input-number :value="text"
                          :style="{backgroundColor: record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_11') === -1 ) ? '' : 'skyblue'}"
                          @change="e => onChange(e,record,'month_11')"
                          :disabled="record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_11') === -1 )"
                          :min="0"
                          :max="record.businessAmt"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </span>

        <span slot="month_12" slot-scope="text,record">
          <a-input-number :value="text"
                          :style="{backgroundColor: record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_12') === -1 ) ? '' : 'skyblue'}"
                          @change="e => onChange(e,record,'month_12')"
                          :disabled="record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_12') === -1 )"
                          :min="0"
                          :max="record.businessAmt"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </span>

        <span slot="month_1" slot-scope="text,record">
          <a-input-number :value="text"
                          :style="{backgroundColor: record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_1') === -1 ) ? '' : 'skyblue'}"
                          @change="e => onChange(e,record,'month_1')"
                          :disabled="record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_1') === -1 )"
                          :min="0"
                          :max="record.businessAmt"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </span>

        <span slot="month_2" slot-scope="text,record">
          <a-input-number :value="text"
                          :style="{backgroundColor: record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_2') === -1 ) ? '' : 'skyblue'}"
                          @change="e => onChange(e,record,'month_2')"
                          :disabled="record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_2') === -1 )"
                          :min="0"
                          :max="record.businessAmt"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </span>

        <span slot="month_3" slot-scope="text,record">
          <a-input-number :value="text"
                          :style="{backgroundColor: record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_3') === -1 ) ? '' : 'skyblue'}"
                          @change="e => onChange(e,record,'month_3')"
                          :disabled="record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_3') === -1 )"
                          :min="0"
                          :max="record.businessAmt"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </span>

        <span slot="month_4" slot-scope="text,record">
          <a-input-number :value="text"
                          :style="{backgroundColor: record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_4') === -1 ) ? '' : 'skyblue'}"
                          @change="e => onChange(e,record,'month_4')"
                          :disabled="record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_4') === -1 )"
                          :min="0"
                          :max="record.businessAmt"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </span>

        <span slot="month_5" slot-scope="text,record">
          <a-input-number :value="text"
                          :style="{backgroundColor: record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_5') === -1 ) ? '' : 'skyblue'}"
                          @change="e => onChange(e,record,'month_5')"
                          :disabled="record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_5') === -1 )"
                          :min="0"
                          :max="record.businessAmt"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </span>

        <span slot="month_6" slot-scope="text,record">
          <a-input-number :value="text"
                          :style="{backgroundColor: record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_6') === -1 ) ? '' : 'skyblue'}"
                          @change="e => onChange(e,record,'month_6')"
                          :disabled="record.isRoot || type === 'view' || (status === 'month' && fiscalMonth.indexOf('Month_6') === -1 )"
                          :min="0"
                          :max="record.businessAmt"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </span>

      </a-table>

      <create-industry-subcontracting
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        :elementID="elementID"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <create-view-history-version
        ref="createViewHistoryModal"
        :visible="visible2"
        :loading="confirmLoading2"
        :model="mdl2"
        :projectCode="projectCode"
        :year="year"
        @cancel="handleCancel2"
        @ok="handleOk2"
      />

      <a-row :gutter="48">
        <a-col :md="24" :sm="24" style="margin: 10px 0">
          <a-button-group v-if="type === 'view' && originData.result.data.auditStatus !== '未审核' && ac('VIEW')">
            <a-button @click="view" type="success">
              查看审批
            </a-button>
          </a-button-group>
          <a-button-group v-if="type !== 'view' && ac('EDIT')">
            <a-button @click="save" type="success" :disabled="disabled">
              储存
            </a-button>
          </a-button-group>
          <a-button-group>
            <a-button @click="back" type="danger">
              关闭
            </a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import CreateIndustrySubcontracting from './modules/CreateIndustrySubcontracting'
    import CreateViewHistoryVersion from './modules/CreateViewHistoryVersion'
    import { FundPlanService } from '@/views/pay/fundplan/fundplan.service'
    import { STable } from '@/components'
    import notification from 'ant-design-vue/es/notification'
    import { Base as BaseService } from '@/api/base'
    import { ac } from '@/views/user/user.service'

    function fixedList (res) {
        const result = {}
        let total = {
            businessAmt: 0,
            businessPayAmt: 0,
            planTotalAmount: 0,
            month_7: 0,
            month_8: 0,
            month_9: 0,
            month_10: 0,
            month_11: 0,
            month_12: 0,
            month_1: 0,
            month_2: 0,
            month_3: 0,
            month_4: 0,
            month_5: 0,
            month_6: 0
        }
        if (res.result.data) {
            result.totalCount = res.result.data.elementList.length
            result.data = _formatList(res.result.data.elementList, true)
            res.result.data.elementList.forEach((item, index) => {
                item.id = index
                if (item.detailList.length > 0) {
                    item.detailList.forEach(d => {
                        total.businessAmt += d.businessAmt
                        total.businessPayAmt += d.businessPayAmt
                        total.planTotalAmount += d.planTotalAmount
                        total.month_7 += d.month_7
                        total.month_8 += d.month_8
                        total.month_9 += d.month_9
                        total.month_10 += d.month_10
                        total.month_11 += d.month_11
                        total.month_12 += d.month_12
                        total.month_1 += d.month_1
                        total.month_2 += d.month_2
                        total.month_3 += d.month_3
                        total.month_4 += d.month_4
                        total.month_5 += d.month_5
                        total.month_6 += d.month_6
                    })
                    item.businessAmt = total.businessAmt
                    item.businessPayAmt = total.businessPayAmt
                    item.planTotalAmount = total.planTotalAmount
                    item.month_7 = total.month_7
                    item.month_8 = total.month_8
                    item.month_9 = total.month_9
                    item.month_10 = total.month_10
                    item.month_11 = total.month_11
                    item.month_12 = total.month_12
                    item.month_1 = total.month_1
                    item.month_2 = total.month_2
                    item.month_3 = total.month_3
                    item.month_4 = total.month_4
                    item.month_5 = total.month_5
                    item.month_6 = total.month_6
                }
            })
        } else {
            result.totalPage = 0
            result.totalCount = 0
            result.data = []
        }
        return result
    }

    function _formatList (items, isRoot) {
        const list = []
        items.forEach(item => {
            item.isRoot = isRoot
            if (item.isRoot) {
                item.businessName = item.elementName
            }
            if (item.detailList && item.detailList.length > 0) {
                item.children = _formatList(item.detailList, false)
            } else {
                item.children = null
                item.isEndNode = true
            }
            list.push(item)
        })
        return list
    }

    const columns = [
        {
            title: '项目名称',
            dataIndex: 'elementCode',
            colSpan: 2,
        },
        {
            title: '节点',
            dataIndex: 'businessName',
            colSpan: 0
        },
        {
            title: '金额',
            dataIndex: 'businessAmt',
            align: 'center',
            scopedSlots: { customRender: 'businessAmt' }
        },
        {
            title: '已支付',
            dataIndex: 'businessPayAmt',
            align: 'center',
            scopedSlots: { customRender: 'businessPayAmt' }
        },
        {
            title: '计划支付',
            dataIndex: 'planTotalAmount',
            align: 'center',
            scopedSlots: { customRender: 'planTotalAmount' }
        },
        {
            title: 'Jul-20',
            dataIndex: 'month_7',
            scopedSlots: { customRender: 'month_7' },
        },
        {
            title: 'Aug-20',
            dataIndex: 'month_8',
            scopedSlots: { customRender: 'month_8' },
        },
        {
            title: 'Sep-20',
            dataIndex: 'month_9',
            scopedSlots: { customRender: 'month_9' },
        },
        {
            title: 'Oct-20',
            dataIndex: 'month_10',
            width: '180px',
            scopedSlots: { customRender: 'month_10' },
        },
        {
            title: 'Nov-20',
            dataIndex: 'month_11',
            scopedSlots: { customRender: 'month_11' },
        },
        {
            title: 'Dec-20',
            dataIndex: 'month_12',
            scopedSlots: { customRender: 'month_12' },
        },
        {
            title: 'Jan-21',
            dataIndex: 'month_1',
            scopedSlots: { customRender: 'month_1' },
        },
        {
            title: 'Feb-21',
            dataIndex: 'month_2',
            scopedSlots: { customRender: 'month_2' },
        },
        {
            title: 'Mar-21',
            dataIndex: 'month_3',
            scopedSlots: { customRender: 'month_3' },
        },
        {
            title: 'Apr-21',
            dataIndex: 'month_4',
            scopedSlots: { customRender: 'month_4' },
        },
        {
            title: 'May-21',
            dataIndex: 'month_5',
            scopedSlots: { customRender: 'month_5' },
        },
        {
            title: 'Jun-21',
            dataIndex: 'month_6',
            scopedSlots: { customRender: 'month_6' },
        },

    ]

    export default {
        name: 'Item',
        components: { CreateViewHistoryVersion, CreateIndustrySubcontracting, STable },
        data () {
            this.columns = columns
            return {
                disabled: false,
                elementID: 0,
                visible: false,
                confirmLoading: false,
                mdl: null,
                visible2: false,
                confirmLoading2: false,
                mdl2: null,
                queryParam: {},
                originData: null,
                fiscalMonth: [],
                fundingPlanInfo: [],
                /*loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    if (!this.originData) {
                        return FundPlanService.fundingPlanInfo(this.projectCode, this.year, this.month ? this.month : 0, this.id === '0' ? '' : this.id).then(res => {
                            this.originData = res
                            if (res.result.data.elementList.length > 0) {
                                this.elementID = res.result.data.elementList[0].elementID
                            }
                            return fixedList(this.originData, requestParameters)
                        })
                    } else {
                        return new Promise((resolve, reject) => {
                            return resolve(fixedList(this.originData, requestParameters))
                        })
                    }
                },*/
            }
        },
        computed: {
            id () {
                return this.$route.params.id
            },
            type () {
                return this.$route.query.type
            },
            projectCode () {
                return this.$route.query.projectCode
            },
            year () {
                return this.$route.query.year
            },
            month () {
                return this.$route.query.month
            },
            status () {
                return this.$route.query.status
            },
        },
        watch: {
            '$route' (path) {
                this.originData = null
                this.loadData()
            }
        },
        created () {
            if (this.status) {
                FundPlanService.currentFiscalMonth().then(res => {
                    res.result.data.forEach(item => {
                        this.fiscalMonth.push(item.fieldName)
                    })
                })
            }
            this.loadData()
        },
        methods: {
            ac (action) {
                return ac(action, this.$route)
            },
            loadData () {
                if (!this.originData) {
                    return FundPlanService.fundingPlanInfo(this.projectCode, this.year, this.month ? this.month : 0, this.id === '0' ? '' : this.id).then(res => {
                        this.originData = res
                        if (res.result.data.elementList.length > 0) {
                            this.elementID = res.result.data.elementList[0].elementID
                        }
                        this.fundingPlanInfo = fixedList(this.originData).data
                    })
                } else {
                    this.fundingPlanInfo = fixedList(this.originData).data
                }
            },
            handleAddIndustry () {
                this.mdl = null
                this.visible = true
            },
            handleViewHistoryVersion () {
                this.mdl2 = null
                this.visible2 = true
            },
            handleOk () {
                this.$refs.createModal.selected.forEach(item => {
                    const params = {
                        id: item.id,
                        businessGID: item.tenderPackageGUID,
                        businessType: '专业分判包',
                        businessName: item.packageTitle,
                        businessAmt: item.budgetAmount,
                        businessPayAmt: 0,
                        planTotalAmount: 0,
                        month_7: 0,
                        month_8: 0,
                        month_9: 0,
                        month_10: 0,
                        month_11: 0,
                        month_12: 0,
                        month_1: 0,
                        month_2: 0,
                        month_3: 0,
                        month_4: 0,
                        month_5: 0,
                        month_6: 0,
                        isNew: true
                    }
                    this.originData.result.data.elementList[0].detailList.push(params)
                })
                this.visible = false
                this.$refs.createModal.$refs.tenderPacakge.clearSelected()
                this.loadData()
            },
            handleCancel () {
                this.visible = false

                const form = this.$refs.createModal.form
                form.resetFields() // 清理表单数据（可不做）
            },
            handleOk2 () {
                const history = this.$refs.createViewHistoryModal.selected
                this.$router.push({ path: `/pay/fundplan/item/${this.id}?type=view&projectCode=` + this.projectCode + `&year=` + history.yearNum + `&month=` + history.monthNum })
                this.visible2 = false
            },
            handleCancel2 () {
                this.visible2 = false

                const form = this.$refs.createViewHistoryModal.form
                form.resetFields() // 清理表单数据（可不做）
            },
            save () {
                this.disabled = true
                const body = this.originData.result.data
                FundPlanService.update(body).then(res => {
                    if (res.result.data) {
                        this.$message.success('修改成功')
                        this.$router.push({ path: '/pay/fundplan/list' })
                    } else {
                        this.disabled = false
                    }
                })

            },
            back () {
                this.$router.push({ path: '/pay/fundplan/list' })
            },
            onChange (value, record, key) {
                record[key] = value
                let total = {
                    month_7: 0,
                    month_8: 0,
                    month_9: 0,
                    month_10: 0,
                    month_11: 0,
                    month_12: 0,
                    month_1: 0,
                    month_2: 0,
                    month_3: 0,
                    month_4: 0,
                    month_5: 0,
                    month_6: 0
                }
                this.originData.result.data.elementList.forEach(item => {
                    item.detailList.forEach(d => {
                        total[key] += d[key]
                        d.planTotalAmount = d.month_7 + d.month_8 + d.month_9 + d.month_10 + d.month_11 + d.month_12 + d.month_1 + d.month_2 + d.month_3 + d.month_4 + d.month_5 + d.month_6
                        if (record.businessGID === d.businessGID) {
                            if (d.planTotalAmount > d.businessAmt) {
                                notification.error({
                                    message: '提示',
                                    description: '计划支付不能大于合同金额！'
                                })
                                this.disabled = true
                            } else {
                                this.disabled = false
                            }
                        }

                    })
                    item[key] = total[key]
                })
                this.loadData()
            },
            view () {
                BaseService.viewBpm(this.originData.result.data.monthNum ? this.originData.result.data.gid : this.originData.result.data.fundingPlanGID).then(res => {
                    const tempwindow = window.open('_blank')
                    tempwindow.location = res.result.data
                })
            },
        }
    }
</script>

<style lang="less" scoped>
  .ant-btn-group {
    margin-right: 8px;
  }

  /deep/ .ant-table-body {
    .ant-table-thead {
      tr {
        th:first-child {
          min-width: 200px;
        }
      }
    }
  }

  table tbody tr td .ant-input-number {
    min-width: 160px;
  }
</style>
