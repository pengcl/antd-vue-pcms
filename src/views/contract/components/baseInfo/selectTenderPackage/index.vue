<template>
  <a-modal
    title="请选择招投标分判包"
    :width="800"
    :visible="visible"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-input-search v-model="searchKey" @change="change" placeholder="按合同名称/编号进行搜索" />
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
      :rowSelection="rowSelection"
    >
      <span slot="budgetAmount" slot-scope="text">{{ text | NumberFormat }}</span>
    </s-table>
  </a-modal>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  import { ContractService } from '@/views/contract/contract.service'
  import { fixedList } from '@/utils/util'
/*
auditStatus: "未审核"
auditTime: null
budgetAmount: 0
creationTime: "2020-11-06T20:06:35.9316508"
creatorUser: "test01"
description: "测试06"
id: 1
isAudit: false
itemTypeCode: null
itemTypeNameCN: null
lastModificationTime: null
lastModifierUser: "INIT"
packageDate: "2020-11-06T09:46:56.193"
packageTitle: "测试06"
projectTenderPackageGUID: "3255f3e5-d147-49c7-9c65-2ea612fbf1de"
tradePackageCode: "CC01-TENDER-0001"
*/
  const columns = [
    {
      title: '招投标分判包名称',
      dataIndex: 'packageTitle',
      scopedSlots: { customRender: 'packageTitle' }
    },
    {
      title: '编号',
      dataIndex: 'tradePackageCode'
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      scopedSlots: { customRender: 'auditStatus' }
    },
    {
      title: '分类',
      dataIndex: 'itemTypeNameCN',
      scopedSlots: { customRender: 'itemTypeNameCN' }
    },
    {
      title: '金额',
      dataIndex: 'budgetAmount',
      scopedSlots: { customRender: 'budgetAmount' }
    }
  ]
  export default {
    name: 'SelectTenderPackage',
    components: {
      STable,
      Ellipsis
    },
    data () {
      return {
        columns: columns,
        queryParam: { IsShowContractUse: false },
        selected: null,
        searchKey: '',
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          this.queryParam.ProjectGUID = this.project.projectGUID
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return ContractService.tenders(requestParameters).then(res => {
            const items = []
            res.result.data.forEach(item => {
              if (item.packageTitle.indexOf(this.searchKey) >= 0) {
                items.push(item)
              }
            })
            res.result.data = items
            return fixedList(res, requestParameters)
          })
        }
      }
    },
    computed: {
      rowSelection () {
        const that = this
        return {
          type: 'radio',
          onSelect: function (record, selected, selectRows, nativeEvent) {
            that.selected = record
          }
        }
      }
    },
    props: {
      project: {
        type: Object,
        default: null
      },
      data: {
        type: Object,
        default: null
      },
      visible: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      change (e) {
        this.$refs.table.refresh()
      }
    }
  }
</script>
