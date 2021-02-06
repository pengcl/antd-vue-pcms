<template>
  <a-modal
    :visible="visible"
    width="90%"
    :maskClosable="false"
    title="分摊工具"
    :confirm-loading="confirmLoading"
    @ok="handleOk">
    <template slot="footer">
      <a-button
        key="compute"
        @click="computeShareAmount"
        type="success"
        :disabled="selectedRows.length < 1">
        分摊金额计算
      </a-button>
      <a-button key="back" @click="handleCancel">
        关闭
      </a-button>
      <a-button
        key="submit"
        type="primary"
        @click="handleOk">
        确认
      </a-button>
    </template>
    <a-form-model ref="_form" :model="data" :rules="rules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row :gutter="48">
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="清单项类别"
            prop="itemType"
            :rules="[{ required: true, message: '请选择清单项类别'}]">
            <a-select placeholder="请选择" v-model="data.itemType">
              <a-select-option
                v-for="(item, index) in selection.itemTypes"
                :key="index"
                :value="item.code"
              >{{ item.nameCN }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="分摊方式"
            prop="shareType"
            :rules="[{ required: true, message: '请选择分摊方式'}]"
          >
            <a-select placeholder="请选择" v-model="data.shareType">
              <a-select-option
                v-for="(item, index) in selection.shareTypes"
                :key="index"
                :value="item.id"
              >{{ item.nameCN }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="总金额"
            prop="allAmount"
            :rules="[{ required: true, message: '请输入总金额'}]"
          >
            <a-input-number
              v-model="data.allAmount"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
              :precision="2"
            ></a-input-number>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <a-form-model ref="form" :model="data" :rules="tableRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-table
        style="margin-top: 10px"
        :row-key="record => record.costCenter"
        :columns="columns"
        :data-source="data.tableData"
        bordered
        ref="table"
        :pagination="false"
        :rowSelection="rowSelection"
      >
            <span slot="costCenter" slot-scope="text, item, index">
                <a-select v-model="item.costCenter" style="width:270px;" :disabled="true">
                    <a-select-option
                      :value="center.id + ''"
                      v-for="center in selection.centers"
                      :text="center.costCenterName"
                      :key="JSON.stringify(center)"
                    >
                    {{ center.costCenterName }}
                    </a-select-option>
                </a-select>
            </span>

        <span slot="secCostAllocateTypeID" slot-scope="text, item, index">
                <a-select v-model="item.secCostAllocateTypeID" style="width: 200px" :disabled="true">
                    <a-select-option v-for="(item,index) in secCostAllocateTypes"
                                     :key="index"
                                     :value="item.id">{{item.nameCN}}
                    </a-select-option>
                </a-select>
         </span>

        <span slot="totalCFAExcludeParking" slot-scope="text">
                {{text | NumberFormat}}
        </span>

        <span slot="totalGFA" slot-scope="text">
                {{text | NumberFormat}}
        </span>

        <span slot="rate" slot-scope="text, item, index">
          <a-form-model-item
            :prop="'tableData.' + index + '.rate'"
          >
            <a-input-number
              style="min-width:200px;margin-top: 12px"
              v-model="item.rate"
              :min="0"
              :max="100"
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
            ></a-input-number>
          </a-form-model-item>
        </span>

        <div slot="allAmount" slot-scope="text, item, index">
          <a-input-number
            :disabled="true"
            style="min-width:200px;"
            v-model="item.allAmount"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\元\s?|(,*)/g, '')"
            :precision="2"
          ></a-input-number>
        </div>
      </a-table>
    </a-form-model>
  </a-modal>
</template>

<script>
    import { STable, Ellipsis } from '@/components'
    import { ChangeService } from '@/views/change/change.service'
    import { Base as BaseService } from '@/api/base'
    import { CostService } from '@/views/project/cost/cost.service'

    const columns = [
        {
            title: '业态成本中心',
            dataIndex: 'costCenter',
            scopedSlots: { customRender: 'costCenter' },
        },
        {
            title: '二次分摊',
            dataIndex: 'secCostAllocateTypeID',
            scopedSlots: { customRender: 'secCostAllocateTypeID' },
        },
        {
            title: '总建筑面积(不含停车库)(CFA)',
            dataIndex: 'totalCFAExcludeParking',
            scopedSlots: { customRender: 'totalCFAExcludeParking' },
        },
        {
            title: '总计容面积(GFA)',
            dataIndex: 'totalGFA',
            scopedSlots: { customRender: 'totalGFA' },
        },
        {
            title: '比例',
            dataIndex: 'rate',
            scopedSlots: { customRender: 'rate' },
        },
        {
            title: '分摊金额',
            dataIndex: 'allAmount',
            scopedSlots: { customRender: 'allAmount' },
        },
    ]

    export default {
        name: 'SplitBQModal',
        components: {
            STable,
            Ellipsis
        },
        data () {
            this.columns = columns
            return {
                // create model
                data: {
                    tableData: [],
                    itemType: null,
                    shareType: null,
                    allAmount: null
                },
                selection: {},
                show: false,
                visible: false,
                confirmLoading: false,
                tableRules: {
                    tableData: [],
                },
                rules: {},
                mdl: null,
                // 高级搜索 展开/关闭
                advanced: false,
                secCostAllocateTypes: null,
                selectedRowKeys: [],
                selectedRows: [],
            }
        },
        props: {
            contract: {
                type: Object,
                default: null
            }
        },
        computed: {
            rowSelection () {
                const that = this
                return {
                    selectedRowKeys: this.selectedRowKeys,
                    onChange: this.onSelectChange,
                    type: 'checkbox',
                    onSelect: function (record, selected, selectRows, nativeEvent) {

                    }
                }
            },
        },
        created () {
            BaseService.itemTypes('vo').then(res => {
                this.selection.itemTypes = res.result.data
                this.$forceUpdate()
            })
            ChangeService.getCostCenters(this.contract.contractGuid).then(res => {
                this.selection.centers = res.result.data
                this.selection.centers.forEach(item => {
                    const param = {
                        costCenter: item.id + '',
                        costCenterName: item.costCenterName,
                        secCostAllocateTypeID: item.secCostAllocateTypeID,
                        totalCFAExcludeParking: item.totalCFAExcludeParking,
                        totalGFA: item.totalGFA
                    }
                    this.data.tableData.push(param)
                })
                this.$forceUpdate()
            })

            ChangeService.getBQShareTypes().then(res => {
                this.selection.shareTypes = res.result.data
                this.$forceUpdate()
            })
            CostService.secCostAllocateTypes().then(res => {
                this.secCostAllocateTypes = res.result.data
            })
        },
        filters: {
            getValue (item) {
                const list = item.costCenter ? item.costCenter.split(';').map(Number) : []
                list.forEach((item, index) => {
                    if (isNaN(item)) {
                        list.splice(index, 1)
                    }
                })
                return list
            }
        },
        watch: {},
        methods: {
            onSelectChange (selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                this.selectedRows = selectedRows
            },
            computeShareAmount () {
                let list = []
                this.selectedRows.forEach(item => {
                    const params = {
                        costCenter: item.costCenter,
                        rate: item.rate / 100
                    }
                    list.push(params)
                })
                const body = [{
                    contractGUID: this.contract.contractGuid,
                    costCenterIdlst: list,
                    shareType: this.data.shareType,
                    allAmount: this.data.allAmount,
                    itemType: this.data.itemType
                }]
                ChangeService.getVOBQByCCShare(body).then(res => {
                    if (res.result.statusCode === 200) {
                        res.result.data.forEach(item => {
                            const index = this.data.tableData.findIndex(d => d.costCenter === item.costCenter)
                            this.data.tableData[index].allAmount = item.allAmount
                            this.$forceUpdate()
                        })
                    }
                })
            },
            showTable () {
                this.visible = true
            },
            handleCancel () {
                this.visible = false
            },
            handleOk () {
                this.confirmLoading = true
                console.log('this.data', this.data)
                let isValid = true
                this.$refs.form.validate(valid => {
                    if (!valid) {
                        isValid = false
                    }
                })
                if (isValid) {
                    this.selectedRows.forEach(item => {
                        item.itemType = this.data.itemType
                        this.$parent.add(undefined, item)
                    })
                    this.confirmLoading = false
                    this.visible = false
                } else {
                    this.confirmLoading = false
                }
            },
        }
    }
</script>

<style lang="less" scoped>

  .ant-form .ant-form-item .ant-form-item-label.ant-col-8 {
    width: 15em;
  }

  .ant-form .ant-form-item .ant-form-item-control-wrapper.ant-col-16 {
    width: calc(100% - 15em);
  }

  /deep/ .has-error .ant-form-explain {
    white-space: nowrap;
  }

  /deep/ .ant-form-item {
    margin-bottom: 8px;
  }

  /deep/ .ant-table-tbody > tr > td {
    padding: 8px 0px 10px !important;
    text-align: center;
  }

  /deep/ .delete-row {
    display: none;
  }

  /deep/ .ant-table-footer {
    padding-bottom: 0;
  }
</style>
