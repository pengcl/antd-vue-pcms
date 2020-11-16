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
                  @change="onChange"
                  v-model="queryParam.Id">
                  <a-select-option
                    v-for="(city,index) in cities"
                    :key="city.city.id"
                    :index="index"
                    :value="city.city.id">{{ city.city.nameCN }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button :disabled="!queryParam.Id" type="success" @click="handleToAdd()">新增项目</a-button>
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

        <span slot="regionalOfficeId" slot-scope="text">
          {{ text }}
        </span>

        <span slot="cityID" slot-scope="text">
          {{ getCity(text) }}
        </span>

        <span slot="beginDate" slot-scope="text">
          {{ text | moment('yyyy-MM-dd') }}
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
              v-if="record.projectDataType !== 'Stage'"
              @click="handleToAdd(record)"
              type="primary"
              class="btn-info"
              icon="plus-square"
              style="margin-left: 4px"
              :title="record.isRoot ? '新增分期' : '新增阶段'">
            </a-button>
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>

import { STable, Ellipsis } from '@/components'
// import { getRoleList } from '@/api/manage'
import { ProjectService } from '@/views/project/project.service'
import { City as CityService } from '@/api/city'
import storage from 'store'
import { getPosValue } from '@/utils/util'

function fixedList (res, params) {
  const result = {}
  result.pageSize = params.pageSize
  result.pageNo = params.pageNo
  if (res.result.data) {
    result.totalPage = Math.ceil(res.result.data.projects.items.length / params.pageSize)
    result.totalCount = res.result.data.projects.items.length
    result.data = formatList(res.result.data.projects.items, true)
  } else {
    result.totalPage = 0
    result.totalCount = 0
    result.data = []
  }
  return result
}

function formatList (items, isRoot) {
  const list = []
  items.forEach(item => {
    item.isRoot = isRoot
    if (item.childs && item.childs.items.length > 0) {
      item.children = formatList(item.childs.items, false)
    } else {
      item.children = null
      item.isEndNode = true
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
    dataIndex: 'projectShortName',
    scopedSlots: { customRender: 'projectShortName' }
  },
  {
    title: '地区',
    dataIndex: 'regionalOfficeId',
    scopedSlots: { customRender: 'regionalOfficeId' }
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
    dataIndex: 'auditStatus',
    scopedSlots: { customRender: 'auditStatus' }
  },
  /* {
    title: '创建者',
    dataIndex: 'creator',
    scopedSlots: { customRender: 'creator' }
  }, */
  {
    title: '创建日期',
    dataIndex: 'beginDate',
    scopedSlots: { customRender: 'beginDate' }
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
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      // 城市
      cities: [],
      selection: {},
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (this.queryParam.Id) {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return ProjectService.items(requestParameters).then(res => {
            return fixedList(res, parameter)
          })
        }
      }
    }
  },
  created () {
    // getRoleList({ t: new Date() })
    ProjectService.tree().then(res => {
      this.cities = res.result.data.citys
      const value = getPosValue(this.cities)
      this.queryParam.Id = value.city.id
      this.$refs.table.refresh()
    })

    CityService.regionals().then(res => {
      this.selection.regionals = res.result.data.items
    })
  },
  methods: {
    getCity (id) {
      let city = {}
      this.cities.forEach(item => {
        if (item.city.id === id) {
          city = item.city
        }
      })
      return city.nameCN
    },
    getRegional (id) {

    },
    onChange (value, option) {
      storage.set('POS', '0-' + option.data.attrs.index + '-0-0-0')
      this.$forceUpdate()
      this.$refs.table.refresh()
    },
    handleToItem (record) {
      this.$router.push({ path: `/project/item/${record.id}?type=view&stage=${record.projectDataType}` })
    },
    handleToEdit (record) {
      this.$router.push({ path: `/project/item/${record.id}?type=update&stage=${record.projectDataType}` })
    },
    handleToAdd (record) {
      const stage = record ? (record.projectDataType === 'Project' ? 'Stages' : 'Stage') : 'Project'
      const id = record ? record.id : '0'
      const url = `/project/item/${id}?type=create&cityID=${this.queryParam.Id}&stage=${stage}`
      this.$router.push({ path: url })
    }
  }
}
</script>
