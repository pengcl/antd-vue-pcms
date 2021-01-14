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
                  :suffixIcon="cities ? '' : '加载中...'"
                  v-model="queryParam.Id">
                  <a-select-option
                    v-for="(city,index) in cities"
                    :key="city.id"
                    :index="index"
                    :value="city.id">{{ city.nameCN }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button v-if="ac('ADD')" :disabled="!queryParam.Id" type="success" @click="handleToAdd()">新增项目</a-button>
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
        :defaultExpandAllRows="true"
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

        <span slot="creationTime" slot-scope="text">
          {{ text | moment('yyyy-MM-DD') }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a-button
              v-if="ac('VIEW')"
              @click="handleToItem(record)"
              class="btn-success"
              type="primary"
              icon="file-text"
              title="查看">
            </a-button>
            <a-button
              v-if="ac('EDIT')"
              :disabled="record.auditStatus !== '未审核'"
              @click="handleToEdit(record)"
              type="primary"
              class="btn-info"
              icon="form"
              style="margin-left: 4px"
              title="编辑">
            </a-button>
            <a-button
              v-if="record.projectDataType !== 'Stage' && ac('ADD')"
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
    import { ProjectService } from '@/views/project/project.service'
    import { City as CityService } from '@/api/city'
    import storage from 'store'
    import { ac } from '@/views/user/user.service'

    function getPosValue (cities) {
      const POS = storage.get('POS') ? storage.get('POS').split('-').splice(1) : []
      let value = JSON.parse(JSON.stringify(cities))
      POS.forEach((index, i) => {
        if (i === 0) {
          if (value[index]) {
            value = value[index]
          }
        }
      })
      return value
    }

    function fixedList (res, params) {
        const result = {}
        result.pageSize = params.pageSize
        result.pageNo = params.pageNo
        if (res.result.data) {
            result.totalPage = Math.ceil(res.result.data.projects.items.length / params.pageSize)
            result.totalCount = res.result.data.projects.items.length
            result.data = formatList(res.result.data.projects.items, true, res.result.data.city.regionalOfficeNameCN)
        } else {
            result.totalPage = 0
            result.totalCount = 0
            result.data = []
        }
        return result
    }

    function formatList (items, isRoot, area) {
        const list = []
        items.forEach(item => {
            item.isRoot = isRoot
            item.area = area
            if (item.childs && item.childs.items.length > 0) {
                item.children = formatList(item.childs.items, false, area)
            } else {
                item.children = null
                item.isEndNode = true
            }
            list.push(item)
        })
        return list
    }

    function getCityId (items) {
        let id = 0
        if (items.length > 0) {
            id = items[0].id
        }
        return id
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
            dataIndex: 'area',
            scopedSlots: { customRender: 'area' }
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
            dataIndex: 'creationTime',
            scopedSlots: { customRender: 'creationTime' }
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
                cities: null,
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
            ProjectService.newTree().then(res => {
                this.cities = res.result.data.items
                const value = getPosValue(this.cities)
                this.queryParam.Id = value.id ? value.id : getCityId(value)
                this.$refs.table.refresh()
            })

            CityService.regionals().then(res => {
                this.selection.regionals = res.result.data.items
            })
        },
        methods: {
            ac (action) {
                return ac(action, this.$route)
            },
            getCity (id) {
                let city = {}
                this.cities.forEach(item => {
                    if (item.id === id) {
                        city = item
                    }
                })
                return city.nameCN
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
