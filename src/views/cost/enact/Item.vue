<template>
  <page-header-wrapper :property="{}">
    <a-card :bordered="false">

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
            <a-button @click="handleToItem(record)" type="success" icon="file-text" title="查看">
            </a-button>
            <a-button
              @click="handleToEdit(record)"
              type="primary"
              icon="form"
              style="margin-left: 4px"
              title="编辑">
            </a-button>
            <a-button
              @click="handleToItem(record)"
              type="primary"
              icon="plus-square"
              style="margin-left: 4px"
              title="审批记录">
            </a-button>
          </template>
        </span>
      </s-table>

      <a-row>
        <a-col :md="12" :sm="24">
          <a-button type="success" style="margin-right: 20px">启动审批流程</a-button>
          <a-button type="success">储存</a-button>
          <a-button type="danger" style="margin-left: 5px">关闭</a-button>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-button-group style="float: right">
            <a-button type="success" style="margin-right: 10px">导入导出</a-button>
            <a-button type="success">审批记录</a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import { STable, Ellipsis } from '@/components'
    import { getRoleList, getServiceList } from '@/api/manage'

    import StepByStepModal from '@/views/list/modules/StepByStepModal'
    import CreateForm from '@/views/list/modules/CreateForm'

    const columns = [
        {
            title: '科目代码',
            dataIndex: 'action',
            width: '150px',
        },
        {
            title: '科目名称',
            dataIndex: 'no'
        },
        {
            title: '业态成本中心A',
            dataIndex: 'description',
            scopedSlots: { customRender: 'description' }
        },
        {
            title: '业态成本中心B',
            dataIndex: 'callNo',
            scopedSlots: { customRender: 'callNo' }
        },
        {
            title: '业态成本中心C',
            dataIndex: 'city',
            scopedSlots: { customRender: 'city' }
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
        name: 'Item',
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
                    console.log('loadData request parameters:', requestParameters)
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
