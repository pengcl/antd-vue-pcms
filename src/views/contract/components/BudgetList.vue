<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <a-radio-group v-model="useStore" button-style="solid">
          <a-radio-button v-for="item in selection.storeTypes" :key="item.id" :value="item.id">
            {{ item.nameCN }}
          </a-radio-button>
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
          <thead>
            <tr>
              <th style="width: 10%">科目</th>
              <th style="width: 10%">行业</th>
              <th style="width: 10%">业态</th>
              <th style="width: 10%">预算余额(a)</th>
              <th style="width: 10%">行业预算(b)</th>
              <th style="width: 10%">合同金额(c)</th>
              <th style="width: 10%">定标盈余(d)</th>
              <th style="width: 10%">预计变更(e)</th>
              <th style="width: 10%">差额(f)</th>
              <th style="width: 10%">调动预算余额(g)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
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
    title: '行业',
    dataIndex: 'itemTypeName'
  },
  {
    title: '业态',
    dataIndex: 'costCenterName'
  },
  {
    title: '预算余额(a)',
    dataIndex: 'generalTradeAmount'
  },
  {
    title: '行业预算(b)',
    dataIndex: 'budgetPlanDetailAmount'
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
    title: '预计变更(e)',
    dataIndex: 'alterPlan',
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
