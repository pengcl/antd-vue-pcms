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
            :scroll="{ y: 500 }"
            :defaultExpandAllRows="true"
          >
            <span :slot="'cost' + item.costCenterId" v-for="item in ars" :key="'cost' + item.costCenterId"
                  slot-scope="text, record">
              <a-input-number
                :disabled="type === 'view'"
                v-if="record.childs.length == 0"
                v-model="record['cost' + item.costCenterId]"
                @change="e => checkChange(e, record, item.costCenterId)"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              />
              <template v-else>
                {{ record['cost' + item.costCenterId]| NumberFormat }}
              </template>
            </span>
          </a-table>
        </a-col>
      </a-row>
      <a-row style="margin-top: 10px">
        <a-col :md="12" :sm="24">
          <a-button style="margin-right: 20px" type="success">启动审批流程</a-button>
          <a-button :disabled="type === 'view'" @click="handleToSave" type="success">储存</a-button>
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
    import { CostService } from '@/views/cost/cost.service'
    import { ContractService } from '@/views/contract/contract.service'
    import { SwaggerService } from '@/api/swagger.service'
    import { Ellipsis, STable } from '@/components'

    const defaultColumns = [
        {
            title: '科目代码',
            width: 250,
            dataIndex: 'elementInfoCode',
            key: 'elementInfoCode'
        },
        {
            title: '科目名称',
            width: 250,
            dataIndex: 'elementInfoNameCN',
            key: 'elementInfoNameCN'
        }
    ]

    const columns = defaultColumns

    export default {
        name: 'Table',
        components: {
            STable,
            Ellipsis
        },
        data () {
            this.columns = columns
            return {
                visible: false,
                datas: [],
                ars: [],
                isUpdate: false,
                confirmLoading: false,
                mdl: null,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: {},
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const _columns = JSON.parse(JSON.stringify(defaultColumns))
                    const requestParameters = {
                        MaxResultCount: 1000,
                        ProjectGUID: this.ProjectGUID,
                        ElementTypeId: this.id
                    }
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
                        const result = []
                        const obj = insertFirstRow(res.result.data[0].elementItem, res.result.data)
                        obj['childs'] = rows
                        obj['children'] = rows
                        result.push(obj)
                        this.datas = result
                    })

                    function forEachItem (datas, elementId) {
                        let result = null
                        for (var i in datas) {
                            const data = datas[i]
                            if (data.elementInfoId === elementId) {
                                result = data
                                break
                            }
                            if (data.childs && data.childs.length > 0) {
                                result = forEachItem(data.childs, elementId)
                                if (result != null) {
                                    break
                                }
                            }
                        }
                        return result
                    }

                    function forEachRow (datas, columnDatas) {
                        for (var i in datas) {
                            var data = datas[i]
                            data['costCenters'] = []
                            console.log(data)
                            columnDatas.forEach(item => {
                                if (item.elementItem) {
                                    var costName = 'cost' + item.costCenterId
                                    if (item.elementItem) {
                                        var costColumn = forEachItem([item.elementItem], data.elementInfoId)
                                        if (costColumn != null) {
                                            data[costName] = costColumn.amount !== null ? costColumn.amount : 0
                                        }
                                    }
                                }
                            })
                            if (data.childs && data.childs.length > 0) {
                                forEachRow(data.childs, columnDatas)
                                data.children = data.childs
                            }
                        }
                    }

                    function insertFirstRow (data, columnDatas) {
                        data['costCenters'] = []
                        columnDatas.forEach(item => {
                            var costName = 'cost' + item.costCenterId
                            if (item.elementItem) {
                                var costColumn = forEachItem([item.elementItem], data.elementInfoId)
                                if (costColumn != null) {
                                    data[costName] = costColumn.amount !== null ? costColumn.amount : 0
                                }
                            }
                        })
                        return data
                    }
                }
            }
        },
        filters: {},
        created () {
            this.loadData()
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
            back () {
                this.$router.push({ path: `/cost/enact/list` })
            },
            handleToSave () {
                const result = {}
                const items = []
                // 组装保存数据
                result['ProjectGUID'] = this.ProjectGUID
                result['budgetBaseTypeId'] = 83
                result['elementTypeId'] = this.id
                getResults(this.datas)

                function getResults (datas) {
                    datas.forEach(item => {
                        if (item.costCenters.length > 0) {
                            item.costCenters.forEach(center => {
                                items.push(center)
                            })
                        }
                        if (item.children && item.children.length > 0) {
                            getResults(item.children)
                        }
                    })
                }

                result['items'] = items
                CostService.update(result).then(res => {
                    if (res.result.statusCode === 200) {
                        this.$message.info('修改成功')
                        this.back()
                    }
                })
            },
            checkChange (value, record, costCenterId) {
                // 找到如果数据内存在旧数据，先移除，再添加
                this.isUpdate = false
                record.costCenters.forEach(center => {
                    if (center.costCenterId === costCenterId) {
                        center.amount = value
                        this.isUpdate = true
                    }
                })
                let totalCost = 0
                console.log(this.datas)
                this.datas.forEach(item => {
                    item.children.forEach(child => {
                        let childCost = 0
                        if(child.children){
                          child.children.forEach(_child => {
                            childCost += _child['cost' + costCenterId]
                          })
                        }else{
                          childCost += child['cost' + costCenterId]
                        }
                        child['cost' + costCenterId] = childCost
                        totalCost += child['cost' + costCenterId]
                    })
                    item['cost' + costCenterId] = totalCost
                })
                if (!this.isUpdate) {
                    const item = {}
                    item['costCenterId'] = costCenterId
                    item['elementInfoId'] = record.elementInfoId
                    item['amount'] = value
                    record.costCenters.push(item)
                }
                //循环组装处理合计金额

                this.$forceUpdate()
            },
            onCellChange (key, dataIndex, value, tableName) {
                var obj = {
                    index: key.index,
                    title: key.title
                }
                obj[dataIndex] = value
                const dataSource = [...this[tableName]]
                const target = dataSource.find(item => item.index === key.index)
                if (target) {
                    if (target[dataIndex] !== value) {
                        target[dataIndex] = value
                        if (!dataSource[0][dataIndex]) {
                            dataSource[0][dataIndex] = 0
                        }
                        dataSource[0][dataIndex] += value * 1
                        this[tableName] = dataSource
                    }
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

  /deep/ .ant-table-row-level-1 {
    background: #d7f4ff !important;
  }
</style>
