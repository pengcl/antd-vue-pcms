<template>
  <page-header-wrapper :property="{}">
    <a-card :bordered="false">

      <a-row>
        <a-col :md="24" :sm="24">
          <!--          <a-table-->
          <!--            style="margin-top: 5px"-->
          <!--            ref="table"-->
          <!--            size="default"-->
          <!--            rowKey="code"-->
          <!--            bordered-->
          <!--            :columns="columns"-->
          <!--            :data-source="loadData"-->
          <!--            :alert="false"-->
          <!--            showPagination="auto"-->
          <!--          >-->
          <a-table :columns="columns" :dataSource="data" bordered>
            <template
              v-for="col in columns"
              :slot="col"
              slot-scope="text, record, index"
            >
              <div :key="col">
                <a-input
                  v-if="record.editable=true"
                  style="margin: -5px 0"
                  :value="text"
                />
              </div>
            </template>
              <span slot="cost" slot-scope="text">
                <p style="text-align: center">
                  <span style="font-weight: bold;padding-right: 10px">{{text}}</span>
                </p>
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

  function getList(items, costCenters) {
    const list = []
    items.forEach(item => {
      //组装成本中心数据
      const costCenter = []
      costCenters.forEach(center => {
        center.elementItem.childs.forEach(childItem => {
          const obj = {}
          if (item.elementInfoId === childItem.elementInfoId) {
            obj['costCenterId'] = center.costCenterId
            obj['costCenterCode'] = center.costCenterCode
            obj['costCenterName'] = center.costCenterName
            obj['elementInfoId'] = childItem.elementInfoId
            obj['elementInfoCode'] = childItem.elementInfoCode
            obj['elementInfoNameCN'] = childItem.elementInfoNameCN
            obj['amount'] = childItem.amount
            costCenter.push(obj)
          }
        })
        item['costCenter'] = costCenter
      })
      if (item.childs) {
        item.children = getList(item.childs, costCenters)
      } else {
        item.children = null
        item.isEndNode = true
      }
      list.push(item)
    })
    return list
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  export default {
    name: 'table',
    components: {
      STable,
      Ellipsis
    },
    data() {
      return {
        data,
        columns,
        rowSelection,
      };
    },
    filters: {

    },
    created() {
      const result = {result: {data: []}}
      const _columns = JSON.parse(JSON.stringify(defaultColumns))
      const requestParameters = {MaxResultCount: 1000, ProjectGUID: this.ProjectGUID, ElementTypeId: this.id}
      CostService.subjectViewItems(requestParameters).then(res => {
        const list = formatList(res.result.data[0].elementItem.childs, true)
        res.result.data.forEach(item => {
          //组装动态列
          _columns.push(
            {
              title: item.costCenterName,
              dataIndex: 'cost' + item.costCenterId,
              scopedSlots: {customRender: 'cost'}
            }
          )
        })
        result.result.data = getList(list, res.result.data)
        this.columns = _columns
        this.$forceUpdate()
        this.data = getList(list, res.result.data)
      })
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
        if (this.data.length > 0) {
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
          if (res.result.statusCode === 200) {
            this.$message.info('修改成功')
          }
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
