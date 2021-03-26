<template>
  <a-modal
    :visible="visible"
    width="90%"
    title="选择项目成员"
    :maskClosable="false"
    @ok="() => { $emit('ok');this.$refs.table.clearSelected() }"
    @cancel="() => { $emit('cancel') }"
  >
    <div class="table-page-search-wrapper">
      <a-form
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        class="search-form"
        @keyup.enter.native="search"
      >
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="区域">
              <a-select
                show-search
                placeholder="请选择区域"
                option-filter-prop="children"
                :filter-option="filterOption"
                :not-found-content="null"
                v-model="queryParam.tenantId"
                v-decorator="[queryParam.tenantId, { rules: [{required: true, message: '请选择'}] }]">
              >
                <a-select-option v-for="item in tenantOptions" :key="item.id" :value="item.code">
                  {{ item.nameCN }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="success" @click="search()">搜索</a-button>
            <a-button type="success" style="margin-left: 20px" @click="reSetSearch()">清空</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div>
      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="userId"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="false"
        :scroll="{ y : 300}"
        showPagination="auto"
        :rowSelection="rowSelection"
      >
        <span slot="packageDate" slot-scope="text, record">
          {{ text | date }}
        </span>
      </s-table>
    </div>
  </a-modal>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  import { ProjectService } from '@/views/project/project.service'
  import {fixedList} from "@/utils/util";

  const columns = [
    {
      title: '姓名',
      dataIndex: 'actualName'
    },
    {
      title: '部门',
      dataIndex: 'orgName'
    }
  ]

  export default {
    name: 'ProjectUserModal',
    components: {
      STable,
      Ellipsis
    },
    data () {
      return {
        columns: columns,
        type: '',
        // 高级搜索 展开/关闭
        advanced: false,
        tenantOptions: [],
        selected: [],
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          if (requestParameters.tenantId) {
            return ProjectService.projectUserItems(requestParameters).then(res => {
              return fixedList(res, requestParameters)
            })
          } else {
            const result = {
              result: {
                data: {
                  totalCount: 0, items: []
                }
              }
            }
            return new Promise((resolve) => {
              resolve(fixedList(result, parameter))
            })
          }
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    created () {
      ProjectService.GetAreaTenantTypes().then(res => {
        this.tenantOptions = JSON.parse(JSON.stringify(res.result.data))
        this.$forceUpdate()
      })
    },
    props: {
      visible: {
        type: Boolean,
        required: true
      }
    },
    computed: {
      rowSelection () {
        const that = this
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange,
          type: 'checkbox',
          onSelect: function (record, selected, selectRows, nativeEvent) {
            if (selected) {
              that.selected.push(record)
            } else {
              const index = that.selected.findIndex(item => item.userId === record.userId)
              that.selected.splice(index, 1)
            }
          }
        }
      }
    },
    methods: {
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },
      search () {
        this.$refs.table.refresh()
      },
      reSetSearch () {
        this.queryParam.tenantId = ''
        this.$refs.table.refresh()
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
