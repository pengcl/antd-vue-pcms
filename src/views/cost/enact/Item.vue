<template>
  <page-header-wrapper :property="{}">
    <a-card :bordered="false">

      <a-row>
        <a-col :md="24" :sm="24">
          <table>
            <thead>
            <tr>
              <th style="width: 30%">科目代码</th>
              <th style="width: 40%">科目名称</th>
              <th v-for="(item,index) in titels" :key="index">
                {{item.costCenterName}}
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in data" :key="index">
              <td>
                {{item.elementInfoCode}}
              </td>
              <td>
                {{item.elementInfoNameCN}}
              </td>
              <td v-for="(costCenterItem,index) in item.costCenter" :key="index">
                <a-input v-model="costCenterItem.amount"></a-input>
              </td>
            </tr>
            </tbody>
          </table>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="12" :sm="24">
          <a-button type="success" style="margin-right: 20px">启动审批流程</a-button>
          <a-button type="success" @click="handleToSave">储存</a-button>
          <a-button type="danger" style="margin-left: 5px" @click="back">关闭</a-button>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-button-group style="float: right">
            <a-button type="success" style="margin-right: 10px">导入导出</a-button>
            <a-button type="success">审批记录</a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import {CostService} from "@/views/cost/cost.service"
    import {ContractService} from "@/views/contract/contract.service";
    export default {
        name: 'Item',
        data () {
          return {
            data:[],
            titels:[],
            loading: false
          }
        },
        filters: {

        },
        created () {
            const requestParameters = {ProjectGUID:this.ProjectGUID,ElementTypeId:this.id}
            CostService.subjectViewItems(requestParameters).then(res => {
                this.titels = res.result.data
                //创建行数据
                const items = []
                res.result.data.forEach(item => {
                    item.elementItem.childs.forEach(childItem => {
                        const len = items.length // this.list是要插入的数据列表，array
                        if(len===0){
                          items.push(childItem)
                        }else{
                          let flag = false // 定义一个标识符
                          for (let i = 0; i < len; i++) {
                            if(items[i].elementInfoCode===childItem.elementInfoCode){
                              flag = true
                              break
                            }
                          }
                          if(!flag){
                            items.push(childItem)
                          }
                        }
                    })
                })
                //插入动态列数据
                items.forEach(item =>{
                  const costCenter = []
                    res.result.data.forEach(costCenterItem => {
                        costCenterItem.elementItem.childs.forEach(childItem => {
                            const obj = {}
                            if(item.elementInfoId === childItem.elementInfoId){
                              obj['costCenterId'] = costCenterItem.costCenterId
                              obj['costCenterCode'] = costCenterItem.costCenterCode
                              obj['costCenterName'] = costCenterItem.costCenterName
                              obj['elementInfoId'] = childItem.elementInfoId
                              obj['elementInfoCode'] = childItem.elementInfoCode
                              obj['elementInfoNameCN'] = childItem.elementInfoNameCN
                              obj['amount'] = childItem.amount
                              costCenter.push(obj)
                            }
                        })
                      item['costCenter'] = costCenter
                    })
                })
                this.data = items
                // console.log(this.data)
                this.$forceUpdate()
            })
        },
        computed: {
            id () {
              return this.$route.params.id
            },
            type () {
              return this.$route.query.type
            },
            ProjectGUID () {
              return this.$route.query.ProjectGUID
            }
        },
        methods: {
            filterParties () {
              const items = []
              if (this.data.childs.forEach) {
                this.data.childs.forEach(item => {
                    items.push(item)
                })
              }
              return items
            },
            back () {
                this.$router.push({ path: `/cost/enact/list` })
            },
            handleToSave () {
              const result = {}
              const items = []
              //组装保存数据
              result['ProjectGUID'] = this.ProjectGUID
              result['budgetBaseTypeId'] = 83
              result['elementTypeId'] = this.id
              if (this.data.length>0) {
                this.data.forEach(item => {
                  item.costCenter.forEach(centerItem => {
                    const obj = {}
                    obj['costCenterId'] = centerItem.costCenterId
                    obj['elementInfoId'] = centerItem.elementInfoId
                    obj['amount'] = centerItem.amount
                    items.push(obj)
                  })
                })
              }
              result['items'] = items
              CostService.update(result).then(res => {
                console.log(res)
              })
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
</style>
