<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="项目">
                <a-tree-select
                  :treeData="cities"
                  placeholder="请选择"
                  style="width: 100%"
                  v-model="queryParam.ProjectGUID"
                  :dropdown-style="{ maxHeight: '400px', overflowH: 'auto' }"
                  @select="onSelect"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-button icon="search" type="primary" @click="show = !show"></a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" v-if="show" class="search-form">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="指令编号">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="申报日期">
              <a-date-picker></a-date-picker><span style="margin: 0 10px;color: #fff">至</span><a-date-picker></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button type="success">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
            <a-button type="success" style="margin-left: 20px">导出</a-button>
          </a-col>
        </a-row>
      </a-form>
      <s-table
        style="margin-top: 10px"
        ref="table"
        size="default"
        rowKey="key"
        bordered
        :columns="columns"
        :data="loadData"
        :scroll="{x : 2300}"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import moment from 'moment'
    import { STable, Ellipsis } from '@/components'
    //import { getRoleList, getServiceList } from '@/api/manage'

    import CreateForm from '@/views/list/modules/CreateForm'
    import { ProjectService } from '@/views/project/project.service'
    import { formatList } from '../../../mock/util'
    import { fixedList, getPosValue,nullFixedList } from '@/utils/util'

    const columns = [
        {
            title: '序号',
            dataIndex: 'no'
        },
        {
            title: '变更编号',
            dataIndex: 'changeNo'
        },
        {
            title: '审核状态',
            dataIndex: 'approvalStatus',
            scopedSlots: { customRender: 'approvalStatus' }
        },
        {
            title:'是否生成',
            dataIndex:'isGenerated'
        },
        {
            title:'当前步骤',
            dataIndex:'currentStep'
        },
        {
            title:'当前审批人',
            dataIndex:'currentApprover'
        },
        {
            title:'合同编号',
            dataIndex:'contractNo'
        },
        {
            title: '项目指令编号',
            dataIndex: 'projectNo'
        },
        {
            title:'变更分类',
            dataIndex:'changeClassification'
        },
        {
            title: '变更名称',
            dataIndex: 'changeName',
        },
        {
            title: '申报日期',
            dataIndex: 'declarationDate'
        },
        {
            title: '申报金额',
            dataIndex: 'declarationAmount'
        },
        {
            title:'变更日期',
            dataIndex: 'changeData'
        },
        {
            title: '归档时间',
            dataIndex: 'archiveDate'
        },
        {
            title: '确认金额',
            dataIndex: 'confirmAmount',
        },
        {
            title:'变更状态',
            dataIndex:'changeStatus'
        },
        {
            title:'确认状态',
            dataIndex:'confirmStatus'
        },
        {
            title:'变更类型',
            dataIndex:'changeType'
        },
        {
            title:'上报为后补指令',
            dataIndex:'afterInstruction'
        },
        {
            title:'后补指令确认',
            dataIndex:'afterInstructionConfirm'
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
        name: 'TableList',
        components: {
            STable,
            Ellipsis,
            CreateForm
        },
        data () {
            this.columns = columns
            return {
                // create model
                cities:[],
                show: false,
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
                    return nullFixedList(requestParameters)
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
            //getRoleList({ t: new Date() })
            ProjectService.tree().then(res => {
                const cities = []
                res.result.data.citys.forEach(item => {
                    const children = formatList(item.projects.items)
                    cities.push({
                    label: item.city.nameCN,
                    value: item.city.id,
                    children: children,
                    selectable: false
                    })
                })
                this.cities = cities 
                const value = getPosValue(this.cities)
                this.queryParam.ProjectID = value.projectCode
                this.queryParam.ProjectGUID = value.projectGUID
                console.log(this.queryParam)
                this.$forceUpdate()
                this.$refs.table.refresh()
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
            onSelectChange (selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                this.selectedRows = selectedRows
            },
            toggleAdvanced () {
                this.advanced = !this.advanced
            },
            onSelect (value,option) {
                storage.set('POS', option.pos)
                this.queryParam.ProjectID = option.$options.propsData.dataRef.projectCode
                this.queryParam.ProjectGUID = value.projectGUID
                this.$refs.table.clearSelected()
                this.$refs.table.refresh()
                this.$forceUpdate()
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
</style>
