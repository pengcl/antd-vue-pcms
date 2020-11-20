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
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                {{ auditStatus }}
              </a-form-item>
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
        showPagination="auto"
      >
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="cost" slot-scope="text">
          <p style="text-align: right">
            <span style="font-weight: bold;padding-right: 10px">{{text.amount|amountFormat}}</span>
<!--            <span style="color: #b3b3ca">{{text.percentage + '%'}}</span>-->
          </p>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            {{ record.code }}
            <a-button
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
  import { getRoleList } from '@/api/manage'

  import StepByStepModal from '@/views/list/modules/StepByStepModal'
  import { ProjectService } from '@/views/project/project.service'
  import { CostService } from '@/views/cost/cost.service'
  import { formatList } from '../../../mock/util'
  import {fixedList, getPosValue, nullFixedList} from '@/utils/util'
  import storage from "store";

  const defaultColumns = [

    {
      title: '科目代码',
      className: 'title-center',
      dataIndex: 'action',
      width: '200px',
      scopedSlots: { customRender: 'action' }
    },
    {
      title: '科目名称',
      className: 'title-center',
      dataIndex: 'name'
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
        titleIds:[],
        auditStatus: '',
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
          const _columns = JSON.parse(JSON.stringify(defaultColumns))
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          // console.log('loadData request parameters:', requestParameters)
          const result = {
            result: {
              data: []
            }
          }
          if(this.queryParam.ProjectGUID){
            return CostService.items(requestParameters).then(res => {
              const requestParameters2 = Object.assign({}, parameter, { Id: this.queryParam.ProjectGUID })
              return CostService.subjectItems(requestParameters2)
                .then(res2 => {
                  if (res2.result.data != null) {
                    res2.result.data.costCenterBudgetSubPlans.forEach(subjectItem1 => {
                      _columns.push(
                        {
                          title: subjectItem1.costCenterName,
                          className: 'title-center',
                          dataIndex: 'cost' + subjectItem1.costCenterId,
                          scopedSlots: { customRender: 'cost' }
                        }
                      )
                      this.titleIds.push('cost' + subjectItem1.costCenterId)
                    })
                    this.columns = _columns
                    this.$forceUpdate()
                    const tempCodes = ['B', 'C', 'D', 'G']
                    res.result.data.forEach(item => {
                      if (tempCodes.includes(item.code)) {
                        const obj = {}
                        obj['id'] = item.id
                        obj['code'] = item.code
                        obj['name'] = item.nameCN

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
                              }
                            })
                            if(!obj[costName]){
                              obj[costName] = {
                                amount: 0,
                                percentage: 0
                              }
                            }
                          })
                        }
                        result.result.data.push(obj)
                      }
                    })
                  }
                  return fixedList(result, parameter)
                })
            })
          }else {
            return nullFixedList(requestParameters)
          }
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    filters: {
      amountFormat (value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      },
    },
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
        this.queryParam.ProjectGUID = value.projectGUID
        this.auditStatus = value.auditStatus
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
    methods: {
      handleToResolve (record) {
        this.$router.push({ path: `/cost/resolve/item/${record.id}?type=edit&ProjectGUID=${this.queryParam.ProjectGUID}` })
      },
      onSelect (value, option) {
        storage.set('POS', option.pos)
        this.queryParam.projectGUID = option.$options.propsData.dataRef.projectGUID
        if (typeof value === 'number') {
          this.city = value
          this.queryParam.ProjectGUID = ''
        } else {
          this.queryParam.ProjectGUID = value
        }
        this.auditStatus = option.dataRef.auditStatus
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
</style>

