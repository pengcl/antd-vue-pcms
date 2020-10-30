<template>
  <a-modal
    :visible="visible"
  >
    <page-header-wrapper>
      <a-card :bordered="false">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            合同清单列表
          </a-col>
        </a-row>
        <s-table :columns="columns" :data="loadData" bordered :rowSelection="rowSelection" ref="table">
        </s-table>
      </a-card>
    </page-header-wrapper>
  </a-modal>
</template>

<script>
  import { ChangeService } from '@/views/change/change.service'
  import { fixedList } from '@/utils/util'

  const columns = [
    {
      title: '带数项目',
      dataIndex: 'isCarryData',
      scopedSlots: { customRender: 'isCarryData' }
    },
    {
      title: '标段',
      dataIndex: 'section'
    },
    {
      title: '楼栋',
      dataIndex: 'building'
    },
    {
      title: '预留字段0',
      dataIndex: 'remark1'

    },
    {
      title: '预留字段1',
      dataIndex: 'remark2'
    },
    {
      title: '清单描述',
      dataIndex: 'description'
    },
    {
      title: '业态成本中心',
      dataIndex: 'costCenterName'
    },
    {
      title: '清单项类别',
      dataIndex: 'signDate'
    },
    {
      title: '供应',
      children: [
        {
          title: '单位',
          dataIndx: 'unitMaterial'
        },
        {
          title: '工程量',
          dataIndx: 'quantityMaterial'
        },
        {
          title: '单价',
          dataIndx: 'unitPriceMaterial'
        },
        {
          title: '小计',
          dataIndx: 'subAmountMaterial'
        }
      ]
    },
    {
      title: '安装',
      children: [
        {
          title: '单位',
          dataIndx: 'unitWork'
        },
        {
          title: '工程量',
          dataIndx: 'quantityWork'
        },
        {
          title: '单价',
          dataIndx: 'unitPriceWork'
        },
        {
          title: '小计',
          dataIndx: 'subAmountWork'
        }
      ]
    },
    {
      title: '供应+安装',
      children: [
        {
          title: '单位',
          dataIndx: 'unitWorkMat'
        },
        {
          title: '工程量',
          dataIndx: 'quantityWorkMat'
        },
        {
          title: '单价',
          dataIndx: 'unitPriceWorkMat'
        },
        {
          title: '小计',
          dataIndx: 'allAmount'
        }
      ]
    },
    {
      title: '合计',
      dataIndex: 'signDate'
    }

  ]

  export default {
    name: 'ContractBQModal',
    data () {
      this.columns = columns
      return {
        // create model
        cities: [],
        show: false,
        visible: false,
        confirmLoading: false,
        mdl: null,
        // 高级搜索 展开/关闭
        advanced: false,
        // 合同列表查询参数
        queryParam: { contractGuid: this.contract.contractGuid },
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return ChangeService.bqList(requestParameters)
            .then(res => {
              return fixedList(res, requestParameters)
            })
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    props: {
      contract: {
        type: Object,
        default: null
      },
      data: {
        type: Object,
        default: null
      }
    },
    created () {
    },
    computed: {
      // 合同列表行选中事件监听
      rowSelection () {
        const that = this
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange,
          type: 'radio',
          onSelect: function (record, selected, selectRows, nativeEvent) {
            // 刷新变更列表
            that.$refs.table2.refresh()
            // 清空变更列表选中数据
            that.tableSelected = {}
          }
        }
      }
    },
    methods: {
      showTable () {
        this.visible = true
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      }
    }
  }
</script>

<style lang="less" scoped>
  .search-form {
    background-color: #1E9FF2;
    padding: 20px;
    border-radius: 0.35rem;

    /deep/ .ant-form-item-label label {
      color: #fff;
    }
  }

  /deep/ .ant-table-footer {
    padding-bottom: 0;
  }

</style>
