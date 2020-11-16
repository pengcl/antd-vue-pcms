<template>
  <page-header-wrapper :property="{}">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="项目">
                <a-tree-select
                  style="width: 100%"
                  :tree-data="cities"
                  :dropdown-style="{ maxHeight: '400px', overflowH: 'auto' }"
                  search-placeholder="请选择"
                  v-model="queryParam.ProjectGUID"
                  @select="onSelect"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="code"
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
            {{ record.code }}
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
              @click="loadTypeItems(record)"
              type="primary"
              icon="plus-square"
              style="margin-left: 4px"
              title="查看科目类型">
            </a-button>
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import {STable, Ellipsis} from '@/components'
  import StepByStepModal from '@/views/list/modules/StepByStepModal'
  import CreateForm from '@/views/list/modules/CreateForm'
  import {ProjectService} from '@/views/project/project.service'
  import {CostService} from '@/views/cost/cost.service'
  import { formatList } from '../../../mock/util'
  import {getPosValue, nullFixedList} from "@/utils/util";
  import storage from "store";

  function fixedList(res, params) {
    const result = {}
    result.pageSize = params.pageSize
    result.pageNo = params.pageNo
    if (res.result.data) {
      result.totalPage = Math.ceil(res.result.data.length / params.pageSize)
      result.totalCount = res.result.data.length
      result.data = getList(res.result.data)
    } else {
      result.totalPage = 0
      result.totalCount = 0
      result.data = []
    }
    console.log(result)
    return result
  }

  function dataFormatList(items) {
    const list = []
    items.forEach(item => {
      if (item.childs) {
        item.children = dataFormatList(item.childs)
      }
      list.push(item)
    })
    return list
  }

  function getList(items) {
    const list = []
    items.forEach(item => {
      CostService.typyItems({Id: item.id}).then(res => {
        item.childs = res.result.data.childs
        item.children = res.result.data.childs
      })
      if (item.childs) {
        item.children = getList(item.childs)
      }
      list.push(item)
    })
    return list
  }

  const defaultColumns = [

    {
      title: '科目代码',
      dataIndex: 'code',
      width: '200px'
    },
    {
      title: '科目名称',
      dataIndex: 'nameCN'
    },
    {
      title: '类型名称',
      dataIndex: 'typeName'
    }
  ]

  const columns = defaultColumns

  export default {
    name: 'CostEnactList',
    components: {
      STable,
      Ellipsis,
      CreateForm,
      StepByStepModal
    },
    data() {
      this.columns = columns
      return {
        titleIds: [],
        auditStatus: '',
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
          const _columns = JSON.parse(JSON.stringify(defaultColumns))
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          if (this.queryParam.ProjectGUID) {
            return CostService.items(requestParameters).then(res => {
              const result = {
                result: {
                  data: []
                }
              }
              // result.result.data = getList(res.result.data)
              // console.log(result)
              // this.$forceUpdate()
              return fixedList(res, requestParameters)
            })
          }else {
            return nullFixedList(requestParameters)
          }
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    created() {
      ProjectService.tree().then(res => {
        const cities = []
        res.result.data.citys.forEach(item => {
          const children = formatList(item.projects.items, {key: 'type', value: 'project'})
          cities.push({
            selectable: false,
            label: item.city.nameCN,
            value: item.city.id,
            children: children
          })
        })
        this.cities = cities
        const value = getPosValue(this.cities)
        this.queryParam.ProjectID = value.projectCode
        this.queryParam.ProjectGUID = value.projectGUID
        this.auditStatus = value.auditStatus
        this.$forceUpdate()
        this.$refs.table.refresh(true)
      })
    },
    computed: {
      rowSelection() {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    },
    methods: {
      handleToItem(record) {
        this.$router.push({path: `/cost/enact/item/${record.id}?type=view&ProjectGUID=${this.queryParam.ProjectGUID}`})
      },
      handleToEdit(record) {
        this.$router.push({path: `/cost/enact/item/${record.id}?type=edit&ProjectGUID=${this.queryParam.ProjectGUID}`})
      },
      handleToAdd() {
        this.$router.push({path: `/cost/enact/item/0?type=add`})
      },
      handleToResolve(record) {
        this.$router.push({path: `/cost/resolve/item/${record.id}?type=edit&ProjectGUID=${this.queryParam.ProjectGUID}`})
      },
      loadTypeItems(record) {
        const result = {
          result: {
            data: []
          }
        }
        const requestParameters = Object.assign(this.queryParam)
        CostService.items(requestParameters).then(res => {
          result.result.data = getList(res.result.data,record.id)
          console.log(result)
          this.$forceUpdate()
          return fixedList(result, requestParameters)
        })

      },
      onSelect(value, option) {
        storage.set('POS', option.pos)
        this.queryParam.projectGUID = option.$options.propsData.dataRef.projectGUID
        if (typeof value === 'number') {
          this.city = value
          this.queryParam.ProjectGUID = ''
        } else {
          this.queryParam.ProjectGUID = value
        }
        this.auditStatus = option.dataRef.auditStatus
        this.$refs.table.refresh()
        this.$forceUpdate()
      }
    }
  }
</script>
