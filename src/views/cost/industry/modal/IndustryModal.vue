<template>
  <a-modal
    :visible="visible"
    :width="900"
    title="新增预算"
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
        :data-source="columnDatas"
        :alert="false"
        :pagination="false"
        :default-expand-all-rows="true"
      >
      <template
        v-for ="col in slots"
        :slot="col"
        slot-scope="text"
      >
        <template  v-if="text && text.length > 0">
          <a-checkbox 
            v-for ="budgetItem in text"
            @change="value => checkChange(value,budgetItem)" >{{budgetItem.amount}}</a-checkbox>
        </template>
        <template v-if="text == undefined || text.length < 1">
          0
        </template>
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
    import { fixedList,formatcu } from '@/utils/util'

    const defaultColumns = [
        {
            title: '科目',
            dataIndex: 'elementInfoNameCN'
        }
    ]

    const columns = Object.assign([],defaultColumns)

    export default {
        name: 'CostIndustryModal',
        components: {
            STable,
            Ellipsis
        },
        data () {
            this.columns = columns
            return {
                visible: false,
                columnDatas : [],
                confirmLoading: false,
                showColumnCodes : ['NWCL'],//存储可展示列code
                slots : [],
                mdl: null,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: { },
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const _columns = JSON.parse(JSON.stringify(defaultColumns))
                    this.columnDatas = []
                    this.showColumnCodes = ['NWCL']
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    if(this.queryParam.id){
                      this.slots = []
                      return CostService.budegetTree(requestParameters).then(res => {
                        return CostService.budegetTreeItem(requestParameters)
                          .then(res2 => {
                          // const res2 = testData  //测试数据
                            if (res2.result.data != null) {
                              //追加列
                              res2.result.data.forEach(column => {
                                var costName = 'cost_'+column.costCenterId
                                this.slots.push(costName)
                                _columns.push({
                                  title : column.costCenterName,
                                  dataIndex : costName,
                                  scopedSlots: { customRender: costName }
                                })
                              })
                              this.columns = _columns
                              this.$forceUpdate()
                              //整理数据
                              const rows = [res.result.data]
                              this.forEachRow(rows,res2.result.data)
                              const showRows = this.filterRows(rows)
                              this.columnDatas = showRows
                            }
                          })
                      })
                    }
                }
            }
        },
        created () {
        },
        props : {
          refreshAllTable : {
            type : Function,
            default : null
          }
        },
        computed: {
        },
        methods: {
          // 搜索
          show(id) {
            this.visible = true
            this.queryParam.id = id
            this.loadData()
            this.$forceUpdate()
          },
          //取消
          handleCancel(){
            this.visible = false
          },
          //确定
          handleOk(){
            const result = {packageId : this.queryParam.id, budgetItemList : []}
            //获取选中行业预算
            getResults(this.columnDatas)
            function getResults(datas){
              datas.forEach(item => {
                for(var i in item){
                  if(i.indexOf('cost_') > -1 && item[i].length > 0){
                    item[i].forEach(budgetItem => {
                      if(budgetItem.checked){
                        result.budgetItemList.push( { tradeBudgeItemId : budgetItem.id })
                      }
                    })
                  }
                }
                if(item.children && item.children.length > 0){
                  getResults(item.children)
                }
              })
            }
            //若选中的行业预算大于0，进行添加操作
            if(result.budgetItemList.length > 0){
              CostService.addBudgetItem(result).then(res =>{
                if(res.result.statusCode === 200){
                  this.$message.info('添加行业预算成功')
                  this.refreshAllTable(true)
                  this.closeModal()
                }
              })
            }else{
              this.closeModal()
            }
          },
          closeModal(){
            this.columns = defaultColumns
            this.columnDatas = []
            this.visible = false
          },
          //监听行业预算checkbox变更
          checkChange(obj,item){
            let myChecked = obj.target.checked
            item.checked = myChecked
          },
          //根据elementId 获取bugetTreeItem中element数据
          forEachBugetItem (datas,elementId){
            let result = null
            for(var i in datas){
              let data = datas[i]
              if(data.elementInfoId === elementId){
                result = data
                break
              }
              if(data.childs && data.childs.length > 0){
                result = this.forEachBugetItem(data.childs,elementId)
                if(result != null){
                  break
                }
              }
            }
            return result
          },
          forEachRow (datas,columnDatas){
            for(var i in datas){
              var data = datas[i]
              columnDatas.forEach(item =>{
                var costName = 'cost_'+item.costCenterId
                if(item.elementBudgetItemTree ){
                  var costColumn = this.forEachBugetItem([item.elementBudgetItemTree],data.elementInfoId)
                  if(costColumn != null && costColumn.tradeBudgetItems.length > 0){
                    data[costName] = []
                    this.showColumnCodes.push(data.elementInfoCode)
                    costColumn.tradeBudgetItems.forEach(temp => {
                      data[costName].push({ id : temp.id , amount : temp.budgetValue,checked : false})
                    })
                  }
                }
              })
              if(data.childs && data.childs.length > 0){
                this.forEachRow(data.childs,columnDatas)
                data.children = Object.assign([],data.childs)
                data.childs = undefined
              }
            }
          },
          filterRows(datas){
            const rows = []
            datas.forEach(item => {
              let show = false
              for(let i in this.showColumnCodes){
                const showCode = this.showColumnCodes[i]
                if(showCode.indexOf(item.elementInfoCode) === 0){
                  show = true
                  break
                }
              }
              if(show){
                rows.push(item)
                if(item.children && item.children.length > 0){
                  item.children = this.filterRows(item.children)
                }
              }
            })
            return rows
          }
        }
    }
</script>
