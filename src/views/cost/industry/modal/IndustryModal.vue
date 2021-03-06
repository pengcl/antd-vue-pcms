<template>
  <a-modal
    :visible="visible"
    width="90%"
    title="新增预算"
    :maskClosable="false"
    @cancel="handleCancel"
    @ok="handleOk"
    :confirm-loading="confirmLoading"
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
        :scroll="{ x: tableWidth, y: 300 }"
        :data-source="columnDatas"
        :alert="false"
        :pagination="false"
        :default-expand-all-rows="true"
      >
        <template slot="elementInfoNameCN" slot-scope="text,record">
          <span v-if="!record.children">
            <a-checkbox style="margin-right:8px;" @click="checkAllAmount(record)"></a-checkbox>{{text}}
          </span>
          <span v-if="record.children">
            {{text}}
          </span>
        </template>
        <template v-for="col in slots" :slot="col" slot-scope="text">
          <template v-if="Array.isArray(text)">
            <a-checkbox v-for="budgetItem in text" @change="value => checkChange(value, budgetItem)" :checked="budgetItem.checked">{{
              budgetItem.amount | NumberFormat
            }}</a-checkbox>
          </template>
          <!-- <template v-if="!Array.isArray(text)">
          {{text}}
        </template> -->
        </template>
      </a-table>
    </div>
  </a-modal>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { CostService } from '@/views/cost/cost.service'
import { data as testData } from '@/views/cost/industry/modal/testData'
import { formatList } from '../../../../mock/util'
import { fixedList, formatcu } from '@/utils/util'

const defaultColumns = [
  {
    title: '科目',
    dataIndex: 'elementInfoNameCN',
    fixed: 'left',
    scopedSlots: { customRender: 'elementInfoNameCN' }
  }
]

const columns = Object.assign([], defaultColumns)

export default {
  name: 'CostIndustryModal',
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
      showColumnCodes: ['NWCL'], // 存储可展示列code
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
        if (this.queryParam.id) {
          this.slots = []
          return CostService.budegetTree(requestParameters).then(res => {
            return CostService.budegetTreeItem(requestParameters).then(res2 => {
              // const res2 = testData  //测试数据
              if (res2.result.data != null) {
                // 追加列
                res2.result.data.forEach(column => {
                  var costName = 'cost_' + column.costCenterId
                  this.slots.push(costName)
                  _columns.push({
                    title: column.costCenterName,
                    dataIndex: costName,
                    scopedSlots: { customRender: costName }
                    // width : 150
                  })
                })
                this.columns = _columns
                this.$forceUpdate()
                // 整理数据
                const rows = [res.result.data]
                this.forEachRow(rows, res2.result.data)
                const showRows = this.filterRows(rows)
                console.log('showRows', showRows)
                this.columnDatas = showRows
                this.tableWidth = _columns.length * 180
              }
            })
          })
        }
      }
    }
  },
  created () {},
  props: {
    refreshAllTable: {
      type: Function,
      default: null
    }
  },
  computed: {},
  methods: {
    // 搜索
    show (id) {
      this.visible = true
      this.queryParam.id = id
      this.loadData()
      this.$forceUpdate()
    },
    // 取消
    handleCancel () {
      this.visible = false
    },
    // 确定
    handleOk () {
      this.confirmLoading = true
      const result = { packageId: this.queryParam.id, budgetItemList: [] }
      // 获取选中行业预算
      getResults(this.columnDatas)
      function getResults (datas) {
        datas.forEach(item => {
          for (var i in item) {
            if (i.indexOf('cost_') > -1 && item[i].length > 0) {
              item[i].forEach(budgetItem => {
                if (budgetItem.checked) {
                  result.budgetItemList.push({ tradeBudgeItemId: budgetItem.id })
                }
              })
            }
          }
          if (item.children && item.children.length > 0) {
            getResults(item.children)
          }
        })
      }
      // 若选中的行业预算大于0，进行添加操作
      if (result.budgetItemList.length > 0) {
        CostService.addBudgetItem(result).then(res => {
          if (res.result.statusCode === 200) {
            this.$message.info('添加行业预算成功')
            this.refreshAllTable(true)
            this.confirmLoading=false
            this.closeModal()
          }
        })
      } else {
            this.confirmLoading=false
        this.closeModal()
      }
    },
    closeModal () {
      this.columns = defaultColumns
      this.columnDatas = []
      this.visible = false
    },
    // 监听行业预算checkbox变更
    checkChange (obj, item) {
      const myChecked = obj.target.checked
      item.checked = myChecked
    },
    // 根据elementId 获取bugetTreeItem中element数据
    forEachBugetItem (datas, elementId) {
      let result = null
      for (var i in datas) {
        const data = datas[i]
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
            if (
              costColumn != null &&
              costColumn.tradeBudgetItems.length > 0 &&
              data.tradeTypes &&
              data.tradeTypes.length > 0
            ) {
              data.tradeTypes.forEach(tradeType => {
                let child = {
                  elementInfoId: tradeType.elementId + '' + tradeType.id,
                  elementInfoCode: tradeType.code,
                  elementInfoNameCN: tradeType.nameCN,
                  parentID: tradeType.elementId,
                  orderSeq: 0,
                  children: []
                }
                const repeatChilds = data.children.filter(childTemp => childTemp.elementInfoId === child.elementInfoId)
                if (repeatChilds.length > 0) {
                  child = repeatChilds[0]
                } else {
                  data.children.push(child)
                }
                // 判断科目组是否存在
                if (tradeType.tradeBudgetItemGroups && tradeType.tradeBudgetItemGroups.length > 0) {
                  tradeType.tradeBudgetItemGroups.forEach(group => {
                    let tradeChild = {
                      elementInfoId: tradeType.elementId + '' + tradeType.id + '' + group.id,
                      elementInfoCode: tradeType.code + '' + group.id + '',
                      elementInfoNameCN: group.budgetTitle,
                      parentID: tradeType.elementId + '' + tradeType.id,
                      orderSeq: 0
                    }
                    const repeatTradeChilds = child.children.filter(
                      childTemp => childTemp.elementInfoId === tradeChild.elementInfoId
                    )
                    if (repeatTradeChilds.length > 0) {
                      tradeChild = repeatTradeChilds[0]
                    } else {
                      child.children.push(tradeChild)
                    }
                    if (tradeChild[costName] == undefined) {
                      tradeChild[costName] = []
                    }
                    costColumn.tradeBudgetItems.forEach(temp => {
                      if (tradeChild.elementInfoId == temp.elementInfoId + '' + temp.tradeTypeId + '' + temp.groupId) {
                        tradeChild[costName].push({ id: temp.id, amount: temp.budgetValue, checked: false })
                      }
                    })
                    if (tradeChild[costName].length > 0) {
                      this.showColumnCodes.push(tradeChild.elementInfoCode)
                    }
                  })
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
        for (const i in this.showColumnCodes) {
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
    },
    checkAllAmount(record){
      const checkAll = !record.checkAll
      this.slots.forEach(item =>{
        if(record[item]){
          record[item].forEach(trendColumn =>{
            trendColumn.checked = checkAll
          })
        }
      })
      record.checkAll = checkAll
      this.$forceUpdate()
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
