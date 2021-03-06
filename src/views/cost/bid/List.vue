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
                  :suffixIcon="cities ? '' : '加载中...'">
                </a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="project-type-tips">
                {{ projectType === 'noProject' ? '请选择末级项目' : '' }}
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button
          v-if="ac('ADD')"
          :disabled="projectType === undefined || projectType === 'noProject'"
          type="success"
          @click="handleToAdd">新增工程招标包
        </a-button>
        <a-button type="primary" style="margin-left: 5px" @click="show = !show">
          <a-icon type="search"></a-icon>
        </a-button>
      </div>

      <a-form
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        v-if="show"
        class="search-form"
        @keyup.enter.native="search"
      >
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="编号">
              <a-input v-model="queryParam.TradePackageCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="工程名称">
              <a-input v-model="queryParam.PackageTitle"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="经办人">
              <a-input v-model="queryParam.CreatorUser"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="提交状态">
              <a-select
                placeholder="请选择"
                v-model="queryParam.AuditStatus"
                v-decorator="[queryParam.AuditStatus, { rules: [{required: true, message: '请选择'}] }]">
                <a-select-option value="未审核">未审核</a-select-option>
                <a-select-option value="审核中">审核中</a-select-option>
                <a-select-option value="已审核">已审核</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button type="success" @click="search()">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
            <a-button type="success" style="margin-left: 20px" @click="reSetSearch()">清空</a-button>
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
        <span slot="budgetAmount" slot-scope="text,record">
            {{record.budgetAmount|NumberFormat}}
        </span>

        <span slot="packageDate" slot-scope="text, record">
          {{ record.packageDate | date }}
        </span>

        <span slot="action" slot-scope="text,record">
          <template>
            <a-button
              v-if="ac('VIEW')"
              type="success"
              icon="file-text"
              title="查看"
              @click="handleToItem(record)">
            </a-button>
            <a-button
              v-if="ac('EDIT')"
              :disabled="record.auditStatus === '审核中'"
              type="primary"
              icon="form"
              style="margin-left: 4px"
              title="编辑"
              @click="handleToEdit(record)"></a-button>
            <a-button
              v-if="ac('DELETE')"
              :disabled="!record.isCanDelete || record.auditStatus !== '未审核'"
              type="danger"
              icon="delete"
              style="margin-left: 4px"
              title="删除"
              @click="handleToRemove(record)"></a-button>
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import moment from 'moment'
    import { STable, Ellipsis } from '@/components'
    import StepByStepModal from '@/views/list/modules/StepByStepModal'
    import { ProjectService } from '@/views/project/project.service'
    import { formatList } from '../../../mock/util'
    import { CostService } from '@/views/cost/cost.service'
    import { fixedList, getPosValue, getList } from '@/utils/util'
    import storage from 'store'
    import { ac } from '@/views/user/user.service'

    const columns = [
        {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' }
        },
        {
            title: '编号',
            dataIndex: 'tradePackageCode',
            sorter: true
        },
        {
            title: '工程名称',
            dataIndex: 'packageTitle'
        },
        {
            title: '预算金额',
            dataIndex: 'budgetAmount',
            scopedSlots: { customRender: 'budgetAmount' },
            sorter: true
        },
        {
            title: '日期',
            dataIndex: 'packageDate',
            scopedSlots: { customRender: 'packageDate' },
            sorter: true
        },
        {
            title: '经办人',
            dataIndex: 'creatorUser'
        },
        {
            title: '状态',
            dataIndex: 'auditStatus',
            sorter: true
        }
    ]

    export default {
        name: 'CostBidList',
        components: {
            STable,
            Ellipsis,
            StepByStepModal
        },
        data () {
            this.columns = columns
            return {
                // create model
                cities: null,
                show: false,
                visible: false,
                confirmLoading: false,
                mdl: null,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: {
                  ProjectGUID: this.$route.query.ProjectGUID,
                  TradePackageCode: this.$route.query.TradePackageCode,
                  PackageTitle: this.$route.query.PackageTitle,
                  AuditStatus: this.$route.query.AuditStatus
                },
                projectType: undefined,
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                  // this.queryParam['Sorting'] = 'packageDate'
                  // this.queryParam['SortOrder'] = 'DESC'
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    if (!parameter.sorting) {
                      this.queryParam.sorting = 'packageDate'
                      this.queryParam.sortOrder = 'desc'
                    } else {
                      this.queryParam.sorting = parameter.sorting
                      this.queryParam.sortOrder = parameter.sortOrder
                    }
                    if (typeof requestParameters.ProjectGUID !== 'undefined' && requestParameters.ProjectGUID !== '' && this.projectType !== 'noProject') {
                        return CostService.bidItems(requestParameters)
                            .then(res => {
                                if (res.result.data.items) {
                                    return fixedList(res, requestParameters)
                                }
                            })
                    } else {
                      const result = {
                        result: {
                          data: []
                        }
                      }
                      return new Promise((resolve) => {
                        resolve(fixedList(result, parameter))
                      })
                    }
                },
                selectedRowKeys: [],
                selectedRows: []
            }
        },
        filters: {},
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
                this.queryParam.ProjectGUID = value.projectGUID ? value.projectGUID : getList(this.cities, 0).projectGUID
              if (typeof (value.children) !== 'undefined' && value.children.length > 0) {
                  this.projectType = 'noProject'
                } else {
                  this.projectType = 'project'
                }
                this.$forceUpdate()
                this.$refs.table.refresh(true)
            })
        },
        props: {
            type: {
                type: String,
                default: 'view'
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
            ac (action) {
                return ac(action, this.$route)
            },
            handleToItem (record) {
                this.$router.push({ path: `/cost/bid/item/${record.id}?ProjectGUID=${this.queryParam.ProjectGUID}&type=view` })
            },
            handleToEdit (record) {
                this.$router.push({ path: `/cost/bid/item/${record.id}?ProjectGUID=${this.queryParam.ProjectGUID}&type=edit` })
            },
            handleToAdd (record) {
                if (this.queryParam.ProjectGUID === '') {
                    this.$message.error(`请选择项目`)
                } else {
                    this.$router.push({ path: `/cost/bid/item/0?ProjectGUID=${this.queryParam.ProjectGUID}&type=add` })
                }
            },
            handleToRemove (record) {
              const that = this
              this.$confirm({
                title: '删除招投标分判包',
                content: '是否确定删除选中招投标分判包?',
                onOk () {
                  CostService.bidRemove(record.id).then((res) => {
                      if (res.result.statusCode === 200) {
                        that.$message.info('招投标分判包删除成功')
                        that.$refs.table.refresh()
                      }
                    })
                },
                onCancel () {
                },
              })
            },
            onSelectChange (selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                this.selectedRows = selectedRows
            },
            resetSearchForm () {
                this.queryParam = {
                    date: moment(new Date())
                }
            },
            onSelect (value, option) {
              storage.set('POS', option.pos)
              this.projectType = option.$options.propsData.dataRef.type
              this.queryParam.ProjectID = option.$options.propsData.dataRef.projectCode
              if (typeof value === 'number') {
                this.city = value
                this.queryParam.ProjectGUID = ''
              } else {
                this.queryParam.ProjectGUID = value
              }
              if (option.$children.length > 0) {
                this.projectType = 'noProject'
              } else {
                this.projectType = 'project'
              }
              this.$refs.table.refresh()
              this.$forceUpdate()
            },
            search () {
              this.$refs.table.refresh()
            },
            reSetSearch () {
              this.queryParam.TradePackageCode = ''
              this.queryParam.PackageTitle = ''
              this.queryParam.CreatorUser = ''
              this.queryParam.AuditStatus = ''
              this.$refs.table.refresh()
            }
        },
        activated () {
          this.$refs.table.refresh()
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