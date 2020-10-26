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
              <a-button icon="search" type="primary" @click="show = !show"></a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" v-if="show" class="search-form">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="合同名称">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合同编号">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="乙方单位">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button type="success">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
          </a-col>
        </a-row>
      </a-form>

      <a-row :gutter="48">
        <a-col :md="24" :sm="24">
          合同列表
        </a-col>
      </a-row>
      <a-table :columns="columns" :data-source="data" bordered>
        <template slot="footer" slot-scope="currentPageData">
          <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-row :gutter="48">
              <a-col :md="12" :sm="24">
                <a-form-item label="累计变更金额"></a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="变更比例"></a-form-item>
              </a-col>
            </a-row>
          </a-form>

        </template>
      </a-table>

        <a-row :gutter="48" style="margin-top: 10px">
          <a-col :md="24" :sm="24" style="margin-bottom: 10px">
            <a-button type="success" @click="handleToAdd">新增CIP</a-button>
            <a-button type="success" style="margin-left: 20px">CIP转VO</a-button>
            <a-button type="success" style="margin-left: 20px" @click="handleToCertificate">现场签证</a-button>
          </a-col>
          <a-col :md="24" :sm="24">
            变更列表
          </a-col>
        </a-row>
      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="key"
        bordered
        :columns="_columns"
        :data="loadData"
        :alert="false"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text,record">
          <template>
            <a-button class="btn-success" type="primary" icon="file-text" title="查看" @click="handleToItem(record)">
            </a-button>
            <a-button class="btn-info" type="primary" icon="form" style="margin-left: 4px" title="编辑"
                      @click="handleToEdit(record)">
            </a-button>
          </template>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <step-by-step-modal ref="modal" @ok="handleOk"/>

    </a-card>
  </page-header-wrapper>
</template>

<script>
    import moment from 'moment'
    import { STable, Ellipsis } from '@/components'
    import { getRoleList, getServiceList } from '@/api/manage'

    import StepByStepModal from '@/views/list/modules/StepByStepModal'
    import CreateForm from '@/views/list/modules/CreateForm'
    import { ProjectService } from '@/views/project/project.service'
    import { formatList } from '../../mock/util'

    const columns = [
        {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            scopedSlots: { customRender: 'approvalStatus' }
        },
        {
            title: '结算状态',
            dataIndex: 'payStatus',
        },
        {
            title: '合同编号',
            dataIndex: 'no'
        },
        {
            title: '合同名称',
            dataIndex: 'description',
            scopedSlots: { customRender: 'description' }
        },
        {
            title: '币种',
            dataIndex: 'currency',
        },
        {
            title: '合同金额',
            dataIndex: 'callNo',
            scopedSlots: { customRender: 'callNo' }
        },
        {
            title: '预计结算金额',
            dataIndex: 'forecastAmount',
        },
        {
            title: '签约日期',
            dataIndex: 'createAt',
        }
    ]

    const _columns = [
        {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' }
        },
        {
            title: '审核状态',
            dataIndex: 'approvalStatus',
            scopedSlots: { customRender: 'approvalStatus' }
        },
        {
            title: '变更编号',
            dataIndex: 'no'
        },
        {
            title: '申请金额',
            dataIndex: 'callNo',
            scopedSlots: { customRender: 'callNo' }
        },
        {
            title: '申报日期',
            dataIndex: 'createAt',
        },
        {
            title: '变更类型',
            dataIndex: 'approvalStatus',
            scopedSlots: { customRender: 'approvalStatus' }
        },
        {
            title: '变更确认',
            dataIndex: 'description',
            scopedSlots: { customRender: 'description' }
        },
        {
            title: '相关现场签证',
            dataIndex: 'present'
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
        name: 'ChangePmiList',
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
                cities:[],
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
                    console.log('loadData request parameters:', requestParameters)
                    return getServiceList(requestParameters)
                        .then(res => {
                            return res.result
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
                    console.log(children)
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
                    onChange: this.onSelectChange
                }
            }
        },
        methods: {
            handleToItem (record) {
                this.$router.push({ path: `/change/cip/item/${record.id}?type=view` })
            },
            handleToEdit (record) {
                this.$router.push({ path: `/change/cip/item/${record.id}?type=edit` })
            },
            handleToAdd () {
                this.$router.push({ path: '/change/cip/edit' })
            },
            handleToCertificate () {
                this.$router.push({ path: '/change/certificate' })
            },
            handleAdd () {
                this.mdl = null
                this.visible = true
            },
            handleEdit (record) {
                this.visible = true
                this.mdl = { ...record }
            },
            handleOk () {
                const form = this.$refs.createModal.form
                this.confirmLoading = true
                form.validateFields((errors, values) => {
                    if (!errors) {
                        console.log('values', values)
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
  /deep/ .ant-table-footer{
    padding-bottom: 0;
  }

</style>
