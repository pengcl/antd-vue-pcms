<template>
  <page-header-wrapper>
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

      <div class="table-operator">
        <a-button type="success" @click="handleToAdd">新增业态成本中心</a-button>
        <!--<a-button type="primary" @click="show = !show">
          <a-icon type="search"></a-icon>
        </a-button>-->
        <a-button type="primary" style="float: right">汇出</a-button>
      </div>

      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" v-if="show" class="search-form">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="成本中心编号">
              <a-input v-model="queryParam.ContractNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="成本中心名称">
              <a-input v-model="queryParam.VendorName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button type="success" @click="search()">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
          </a-col>
        </a-row>
      </a-form>

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
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { CostService } from '@/views/project/cost/cost.service'
import { fixedList, getPosValue } from '@/utils/util'
import { ProjectService } from '@/views/project/project.service'
import storage from 'store'

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

const formatList = (items, option) => {
  const list = []
  items.forEach(item => {
    if (item.childs) {
      item.selectable = item.childs.items.length < 1
      item.children = formatList(item.childs.items)
    } else {
      item.selectable = true
      item.children = null
    }
    if (option) {
      item.selectable = false
      item[option.key] = option.value
    }
    item.label = item.projectName
    item.value = item.projectGUID
    list.push(item)
  })
  return list
}

export default {
  name: 'ProjectCostList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      show: false,
      cities: [],
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (this.queryParam.ProjectGUID) {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return CostService.list(requestParameters).then(res => {
            return fixedList(res, requestParameters)
          })
        }
      }
    }
  },
  created () {
    // getRoleList({ t: new Date() })
    ProjectService.tree().then(res => {
      const cities = []
      res.result.data.citys.forEach(item => {
        const children = formatList(item.projects.items, { key: 'type', value: 'project' })
        cities.push({
          selectable: false,
          label: item.city.nameCN,
          value: item.city.id,
          children: children
        })
      })
      this.cities = cities
      const value = getPosValue(this.cities)
      if (value.type !== 'project') {
        this.queryParam.ProjectGUID = value.projectGUID
      }
      this.$refs.table.refresh()
      this.$forceUpdate()
    })
  },
  methods: {
    handleToItem (record) {
      this.$router.push({ path: `/project/cost/item/${record.id}?type=view` })
    },
    handleToEdit (record) {
      this.$router.push({ path: `/project/cost/item/${record.id}?type=update` })
    },
    handleToAdd () {
      this.$router.push({ path: `/project/cost/item/0?type=create&ProjectGUID=` + this.queryParam.ProjectGUID })
    },
    onSelect (value, option) {
      storage.set('POS', option.pos)
      this.queryParam.ProjectGUID = value
      this.$refs.table.refresh()
      this.$forceUpdate()
    },
    search () {
      this.$refs.table.refresh()
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
