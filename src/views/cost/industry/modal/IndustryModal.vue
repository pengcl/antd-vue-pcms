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
        bordered
        :columns="columns"
        :data-source="columnDatas"
        :alert="false"
        :pagination="false"
      >
      <span slot="elementInfoId" slot-scope="text,record">
        <a-checkbox >测试一下{{record.cost1}}</a-checkbox>
      </span>
      </a-table>
    </div>
  </a-modal>
</template>

<script>
    import { STable, Ellipsis } from '@/components'
    import { CostService } from '@/views/cost/cost.service'
    import { formatList } from '../../../../mock/util'
    import { fixedList } from '@/utils/util'

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
                mdl: null,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: { },
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const _columns = JSON.parse(JSON.stringify(defaultColumns))
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    if(this.queryParam.id){
                      return CostService.budegetTree(requestParameters).then(res => {
                        return CostService.budegetTreeItem(requestParameters)
                          .then(res2 => {
                            var result = {
                              result : {
                                data : []
                              }
                            }
                            if (res2.result.data != null) {
                              //追加列
                              res2.result.data.forEach(column => {
                                _columns.push({
                                  title : column.costCenterName,
                                  dataIndex : 'cost'+column.costCenterId,
                                  customRender : (text,row,index) =>{
                                    if(row.childs.length < 1 && row.id){
                                      const budgetItemCheckId = 'budgetItemId'+column.costCenterId
                                      const myChangeEvent = (e) =>{
                                        this.checkChange(e,row,budgetItemCheckId)
                                      }
                                      const content = (<a-checkbox onClick={myChangeEvent}>{text}</a-checkbox>)
                                      const obj = {
                                        children : content
                                      }
                                      return obj
                                    }else{
                                      return text
                                    }
                                  }
                                })
                              })
                              this.columns = _columns
                              this.$forceUpdate()
                              //整理数据
                              const rows = [res.result.data]
                              forEachRow(rows,res2.result.data)
                              this.columnDatas = rows
                              // console.log('rows',JSON.stringify(rows))
                            }
                            // return fixedList(result, parameter)
                          })
                      })
                    }
                    //根据elementId 获取bugetTreeItem中element数据
                    function forEachBugetItem (datas,elementId){
                      let result = null
                      for(var i in datas){
                        let data = datas[i]
                        if(data.elementInfoId === elementId){
                          result = data
                          break
                        }
                        if(data.childs && data.childs.length > 0){
                          result = forEachBugetItem(data.childs,elementId)
                          if(result != null){
                            break
                          }
                        }
                      }
                      return result
                    }

                    function forEachRow (datas,columnDatas){
                      for(var i in datas){
                        var data = datas[i]
                        columnDatas.forEach(item =>{
                          var costName = 'cost'+item.costCenterId
                          if(item.elementBudgetItemTree ){
                            var costColumn = forEachBugetItem([item.elementBudgetItemTree],data.elementInfoId)
                            if(costColumn != null){
                              data[costName] = costColumn.amount
                              data['budgetItemId'+item.costCenterId] = costColumn.id
                            }
                          }
                        })
                        if(data.childs && data.childs.length > 0){
                          forEachRow(data.childs,columnDatas)
                          data.children = data.childs
                        }
                      }
                    }
                }
            }
        },
        created () {
        },
        computed: {
        },
        methods: {
          // 搜索
          show(id) {
            this.visible = true
            console.log('调用展示窗口',id)
            this.queryParam.id = id
            this.loadData()
            this.$forceUpdate()
          },
          handleCancel(){
            this.visible = false
          },
          handleOk(){
            var result = []
            var that = this
            getResults(this.columnDatas)
            function getResults(datas){
              datas.forEach(item => {
                for(var i in item){
                  if(i.indexOf('budgetItemCheck') > -1 && item[i]){
                    console.log('itemId',i)
                    result.push({packageId : that.queryParam.id, budgetItemId : item['budgetItemId'+(i.replace('budgetItemCheck',''))] })
                  }
                  if(item.children && item.children.length > 0){
                    getResults(item.children)
                  }
                }
              })
            }
            console.log('result',result)
            if(result.length > 0){
              result.forEach(item => {
                CostService.addBudgetItem(item).then(res =>{
                  if(res.result.statusCode === 200){
                    this.$message.info('添加行业预算成功')
                    this.closeModal()
                  }
                })
              })
            }else{
              this.closeModal()
            }
          },
          closeModal(){
            this.columns = defaultColumns
            this.columnDatas = []
            this.visible = false
            this.$forceUpdate()
          },
          checkChange(obj,record,budgetItemId){
            if(obj.target.checked){
              record['budgetItemCheck'+record[budgetItemId]] = true
            }else{
              record['budgetItemCheck'+record[budgetItemId]] = false
            }
          }
        }
    }
</script>
