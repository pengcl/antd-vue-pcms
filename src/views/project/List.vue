<template>
  <page-header-wrapper :property="{}">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="城市">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">深圳</a-select-option>
                  <a-select-option value="1">广州</a-select-option>
                  <a-select-option value="2">珠海</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="success" @click="handleToAdd">新增项目</a-button>
        <a-button type="primary" style="margin-left: 5px">汇出</a-button>
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
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a-button @click="handleToItem(record)" class="btn-success" type="primary" icon="file-text" title="查看">
            </a-button>
            <a-button
              @click="handleToEdit(record)"
              type="primary"
              class="btn-info"
              icon="form"
              style="margin-left: 4px"
              title="编辑">
            </a-button>
            <a-button
              @click="handleToItem(record)"
              type="primary"
              class="btn-info"
              icon="plus-square"
              style="margin-left: 4px"
              title="新增分期">
            </a-button>
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  import { getRoleList, getServiceList } from '@/api/manage'

  import StepByStepModal from '@/views/list/modules/StepByStepModal'
  import CreateForm from '@/views/list/modules/CreateForm'

  import { ProjectService } from '@/views/project/project.service'

  const columns = [
    {
      title: '操作',
      dataIndex: 'action',
      width: '150px',
      scopedSlots: { customRender: 'action' }
    },
    {
      title: '项目编号',
      dataIndex: 'no'
    },
    {
      title: '房产项目名称',
      dataIndex: 'description',
      scopedSlots: { customRender: 'description' }
    },
    {
      title: '地区',
      dataIndex: 'callNo',
      scopedSlots: { customRender: 'callNo' }
    },
    {
      title: '城市',
      dataIndex: 'city',
      scopedSlots: { customRender: 'city' }
    },
    {
      title: '项目状态',
      dataIndex: 'status',
      scopedSlots: { customRender: 'status' }
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      scopedSlots: { customRender: 'approvalStatus' }
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      scopedSlots: { customRender: 'creator' }
    },
    {
      title: '创建日期',
      dataIndex: 'createAt'
    },
    {
      title: '最后更新者',
      dataIndex: 'updater',
      scopedSlots: { customRender: 'updater' }
    },
    {
      title: '最后更新日期',
      dataIndex: 'updatedAt'
    }
  ]

  const statusMap = {
    0: {
      status: 'default',
      text: '关闭'
    },
    1: {
      status: 'processing',
      text: '运行中'
    },
    2: {
      status: 'success',
      text: '已上线'
    },
    3: {
      status: 'error',
      text: '异常'
    }
  }

  export default {
    name: 'ProjectList',
    components: {
      STable,
      Ellipsis,
      CreateForm,
      StepByStepModal
    },
    data () {
      this.columns = columns
      return {
        // create model
        visible: false,
        confirmLoading: false,
        mdl: null,
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return getServiceList(requestParameters)
            .then(res => {
              return res.result
            })
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    filters: {
      statusFilter (type) {
        return statusMap[type].text
      },
      statusTypeFilter (type) {
        return statusMap[type].status
      }
    },
    created () {
      getRoleList({ t: new Date() })
      ProjectService.list().then(res => {
        console.log(res)
      })
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
      handleToItem (record) {
        this.$router.push({ path: `/project/item/${record.id}?type=view` })
      },
      handleToEdit (record) {
        this.$router.push({ path: `/project/item/${record.id}?type=edit` })
      },
      handleToAdd () {
        this.$router.push({ path: `/project/item/0?type=add` })
      }
    }
  }
</script>
