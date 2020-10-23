<template>
  <page-header-wrapper :property="{}">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="城市">
                <a-select
                  placeholder="请选择城市"
                  v-model="queryParam.Id">
                  <a-select-option
                    v-for="city in cities"
                    :key="city.city.id"
                    :value="city.city.id">{{ city.city.nameCN }}
                  </a-select-option>
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
        rowKey="projectGUID"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="false"
        showPagination="auto"
        :expandIconColumnIndex="2"
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
              @click="handleToEdit(record,true)"
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
    import { getRoleList } from '@/api/manage'
    import { ProjectService } from '@/views/project/project.service'

    function fixedList (res, params) {
        const result = {}
        result.pageSize = params.pageSize
        result.pageNo = params.pageNo
        if (res.result.data) {
            result.totalPage = Math.ceil(res.result.data.projects.items.length / params.pageSize)
            result.totalCount = res.result.data.projects.items.length
            result.data = formatList(res.result.data.projects.items)
        } else {
            result.totalPage = 0
            result.totalCount = 0
            result.data = []
        }
        return result
    }

    function formatList (items) {
        const list = []
        items.forEach(item => {
            if (item.childs) {
                item.children = formatList(item.childs.items)
            } else {
                item.children = null
            }
            list.push(item)
        })
        return list
    }

    const columns = [
        {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' }
        },
        {
            title: '项目编号',
            dataIndex: 'projectCode'
        },
        {
            title: '房产项目名称',
            dataIndex: 'projectName',
            scopedSlots: { customRender: 'projectName' }
        },
        {
            title: '地区',
            dataIndex: 'projAddress',
            scopedSlots: { customRender: 'projAddress' }
        },
        {
            title: '城市',
            dataIndex: 'cityID',
            scopedSlots: { customRender: 'cityID' }
        },
        {
            title: '项目状态',
            dataIndex: 'projStatus',
            scopedSlots: { customRender: 'projStatus' }
        },
        {
            title: '审批状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
        },
        /* {
          title: '创建者',
          dataIndex: 'creator',
          scopedSlots: { customRender: 'creator' }
        }, */
        {
            title: '创建日期',
            dataIndex: 'beginDate'
        }
        /* {
          title: '最后更新者',
          dataIndex: 'updater',
          scopedSlots: { customRender: 'updater' }
        }, */
        /* {
          title: '最后更新日期',
          dataIndex: 'updatedAt'
        } */
    ]

    export default {
        name: 'ProjectList',
        components: {
            STable,
            Ellipsis,
        },
        data () {
            this.columns = columns
            return {
                // 城市
                cities: [],
                // 查询参数
                queryParam: {},
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    return ProjectService.items(requestParameters).then(res => {
                        return fixedList(res, parameter)
                    })
                }
            }
        },
        created () {
            // getRoleList({ t: new Date() })
            ProjectService.tree().then(res => {
                this.cities = res.result.data.citys
                console.log(this.cities)
            })
        },
        watch: {
            'queryParam.Id' () {
                this.$refs.table.refresh(true)
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
            handleToItem (record) {
                this.$router.push({ path: `/project/item/${record.id}?type=view` })
            },
            handleToEdit (record, isStaged = false) {
                this.$router.push({ path: `/project/item/${record.id}?type=update&isStaged=` + isStaged })
            },
            handleToAdd () {
                this.$router.push({ path: `/project/item/0?type=create` })
            }
        }
    }
</script>
