<template>
  <page-header-wrapper :property="{}">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="项目">
                <a-tree-select
                  style="width: 100%"
                  :tree-data="cities"
                  :dropdown-style="{ maxHeight: '400px', overflowH: 'auto' }"
                  search-placeholder="请选择"
                  v-model="queryParam.ProjectGUID"
                  @select="onSelect"
                  :suffixIcon="cities ? '' : '加载中...'">
                </a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="project-type-tips">
                {{ projectType === 'noProject' ? '请选择末级项目' : '' }}
              </span>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item v-if="projectType !== 'noProject'" label="状态">
                {{ auditStatus }}（V.{{ version }}）
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="10" :sm="24">
              <a-button
                v-if="ac('BudgetGather')"
                :disabled="(projectType === undefined || projectType === 'noProject') && isStartAudit === true"
                type="success"
                style="margin-right: 5px"
                @click="handleToCollect">预算汇总
              </a-button>
              <a-button
                :disabled="projectType === undefined || projectType === 'noProject'"
                type="success"
                style="margin-right: 5px;"
                @click="showAuditModal">审批记录</a-button>
              <a-button
                v-if="ac('ImportExport')"
                :disabled="projectType === undefined || projectType === 'noProject' || auditStatus === '审核中'"
                type="success"
                @click="handleToImport">导入导出</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="code"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="false"
        :scroll="{ x: columnsWidth,y: 700 }"
        showPagination="auto"
      >
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="cost" slot-scope="text">
          <p style="text-align: right">
            <span style="font-weight: bold;padding-right: 10px">{{text|NumberFormat}}</span>
            <!--            <span style="color: #b3b3ca">{{text.percentage + '%'}}</span>-->
          </p>
        </span>

        <span slot="auditStatus" slot-scope="text,record">
          <p style="text-align: right">
            <span style="font-weight: bold;padding-right: 10px">{{text}} （V.{{record.version }}）</span>
          </p>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            {{ record.code }}
            <a-button
              v-if="ac('VIEW')"
              @click="handleToView(record)"
              type="success"
              icon="file-text"
              title="查看">
            </a-button>
            <a-button
              :disabled="auditStatus === '审核中'"
              v-if="ac('EDIT') && auditStatus !== '审核中'"
              @click="handleToEdit(record)"
              type="primary"
              icon="form"
              style="margin-left: 4px"
              title="编辑">
            </a-button>
            <a-button
              @click="handleToItem(record)"
              type="primary"
              icon="plus-square"
              style="margin-left: 4px"
              title="审批记录">
            </a-button>
          </template>
        </span>
      </s-table>
    </a-card>
    <!-- 主列表审批记录 -->
    <audit-list-modal ref="auditListModal"></audit-list-modal>
    <!-- 科目审批记录 -->
    <audit-sub-list-modal ref="auditSubListModal"></audit-sub-list-modal>
  </page-header-wrapper>
</template>

<script>
    import { STable, Ellipsis } from '@/components'

    import StepByStepModal from '@/views/list/modules/StepByStepModal'
    import { ProjectService } from '@/views/project/project.service'
    import { CostService } from '@/views/cost/cost.service'
    import { formatList } from '../../../mock/util'
    import { fixedList, getPosValue, getList } from '@/utils/util'
    import storage from 'store'
    import { ac } from '@/views/user/user.service'
    import AuditListModal from '@/views/cost/enact/modal/AuditListModal'
    import AuditSubListModal from '@/views/cost/enact/modal/AuditSubListModal'

    const defaultColumns = [

        {
            title: '科目代码',
            className: 'title-center',
            dataIndex: 'action',
            width: 200,
            fixed: 'left',
            scopedSlots: { customRender: 'action' }
        },
        {
            title: '科目名称',
            className: 'title-center',
            width: 300,
            fixed: 'left',
            dataIndex: 'name'
        },
        {
          title: '审核状态',
          className: 'title-center',
          width: 150,
          fixed: 'left',
          dataIndex: 'auditStatus',
          scopedSlots: { customRender: 'auditStatus' }
        },
        {
          title: '合计',
          className: 'title-center',
          width: 200,
          fixed: 'left',
          dataIndex: 'amountCount',
          scopedSlots: {customRender: 'cost'}
        }
    ]

    const columns = defaultColumns

    export default {
        name: 'CostEnactList',
        components: {
          STable,
          Ellipsis,
          StepByStepModal,
          AuditListModal,
          AuditSubListModal
        },
        data () {
            this.columns = columns
            return {
                titleIds: [],
                auditStatus: '',
                isStartAudit: false,
                version: '',
                cities: null,
                visible: false,
                confirmLoading: false,
                mdl: null,
                columnsWidth: 850,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                ProjectGUID: this.$route.query.ProjectGUID,
                queryParam: {},
                projectType: undefined,
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const _columns = JSON.parse(JSON.stringify(defaultColumns))
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    const result = {
                        result: {
                            data: []
                        }
                    }
                    if (this.queryParam.ProjectGUID && this.projectType !== 'noProject') {
                        return CostService.items(requestParameters).then(res => {
                            const requestParameters2 = Object.assign({}, parameter, { Id: this.queryParam.ProjectGUID })
                            return CostService.subjectItems(requestParameters2)
                                .then(res2 => {
                                    if (res2.result.data != null) {
                                        this.auditStatus = res2.result.data.auditStatus
                                        this.version = res2.result.data.version
                                        this.isStartAudit = res2.result.data.isStartAudit
                                        this.columnsWidth = 850 + res2.result.data.costCenterBudgetSubPlans.length * 200
                                        if (this.columnsWidth < 1560) {
                                            this.columnsWidth = 1560
                                        }
                                        let index = 0
                                        res2.result.data.costCenterBudgetSubPlans.forEach(subjectItem1 => {
                                            ++index
                                            const obj = {}
                                            obj.title = subjectItem1.costCenterName
                                            obj.className = 'title-center'
                                            obj.dataIndex = 'cost' + subjectItem1.costCenterId
                                            obj.scopedSlots = { customRender: 'cost' }
                                            if (index !== res2.result.data.costCenterBudgetSubPlans.length) {
                                                obj.width = (this.columnsWidth - 850) / res2.result.data.costCenterBudgetSubPlans.length
                                            }
                                            _columns.push(obj)
                                            this.titleIds.push('cost' + subjectItem1.costCenterId)
                                        })
                                        this.columns = _columns
                                        this.$forceUpdate()
                                        res.result.data.forEach(item => {
                                            const obj = {}
                                            obj['id'] = item.id
                                            obj['code'] = item.code
                                            obj['name'] = item.nameCN
                                            let itemsAmount = 0
                                            if (res2.result.data != null) {
                                                res2.result.data.costCenterBudgetSubPlans.forEach(subjectItem2 => {
                                                    // 加载成本
                                                    const costName = 'cost' + subjectItem2.costCenterId
                                                    subjectItem2.mainElements.forEach(itemA => {
                                                        if (item.id === itemA.elementTypeId) {
                                                            obj[costName] = itemA.amount
                                                            itemsAmount += itemA.amount
                                                        }
                                                    })
                                                    if (!obj[costName]) {
                                                        obj[costName] = 0
                                                    }
                                                })
                                                res2.result.data.elementAuditList.forEach(subjectItem3 => {
                                                  // 加载科目审批状态
                                                  if (item.id === subjectItem3.mainElementId) {
                                                    obj['auditStatus'] = subjectItem3.auditStatus
                                                    obj['version'] = subjectItem3.version
                                                  }
                                                })
                                            }
                                            obj.amountCount = itemsAmount
                                            result.result.data.push(obj)
                                        })
                                    }
                                    return fixedList(result, parameter)
                                })
                        })
                    } else {
                      return new Promise((resolve) => {
                        resolve(fixedList(result, parameter))
                      })
                    }
                },
                selectedRowKeys: [],
                selectedRows: []
            }
        },
        filters: {},
        created () {
            ProjectService.tree().then(res => {
                const cities = []
                res.result.data.citys.forEach(item => {
                    const children = formatList(item.projects.items, { key: 'type', value: 'project' })
                    cities.push({
                        selectable: false,
                        label: item.city.nameCN,
                        value: item.city.id,
                        children: children
                    })
                })
                this.cities = cities
                const value = getPosValue(this.cities)
                if (this.ProjectGUID === '' || typeof (this.ProjectGUID) === 'undefined') {
                  this.queryParam.ProjectID = value.projectCode ? value.projectCode : getList(this.cities, 0).projectCode
                  this.queryParam.ProjectGUID = value.projectGUID ? value.projectGUID : getList(this.cities, 0).projectGUID
                } else {
                  this.queryParam.ProjectGUID = this.ProjectGUID
                }
                if (typeof (value.children) !== 'undefined' && value.children.length > 0) {
                  this.projectType = 'noProject'
                } else {
                  this.projectType = 'project'
                }
                this.$forceUpdate()
                this.$refs.table.refresh(true)
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
        activated() {
          this.$refs.table.refresh()
        },
        methods: {
            ac (action) {
                return ac(action, this.$route)
            },
            handleToItem (record) {
                this.$refs.auditSubListModal.show(this.queryParam.ProjectGUID, record.id)
            },
            handleToEdit (record) {
                this.$router.push({ path: `/cost/enact/item/${record.id}?type=edit&ProjectGUID=${this.queryParam.ProjectGUID}` })
            },
            handleToCollect () {
                this.$router.push({ path: `/cost/enact/collect?ProjectGUID=${this.queryParam.ProjectGUID}` })
            },
            handleToImport () {
                this.$router.push({ path: `/cost/enact/import?ProjectGUID=${this.queryParam.ProjectGUID}` })
            },
            handleToAdd () {
                this.$router.push({ path: `/cost/enact/item/0?type=add` })
            },
            handleToView (record) {
              this.$router.push({ path: `/cost/enact/item/${record.id}?type=view&ProjectGUID=${this.queryParam.ProjectGUID}` })
            },
            onSelect (value, option) {
              storage.set('POS', option.pos)
              this.projectType = option.$options.propsData.dataRef.type
              this.queryParam.ProjectID = option.$options.propsData.dataRef.projectCode
              if (typeof value === 'number') {
                this.city = value
                this.queryParam.ProjectGUID = ''
              } else {
                this.queryParam.ProjectGUID = value
              }
              if (option.$children.length > 0) {
                this.projectType = 'noProject'
              } else {
                this.projectType = 'project'
              }
              this.$refs.table.refresh()
              this.$forceUpdate()
            },
            showAuditModal() {
                this.$refs.auditListModal.show(this.queryParam.ProjectGUID)
            },
        }
    }
</script>
<style>
  th.title-center,
  td.title-center {
    text-align: center !important;
  }
  .search-form {
    background-color: #1E9FF2;
    padding: 20px;
    border-radius: 0.35rem;

    /deep/ .ant-form-item-label label {
      color: #fff
    }
  }

  .project-type-tips {
    line-height: 32px;
    color: #ff0000;
  }
</style>

