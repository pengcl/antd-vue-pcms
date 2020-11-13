<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-row>
            <a-col :md="12" :sm="24">
              工程行业预算
              <a-button type="success" style="margin-left: 20px">审批记录</a-button>
              <a-button type="success" @click="createGT" style="margin-left: 20px">生成GT</a-button>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-checkbox>Budget Re-allocation</a-checkbox>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-row>
        <a-col :md="24" :sm="24">
          <s-table
            style="margin-top: 5px"
            ref="table"
            size="default"
            rowKey="elementInfoId"
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
            <span slot="action" slot-scope="text, record">
          <template>
            <a-button v-if="record.isCreate" @click="showModal(record,'add')" type="success" icon="form" title="新增">
            </a-button>
            {{record.elementInfoNameCN}}
          </template>
        </span>
          </s-table>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="12" :sm="24">
          <a-button type="danger" style="margin-top: 10px" @click="back">关闭</a-button>
        </a-col>
      </a-row>
    </a-card>
    <resolve-modal ref="resolveModal"></resolve-modal>
  </page-header-wrapper>
</template>

<script>
  import {CostService} from "@/views/cost/cost.service";
  import {Ellipsis, STable} from "@/components";
  import ResolveModal from '@/views/cost/resolve/modal/ResolveModal'
  import StepByStepModal from "@/views/list/modules/StepByStepModal";

  function fixedList (res, params) {
    const result = {}
    result.pageSize = params.pageSize
    result.pageNo = params.pageNo
    if (res.result.data) {
      result.totalPage = Math.ceil(res.result.data.length / params.pageSize)
      result.totalCount = res.result.data.length
      result.data = formatList(res.result.data)
    } else {
      result.totalPage = 0
      result.totalCount = 0
      result.data = []
    }
    return result
  }

  function formatList (items) {
    const list = []
    items.forEach(item => {
      if (item.childs) {
        item.children = formatList(item.childs)
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
      obj.elementInfoNameCN = item.elementInfoNameCN

      costCenters.forEach(center => {
        const costName = 'cost' + center.costCenterId
        obj[costName] = item.amount
      })
      if (item.childs && item.childs.length>0) {
        const childrenList = getList(item.childs,costCenters)
        obj.childs = childrenList
        obj.children = obj.childs
      }
      list.push(obj)
      if(item.tradeBudgetItems && item.tradeBudgetItems.length>0){
        item.tradeBudgetItems.forEach((budget,index) => {
          const budgetItem = {}
          budgetItem.elementInfoId = budget.elementInfoId+new Date().getTime()
          budgetItem.BudgetTitle = budget.budgetTitle
          budgetItem.elementInfoNameCN = budget.elementInfoNameCN
          const costName = 'cost' + budget.costCenterId
          budgetItem[costName] = budget.budgetValue
          list.push(budgetItem)
        })
      }

      //插入General Trade行
      if( item.tradeBudgetInfo && item.childs && item.childs.length==0){
        const gt = {}
        costCenters.forEach((center,index) => {
          gt.elementInfoId = item.elementInfoId+new Date().getTime()
          gt.BudgetTitle = 'General Trade'
          gt.elementInfoNameCN = ''
          const costName = 'cost' + center.costCenterId
          gt[costName] = item.tradeBudgetInfo.budgetValue
        })
        list.push(gt)
        obj.costCenters = costCenters
        obj.isCreate = true
      }else{
        obj.costCenters = null
        obj.isCreate = false
      }
    })
    return list
  }

  const defaultColumns = [
    {
      title: '行业名称',
      width: '350px',
      dataIndex: 'elementInfoNameCN',
      scopedSlots: { customRender: 'action' }
    },
    {
      title: '行业名称',
      width: '300px',
      dataIndex: 'BudgetTitle'
    }
  ]

  const columns = defaultColumns

  export default {
    name: 'list',
    components: {
      STable,
      Ellipsis,
      ResolveModal
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
          const requestParameters = Object.assign({}, parameter, this.queryParam, { MaxResultCount : 1000 ,ProjectGUID: this.queryParam.ProjectGUID,ElementTypeId: this.id})
          const result = {
            result: {
              data: []
            }
          }
          return CostService.resolveTreeItems(requestParameters).then(res => {
            console.log(res.result.data)
            if(res.result.data){
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
              const list = res.result.data[0].elementItem.childs
              result.result.data = getList(list,res.result.data)
              this.columns = _columns
              this.$forceUpdate()
            }
            console.log(result)
            return fixedList(result, parameter)
          })
        }
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
      },
      back () {
        this.$router.push({ path: `/cost/enact/list?ProjectGUID=${this.ProjectGUID}` })
      },
      showModal(record,type) {
        CostService.elementTradeTypes({Id:record.elementInfoId}).then(res => {
          record.elementTradeTypes = JSON.parse(JSON.stringify(res.result.data))
          record.ProjectGUID = this.ProjectGUID
          record.type = type
          this.$refs.resolveModal.show(record)
        })
      },
      // handleOk(e) {
      //   this.ModalText = 'The modal will be closed after two seconds';
      //   this.confirmLoading = true;
      //   setTimeout(() => {
      //     this.visible = false;
      //     this.confirmLoading = false;
      //   }, 2000);
      // },
      // handleCancel(e) {
      //   console.log('Clicked cancel button');
      //   this.visible = false;
      // },
      createGT() {
        CostService.createGT({projectGUID: this.ProjectGUID, planPackageGUID : this.ProjectGUID}).then(res => {
          if (res.result.statusCode === 200) {
            this.$message.info('GeneralTrade已触发生成')
          }
        })
      },
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