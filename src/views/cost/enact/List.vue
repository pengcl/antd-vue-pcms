<template>
  <page-header-wrapper :property="{}">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="项目">
                <a-cascader
                  :options="cities"
                  placeholder="请选择"
                  @change="onChange"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                编制中
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-button type="success">预算汇总</a-button>
              <a-button type="success" style="margin-left: 20px">审批记录</a-button>
              <a-button type="success" style="margin-left: 20px">导入导出</a-button>
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
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            {{record.code}}
            <a-button @click="handleToItem(record)" type="success" icon="file-text" title="查看">
            </a-button>
            <!--<a-button
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
            </a-button>-->
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import { STable, Ellipsis } from '@/components'
    import { getRoleList } from '@/api/manage'

    import StepByStepModal from '@/views/list/modules/StepByStepModal'
    import CreateForm from '@/views/list/modules/CreateForm'
    import { ProjectService } from '@/views/project/project.service'
    import { CostService } from '@/views/cost/cost.service'
    import { formatList } from '../../../mock/util'
    import { fixedList } from '@/utils/util'

    const columns = [

        {
            title: '科目代码',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' }
        },
        {
            title: '科目名称',
            dataIndex: 'name'
        },
        {
            title: '业态成本中心A',
            dataIndex: 'costA',
            scopedSlots: { customRender: 'costA' }
        },
        {
            title: '业态成本中心B',
            dataIndex: 'costB',
            scopedSlots: { customRender: 'costB' }
        },
        {
            title: '业态成本中心C',
            dataIndex: 'costC',
            scopedSlots: { customRender: 'costC' }
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
        name: 'CostEnactList',
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
                cities: [],
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
                    // console.log('loadData request parameters:', requestParameters)
                    const result = {
                        result:{
                          data:{
                            items:[]
                          }
                        }
                    }
                    return CostService.items(requestParameters).then(res => {
                            CostService.subjectItems(this.queryParam.ProjectGUID)
                              .then(res2 => {
                                res.result.data.forEach(item=> {
                                  const obj = {
                                    id: item.id,
                                    code: item.code,
                                    name: item.nameCN,
                                    costA: '',
                                    costB: '',
                                    costC: ''
                                  }
                                  result.result.data.items.push(obj);
                                })
                              })
                          return fixedList(result, requestParameters)
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

            ProjectService.tree().then(res => {
                const cities = []
                res.result.data.citys.forEach(item => {
                    const children = formatList(item.projects.items)
                    // console.log(children)
                    cities.push({
                        label: item.city.nameCN,
                        value: item.city.id,
                        children: children
                    })
                })
                this.cities = cities
                this.$forceUpdate()
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
                this.$router.push({ path: `/cost/enact/item/${record.id}?type=view` })
            },
            handleToEdit (record) {
                this.$router.push({ path: `/cost/enact/item/${record.id}?type=edit` })
            },
            handleToAdd () {
                this.$router.push({ path: `/cost/enact/item/0?type=add` })
            },
            onChange (value) {
                if (value.length >= 2) {
                    this.queryParam.ProjectGUID = value[value.length - 1]
                    this.$refs.table.refresh(true)
                } else {
                    this.queryParam.ProjectGUID = ''
                    this.$refs.table.refresh(true)
                }
            }
        }
    }
</script>
