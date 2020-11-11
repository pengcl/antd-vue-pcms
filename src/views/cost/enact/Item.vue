<template>
  <page-header-wrapper :property="{}">
    <a-card :bordered="false">

      <a-row>
        <a-col :md="24" :sm="24">
          <a-table
            style="margin-top: 5px"
            ref="table"
            size="default"
            rowKey="elementInfoId"
            bordered
            :columns="columns"
            :data-source="datas"
            :alert="false"
            :pagination="false"
          >
          <span :slot="'cost' + item.costCenterId" v-for="item in ars" :key="'cost' + item.costCenterId" slot-scope="text, record">
            <a-input-number
              v-if="record.childs.length ==0"
              v-model="record['cost' + item.costCenterId]"
              @change="e => checkChange(e.target.value, record, item.costCenterId)"
              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
            />
            <template v-else>
              {{ record['cost' + item.costCenterId] }}
            </template>
          </span>
          </a-table>
        </a-col>
      </a-row>
      <a-row style="margin-top: 10px">
        <a-col :md="12" :sm="24">
          <a-button style="margin-right: 20px" type="success">启动审批流程</a-button>
          <a-button @click="handleToSave" type="success">储存</a-button>
          <a-button @click="back" style="margin-left: 5px" type="danger">关闭</a-button>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-button-group style="float: right">
            <a-button style="margin-right: 10px" type="success">导入导出</a-button>
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
  import {SwaggerService} from "@/api/swagger.service";
  import {Ellipsis, STable} from "@/components";

  const defaultColumns = [
    {
      title: '科目代码',
      width: '150px',
      dataIndex: 'elementInfoCode',
      key: 'elementInfoCode'
    },
    {
      title: '科目名称',
      width: '350px',
      dataIndex: 'elementInfoNameCN',
      key: 'elementInfoNameCN'
    }
  ]

  const columns = defaultColumns

  function formatList(items, isRoot) {
    const list = []
    items.forEach(item => {
      item.isRoot = isRoot
      if (item.childs) {
        item.children = formatList(item.childs, false)
      } else {
        item.children = null
        item.isEndNode = true
      }
      list.push(item)
    })
    return list
  }



  export default {
    name: 'table',
    components: {
      STable,
      Ellipsis
    },
    data () {
      this.columns = columns
      return {
        visible: false,
        datas : [],
        ars: [],
        isUpdate: false,
        confirmLoading: false,
        mdl: null,
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: { },
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const _columns = JSON.parse(JSON.stringify(defaultColumns))
          const requestParameters = {MaxResultCount: 1000, ProjectGUID: this.ProjectGUID, ElementTypeId: this.id}
          return CostService.subjectViewItems(requestParameters).then(res => {
            this.ars = res.result.data
            this.ars.forEach(item => {
              // 组装动态列
              _columns.push(
                {
                  title: item.costCenterName,
                  dataIndex: 'cost' + item.costCenterId,
                  scopedSlots: { customRender: 'cost' + item.costCenterId }
                }
              )
            })
            this.columns = _columns
            this.$forceUpdate()
            const rows = res.result.data[0].elementItem.childs
            forEachRow(rows, res.result.data)
            this.datas = rows
            console.log(this.datas)
          })

          function forEachItem (datas, elementId){
            let result = null
            for(var i in datas){
              let data = datas[i]
              if(data.elementInfoId === elementId){
                result = data
                break
              }
              if(data.childs && data.childs.length > 0){
                result = forEachItem(data.childs,elementId)
                if(result != null){
                  break
                }
              }
            }
            return result
          }

          function forEachRow (datas, columnDatas){
            for(var i in datas){
              var data = datas[i]
              data['costCenters'] = []
              columnDatas.forEach(item =>{
                if( item.elementItem ){
                  var costName = 'cost'+item.costCenterId
                  if (item.elementItem) {
                      var costColumn = forEachItem([item.elementItem],data.elementInfoId)
                      if(costColumn != null){
                        data[costName] = costColumn.amount !== null ? costColumn.amount : 0
                      }
                  }
                }
              })
              if(data.childs && data.childs.length > 0){
                forEachRow(data.childs,columnDatas)
                data.children = data.childs
              }
            }
          }
        },
      }
    },
    filters: {

    },
    created() {
      this.loadData()
    },
    computed: {
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
        this.$router.push({path: `/cost/enact/list?ProjectGUID=${this.ProjectGUID}`})
      },
      handleToSave() {
        const result = {}
        const items = []
        //组装保存数据
        result['ProjectGUID'] = this.ProjectGUID
        result['budgetBaseTypeId'] = 83
        result['elementTypeId'] = this.id
        getResults(this.datas)
        function getResults(datas){
          datas.forEach(item => {
            if(item.costCenters.length > 0){
              item.costCenters.forEach(center =>{
                items.push(center)
              })
            }
            if(item.children && item.children.length > 0){
              getResults(item.children)
            }
          })
        }
        result['items'] = items
        CostService.update(result).then(res => {
          if (res.result.statusCode === 200) {
            this.$message.info('修改成功')
          }
        })
      },
      checkChange(value,record,costCenterId){
        //找到如果数据内存在旧数据，先移除，再添加
        this.isUpdate = false
        record.costCenters.forEach(center =>{
          if(center.costCenterId===costCenterId){
            center.amount = value
            this.isUpdate = true
          }
        })
        if(!this.isUpdate){
          const item ={}
          item['costCenterId'] = costCenterId
          item['elementInfoId'] = record.elementInfoId
          item['amount'] = value
          record.costCenters.push(item)
        }
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
