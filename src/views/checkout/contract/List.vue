<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="项目">
                <a-tree-select
                  v-model="queryParam.ProjectGUID"
                  style="width: 100%"
                  :tree-data="cities"
                  :dropdown-style="{ maxHeight: '400px', overflowH: 'auto' }"
                  search-placeholder="请选择"
                  @select="onSelect"
                  :suffixIcon="cities ? '' : '加载中...'"
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
          <a-col :md="24" :sm="24">
            <a-button type="success" @click="search">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
          </a-col>
        </a-row>
      </a-form>

      <a-row>
        <a-col :md="24" :sm="24">
          合同列表
        </a-col>
      </a-row>
      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="contractGuid"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="false"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="contractNo" slot-scope="text, record">
            <a @click="handleToContractInfo(record)">{{text}}</a>
        </span>

        <span slot="contractCategory" slot-scope="text">
            {{text === 15 ? '原合同' : text === 16 ? '补充合同' : '专业分包合同'}}
        </span>

        <span slot="contractAmount" slot-scope="text">
            {{text | NumberFormat}}
        </span>

      </s-table>


      <a-row :gutter="48" style="margin-top: 10px">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button type="success" @click="handleToCompleted" :disabled="!contractGID">新增竣工证书</a-button>
          <a-button type="success" style="margin-left: 10px" @click="handleToAdd">新增合同结算</a-button>
          <a-button type="success" style="margin-left: 10px">打印工程财务结算书</a-button>
        </a-col>
        <a-col :md="24" :sm="24">
          结算列表
        </a-col>
      </a-row>
      <s-table
        style="margin-top: 5px"
        ref="_table"
        size="default"
        rowKey="contractGuid"
        bordered
        :columns="_columns"
        :data="loadData2"
        :alert="false"
        showPagination="auto"
      >

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

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import { STable } from '@/components'
    import { getRoleList } from '@/api/manage'
    import CreateForm from '@/views/list/modules/CreateForm'
    import { fixedList, getPosValue, nullFixedList, getList } from '@/utils/util'
    import { ProjectService } from '@/views/project/project.service'
    import { ChangeService } from '@/views/change/change.service'
    import { formatList } from '@/mock/util'
    import storage from 'store'
    import { CheckoutService } from '../checkout.service'

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
            title: '审核状态',
            dataIndex: 'auditStatus',
            scopedSlots: { customRender: 'auditStatus' }
        },
        {
            title: '结算状态',
            dataIndex: 'balanceStatus',
        },
        {
            title: '合同类型',
            dataIndex: 'contractCategory',
            scopedSlots: { customRender: 'contractCategory' }
        },
        {
            title: '合同总金额(￥)',
            dataIndex: 'contractAmount',
            scopedSlots: { customRender: 'contractAmount' }
        },
        {
            title: '乙方单位',
            dataIndex: 'creatorUser',
            scopedSlots: { customRender: 'creatorUser' }
        }
    ]

    const _columns = [
        {
            title: '竣工证书',
            children: [
                {
                    title: '竣工日期',
                    dataIndex: 'completedDate'
                },
                {
                    title: '竣工证书',
                    dataIndex: 'completedCertificate'
                },
                {
                    title: '是否最终竣工',
                    dataIndex: 'isLastCompleted'
                },
                {
                    title: '发起日期',
                    dataIndex: 'launchDate'
                },
                {
                    title: '审批状态',
                    dataIndex: 'approvalStatus'
                }
            ]
        },
        {
            title: '合同结算',
            children: [
                {
                    title: '结算日期',
                    dataIndex: 'balanceDate'
                },
                {
                    title: '结算申请金额',
                    dataIndex: 'balanceAmount'
                },
                {
                    title: '发起日期',
                    dataIndex: 'launchDate'
                },
                {
                    title: '审批状态',
                    dataIndex: 'approvalStatus'
                }
            ]
        },
        {
            title: '工程结算',
            children: [
                {
                    title: '发起日期',
                    dataIndex: 'launchDate'
                },
                {
                    title: '审批状态',
                    dataIndex: 'approvalStatus'
                }
            ]
        },
        {
            title: '财务结算',
            children: [
                {
                    title: '发起日期',
                    dataIndex: 'launchDate'
                },
                {
                    title: '审批状态',
                    dataIndex: 'approvalStatus'
                }
            ]
        }
    ]

    export default {
        name: 'CheckoutContractList',
        components: {
            STable,
            CreateForm,
        },
        data () {
            this.columns = columns
            this._columns = _columns
            return {
                // create model
                contractGID: '',
                projectType: '',
                cities: null,
                show: false,
                visible: false,
                confirmLoading: false,
                mdl: null,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: {},
                queryParam2: {},
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    if (this.queryParam.ProjectID) {
                        return ChangeService.items(requestParameters).then(res => {
                            return fixedList(res, parameter)
                        })
                    }

                },
                loadData2: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam2)
                    if (this.contractGID) {
                        return CheckoutService.list(this.contractGID).then(res => {
                            return fixedList(res, requestParameters)
                        })
                    } else {
                        return nullFixedList(requestParameters)
                    }
                },
                selectedRowKeys: [],
                selectedRows: []
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
                const value = getPosValue(this.cities)
                this.queryParam.ProjectID = value.projectCode ? value.projectCode : getList(this.cities, 0).projectCode
                this.projectType = value.type ? value.type : getList(this.cities, 0).type
                this.queryParam.ProjectGUID = value.projectGUID ? value.projectGUID : getList(this.cities, 0).projectGUID
                this.$refs.table.refresh()
                this.$forceUpdate()
            })
        },
        computed: {
            rowSelection () {
                const that = this
                return {
                    selectedRowKeys: this.selectedRowKeys,
                    onChange: this.onSelectChange,
                    type: 'radio',
                    onSelect: function (record, selected, selectRows, nativeEvent) {
                        that.contractGID = record.contractGuid
                        that.$refs._table.refresh()
                    }
                }
            }
        },
        methods: {
            handleToContractInfo (record) {
                this.$router.push({ path: `/contract/item/${record.contractGuid}?type=view` })
            },
            onSelect (value, option) {
                storage.set('POS', option.pos)
                this.queryParam.ProjectID = option.$options.propsData.dataRef.projectCode
                this.projectType = option.$options.propsData.dataRef.type
                if (typeof value === 'number') {
                    this.city = value
                    this.queryParam.ProjectGUID = ''
                } else {
                    this.queryParam.ProjectGUID = value
                }
                this.$refs.table.refresh()
                this.$forceUpdate()
            },
            handleToCompleted () {
                this.$router.push({ path: `/checkout/completed/list/0?type=create&contractGID=` + this.contractGID })
            },
            handleToItem (record) {
                this.$router.push({ path: `/contract/item/${record.contractGuid}?type=view` })
            },
            handleToEdit (record) {
                this.$router.push({ path: `/contract/item/${record.contractGuid}?type=edit` })
            },
            handleToAdd () {
                this.$router.push({ path: '/checkout/contract/edit' })
            },
            handleAdd () {
                this.mdl = null
                this.visible = true
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
            onSelectChange (selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                this.selectedRows = selectedRows
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


</style>

