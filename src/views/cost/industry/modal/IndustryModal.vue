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

    const columns = defaultColumns

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
                    // console.log('loadData request parameters:', requestParameters)
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
                                    if(row.childs.length < 1){
                                      const costCenterId = column.costCenterId
                                      const budgetItemId = 'budgetItemId'+costCenterId
                                      return <a-checkbox v-value="{row[budgetItemId]}">{text}</a-checkbox>
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
        // watch : {
        //   'queryParam.id'(value){
        //     consoe.log('id发生变化',value)
        //     this.$refs.table.refresh()
        //   }
        // },
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
            // this.$refs.table.refresh()
            this.loadData()
            this.$forceUpdate()
          },
          handleCancel(){
            this.visible = false
          },
          handleOk(){
            this.$message.warn('待完善')
            this.visible = false
          }
        }
    }
</script>
