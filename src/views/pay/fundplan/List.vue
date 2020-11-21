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
                <a-button type="success"
                          style="margin-right: 10px"
                          v-if="queryParam.ProjectID"
                          @click="handleAdd">新增年度资金计划
                </a-button>
                <a-button type="success"
                          v-if="queryParam.ProjectID"
                          style="margin-right: 10px"
                          @click="addMonthPlan">新增月度资金计划
                </a-button>
                <a-button type="success"
                          v-if="queryParam.ProjectID"
                          @click="visible2 = true">查看历史版本（V1.0）
                </a-button>
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
              <em style="color: #1e66ca;font-style: normal" v-if="record.isRoot">{{record.yearVersionAuditStatus ? '（年度：' + record.yearVersionAuditStatus+record.yearVersion + '）' : ''}}</em>
              <em style="color: #1e66ca;font-style: normal" v-if="record.isRoot">{{record.monthLastVersionAuditStatus ? '（月度：' + record.monthLastVersionAuditStatus+record.monthLastVersion + '）' : ''}}</em>
            </span>
          </template>
        </span>

        <span slot="fundingPlanAmountTotal" slot-scope="text">
          {{text | NumberFormat}}
        </span>

        <span slot="lastModificationTime" slot-scope="text">
          {{text | date}}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a-button-group v-if="record.isRoot">
              <a-button @click="startBPM(record)">发起审批</a-button>
            </a-button-group>
            <a-button-group v-if="!record.isRoot">
            <a-button
              class="btn-success"
              type="primary"
              icon="file-text"
              title="查看"
              @click="handleToItem(record)"></a-button>
            <a-button
              :disabled="record.yearVersionAuditStatus !== '未审核'"
              class="btn-info"
              type="primary"
              icon="form"
              style="margin-left: 4px"
              title="修改"
              @click="handleToEdit(record)"></a-button>
            <a-button
              :disabled="record.monthLastVersionAuditStatus !== '未审核'"
              type="primary"
              class="btn-info"
              icon="edit"
              style="margin-left: 4px"
              title="月度修订"
              @click="handToMonthEdit(record)"></a-button>
              </a-button-group>
          </template>
        </span>
      </s-table>

      <create-annual-funding-plan
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        :project="projectValue"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <create-view-history-version
        ref="createViewHistoryModal"
        :visible="visible2"
        :loading="confirmLoading2"
        :model="mdl2"
        :projectCode="queryParam.ProjectID"
        @cancel="handleCancel2"
        @ok="handleOk2"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import { STable } from '@/components'
    import { getRoleList } from '@/api/manage'
    import { getPosValue, nullFixedList } from '@/utils/util'
    import { ProjectService } from '@/views/project/project.service'
    import { formatList } from '../../../mock/util'
    import CreateAnnualFundingPlan from '@/views/pay/fundplan/modules/CreateAnnualFundingPlan'
    import CreateViewHistoryVersion from '@/views/pay/fundplan/modules/CreateViewHistoryVersion'
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
                    child.projectCode = item.projectCode
                    child.year = item.year
                    child.yearVersionAuditStatus = item.yearVersionAuditStatus
                    child.monthLastVersionAuditStatus = item.monthLastVersionAuditStatus
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
            scopedSlots: { customRender: 'fundingPlanAmountTotal' }
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

    export default {
        name: 'FundPlanList',
        components: {
            CreateAnnualFundingPlan,
            STable,
            CreateViewHistoryVersion
        },
        data () {
            this.columns = columns
            return {
                // create model
                value: '',
                city: '',
                projectType: '',
                cities: [],
                fundingPlanYearList: [],
                visible: false,
                confirmLoading: false,
                visible2: false,
                confirmLoading2: false,
                mdl2: null,
                mdl: null,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: {},
                projectValue: {},
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    if (this.queryParam.ProjectGUID && this.queryParam.ProjectID) {
                        return FundPlanService.fundingPlanYearList(this.queryParam.ProjectID).then(res => {
                            this.fundingPlanYearList = res.result.data
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
                this.projectValue = { projectName: value.projectName, projectCode: value.projectCode }
                this.$refs.table.refresh()
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
                this.$router.push({ path: `/pay/fundplan/item/${record.elementCode}?type=view&projectCode=` + record.projectCode + `&year=` + record.year })
            },
            handleToEdit (record) {
                this.$router.push({ path: `/pay/fundplan/item/${record.elementCode}?type=update&projectCode=` + record.projectCode + `&year=` + record.year })
            },
            handToMonthEdit (record) {
                this.$router.push({ path: `/pay/fundplan/item/${record.elementCode}?type=update&status=month&projectCode=` + record.projectCode + `&year=` + record.year })
            },
            handleAdd () {
                this.mdl = null
                this.visible = true
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
                this.projectValue = {
                    projectName: option.$options.propsData.dataRef.projectName,
                    projectCode: this.queryParam.ProjectID
                }
                this.$refs.table.refresh()
                this.$forceUpdate()
            },
            handleOk () {
                const form = this.$refs.createModal.form
                this.confirmLoading = true
                form.validateFields((errors, values) => {
                    if (!errors) {
                        FundPlanService.createFundingPlanYear(values).then(res => {
                            if (res.result.data) {
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

                                    this.$message.info('新增年度资金计划成功！')
                                })
                            } else {
                                this.visible = false
                                this.confirmLoading = false
                                form.resetFields()
                            }
                        })
                        // 新增

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
            handleOk2 () {
                const history = this.$refs.createViewHistoryModal.selected
                this.$router.push({ path: `/pay/fundplan/item/0?type=view&projectCode=` + this.queryParam.ProjectID + `&year=` + history.yearNum })
                this.visible2 = false
            },
            handleCancel2 () {
                this.visible2 = false

                const form = this.$refs.createViewHistoryModal.form
                form.resetFields() // 清理表单数据（可不做）
            },
            addMonthPlan () {
                const body = {
                    projectCode: this.queryParam.ProjectID,
                }
                FundPlanService.createFundingPlanMonth(body).then(res => {
                    if (res.result.data) {
                        this.$message.success('新增月度资金计划成功！')
                        this.$refs.table.refresh()
                    }
                })
            },
            startBPM (record) {
                if (record.yearVersionAuditStatus === '未审核') {
                    FundPlanService.startBPM_Year(record.gid).then(res => {
                        if (res.result.data) {
                            this.$message.success('已启动审批流程')
                            window.location.href = res.result.data
                        }
                    })
                } else {
                    if (!record.monthLastVersionAuditStatus || record.monthLastVersionAuditStatus === '未审核') {
                        FundPlanService.startBPM_Month(record.monthLastVersionGID).then(res => {
                            if (res.result.data) {
                                this.$message.success('已启动审批流程')
                                window.location.href = res.result.data
                            }
                        })
                    }
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
