<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="margin-bottom: 16px">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <a-radio-group :disabled="true" v-model="useStore" button-style="solid">
          <a-radio v-for="item in selection.storeTypes" :key="item.id" :value="item.id">
            {{ item.nameCN }}
          </a-radio>
        </a-radio-group>
        <s-table
          style="margin-top: 5px"
          ref="table"
          size="default"
          rowKey="id"
          bordered
          :columns="columns"
          :data="loadData"
          :alert="false"
          showPagination="auto"
        >
          <span slot="generalTradeAmount" slot-scope="text">{{ text | NumberFormat }}</span>
          <span slot="budgetPlanDetailAmount" slot-scope="text">{{ text | NumberFormat }}</span>
          <span slot="contractSplitAmount" slot-scope="text">{{ text | NumberFormat }}</span>
          <span slot="tenderSurplus" slot-scope="text">{{ text | NumberFormat }}</span>
          <span slot="alterPlan" slot-scope="text">{{ text | NumberFormat }}</span>
        </s-table>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import { ContractService } from '@/views/contract/contract.service'
import { fixedList } from '@/utils/util'
import { Ellipsis, STable } from '@/components'

const columns = [
  {
    title: '科目',
    dataIndex: 'elementName'
  },
  {
    title: '编码',
    dataIndex: 'elementCode'
  },
  {
    title: '行业',
    dataIndex: 'itemTypeName'
  },
  {
    title: '业态',
    dataIndex: 'costCenterName'
  },
  {
    title: '预算余额(a)',
    dataIndex: 'generalTradeAmount',
    scopedSlots: { customRender: 'generalTradeAmount' }
  },
  {
    title: '行业预算(b)',
    dataIndex: 'budgetPlanDetailAmount',
    scopedSlots: { customRender: 'budgetPlanDetailAmount' }
  },
  {
    title: '合同金额(c)',
    dataIndex: 'contractSplitAmount',
    scopedSlots: { customRender: 'contractSplitAmount' }
  },
  {
    title: '定标盈余(d)',
    dataIndex: 'tenderSurplus',
    scopedSlots: { customRender: 'tenderSurplus' }
  },
  {
    title: '变更预留-固定(e1)',
    dataIndex: 'alterPlan',
    scopedSlots: { customRender: 'alterPlan' }
  },
  {
    title: '变更预留-暂定(e2)',
    dataIndex: 'TemporaryAlterPlan',
    scopedSlots: { customRender: 'alterPlan' }
  },
  {
    title: '差额(f)',
    dataIndex: 'balanceAmount',
    scopedSlots: { customRender: 'balanceAmount' }
  }
]

export default {
  name: 'BudgetList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      items: [],
      columns: columns,
      selection: {},
      useStore: null,
      queryParam: { contractGuid: this.data.contract.contractGuid },
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return ContractService.viewBudgets(requestParameters).then(res => {
          return fixedList(res, parameter)
        })
      }
    }
  },
  created () {
    ContractService.storeTypes().then(res => {
      this.selection.storeTypes = res.result.data
      this.useStore = res.result.data[0].id
    })
  },
  props: {
    data: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      default: 'view'
    },
    id: {
      type: String,
      default: '0'
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
