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
                />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-button-group style="float: right">
                <a-button type="success" style="margin-right: 10px" @click="handleAdd">新增年度资金计划</a-button>
                <a-button type="success" style="margin-right: 10px">新增月度资金计划</a-button>
                <a-button type="success">查看历史版本（V1.0）</a-button>
              </a-button-group>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="gid"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="false"
        showPagination="auto"
        :expandIconColumnIndex="1"
      >
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="courseName" slot-scope="text, record">
          <template>
            <span>
              <span :style="{fontWeight: record.isRoot ? 'bold' : '' }">{{record.title}}</span>
              <em style="color: #1e66ca;font-style: normal">{{record.yearVersionAuditStatus ? '（年度：' + record.yearVersionAuditStatus+record.yearVersion + '）' : ''}}</em>
              <em style="color: #1e66ca;font-style: normal">{{record.monthLastVersionAuditStatus ? '（月度：' + record.monthLastVersionAuditStatus+record.monthLastVersion + '）' : ''}}</em>
            </span>
          </template>
        </span>


        <span slot="lastModificationTime" slot-scope="text">
          {{text | moment}}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a-button-group v-if="record.isRoot">
              <a-button>发起审批</a-button>
            </a-button-group>
            <a-button-group v-if="!record.isRoot">
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
              title="修改"
              @click="handleToEdit(record)"></a-button>
            <a-button
              type="primary"
              class="btn-info"
              icon="edit"
              style="margin-left: 4px"
              title="月度修订"></a-button>
              </a-button-group>
          </template>
        </span>
      </s-table>

      <create-annual-funding-plan
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
    import moment from 'moment'
    import { STable, Ellipsis } from '@/components'
    import { getRoleList } from '@/api/manage'

    import StepByStepModal from '@/views/list/modules/StepByStepModal'
    import { getPosValue } from '@/utils/util'
    import { ProjectService } from '@/views/project/project.service'
    import { formatList } from '../../../mock/util'
    import CreateAnnualFundingPlan from '@/views/pay/fundplan/modules/CreateAnnualFundingPlan'
    import { FundPlanService } from './fundplan.service'
    import storage from 'store'

    function fixedList (res, params) {
        const result = {}
        result.pageSize = params.pageSize
        result.pageNo = params.pageNo
        if (res.result.data) {
            result.totalPage = Math.ceil(res.result.data.length / params.pageSize)
            result.totalCount = res.result.data.length
            result.data = _formatList(res.result.data, true)
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
            if (item.elementList && item.elementList.length > 0) {
                item.children = _formatList(item.elementList, false)
                item.children.forEach(child => {
                    child.title = child.elementCode + '-' + child.elementName
                })
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
            title: '操作',
            dataIndex: 'action',
            width: '139px',
            scopedSlots: { customRender: 'action' }
        },
        {
            title: '科目名称',
            scopedSlots: { customRender: 'courseName' }
        },
        {
            title: '金额',
            dataIndex: 'fundingPlanAmountTotal',
        },
        {
            title: '最后修改时间',
            dataIndex: 'lastModificationTime',
            scopedSlots: { customRender: 'lastModificationTime' }
        },
        {
            title: '最后修改人',
            dataIndex: 'lastModifierUser'
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
        name: 'ContractList',
        components: {
            CreateAnnualFundingPlan,
            STable,
            Ellipsis,
            StepByStepModal
        },
        data () {
            this.columns = columns
            return {
                // create model
                value: '',
                city: '',
                projectType: '',
                currentFiscalYear: [],
                cities: [],
                visible: false,
                confirmLoading: false,
                mdl: null,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: {},
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    if (this.queryParam.ProjectGUID && this.queryParam.ProjectID) {
                        const requestParameters = Object.assign({}, parameter, this.queryParam)
                        return FundPlanService.fundingPlanYearList(this.queryParam.ProjectID).then(res => {
                            return fixedList(res, requestParameters)
                        })
                    } else {
                        return []
                    }

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
                const value = getPosValue(this.cities)
                this.queryParam.ProjectID = value.projectCode
                this.projectType = value.type
                this.queryParam.ProjectGUID = value.projectGUID
                this.$refs.table.refresh()
                this.$forceUpdate()
            })
            FundPlanService.currentFiscalYear().then(res => {
                this.currentFiscalYear = res.result.data
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
                this.$router.push({ path: `/pay/fundplan/item/${record.gid}?type=view` })
            },
            handleToEdit (record) {
                this.$router.push({ path: `/pay/fundplan/item/${record.gid}?type=update` })
            },
            handleToAdd () {
                this.$router.push({ path: '/pay/fundplan/item/0?type=create' })
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
                console.log('search')
                this.show = !this.show
                this.$refs.table.refresh(true)
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

  /deep/ .ant-table-footer {
    padding-bottom: 0;
  }

</style>
