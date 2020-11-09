<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
<!--        <a-row :gutter="48">-->
<!--            <a-col :md="12" :sm="24">-->
<!--                <a-form-item label="项目">-->
<!--                  <a-select-->
<!--                    :disabled="type === 'view'"-->
<!--                    placeholder="请选择"-->
<!--                    v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">-->
<!--                    <a-select-option value="1">广佛新世界第一期</a-select-option>-->
<!--                  </a-select>-->
<!--                </a-form-item>-->
<!--            </a-col>-->
<!--        </a-row>-->
        <a-row>
          <a-col :md="12" :sm="24">
            工程行业预算
            <a-button type="success" style="margin-left: 20px">审批记录</a-button>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-checkbox>Budget Re-allocation</a-checkbox>
          </a-col>
        </a-row>
      </a-form>
      </div>
      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="code"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="false"
        showPagination="auto"
      >
        <span slot="cost" slot-scope="text">
          <p style="text-align: center">
            <span style="font-weight: bold;padding-right: 10px">{{text}}</span>
          </p>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import {CostService} from "@/views/cost/cost.service";
    import {Ellipsis, STable} from "@/components";

    function fixedList (res, params) {
      const result = {}
      result.pageSize = params.pageSize
      result.pageNo = params.pageNo
      if (res.result.data) {
        result.totalPage = Math.ceil(res.result.data.length / params.pageSize)
        result.totalCount = res.result.data.length
        result.data = formatList(res.result.data, true)
      } else {
        result.totalPage = 0
        result.totalCount = 0
        result.data = []
      }
      return result
    }

    function formatList (items, isRoot) {
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

    function getList(items,costCenters){
      const list = []
      items.forEach(item => {
        const obj = {}
        obj.elementInfoId = item.elementInfoId
        obj.elementInfoCode = item.elementInfoCode
        obj.BudgetTitle = item.elementInfoNameCN
        costCenters.forEach(center => {
          const costName = 'cost' + center.costCenterId
          obj[costName] = item.amount
        })
        if (item.childs) {
          const childrenList = getList(item.childs,costCenters)
          childrenList.forEach(child =>{
            obj.children.push(child)
          })
          console.log('obj.children',obj.children,obj)
        } else {
          obj.children = null
          obj.isEndNode = true
        }
        list.push(obj)
        if(item.tradeBudgetInfo){
          const gt = {}
          costCenters.forEach(center => {
            gt.elementInfoId = item.elementInfoId
            gt.TradeTypeNameCN = 'General Trade'
            gt.BudgetTitle = ''
            const costName = 'cost' + center.costCenterId
            gt[costName] = item.tradeBudgetInfo.budgetValue
          })
          list.push(gt)
        }
      })
      return list
    }

    const defaultColumns = [
      {
        title: '行业名称',
        width: '300px',
        dataIndex: 'BudgetTitle'
      },
      {
        title: '行业名称',
        width: '300px',
        dataIndex: 'TradeTypeNameCN'
      }
    ]

    const columns = defaultColumns

    export default {
      name: 'list',
      components: {
        STable,
        Ellipsis
      },
      data () {
        this.columns = columns
        return {
          auditStatus: '',
          cities: [],
          visible: false,
          confirmLoading: false,
          mdl: null,
          // 高级搜索 展开/关闭
          advanced: false,
          // 查询参数
          queryParam: { ProjectGUID:this.$route.query.ProjectGUID },
          // 加载数据方法 必须为 Promise 对象
          loadData: parameter => {
            const _columns = JSON.parse(JSON.stringify(defaultColumns))
            const requestParameters = Object.assign({}, parameter, this.queryParam, { ProjectGUID: this.queryParam.ProjectGUID,ElementTypeId: this.id})
            const result = {
              result: {
                data: []
              }
            }
            return CostService.resolveTreeItems(requestParameters).then(res => {
              if(res.result.data){
                const list = formatList(res.result.data[0].elementItem.childs, true)
                res.result.data.forEach(item => {
                  //组装动态列
                  _columns.push(
                    {
                      title: item.costCenterName,
                      children: [
                        {
                          title: 'Budget Value',
                          dataIndex: 'cost' + item.costCenterId,
                          scopedSlots: { customRender: 'cost' }
                        }
                      ]
                    }
                  )
                })
                //组装动态列对应的行数据
                result.result.data = getList(list,res.result.data)
                console.log(result.result.data)
                this.columns = _columns
                this.$forceUpdate()
              }
              return fixedList(result, parameter)
            })
          },
          selectedRowKeys: [],
          selectedRows: []
        }
      },
      created () {

      },
      computed: {
        rowSelection () {
          return {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
          }
        },
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
        handleToItem (record) {
          this.$router.push({ path: `/cost/enact/item/${record.id}?type=view&ProjectGUID=${this.queryParam.ProjectGUID}` })
        },
        handleToEdit (record) {
          this.$router.push({ path: `/cost/enact/item/${record.id}?type=edit&ProjectGUID=${this.queryParam.ProjectGUID}` })
        },
        handleToAdd () {
          this.$router.push({ path: `/cost/enact/item/0?type=add` })
        },
        handleToResolve () {
          this.$router.push({ path: `/cost/resolve/item/0?type=edit&ProjectGUID=${this.queryParam.ProjectGUID}` })
        },
        onChange (value,option) {
          if (value.length >= 2) {
            this.queryParam.ProjectGUID = value
            this.$refs.table.refresh(true)
          } else {
            this.queryParam.ProjectGUID = ''
            this.$refs.table.refresh(true)
          }
        },
        onSelect (value,option) {
          this.auditStatus = option.dataRef.auditStatus
        }
      }
    }
</script>

<style  lang="less" scoped>
  table {
    margin: 15px 0;
    width: 100%;
    border-width: 1px 1px 0 0;
    border-radius: 3px 3px 0 0;
    border-style: solid;
    border-color: #ccc;

    thead {
      tr {
        &:first-child{
          th{
            background-color: #f5f5f5;
          }
        }
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