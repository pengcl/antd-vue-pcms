<template>
  <a-modal
    :visible="visible"
    width="90%"
    title="审批记录"
    :maskClosable="false"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div>
      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="id"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="false"
        :scroll="{ y : 300}"
        showPagination="auto"
        :rowSelection="rowSelection"
      >
        <span slot="auditTime" slot-scope="text">
          {{ text | date }}
        </span>
      </s-table>
    </div>
  </a-modal>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  import { CostService } from '@/views/project/cost/cost.service'
  import {fixedList} from "@/utils/util";
  import {Base as BaseService} from "@/api/base";

  const columns = [
    {
      title: '版本信息',
      dataIndex: 'auditVersion'
    },
    {
      title: '审批时间',
      dataIndex: 'auditTime'
    }
  ]

  export default {
    name: 'AuditListModal',
    components: {
      STable,
      Ellipsis
    },
    data () {
      return {
        columns: columns,
        visible: false,
        ProjectGUID: '',
        slots: [],
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, { ProjectGUID: this.ProjectGUID })
          return CostService.bpmVersion(requestParameters).then(res => {
            return fixedList(res, requestParameters)
          })
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    created () {},
    props: {
    },
    computed: {
      rowSelection () {
        const that = this
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange,
          type: 'radio',
          onSelect: function (record, selected, selectRows, nativeEvent) {
            that.selected = record
          }
        }
      }
    },
    methods: {
      show (id) {
        this.visible = true
        this.ProjectGUID = id
        this.$refs.table.refresh()
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      // 取消
      handleCancel () {
        this.visible = false
      },
      // 确定
      handleOk () {
        if (this.selected) {
          BaseService.viewBpm(this.selected.bpmBusinessGuid).then(res => {
            const _window = window.open('_blank')
            _window.location = res.result.data
          })
          this.$refs.table.clearSelected()
          this.visible = false
        } else {
          this.$message.warn('请选择对应记录')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  /deep/ table {
    td:first-child {
      width: 380px !important;
    }
    th:first-child {
      width: 380px !important;
    }
  }
</style>
