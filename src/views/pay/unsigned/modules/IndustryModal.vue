<template>
  <a-modal
    :visible="visible"
    :width="90%"
    title="新增预算"
    :maskClosable="false"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div>
      <a-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="elementInfoId"
        v-if="columnDatas.length > 0"
        bordered
        :columns="columns"
        :scroll="{x : tableWidth,y : 300}"
        :data-source="columnDatas"
        :alert="false"
        :pagination="false"
        :default-expand-all-rows="true"
      >
        <template
          v-for="col in slots"
          :slot="col"
          slot-scope="text"
        >
          <template v-if="text && text.length > 0">
            <span v-for="budgetItem in text">
              <a-checkbox
                v-if="budgetItem.amount"
                @change="value => checkChange(value,budgetItem)">{{budgetItem.amount | NumberFormat}}
            </a-checkbox>
              <span v-else>0</span>
            </span>
          </template>
        </template>
      </a-table>
    </div>
  </a-modal>
</template>

<script>
    import { STable, Ellipsis } from '@/components'
    import { UnSignedService } from '../unsigned.service'

    const defaultColumns = [
        {
            title: '科目',
            dataIndex: 'elementInfoNameCN',
            fixed: 'left'
        }
    ]

    const columns = Object.assign([], defaultColumns)

    export default {
        name: 'UnsignedIndustryModal',
        components: {
            STable,
            Ellipsis
        },
        data () {
            this.columns = columns
            return {
                tableWidth: 800,
                visible: false,
                columnDatas: [],
                confirmLoading: false,
                showColumnCodes: ['NWCL'],//存储可展示列code
                slots: [],
                mdl: null,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: {},
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const _columns = JSON.parse(JSON.stringify(defaultColumns))
                    this.columnDatas = []
                    this.showColumnCodes = ['NWCL']
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    if (this.queryParam.ElementTypeId) {
                        this.slots = []
                        return UnSignedService.tradeBudgetTree(this.queryParam.ProjectGUID, this.queryParam.ElementTypeId).then(res => {
                            return UnSignedService.costCenterBudgetItems(this.queryParam.ProjectGUID, this.queryParam.ElementTypeId)
                                .then(res2 => {
                                    if (res2.result.data) {
                                        //追加列
                                        res2.result.data.forEach(column => {
                                            var costName = 'cost_' + column.costCenterId
                                            this.slots.push(costName)
                                            _columns.push({
                                                title: column.costCenterName,
                                                dataIndex: costName,
                                                scopedSlots: { customRender: costName },
                                                // width : 150
                                            })
                                        })
                                        this.columns = _columns
                                        this.$forceUpdate()
                                        //整理数据
                                        const rows = [res.result.data]
                                        this.forEachRow(rows, res2.result.data)
                                        const showRows = this.filterRows(rows)
                                        this.columnDatas = showRows
                                        this.tableWidth = (_columns.length) * 180
                                    }
                                })
                        })
                    }
                }
            }
        },
        created () {

        },
        computed: {},
        methods: {
            // 搜索
            show (option) {
                this.visible = true
                this.queryParam.ProjectGUID = option.projectGUID
                this.queryParam.ElementTypeId = option.elementTypeId
                this.loadData()
                this.$forceUpdate()
            },
            //取消
            handleCancel () {
                this.visible = false
            },
            //确定
            handleOk () {
                const result = { projectGUID: this.queryParam.ProjectGUID, tradeBudgetList: [] }
                //获取选中行业预算
                getResults(this.columnDatas)

                function getResults (datas) {
                    datas.forEach(item => {
                        for (var i in item) {
                            if (i.indexOf('cost_') > -1 && item[i].length > 0) {
                                item[i].forEach(budgetItem => {
                                    if (budgetItem.checked) {
                                        result.tradeBudgetList.push({ tradeBudgeId: budgetItem.id })
                                    }
                                })
                            }
                        }
                        if (item.children && item.children.length > 0) {
                            getResults(item.children)
                        }
                    })
                }

                //若选中的行业预算大于0，进行添加操作
                if (result.tradeBudgetList.length > 0) {
                    UnSignedService.addTradeBudgets(result).then(res => {
                        if (res.result.statusCode === 200) {
                            this.$message.info('添加行业预算成功')
                            this.$emit('on-change-industry', res.result.data)
                            this.closeModal()
                        }
                    })
                } else {
                    this.closeModal()
                }
            },
            closeModal () {
                this.columns = defaultColumns
                this.columnDatas = []
                this.visible = false
            },
            //监听行业预算checkbox变更
            checkChange (obj, item) {
                let myChecked = obj.target.checked
                item.checked = myChecked
            },
            //根据elementId 获取bugetTreeItem中element数据
            forEachBugetItem (datas, elementId) {
                let result = null
                for (var i in datas) {
                    let data = datas[i]
                    if (data.elementInfoId === elementId) {
                        result = data
                        break
                    }
                    if (data.childs && data.childs.length > 0) {
                        result = this.forEachBugetItem(data.childs, elementId)
                        if (result != null) {
                            break
                        }
                    }
                }
                return result
            },
            forEachRow (datas, columnDatas) {
                for (var i in datas) {
                    var data = datas[i]
                    data.children = []
                    columnDatas.forEach(item => {
                        var costName = 'cost_' + item.costCenterId
                        if (item.elementBudgetItemTree) {
                            var costColumn = this.forEachBugetItem([item.elementBudgetItemTree], data.elementInfoId)
                            if (costColumn && costColumn.tradeBudgetInfo && data.tradeBudgetInfos && data.tradeBudgetInfos.length > 0) {
                                data.tradeBudgetInfos.forEach(tradeType => {
                                    let child = {
                                        id: tradeType.id,
                                        costCenterId: tradeType.costCenterId,
                                        budgetValue: tradeType.budgetValue,
                                        elementInfoId: tradeType.elementInfoId + '' + tradeType.id,
                                        elementInfoCode: tradeType.elementInfoCode,
                                        elementInfoNameCN: tradeType.elementInfoNameCN,
                                        itemKey: tradeType.itemKey
                                    }
                                    const repeatChilds = data.children.filter(childTemp => childTemp.itemKey === child.itemKey)
                                    if (repeatChilds.length > 0) {
                                        child = repeatChilds[0]
                                    } else {
                                        data.children.push(child)
                                    }
                                    if (child[costName] == undefined) {
                                        child[costName] = []
                                    }
                                    const temp = costColumn.tradeBudgetInfo
                                    if (child.elementInfoId === temp.elementInfoId + '' + temp.id) {
                                        child[costName].push({
                                            id: child.id,
                                            amount: child.budgetValue,
                                            checked: false
                                        })
                                    }
                                    if (child[costName].length > 0) {
                                        this.showColumnCodes.push(child.elementInfoCode)
                                    }
                                })
                            }
                        }
                    })
                    if (data.childs && data.childs.length > 0) {
                        this.forEachRow(data.childs, columnDatas)
                        data.children = Object.assign([], data.childs)
                        data.childs = undefined
                    }
                }
            },
            filterRows (datas) {
                const rows = []
                datas.forEach(item => {
                    let show = false
                    for (let i in this.showColumnCodes) {
                        const showCode = this.showColumnCodes[i]
                        if (showCode.indexOf(item.elementInfoCode) === 0) {
                            show = true
                            break
                        }
                    }
                    if (show) {
                        rows.push(item)
                        if (item.children && item.children.length > 0) {
                            item.children = this.filterRows(item.children)
                        }
                    }
                })
                return rows
            }
        }
    }
</script>


<style lang="less" scoped>
  /deep/ table {
    td:first-child {
      width: 380px !important;
    }

    th:first-child {
      width: 380px !important;
    }
  }
</style>