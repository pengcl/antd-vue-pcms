<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-row>
            <a-col :md="12" :sm="24">
              工程行业预算
              <a-button type="success" style="margin-left: 20px">审批记录</a-button>
              <a-button type="success" @click="createGT" style="margin-left: 20px">生成GT</a-button>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-checkbox>Budget Re-allocation</a-checkbox>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-row>
        <a-col :md="24" :sm="24">
          <s-table
            style="margin-top: 5px"
            ref="table"
            size="default"
            rowKey="key"
            bordered
            :columns="columns"
            :data="loadData"
            :alert="false"
            showPagination="auto"
            :scroll="{ y: 500 }"
          >
            <span slot="cost" slot-scope="text">
              <p style="text-align: center">
                <span style="font-weight: bold;padding-right: 10px">{{ text|NumberFormat }}</span>
              </p>
            </span>
            <span slot="action" slot-scope="text, record">
              <template>
                <a-button
                  v-if="record.isCreate"
                  @click="showModal(record,'add')"
                  type="primary"
                  icon="plus-square" title="新增">
                </a-button>
                <a-popconfirm v-if="record.isDelete && !record.isUsed" title="是否要删除此行？"
                              @confirm="handleToRemove(record)">
                  <a-button
                    type="danger"
                    icon="delete"
                    style="margin-left: 4px"
                    title="删除"></a-button>
                </a-popconfirm>
                {{ record.code }}
              </template>
            </span>
          </s-table>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="12" :sm="24">
          <a-button type="danger" style="margin-top: 10px" @click="back">关闭</a-button>
        </a-col>
      </a-row>
    </a-card>
    <resolve-modal ref="resolveModal" :refreshParent="refreshTable"></resolve-modal>
  </page-header-wrapper>
</template>

<script>
  import {CostService} from '@/views/cost/cost.service'
  import {Ellipsis, STable} from '@/components'
  import ResolveModal from '@/views/cost/resolve/modal/ResolveModal'
  import StepByStepModal from '@/views/list/modules/StepByStepModal'

  function fixedList(res, params) {
    const result = {}
    result.pageSize = params.pageSize
    result.pageNo = params.pageNo
    if (res.result.data) {
      result.totalPage = Math.ceil(res.result.data.length / params.pageSize)
      result.totalCount = res.result.data.length
      result.data = formatList(res.result.data)
    } else {
      result.totalPage = 0
      result.totalCount = 0
      result.data = []
    }
    return result
  }

  function formatList(items) {
    const list = []
    items.forEach(item => {
      if (item.childs) {
        item.children = formatList(item.childs)
      }
      list.push(item)
    })
    return list
  }

  function getBudgetList(groupId, items) {
    let obj = null
    items.forEach(item => {
      if (item.childs && item.childs.length > 0) {
        const temp = getBudgetList(groupId, item.childs)
        if (temp) {
          obj = temp
        }
      } else if (item.elementItem && item.elementItem.childs) {
        const temp = getBudgetList(groupId, item.elementItem.childs)
        if (temp) {
          obj = temp
        }
      } else if (item.tradeBudgetItems && item.tradeBudgetItems.length > 0) {
        item.tradeBudgetItems.forEach((budget, index) => {
          if (budget.groupId === groupId) {
            obj = {}
            obj['name'] = 'cost' + budget.costCenterId
            obj['value'] = budget.budgetValue
          }
        })
      }
    })
    return obj
  }

  function getCostAmount(elementInfoId, items) {
    let amount = null
    items.forEach(item => {
      if (elementInfoId === item.elementInfoId) {
        const temp = item.amount
        if (temp) {
          amount = temp
        }
      } else if (item.childs) {
        const temp = getCostAmount(elementInfoId, item.childs)
        if (temp) {
          amount = temp
        }
      }
    })
    return amount
  }

  function getGTAmount(elementInfoId, items) {
    let amount = null
    items.forEach(item => {
      if (elementInfoId === item.elementInfoId) {
        const temp = item.tradeBudgetInfo.budgetValue
        if (temp) {
          amount = temp
        }
      } else if (item.childs) {
        const temp = getGTAmount(elementInfoId, item.childs)
        if (temp) {
          amount = temp
        }
      }
    })
    if (amount === null) {
      amount = 0
    }
    return amount
  }

  //根据行数据，循环成本中心组装列数据
  function getList(items, costCenters) {
    const list = []
    items.forEach(item => {
      // 插入科目
      const obj = {}
      obj.key = Number(Math.random().toString() + Date.now()).toString(36)
      obj.elementInfoId = item.elementInfoId
      obj.elementInfoCode = item.elementInfoCode
      obj.elementInfoNameCN = item.elementInfoNameCN
      obj.code = item.elementInfoCode
      costCenters.forEach(center => {
        const costName = 'cost' + center.costCenterId
        obj[costName] = getCostAmount(item.elementInfoId, center.elementItem.childs)
      })
      if (item.childs && item.childs.length > 0) {
        const childrenList = getList(item.childs, costCenters)
        obj.childs = childrenList
        obj.children = obj.childs
      }
      // 插入行业预算
      if (item.tradeBudgetItems && item.tradeBudgetItems.length > 0) {
        const objItems = []
        item.tradeBudgetItems.forEach((budget, index) => {
          const budgetItem = {}
          budgetItem.key = Number(Math.random().toString() + Date.now()).toString(36)
          budgetItem.elementInfoId = budget.elementInfoId
          budgetItem.BudgetTitle = budget.budgetTitle
          budgetItem.elementInfoNameCN = ''
          budgetItem.code = budget.code
          budgetItem.groupId = budget.groupId
          costCenters.forEach(center => {
            const result = getBudgetList(budget.groupId, center.elementItem.childs)
            if (result !== null) {
              budgetItem[result['name']] = result['value']
            }
          })
          budgetItem.isUsed = budget.isUsed
          budgetItem.isDelete = true
          objItems.push(budgetItem)
        })
        if (objItems.length > 0) {
          obj.children = objItems
        }
      }
      list.push(obj)

      // 插入General Trade行
      if (item.tradeBudgetInfo && item.childs && item.childs.length === 0) {
        const gt = {}
        costCenters.forEach((center, index) => {
          gt.key = Number(Math.random().toString() + Date.now()).toString(36)
          gt.elementInfoId = item.elementInfoId
          gt.BudgetTitle = 'General Trade'
          gt.elementInfoNameCN = ''
          const costName = 'cost' + center.costCenterId
          gt[costName] = getGTAmount(item.elementInfoId, center.elementItem.childs)
        })
        list.push(gt)
        obj.gt = gt
        obj.costCenters = costCenters
        obj.isCreate = true
      } else {
        obj.costCenters = null
        obj.isCreate = false
      }
    })
    return list
  }

  //组装行数据
  function getLineData(defaultData, centerData) {
    const list = []
    defaultData.forEach(item => {
      centerData.forEach(center => {
        let list = getTradeBudgetItems(item.elementInfoId, center.elementItem.childs)
        if (list && list.length > 0) {
          list.forEach(budget => {
            if (item.tradeBudgetItems && item.tradeBudgetItems.length > 0) {
              let isHaving = false
              item.tradeBudgetItems.forEach(tradeBudget => {
                if (budget.groupId === tradeBudget.groupId) {
                  isHaving = true
                }
              })
              if (!isHaving) {
                item.tradeBudgetItems.push(budget)
              }
            } else {
              item.tradeBudgetItems.push(budget)
            }
          })
        }
      })
      if (item.childs) {
        item.children = getLineData(item.childs, centerData)
      }
      list.push(item)
    })
    return list
  }

  function getTradeBudgetItems(elementInfoId, items) {
    let budgetList = null
    items.forEach(item => {
      if (elementInfoId === item.elementInfoId) {
          const tradeBudgetItems = item.tradeBudgetItems
          if (tradeBudgetItems) {
            budgetList = tradeBudgetItems
          }
      }else if (item.childs) {
        const tradeBudgetItems = getTradeBudgetItems(elementInfoId, item.childs)
        if (tradeBudgetItems) {
          budgetList = tradeBudgetItems
        }
      }
    })
    return budgetList
  }

  const defaultColumns = [
    {
      title: '科目代码',
      width: 200,
      dataIndex: 'code',
      scopedSlots: {customRender: 'action'}
    },
    {
      title: '行业名称',
      width: 250,
      dataIndex: 'elementInfoNameCN'
    },
    {
      title: '行业名称',
      width: 300,
      dataIndex: 'BudgetTitle'
    }
  ]

  const columns = defaultColumns

  export default {
    name: 'List',
    components: {
      STable,
      Ellipsis,
      ResolveModal
    },
    data() {
      this.columns = columns
      return {
        auditStatus: '',
        cities: [],
        visible: false,
        confirmLoading: false,
        mdl: null,
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {ProjectGUID: this.$route.query.ProjectGUID},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const _columns = JSON.parse(JSON.stringify(defaultColumns))
          const requestParameters = Object.assign({}, parameter, this.queryParam, {
            MaxResultCount: 1000,
            ProjectGUID: this.queryParam.ProjectGUID,
            ElementTypeId: this.id
          })
          const result = {
            result: {
              data: []
            }
          }
          return CostService.resolveTreeItems(requestParameters).then(res => {
            if (res.result.data) {
              res.result.data.forEach(item => {
                // 组装动态列
                _columns.push(
                  {
                    title: item.costCenterName,
                    children: [
                      {
                        title: 'Budget Value',
                        dataIndex: 'cost' + item.costCenterId,
                        scopedSlots: {customRender: 'cost'}
                      }
                    ]
                  }
                )
              })
              // 组装动态列对应的行数据
              const list = getLineData(res.result.data[0].elementItem.childs, res.result.data)
              result.result.data = getList(list, res.result.data)
              this.columns = _columns
              this.$forceUpdate()
            }
            return fixedList(result, parameter)
          })
        }
      }
    },
    filters: {
    },
    created() {

    },
    computed: {
      rowSelection() {
        return {
          selectedRowKeys: this.selectedRowKeys
        }
      },
      id() {
        return this.$route.params.id
      },
      type() {
        return this.$route.query.type
      },
      ProjectGUID() {
        return this.$route.query.ProjectGUID
      }
    },
    methods: {
      back() {
        this.$router.push({path: `/cost/resolve/list`})
      },
      showModal(record, type) {
        CostService.elementTradeTypes({Id: record.elementInfoId}).then(res => {
          record.elementTradeTypes = JSON.parse(JSON.stringify(res.result.data))
          record.ProjectGUID = this.ProjectGUID
          record.type = type
          this.$refs.resolveModal.show(record)
        })
      },
      createGT() {
        CostService.createGT({projectGUID: this.ProjectGUID, planPackageGUID: this.ProjectGUID}).then(res => {
          if (res.result.statusCode === 200) {
            this.$message.info('GeneralTrade已触发生成')
          }
        })
      },
      handleToRemove(record) {
        const requestParameters = Object.assign({
          ProjectGUID: this.ProjectGUID,
          ElementInfoId: record.elementInfoId,
          ItemGroupId: record.groupId
        })
        CostService.removeTradeBudget(requestParameters).then(res => {
          if (res.result.statusCode === 200) {
            this.$message.info('预算分解删除成功').then(() => {
              this.$refs.table.refresh()
            })
          }
        })
      },
      refreshTable() {
        this.$refs.table.refresh()
      }
    }
  }
</script>

<style lang="less" scoped>
  table {
    margin: 15px 0;
    width: 100%;
    border-width: 1px 1px 0 0;
    border-radius: 3px 3px 0 0;
    border-style: solid;
    border-color: #ccc;

    thead {
      tr {
        &:first-child {
          th {
            background-color: #f5f5f5;
          }
        }

        th {
          background-color: #06c;
          color: #fff;
          font-weight: normal;
          border-width: 0 0 1px 1px;
          border-style: solid;
          border-color: #ccc;

          button {
            margin-right: 10px;
          }
        }
      }
    }

    tbody {
      tr {
        td {
          padding: 0.5em 0.6em 0.4em 0.6em !important;
          border-width: 0 0 1px 1px;
          border-style: solid;
          border-color: #ccc;

          button {
            margin-right: 10px;
          }
        }
      }
    }
  }

  /deep/ .ant-table-row-level-2 {
    background: #d7f4ff !important;
  }
</style>
