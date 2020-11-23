<template>
  <page-header-wrapper :property="{}">
    <a-card :bordered="false">

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
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="cost" slot-scope="text">
          <p style="text-align: center">
            <span style="font-weight: bold;padding-right: 10px">{{text.amount}}</span>
            <span style="color: #b3b3ca">{{text.percentage + '%'}}</span>
          </p>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a-button v-if="record.isEdit" type="success" icon="file-text" title="查看"
                      @click="handleToItem(record)"></a-button>
            <!--            <a-button-->
            <!--              v-if="record.isEdit"-->
            <!--              @click="handleToAdd(record)"-->
            <!--              type="primary"-->
            <!--              icon="form"-->
            <!--              style="margin-left: 4px"-->
            <!--              title="编辑科目类型">-->
            <!--            </a-button>-->
            <a-button
              v-if="record.isCreate"
              @click="handleToAdd(record)"
              type="primary"
              icon="plus-square"
              style="margin-left: 4px"
              title="新增科目">
            </a-button>
            {{ record.nameCN }}
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import {STable, Ellipsis} from '@/components'
  import StepByStepModal from '@/views/list/modules/StepByStepModal'
  import {CostService} from '@/views/cost/cost.service'
  import {fixedList, nullFixedList} from '@/utils/util'
  import storage from "store";

  function getList(items) {
    const list = []
    items.forEach(item => {
      if (item.childs) {
        item.children = getList(item.childs)
      }
      if (item.childs && item.childs.length === 0) {
        item.isCreate = true
      }
      list.push(item)
      // 插入行业预算行
      if (item.tradeTypeList) {
        const objItems = []
        item.tradeTypeList.forEach(budgetItem => {
          const budget = {}
          budget.elementId = item.id
          budget.code = budgetItem.code
          budget.tradeTypeId = budgetItem.id
          budget.nameCN = budgetItem.nameCN
          budget.description = budgetItem.description
          budget.isEdit = true
          objItems.push(budget)
        })
        if (objItems.length > 0) {
          item.children = objItems
        }
      }
    })
    return list
  }

  const columns = [

    {
      title: '科目代码',
      dataIndex: 'code',
      width: '200px'
    },
    {
      title: '科目名称',
      dataIndex: 'nameCN',
      scopedSlots: {customRender: 'action'}
    },

    {
      title: '描述',
      dataIndex: 'description'
    }
  ]

  export default {
    name: 'CostTypeList',
    components: {
      STable,
      Ellipsis,
      StepByStepModal
    },
    data() {
      this.columns = columns
      return {
        titleIds: [],
        auditStatus: '',
        visible: false,
        confirmLoading: false,
        mdl: null,
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return CostService.typyItems().then(res => {
            const result = {
              result: {
                data: []
              }
            }
            const temp = []
            const tempCodes = ['B', 'C', 'D', 'G']
            if (res.result.data.childs) {
              res.result.data.childs.forEach(item => {
                if (tempCodes.includes(item.code)) {
                  temp.push(item)
                }
              })
            }
            result.result.data = getList(temp)
            return fixedList(result, parameter)
          })
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    created() {
    },
    computed: {
      rowSelection() {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    },
    methods: {
      handleToItem(record) {
        this.$router.push({path: `/cost/type/item/${record.tradeTypeId}?type=view&elementId=${record.elementId}`})
      },
      handleToEdit(record) {
        this.$router.push({path: `/cost/type/item/${record.tradeTypeId}?type=edit&elementId=${record.elementId}`})
      },
      handleToAdd(record) {
        this.$router.push({path: `/cost/type/item/0?type=add&elementId=${record.id}`})
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/ .ant-table-row-level-3 {
    background: #d7f4ff !important;
  }
  /deep/ .ant-table-row-level-1{
    background: #d7f4ff !important;
  }
</style>