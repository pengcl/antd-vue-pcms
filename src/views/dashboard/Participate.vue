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

      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="key"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="false"
        showPagination="auto"
      >
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action">
          <template>
            <a-button class="btn-success" type="primary" icon="file-text" title="查看">
            </a-button>
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import moment from 'moment'
  import { STable, Ellipsis } from '@/components'
  import { TaskService } from '@/views/dashboard/task.service'

  const columns = [
    {
      title: '操作',
      dataIndex: 'action',
      width: '32px',
      scopedSlots: { customRender: 'action' }
    },
    {
      title: '流程',
      dataIndex: 'no'
    },
    {
      title: '任务标题',
      dataIndex: 'description',
      scopedSlots: { customRender: 'description' }
    },
    {
      title: '任务描述',
      dataIndex: 'callNo',
      scopedSlots: { customRender: 'callNo' }
    },
    {
      title: '任务备注',
      dataIndex: 'city',
      scopedSlots: { customRender: 'city' }
    },
    {
      title: '最后更新日期',
      dataIndex: 'status',
      scopedSlots: { customRender: 'status' }
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
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return TaskService.participates(requestParameters)
            .then(res => {
              console.log(res)
              return res.result
            })
        }
      }
    },
    created () {
      // getRoleList({ t: new Date() })
    },
    methods: {
    }
  }
</script>
<style lang="less" scoped>
  /*/deep/*/
</style>
