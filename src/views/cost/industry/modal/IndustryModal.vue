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
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    if(this.queryParam.id){
                      this.slots = []
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
                              forEachRow(rows,res2.result.data)
                              this.columnDatas = rows
                            }
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
                          var costName = 'cost_'+item.costCenterId
                          if(item.elementBudgetItemTree ){
                            var costColumn = forEachBugetItem([item.elementBudgetItemTree],data.elementInfoId)
                            if(costColumn != null && costColumn.tradeBudgetItems.length > 0){
                              data[costName] = []
                              costColumn.tradeBudgetItems.forEach(temp => {
                                data[costName].push({ id : temp.id , amount : temp.budgetValue,checked : false})
                              })
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
          //取消
          handleCancel(){
            this.visible = false
          },
          //确定
          handleOk(){
            const result = []
            const that = this
            //获取选中行业预算
            getResults(this.columnDatas)
            function getResults(datas){
              datas.forEach(item => {
                for(var i in item){
                  if(i.indexOf('cost_') > -1 && item[i].length > 0){
                    item[i].forEach(budgetItem => {
                      if(budgetItem.checked){
                        result.push({packageId : that.queryParam.id, budgetItemId : budgetItem.id })
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
            if(result.length > 0){
              result.forEach(item => {
                CostService.addBudgetItem(item).then(res =>{
                  if(res.result.statusCode === 200){
                    // this.$message.info('添加行业预算'++'成功')
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
          //监听行业预算checkbox变更
          checkChange(obj,item){
            let myChecked = obj.target.checked
            item.checked = myChecked
          }
        }
    }
</script>
