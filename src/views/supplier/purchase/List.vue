<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-button type="success" @click="handleToAdd">新供应商录入</a-button>
            <a-button type="primary" style="margin-left: 5px" @click="show = !show">
              <a-icon type="search"></a-icon>
            </a-button>
          </a-col>
        </a-row>
      </a-form>


      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" v-if="show" class="search-form">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="供应商名称">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="编号">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-button type="success">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
          </a-col>
        </a-row>
      </a-form>


      <!--<s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="key"
        bordered
        :columns="columns"
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
      </s-table>-->
      <a-table :columns="columns" :data-source="data" bordered style="margin-top: 20px">
        <template slot="name" slot-scope="text">
          <a>{{ text }}</a>
        </template>
        <template slot="action" slot-scope="text, record">
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
        </template>
        <template slot="detail" slot-scope="text">
          <p>{{text.name}}</p>
          <p>
            <a-button-group>
              <a-button type="success">{{text.status}}</a-button>
            </a-button-group>
            <a-button-group>
              <a-button type="success">{{text.partner}}</a-button>
            </a-button-group>
            <a-button-group>
              <a-button type="success">{{text.tax}}</a-button>
            </a-button-group>
          </p>
          <a-row>
            <a-col :span="12">
              准入时间：{{text.date}}
            </a-col>
            <a-col :span="12">
              供应商类别：{{text.category}}
            </a-col>
            <a-col :span="24">
              公司地址：{{text.address}}
            </a-col>
          </a-row>
        </template>
      </a-table>


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
    import { getRoleList } from '@/api/manage'

    import StepByStepModal from '@/views/list/modules/StepByStepModal'
    import CreateForm from '@/views/list/modules/CreateForm'
    import { ContractService } from '@/views/contract/contract.service'
    import { fixedList } from '@/utils/util'

    const renderContent = (value, row, index) => {
        const obj = {
            children: value,
            attrs: {},
        }
        return obj
    }

    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            abbr: '供应商简称',
            phone: 18889898989,
            address: 'New York No. 1 Lake Park',
            status: '已准入',
            detail: { name:'供应商名称1',status:'待合作',partner:'张三',tax:'一般纳税人',date: '2020-10-16',category:'设计类-人防设计',address:'广东省广州市白云区龙禧中心F1234'},

        },
        {
            key: '2',
            name: 'Jim Green',
            abbr: '供应商简称',
            phone: 18889898888,
            age: 42,
            address: 'London No. 1 Lake Park',
            status: '已准入',
            detail: { name:'供应商名称2',status:'已签约',partner:'李四',tax:'小额纳税人',date: '2020-10-16',category:'设计类-人防设计',address:'广东省广州市白云区龙禧中心F1234'},

        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            abbr: '供应商简称',
            phone: 18900010002,
            address: 'Sidney No. 1 Lake Park',
            status: '已准入',
            detail: { name:'供应商名称3',status:'待合作',partner:'王五',tax:'一般纳税人',date: '2020-10-16',category:'设计类-人防设计',address:'广东省广州市白云区龙禧中心F1234'},
        },
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
        name: 'SupplierPurchaseList',
        components: {
            STable,
            Ellipsis,
            CreateForm,
            StepByStepModal
        },
        data () {
            const columns = [
                {
                    title: '供应商分类',
                    dataIndex: 'name',
                    customRender: (text, row, index) => {
                        return
                    <
                        a
                        href = 'javascript:;' > { text } < /a>;
                    },
                },
                {
                    title: '供应商信息',
                    colSpan: 4,
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                },
                {
                    title: '供应商简称',
                    colSpan: 0,
                    dataIndex: 'abbr',
                    customRender: renderContent,
                },
                {
                    title: '详情',
                    dataIndex: 'detail',
                    colSpan: 0,
                    scopedSlots: { customRender: 'detail' },
                },
                {
                    title: '审批状态',
                    dataIndex: 'status',
                    colSpan: 0,
                    customRender: renderContent,
                },
            ]

            this.columns = columns
            this.data = data
            return {
                // create model
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
                    return ContractService.list(requestParameters).then(res => {
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
                this.$router.push({ path: `/supplier/purchase/item/${record.id}?type=view` })
            },
            handleToEdit (record) {
                this.$router.push({ path: `/supplier/purchase/item/${record.id}?type=edit` })
            },
            handleToAdd () {
                this.$router.push({ path: '/supplier/purchase/edit' })
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

  .ant-btn-group {
    margin-right: 8px;
  }
</style>
