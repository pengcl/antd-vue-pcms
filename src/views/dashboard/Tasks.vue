<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="流程类别">
                <a-select v-model="queryParam.processState" placeholder="请选择流程类别">
                  <a-select-option :value="0">全部</a-select-option>
                  <a-select-option :value="1">关闭</a-select-option>
                  <a-select-option :value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="关键词">
                <a-input v-model="queryParam.keyWord" placeholder="请输入关键词"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="success" @click="search">搜索</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="workflowId"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :rowSelection="rowSelection"
        :class="intervalId ? 'interval no-border' : 'no-border'"
        showPagination="auto"
      >
        <span slot="project" slot-scope="text,record">
          <span>{{ record.workflowTitle }}</span>
        </span>
        <span slot="detail" slot-scope="text,record">
          {{ record.taskStartTime | moment }}
        </span>

        <span slot="action" slot-scope="text,record">
          <template>
            <a-button icon="form" @click="handleEdit(record)" type="primary"></a-button>
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import { STable, Ellipsis } from '@/components'
    import { TaskService } from '@/views/dashboard/task.service'
    import { fixedList } from '@/utils/util'
    const columns = [
        {
            title: '类型',
            dataIndex: 'taskType',
            scopedSlots: { customRender: 'taskType' }
        },
        {
            title: '项目',
            dataIndex: 'project',
            scopedSlots: { customRender: 'project' }
        },
        {
            title: '',
            dataIndex: 'detail',
            scopedSlots: { customRender: 'detail' }
        },
        {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' }
        }
    ]

    export default {
        name: 'Tasks',
        components: {
            STable,
            Ellipsis
        },
        data () {
            this.columns = columns
            return {
                // create model
                // 查询参数
                queryParam: {},
                intervalId: null,
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                  this.pageNo = parameter.pageNo
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    return TaskService.tasks(requestParameters)
                        .then(res => {
                          return fixedList(res, parameter)
                        })
                },
                selectedRowKeys: [],
                selectedRows: [],
              pageNo: 1
            }
        },
        filters: {},
        created () {

        },
        watch: {
            '$route' (path) {
                this.$refs.table.refresh()
            },
          'pageNo' () {
            this.clear()
          }
        },
        computed: {
            rowSelection () {
                return {
                    selectedRowKeys: this.selectedRowKeys,
                    onChange: this.onSelectChange
                }
            }
        },
        destroyed () {
            this.clear()
        },
        methods: {
            dataRefresh () {
                // 计时器正在进行中，退出函数
                if (this.intervalId != null) {
                    return
                }
                // 计时器为空，操作
                this.intervalId = setInterval(() => {
                    this.$refs.table.refresh()
                }, 5000)
            },
            // 停止定时器
            clear () {
                clearInterval(this.intervalId) // 清除计时器
                this.intervalId = null // 设置为null
            },
            search () {
                this.$refs.table.refresh()
            },
            handleEdit (record) {
                TaskService.task(record.workflowId).then(res => {
                    if (res.result.data) {
                        this.dataRefresh()
                        const _window = window.open('_blank')
                        _window.location = res.result.data
                    } else {
                        this.$message.error('流程打开异常，请联系系统管理员')
                    }
                })
                /* const _window = window.open('_blank')
                _window.location = record.workflowUrl */
            },

            onSelectChange (selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                this.selectedRows = selectedRows
            }
        }
    }
</script>
<style lang="less" scoped>
  /deep/ .row {
    display: flex;
    font-weight: 400;
    color: #333;
    font-family: Microsoft Sans Serif, '微軟正黑體', '微软正黑体' !important;

    .col-lg-6 {
      flex: 0 0 50%;
      max-width: 50%;
    }

    .col-lg-3 {
      flex: 0 0 25%;
      max-width: 25%;
    }

    .btn-sm, .btn-group-sm > .btn {
      padding: 7px 10px;
      line-height: 1;
      border-radius: 3px;
      font-size: 13px;
    }

    .btn-primary {
      border-color: #3A44E1 !important;
      color: #FFF;
      background-color: #666EE8 !important;
      box-sizing: content-box;
    }

    .btn-warning, .color-info.warning {
      background-color: #FF9149 !important;
      border-color: #FF7216 !important;
      color: #FFF;
    }
  }

  /deep/ .text-height {
    margin-top: 15px;
  }

  .interval {
    /deep/ .ant-spin.ant-spin-spinning {
      display: none;
    }

    /deep/ .ant-spin-blur {
      user-select: unset !important;
      pointer-events: unset !important;
      opacity:1 !important;
      &::after {
        display: none !important;
      }
    }

    /deep/ .ant-spin-spinning {
      display: none !important;
    }

    /deep/ .ant-spin-container::after {
      display: none !important;
    }

    /deep/ .ant-spin-nested-loading > div:not('.ant-spin-container') {
      display: none;
    }
  }
</style>
