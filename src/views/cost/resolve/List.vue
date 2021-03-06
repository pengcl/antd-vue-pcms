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
            <a-col :md="12" :sm="24"><span
              class="project-type-tips">{{ projectType === 'noProject' ? '请选择末级项目' : '' }}</span></a-col>
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
        :scroll="{ x:columnsWidth,y: 500 }"
        showPagination="auto"
      >
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="cost" slot-scope="text">
          <p style="text-align: right">
            <span style="font-weight: bold;padding-right: 10px">{{ text.amount|NumberFormat }}</span>
          </p>
        </span>

        <span slot="amountCount" slot-scope="text">
          <p style="text-align: right">
            <span style="font-weight: bold;padding-right: 10px">{{ text|NumberFormat }}</span>
          </p>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            {{ record.code }}
            <a-button
              v-if="ac('EDIT') && record.isRecord"
              @click="handleToResolve(record)"
              type="primary"
              icon="snippets"
              style="margin-left: 4px"
              title="预算分解">
            </a-button>
          </template>
        </span>
      </s-table>
    </a-card>
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
          title: '合计',
          className: 'title-center',
          width: 200,
          fixed: 'left',
          dataIndex: 'amountCount',
          scopedSlots: {customRender: 'amountCount'}
        }
    ]

    const columns = defaultColumns

    export default {
        name: 'CostEnactList',
        components: {
            STable,
            Ellipsis,
            StepByStepModal
        },
        data () {
            this.columns = columns
            return {
                titleIds: [],
                auditStatus: '',
                cities: null,
                visible: false,
                confirmLoading: false,
                mdl: null,
                columnsWidth: 700,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: {},
                projectType: undefined,
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const _columns = JSON.parse(JSON.stringify(defaultColumns))
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    // console.log('loadData request parameters:', requestParameters)
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
                                        this.columnsWidth = 700 + res2.result.data.costCenterBudgetSubPlans.length * 200
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
                                                obj.width = (this.columnsWidth - 700) / res2.result.data.costCenterBudgetSubPlans.length
                                            }

                                            _columns.push(obj)
                                            this.titleIds.push('cost' + subjectItem1.costCenterId)
                                        })
                                        this.columns = _columns
                                        this.$forceUpdate()
                                        const tempCodes = ['B', 'C', 'D', 'E', 'F', 'G']
                                        let allAmountCount = 0 // 汇总列总金额
                                        res.result.data.forEach(item => {
                                            if (tempCodes.includes(item.code)) {
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
                                                                obj[costName] = {
                                                                    amount: itemA.amount,
                                                                    percentage: itemA.percentage
                                                                }
                                                                itemsAmount += itemA.amount
                                                            }
                                                        })
                                                        if (!obj[costName]) {
                                                            obj[costName] = {
                                                                amount: 0,
                                                                percentage: 0
                                                            }
                                                        }
                                                    })
                                                }
                                                // 汇总行总金额
                                                obj['amountCount'] = itemsAmount
                                                // 汇总列总金额
                                                allAmountCount += itemsAmount
                                                // 用来判断是记录还是合计显示
                                                obj['isRecord'] = true
                                                result.result.data.push(obj)
                                            }
                                        })

                                        // 计算列合计金额
                                        const columnObj = {}
                                        columnObj.amountCount = allAmountCount
                                        columnObj.name = '合计'
                                        if (res2.result.data != null) {
                                          res2.result.data.costCenterBudgetSubPlans.forEach(subjectItem2 => {
                                            // 加载成本
                                            let columnAmount = 0
                                            const costName = 'cost' + subjectItem2.costCenterId
                                            subjectItem2.mainElements.forEach(itemA => {
                                              columnAmount += itemA.amount
                                            })
                                            if (columnAmount > 0 ) {
                                              columnObj[costName] = {
                                                amount: columnAmount,
                                                percentage: 0
                                              }
                                            } else {
                                              columnObj[costName] = {
                                                amount: 0,
                                                percentage: 0
                                              }
                                            }
                                          })
                                        }
                                        result.result.data.push(columnObj)
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
            this.queryParam.ProjectID = value.projectCode ? value.projectCode : getList(this.cities, 0).projectCode
            this.projectType = value.type ? value.type : getList(this.cities, 0).type
            this.queryParam.ProjectGUID = value.projectGUID ? value.projectGUID : getList(this.cities, 0).projectGUID
            if (typeof (value.children) !== 'undefined' && value.children.length > 0) {
              this.projectType = 'noProject'
            } else {
              this.projectType = 'project'
            }
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
        activated() {
          this.$refs.table.refresh()
        },
        methods: {
            ac (action) {
              return ac(action, this.$route)
            },
            handleToResolve (record) {
              this.$router.push({ path: `/cost/resolve/item/${record.id}?type=edit&ProjectGUID=${this.queryParam.ProjectGUID}` })
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
            }
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
