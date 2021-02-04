<template>
  <a-modal
    :visible="visible"
    width="90%"
    :maskClosable="false"
    title="分摊工具"
    @cancel="handleCancel"
    :confirm-loading="confirmLoading"
    @ok="handleOk">
    <a-row>
      <a-col>
        <div
          style="padding-top:5px; padding-bottom:5px;padding-left:30px;background-color:#f5f5f5;border-bottom:0;border:1px solid #ccc;"
        >
          <a-button icon="plus" @click="add()"> 新增</a-button>
        </div>
        <a-form-model ref="form" :model="data" :rules="tableRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-table
            :row-key="record => record.id"
            :columns="columns"
            :data-source="data.tableData"
            bordered
            ref="table"
            :pagination="false"
          >
            <span slot="action" slot-scope="text, item, index">
                <template>
                <a-button @click="del(index)" icon="close"> 删除 </a-button>
                </template>
            </span>
            <span slot="costCenter" slot-scope="text, item, index">
                <a-form-model-item
                  :prop="'tableData.' + index + '.costCenterIdlst'"
                  :rules="[{ required: true, message: '请选择成本中心' }]"
                >
                <a-select v-model="item.costCenterIdlst" mode="multiple" style="width:270px;">
                    <a-select-option
                      :value="center.id + ''"
                      v-for="center in selection.centers"
                      :text="center.costCenterName"
                      :key="JSON.stringify(center)"
                    >
                    {{ center.costCenterName }}
                    </a-select-option>
                </a-select>
                </a-form-model-item>
            </span>
            <span slot="itemType" slot-scope="text, item, index">
                <a-form-model-item
                  :prop="'tableData.' + index + '.itemType'"
                  :rules="[{ required: true, message: '请选择清单项类别' }]"
                >
                <a-select placeholder="请选择" v-model="item.itemType" style="width: 200px">
                    <a-select-option
                      v-for="(item, index) in selection.itemTypes"
                      :key="index"
                      :value="item.code"
                    >{{ item.nameCN }}
                    </a-select-option>
                </a-select>
                </a-form-model-item>
            </span>
            <span slot="shareType" slot-scope="text, item, index">
                <a-form-model-item
                  :prop="'tableData.' + index + '.shareType'"
                  :rules="[{ required: true, message: '请选择分摊方式' }]"
                >
                <a-select placeholder="请选择" v-model="item.shareType" style="width: 200px">
                    <a-select-option
                      v-for="(item, index) in selection.shareTypes"
                      :key="index"
                      :value="item.id"
                    >{{ item.nameCN }}
                    </a-select-option>
                </a-select>
                </a-form-model-item>
            </span>
            <div slot="allAmount" slot-scope="text, item, index">
              <a-form-model-item
                :prop="'tableData.' + index + '.allAmount'"
                :rules="[{ required: true, message: '请输入金额' }]"
              >
                <a-input-number
                  style="min-width:200px;margin-top: 10px"
                  v-model="item.allAmount"
                  :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                  :precision="2"
                ></a-input-number>
              </a-form-model-item>
            </div>
          </a-table>
        </a-form-model>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
    import { STable, Ellipsis } from '@/components'
    import { Base as BaseService } from '@/api/base'
    import { ContractService } from '@/views/contract/contract.service'

    const columns = [
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            width: '100px'
        },
        {
            title: '业态成本中心',
            dataIndex: 'costCenterIdlst',
            scopedSlots: { customRender: 'costCenter' },
            width: '270px'
        },
        {
            title: '清单项类别',
            dataIndex: 'itemType',
            scopedSlots: { customRender: 'itemType' },
            width: '220px'
        },
        {
            title: '分摊方式',
            dataIndex: 'shareType',
            scopedSlots: { customRender: 'shareType' },
            width: '150px'
        },
        {
            title: '总金额',
            dataIndex: 'allAmount',
            scopedSlots: { customRender: 'allAmount' },
            width: '180px'
        }
    ]

    const contractTypes = {
        '15': 'contract',
        '16': 'sa',
        '17': 'nsc'
    }

    export default {
        name: 'ShareToolModal',
        components: {
            STable,
            Ellipsis
        },
        data () {
            this.columns = columns
            return {
                // create model
                data: { tableData: [] },
                show: false,
                visible: false,
                confirmLoading: false,
                selection: {},
                tableRules: {
                    tableData: [],
                },
                mdl: null,
                // 高级搜索 展开/关闭
                advanced: false
            }
        },
        props: {
            contract: {
                type: Object,
                default: null
            }
        },
        computed: {},
        created () {
            if (this.contract.contract.contractCategory) {
                const contractTypeKey = contractTypes[this.contract.contract.contractCategory + '']
                if (contractTypeKey) {
                    BaseService.itemTypes(contractTypeKey).then(res => {
                        this.selection.itemTypes = res.result.data
                        this.$forceUpdate()
                    })
                }
            }
            ContractService.centers(this.contract.contract.tenderPackageItemID).then(res => {
                this.selection.centers = res.result.data
                this.$forceUpdate()
            })
            BaseService.shareTypes().then(res => {
                this.selection.shareTypes = res.result.data
                this.$forceUpdate()
            })
        },
        methods: {
            showTable () {
                this.visible = true
                if (this.$refs.table) {
                    this.data.tableData = []
                }
            },
            handleCancel () {
                this.visible = false
            },
            handleOk () {
                if (this.data.tableData.length < 1) {
                    this.$message.warn('请添加分摊信息')
                    return
                }
                this.confirmLoading = true
                let isValid = true
                this.$refs.form.validate(valid => {
                    if (!valid) {
                        isValid = false
                    }
                })
                if (isValid) {
                    ContractService.shareTool(this.data.tableData).then(res => {
                        if (res.result.statusCode === 200) {
                            res.result.data.forEach(item => {
                                this.$parent.add(item)
                            })
                            this.confirmLoading = false
                            this.visible = false
                        }
                    }).catch(e => {
                        this.confirmLoading = false
                        console.error('请求获取变更清单分摊数据错误', e)
                    })
                } else {
                    this.confirmLoading = false
                }
            },
            del (index) {
                this.data.tableData.splice(index, 1)
            },
            add () {
                const param = {
                    projectTenderPackageGUID: this.contract.contract.tenderPackageItemID
                }
                this.data.tableData.push(param)
            }
        }
    }
</script>

<style lang="less" scoped>
  /deep/ .ant-form-item-label label {
    color: #fff;
  }

  .ant-form .ant-form-item .ant-form-item-label.ant-col-8 {
    width: 15em;
  }

  .ant-form .ant-form-item .ant-form-item-control-wrapper.ant-col-16 {
    width: calc(100% - 15em);

    .ant-form-item-control {
      .ant-form-item-children {
        .ant-select {
          margin-top: 8px;
        }
      }
    }
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
