<template>
  <page-header-wrapper :property="{}">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="流程类别">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="关键词">
                <a-input v-model="queryParam.id" placeholder=""/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="success">搜索</a-button>
      </div>

      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="workflowId"
        :columns="columns"
        :data="loadData"
        :rowSelection="rowSelection"
        :alert="false"
        :class="'no-border'"
        showPagination="auto"
      >

        <span slot="created" slot-scope="text">
          {{ text | moment }}
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
    import moment from 'moment'
    import { fixedList } from '@/utils/util'
    import { STable, Ellipsis } from '@/components'
    import { TaskService } from '@/views/dashboard/task.service'

    const columns = [
        {
            title: '项目',
            dataIndex: 'workflowTitle',
            scopedSlots: { customRender: 'workflowTitle' }
        },
        {
            title: '当前步骤',
            dataIndex: 'taskTitle',
            align: 'center'
        },
        {
            title: '申请人',
            dataIndex: 'author',
            align: 'center'
        },
        {
            title: '申请日期',
            dataIndex: 'created',
            scopedSlots: { customRender: 'created' },
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' },
            align: 'center'
        }
    ]

    export default {
        name: 'Participate',
        components: {
            STable,
            Ellipsis
        },
        data () {
            this.columns = columns
            return {
                // 查询参数
                queryParam: {},
                selectedRowKeys: [],
                selectedRows: [],
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    return TaskService.participates(requestParameters)
                        .then(res => {
                            return fixedList(res, parameter)
                        })
                }
            }
        },
        created () {
            // getRoleList({ t: new Date() })
        },
        watch: {
            '$route' (path) {
                this.$refs.table.refresh()
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
        methods: {
            onSelectChange (selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                this.selectedRows = selectedRows
            },
            handleEdit (record) {
              TaskService.task(record.workflowId).then(res => {
                if (res.result.data) {
                  const _window = window.open('_blank')
                  _window.location = res.result.data
                } else {
                  this.$message.error('流程打开异常，请联系系统管理员')
                }
              })
            }
        }
    }
</script>
<style lang="less" scoped>
  /*/deep/*/
</style>
