<template>
  <page-header-wrapper>
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
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="success" @click="handleToAdd">新增业态成本中心</a-button>
        <a-button type="primary" style="margin-left: 5px">汇出</a-button>
      </div>

      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="id"
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
          <!--<template>
            <a-button class="btn-success" type="primary" icon="file-text" title="检视">
            </a-button>
            <a-button type="primary" class="btn-info" icon="form" style="margin-left: 4px" title="编辑">
            </a-button>
            <a-button type="primary" class="btn-info" icon="plus-square" style="margin-left: 4px" title="新增业态成本中心">
            </a-button>
          </template>-->
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
import { getRoleList } from '@/api/manage'
import { CostService } from '@/views/project/cost/cost.service'
import { fixedList } from '@/utils/util'
import { ProjectService } from '@/views/project/project.service'

function fixedProjects (projects) {
  const list = []
  if (projects) {
    if (projects.items) {
      projects.items.forEach(item => {
        item.label = item.projectName
        item.value = item.projectGUID
        item.children = fixedProjects(item.childs)
        list.push(item)
      })
    }
  }
  return list
}

function formatList (items) {
  const list = []
  items.forEach(item => {
    if (item.childs) {
      item.children = formatList(item.childs.items)
    } else {
      item.children = null
    }
    item.label = item.projectName
    item.value = item.projectGUID
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
    title: '成本中心编号',
    dataIndex: 'costCenterCode'
  },
  {
    title: '成本中心名称',
    dataIndex: 'costCenterName',
    scopedSlots: { customRender: 'costCenterName' }
  },
  {
    title: '审批状态',
    dataIndex: 'auditStatus',
    scopedSlots: { customRender: 'auditStatus' }
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

export default {
  name: 'ProjectCostList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      cities: [],
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return CostService.list(requestParameters).then(res => {
          return fixedList(res, requestParameters)
        })
      }
    }
  },
  created () {
    // getRoleList({ t: new Date() })
    ProjectService.tree().then(res => {
      const cities = []
      res.result.data.citys.forEach(item => {
        const children = formatList(item.projects.items)
        console.log(children)
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
  methods: {
    handleToItem (record) {
      this.$router.push({ path: `/project/cost/item/${record.id}?type=view` })
    },
    handleToEdit (record) {
      this.$router.push({ path: `/project/cost/item/${record.id}?type=edit` })
    },
    handleToAdd () {
      this.$router.push({ path: `/project/cost/item/0?type=add` })
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
