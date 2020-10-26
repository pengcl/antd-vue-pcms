<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="项目">
                <a-cascader
                  :options="cities"
                  placeholder="请选择"
                  @change="onChange"
                />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-button type="primary" style="margin-left: 5px" @click="show = !show">
                <a-icon type="search"></a-icon>
              </a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" v-if="show" class="search-form">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="合同编号">
              <a-input v-model="queryParam.ContractNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合同名称">
              <a-input v-model="queryParam.ContractName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="供应商名称">
              <a-input v-model="queryParam.VendorName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="提交状态">
              <a-select
                placeholder="请选择"
                v-model="queryParam.AuditStatus"
                v-decorator="[queryParam.AuditStatus, { rules: [{required: true, message: '请选择'}] }]">
                <a-select-option value="1">草拟中</a-select-option>
                <a-select-option value="2">已审批</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-button type="success" @click="search()">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
          </a-col>
        </a-row>
      </a-form>

      <s-table :columns="columns" :data="loadData2" bordered>
        <span slot="contractNo" slot-scope="text, record">
            <a @click="getContractAmt(record)">{{text}}</a>
        </span>
        <template slot="footer">
          <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="预计结算金额">{{contractAmt.contractEstimateAmount}}</a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="累计批准金额">{{contractAmt.paymentRequestAmountTotal}} 占
                  {{contractAmt.paymentRequestAmountTotalRatio ? contractAmt.paymentRequestAmountTotalRatio + '%' : ''}}
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="累计付款金额">{{contractAmt.paymentAmountTotal}} 占 {{contractAmt.paymentAmountTotalRatio ?
                  contractAmt.paymentAmountTotalRatio + '%' : ''}}
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>

        </template>
      </s-table>


      <a-row :gutter="48" style="margin-top: 10px">
        <a-col :md="12" :sm="24">
          <a-button type="success" @click="handleToAdd" v-if="id">新增付款</a-button>
          <a-button type="success" style="margin-left: 10px">发票管理</a-button>
        </a-col>
      </a-row>
      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="contractGuid"
        bordered
        :columns="_columns"
        :data="loadData"
        :alert="false"
        showPagination="auto"
      >
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a-button
              class="btn-success"
              type="primary"
              icon="file-text"
              title="查看"
              @click="handleToItem(record)"></a-button>
            <a-button
              class="btn-info"
              type="primary"
              icon="form"
              style="margin-left: 4px"
              title="编辑"
              @click="handleToEdit(record)"></a-button>
            <a-button
              type="primary"
              class="btn-info"
              icon="file-done"
              style="margin-left: 4px"
              title="审批记录"></a-button>
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import moment from 'moment'
    import { STable, Ellipsis } from '@/components'
    import { getRoleList } from '@/api/manage'

    import StepByStepModal from '@/views/list/modules/StepByStepModal'
    import CreateForm from '@/views/list/modules/CreateForm'
    import { fixedList } from '@/utils/util'
    import { ProjectService } from '@/views/project/project.service'
    import { formatList } from '../../../mock/util'
    import { SignedService } from './signed.service'
    import { ContractService } from '@/views/contract/contract.service'

    const columns = [
        {
            title: '合同编号',
            dataIndex: 'contractNo',
            scopedSlots: { customRender: 'contractNo' }
        },
        {
            title: '合同名称',
            dataIndex: 'contractName',
            scopedSlots: { customRender: 'contractName' }
        },
        {
            title: '乙方单位',
            dataIndex: 'partyInfo',
        },
        {
            title: '币种',
            dataIndex: 'currency',
        },
        {
            title: '合同金额',
            dataIndex: 'contractAmount',
            scopedSlots: { customRender: 'contractAmount' }
        },
        {
            title: '审核状态',
            dataIndex: 'auditStatus',
            scopedSlots: { customRender: 'auditStatus' }
        },
        {
            title: '结算状态',
            dataIndex: 'payState',
        }
    ]

    const _columns = [
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
        },
        {
            title: '期数',
            dataIndex: 'contractNo'
        },
        {
            title: '申请日期',
            dataIndex: 'signDate',
            scopedSlots: { customRender: 'signDate' }
        },
        {
            title: '付款单号',
            dataIndex: 'creatorUser',
            scopedSlots: { customRender: 'creatorUser' }
        },
        {
            title: '申请批准金额',
            dataIndex: 'currency',
        },
        {
            title: '支付金额',
            dataIndex: 'contractAmount',
            scopedSlots: { customRender: 'contractAmount' }
        },
        {
            title: '支付日期',
            dataIndex: 'creationTime'
        },
        {
            title: '付款状态',
            dataIndex: 'auditStatus',
            scopedSlots: { customRender: 'auditStatus' }
        }
    ]

    const statusMap = {
        0: {
            status: 'default',
            text: '关闭'
        },
        1: {
            status: 'processing',
            text: '运行中'
        },
        2: {
            status: 'success',
            text: '已上线'
        },
        3: {
            status: 'error',
            text: '异常'
        }
    }

    export default {
        name: 'ContractList',
        components: {
            STable,
            Ellipsis,
            CreateForm,
            StepByStepModal
        },
        data () {
            this.columns = columns
            this._columns = _columns
            return {
                // create model
                id: '',
                contractAmt: {},
                cities: [],
                data: [],
                show: false,
                visible: false,
                confirmLoading: false,
                mdl: null,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: {},
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    if (this.id) {
                        return SignedService.paymentList(this.id).then(res => {
                            return fixedList(res, requestParameters)
                        })
                    } else {
                        const res = {
                            'result': {
                                'data': {
                                    'totalCount': 0,
                                    'items': []
                                }
                            }
                        }
                        console.log(fixedList(res, requestParameters))
                        return fixedList(res, requestParameters)
                    }
                },
                loadData2: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    return SignedService.items(requestParameters).then(res => {
                        return fixedList(res, requestParameters)
                    })
                },
                selectedRowKeys: [],
                selectedRows: []
            }
        },
        filters: {
            statusFilter (type) {
                return statusMap[type].text
            },
            statusTypeFilter (type) {
                return statusMap[type].status
            }
        },
        created () {
            getRoleList({ t: new Date() })
            ProjectService.tree().then(res => {
                const cities = []
                res.result.data.citys.forEach(item => {
                    const children = formatList(item.projects.items)
                    cities.push({
                        label: item.city.nameCN,
                        value: item.city.id,
                        children: children
                    })
                })
                this.cities = cities
                this.$forceUpdate()
            })

        },
        computed: {
            rowSelection () {
                return {
                    selectedRowKeys: this.selectedRowKeys,
                }
            }
        },
        methods: {
            getContractAmt (record) {
                this.id = record.contractGuid
                this.$refs.table.refresh(true)
                SignedService.contractAmt(record.contractGuid).then(res => {
                    this.contractAmt = res.result.data
                })
            },
            handleToItem (record) {
                this.$router.push({ path: `/contract/item/${record.contractGuid}?type=view` })
            },
            handleToEdit (record) {
                this.$router.push({ path: `/contract/item/${record.contractGuid}?type=edit` })
            },
            handleToAdd () {
                this.$router.push({ path: `/pay/signed/item/${this.id}?type=create` })
            },
            handleAdd () {
                this.mdl = null
                this.visible = true
            },
            handleEdit (record) {
                this.visible = true
                this.mdl = { ...record }
            },
            search () {
                this.show = !this.show
                this.$refs.table.refresh(true)
            },
            onChange (value) {
                if (value.length >= 2) {
                    this.queryParam.ProjectGUID = value[value.length - 1]
                    this.$refs.table.refresh(true)
                } else {
                    this.queryParam.ProjectGUID = ''
                    this.$refs.table.refresh(true)
                }
            },
            handleOk () {
                const form = this.$refs.createModal.form
                this.confirmLoading = true
                form.validateFields((errors, values) => {
                    if (!errors) {
                        if (values.id > 0) {
                            // 修改 e.g.
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve()
                                }, 1000)
                            }).then(res => {
                                this.visible = false
                                this.confirmLoading = false
                                // 重置表单数据
                                form.resetFields()
                                // 刷新表格
                                this.$refs.table.refresh()

                                this.$message.info('修改成功')
                            })
                        } else {
                            // 新增
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve()
                                }, 1000)
                            }).then(res => {
                                this.visible = false
                                this.confirmLoading = false
                                // 重置表单数据
                                form.resetFields()
                                // 刷新表格
                                this.$refs.table.refresh()

                                this.$message.info('新增成功')
                            })
                        }
                    } else {
                        this.confirmLoading = false
                    }
                })
            },
            handleCancel () {
                this.visible = false

                const form = this.$refs.createModal.form
                form.resetFields() // 清理表单数据（可不做）
            },
            handleSub (record) {
                if (record.status !== 0) {
                    this.$message.info(`${record.no} 订阅成功`)
                } else {
                    this.$message.error(`${record.no} 订阅失败，规则已关闭`)
                }
            },
            onSelectChange (selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                this.selectedRows = selectedRows
            },
            toggleAdvanced () {
                this.advanced = !this.advanced
            },
            resetSearchForm () {
                this.queryParam = {
                    date: moment(new Date())
                }
            }
        }
    }
</script>

<style lang="less" scoped>
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
