<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="项目">
                <a-cascader
                  :options="regionalOffices"
                  :load-data="loadProjects"
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

import StepByStepModal from '@/views/list/modules/StepByStepModal'
import CreateForm from '@/views/list/modules/CreateForm'
import { CostService } from '@/views/project/cost/cost.service'
import { fixedList } from '@/utils/util'
import { Regional as RegionalService } from '@/api/regional'
import { City as CityService } from '@/api/city'
import { ProjectService } from '@/views/project/project.service'

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
  name: 'ProjectCostList',
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
      regionalOffices: [],
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return CostService.list(requestParameters).then(res => {
          return fixedList(res, requestParameters)
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
    // getRoleList({ t: new Date() })
    RegionalService.list().then(res => {
      const options = []
      res.result.data.items.forEach(item => {
        options.push({
          value: item.id,
          label: item.nameCN,
          isLeaf: false
        })
      })
      this.regionalOffices = options
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
      this.$router.push({ path: `/project/cost/item/${record.id}?type=view` })
    },
    handleToEdit (record) {
      this.$router.push({ path: `/project/cost/item/${record.id}?type=edit` })
    },
    handleToAdd () {
      this.$router.push({ path: `/project/cost/item/0?type=add` })
    },
    onChange (value, items) {
      console.log(value)
      if (value.length === 3) {
        this.queryParam.ProjectGUID = value[2]
        this.$refs.table.refresh(true)
      } else {
        this.queryParam.ProjectGUID = ''
        this.$refs.table.refresh(true)
      }
      /* if (items) {
        const city = items[1];
        if (city) {
          this.queryParam.Id = city.value;
          this.$refs.table.refresh(true);
        }
      } else {
        this.queryParam.Id = '';
        this.$refs.table.refresh(true);
      } */
    },
    loadProjects (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      ProjectService.tree(targetOption.value).then(res => {
        targetOption.loading = false
        const items = []
        res.result.data.citys.forEach(item => {
          const childrens = []
          item.projects.items.forEach(item => {
            childrens.push({
              value: item.projectGUID,
              label: item.projectName
            })
          })
          items.push({
            value: item.city.id,
            label: item.city.nameCN,
            children: childrens
          })
        })
        targetOption.children = items
        this.regionalOffices = [...this.regionalOffices]
      })
    }
  }
}
</script>
