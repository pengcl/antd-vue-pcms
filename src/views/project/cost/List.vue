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
                  :suffixIcon="cities ? '' : '加载中...'"
                />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24"><span
              class="project-type-tips">{{ projectType === 'project' ? '请选择末级新建业态成本中心' : '' }}</span></a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button :disabled="!queryParam.ProjectGUID || auditStatus !== '已审核' || projectType === 'project'"
                  v-if="ac('ADD')" type="success" @click="handleToAdd">新增业态成本中心
        </a-button>
        <a-button v-if="ac('ADD')" type="success" @click="bpm">新增审核
        </a-button>
        <a-button type="success" @click="showAuditModal">审核记录
        </a-button>
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
        :scroll="{ x: 'calc(700px + 50%)'}"
      >

        <span slot="propertyTypeID" slot-scope="text">{{ getName(tagTree,text) }}</span>
        <span slot="developmentPurposeID" slot-scope="text">{{ getName(types,text) }}</span>
        <span slot="totalGFA" slot-scope="text">{{ text | NumberFormat }}</span>
        <span slot="totalRA" slot-scope="text">{{ text | NumberFormat }}</span>
        <span slot="totalCFAIncludeParking" slot-scope="text">{{ text | NumberFormat }}</span>
        <span slot="creationTime" slot-scope="text">{{ text | moment('yyyy-MM-DD') }}</span>
        <span slot="lastModificationTime" slot-scope="text">{{ text | moment('yyyy-MM-DD') }}</span>

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
          </template>
        </span>
        <span slot="auditStatus" slot-scope="text,record">
          <p >
            <span v-if="!!record.auditStatus" style="font-weight: bold;padding-right: 10px">{{text}} （V.{{record.version }}）</span>
          </p>
        </span>
      </s-table>
    </a-card>
    <!-- 主列表审批记录 -->
    <audit-list-modal ref="auditListModal"></audit-list-modal>
  </page-header-wrapper>
</template>

<script>
    import { STable, Ellipsis } from '@/components'
    import { CostService } from '@/views/project/cost/cost.service'
    import { fixedList, getPosValue, getList } from '@/utils/util'
    import { ProjectService } from '@/views/project/project.service'
    import { ac } from '@/views/user/user.service'
    import storage from 'store'
    import { formatList } from '@/mock/util'
    import { Base as BaseService } from '@/api/base'
    import AuditListModal from '@/views/project/cost/modal/AuditListModal'

    const columns = [
        {
            title: '操作',
            dataIndex: 'action',
            width: 120,
            scopedSlots: { customRender: 'action' }
        },
        {
            title: '成本中心编码',
            dataIndex: 'costCenterCode',
            width: 120,
            sorter: true
        },
        {
            title: '成本中心名称',
            dataIndex: 'costCenterName',
            width: 150,
            scopedSlots: { customRender: 'costCenterName' }
        },
        {
            title: '审批状态',
            dataIndex: 'auditStatus',
            width: 140,
            scopedSlots: { customRender: 'auditStatus' }
        },
        {
            title: '业态标签',
            width: 180,
            dataIndex: 'propertyTypeID',
            scopedSlots: { customRender: 'propertyTypeID' }
        },
        {
            title: '业态属性',
            width: 90,
            dataIndex: 'developmentPurposeID',
            scopedSlots: { customRender: 'developmentPurposeID' }
        },
        {
            title: '总计容面积（GFA）',
            width: 180,
            dataIndex: 'totalGFA',
            scopedSlots: { customRender: 'totalGFA' }
        },
        {
            title: '总可售/可租面积（RA）',
            width: 180,
            dataIndex: 'totalRA',
            scopedSlots: { customRender: 'totalRA' }
        },
        {
            title: '总建筑面积(不含车库)(CFA)',
            width: 180,
            dataIndex: 'totalCFAIncludeParking',
            scopedSlots: { customRender: 'totalCFAIncludeParking' }
        },
        {
            title: '单位/车位数',
            width: 100,
            dataIndex: 'roomCarParkNo',
        },
        {
            title: '创建者',
            dataIndex: 'creatorUser',
            width: 100,
            scopedSlots: { customRender: 'creatorUser' }
        },
        {
            title: '创建日期',
            dataIndex: 'creationTime',
            width: 120,
            scopedSlots: { customRender: 'creationTime' },
            sorter: true
        },
        {
            title: '最后更新日期',
            dataIndex: 'lastModificationTime',
            width: 120,
            scopedSlots: { customRender: 'lastModificationTime' },
            sorter: true
        }
    ]

    const _formatList = (items) => {
        const list = []
        items.forEach(item => {
            if (item.childs && item.childs.length > 0) {
                item.selectable = false
                item.children = _formatList(item.childs)
            } else {
                item.children = null
            }
            item.label = item.nameCN
            item.value = item.id
            list.push(item)
        })
        return list
    }

    function getName (items, id) {
        let name = ''
        if (items) {
            items.forEach(item => {
                if (!name) {
                    if (item.id === id) {
                        name = item.nameCN
                        name = item.nameCN
                    } else {
                        if (item.children && item.children.length > 0) {
                            name = getName(item.children, id)
                        }
                    }
                }
            })
        }
        return name
    }

    export default {
        name: 'ProjectCostList',
        components: {
            STable,
            Ellipsis,
            AuditListModal
        },
        data () {
            this.columns = columns
            return {
                loading: { bpm: false, view: false },
                show: false,
                cities: null,
                projectType: null,
                auditStatus: null,
                tagTree: null,
                types: null,
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
                this.auditStatus = value.auditStatus ? value.auditStatus : getList(this.cities, 0).auditStatus
                this.projectType = value.type ? value.type : getList(this.cities, 0).type
                this.queryParam.ProjectGUID = value.projectGUID ? value.projectGUID : getList(this.cities, 0).projectGUID
                this.$refs.table.refresh()
                this.$forceUpdate()
            })
            BaseService.centerTags().then(res => {
                this.tagTree = _formatList([res.result.data])
            })
            BaseService.centerTypes().then(res => {
                this.types = res.result.data
            })
        },
        methods: {
            getName (items, id) {
                return getName(items, id)
            },
            ac (action) {
                return ac(action, this.$route)
            },
            handleToItem (record) {
                this.$router.push({ path: `/project/cost/item/${record.id}?type=view&ProjectGUID=` + this.queryParam.ProjectGUID })
            },
            handleToEdit (record) {
                this.$router.push({ path: `/project/cost/item/${record.id}?type=update&ProjectGUID=` + this.queryParam.ProjectGUID })
            },
            handleToAdd () {
                this.$router.push({ path: `/project/cost/item/0?type=create&ProjectGUID=` + this.queryParam.ProjectGUID })
            },
            onSelect (value, option) {
                storage.set('POS', option.pos)
                this.projectType = option.$options.propsData.dataRef.type
                this.auditStatus = option.$options.propsData.dataRef.auditStatus
                this.queryParam.ProjectGUID = value
                this.$refs.table.refresh()
                this.$forceUpdate()
            },
            search () {
                this.$refs.table.refresh()
            },
            view () {
              this.loading.view = true
              BaseService.viewBpm(this.form.ccBusinessGuid).then(res => {
                this.loading.view = false
                const _window = window.open('_blank')
                _window.location = res.result.data
              })
            },
            bpm () {
              this.loading.bpm = true
              CostService.bpm(this.queryParam.ProjectGUID).then(res => {
                this.loading.bpm = false
                const _window = window.open('_blank')
                _window.location = res.result.data
              })
            },
            showAuditModal() {
              this.$refs.auditListModal.show(this.queryParam.ProjectGUID)
            },
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

  .project-type-tips {
    line-height: 32px;
    color: #ff0000;
  }

</style>
