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
            <a-col :md="12" :sm="24"><span
              class="project-type-tips">{{ projectType === 'project' ? '请选择末级新建合同' : '' }}</span></a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button v-if="ac('ADD')" :disabled="!queryParam.ProjectGUID || projectType === 'project'" type="success"
                  @click="handleToAdd">
          新增合同
        </a-button>
        <a-button type="primary" style="margin-left: 5px" @click="show = !show">
          <a-icon type="search"></a-icon>
        </a-button>
      </div>

      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" v-if="show" class="search-form"
              @keyup.enter.native="formSearch">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="合同编号">
              <a-input v-model="queryParam.ContractNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="本地合同编号">
              <a-input v-model="queryParam.LocalContractNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合同名称">
              <a-input v-model="queryParam.ContractName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合作方">
              <a-input v-model="queryParam.VendorName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合同类型">
              <a-select
                placeholder="请选择合同类型"
                v-model="queryParam.ContractCategory">
                <a-select-option :value="15">原合同</a-select-option>
                <a-select-option :value="16">补充合同</a-select-option>
                <a-select-option :value="17">专业分包合同</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="审批状态">
              <a-select
                placeholder="请选择"
                v-model="queryParam.AuditStatus">
                <a-select-option :value="'未审核'">未审核</a-select-option>
                <a-select-option :value="'审核中'">审核中</a-select-option>
                <a-select-option :value="'已审核'">已审核</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="预算确认">
              <a-radio-group v-model="queryParam.BudgetIsConfirm" style="color: #fff">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button type="success" @click="search()">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
            <a-button type="success" style="margin-left: 20px" @click="clear">清空</a-button>
          </a-col>
        </a-row>
      </a-form>

      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="contractGuid"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="false"
        :locale="{emptyText:'暂无数据'}"
        showPagination="auto"
      >
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="budgetIsConfirm" slot-scope="text">
          {{ text ? '已确认' : '未确认' }}
        </span>
        <span slot="contractAmount" slot-scope="text">{{ text | NumberFormat }}</span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a-button
              v-if="ac('VIEW')"
              class="btn-success"
              type="primary"
              icon="file-text"
              title="查看"
              @click="handleToItem(record)"></a-button>
            <a-button
              v-if="ac('EDIT')"
              class="btn-info"
              :disabled="record.auditStatus !== '未审核'"
              type="primary"
              icon="form"
              style="margin-left: 4px"
              title="编辑"
              @click="handleToEdit(record)"></a-button>
            <a-button
              v-if="ac('DELETE')"
              :disabled="record.auditStatus !== '未审核'"
              @click="handleToDel(record)"
              type="danger"
              title="删除"
              style="margin-left: 4px"
              icon="delete"></a-button>
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import { STable, Ellipsis } from '@/components'
    import storage from 'store'
    import { ContractService } from '@/views/contract/contract.service'
    import { fixedList, getPosValue, getList } from '@/utils/util'
    import { ProjectService } from '@/views/project/project.service'
    import { formatList } from '@/mock/util'
    import { ac } from '@/views/user/user.service'

    const columns = [
        {
            title: '操作',
            dataIndex: 'action',
            width: '140px',
            scopedSlots: { customRender: 'action' }
        },
        {
            title: '合同编号',
            dataIndex: 'contractNo',
            sorter: true
        },
        {
            title: '合同名称',
            dataIndex: 'contractName',
            scopedSlots: { customRender: 'contractName' }
        },
        {
            title: '合同金额',
            dataIndex: 'contractAmount',
            scopedSlots: { customRender: 'contractAmount' },
            sorter: true
        },
        {
            title: '签约日期',
            dataIndex: 'signDate',
            scopedSlots: { customRender: 'signDate' },
            width: 110,
            sorter: true
        },
        {
            title: '审批状态',
            dataIndex: 'auditStatus',
            width: 78,
            scopedSlots: { customRender: 'auditStatus' }
        },
        {
            title: '预算确认状态',
            dataIndex: 'budgetIsConfirm',
            align: 'center',
            scopedSlots: { customRender: 'budgetIsConfirm' }
        },
        {
            title: '建立日期',
            dataIndex: 'creationTime',
            width: 110,
            sorter: true
        },
        {
            title: '建立者',
            dataIndex: 'creatorUser',
            width: 100,
            align: 'center',
            scopedSlots: { customRender: 'creatorUser' }
        }
    ]

    export default {
        name: 'ContractList',
        components: {
            STable,
            Ellipsis
        },
        data () {
            this.columns = columns
            return {
                // create model
                cities: null,
                city: '',
                value: '',
                show: false,
                // 查询参数
                queryParam: {},
                projectType: undefined,
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    if (!parameter.sorting) {
                        this.queryParam.sorting = 'creationTime'
                        this.queryParam.sortOrder = 'desc'
                    } else {
                        this.queryParam.sorting = parameter.sorting
                        this.queryParam.sortOrder = parameter.sortOrder
                    }
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    if (this.queryParam.ProjectGUID) {
                        return ContractService.items(requestParameters).then(res => {
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
                this.queryParam.ProjectID = value.projectCode ? value.projectCode : getList(this.cities, 0).projectCode
                this.projectType = value.type ? value.type : getList(this.cities, 0).type
                this.queryParam.ProjectGUID = value.projectGUID ? value.projectGUID : getList(this.cities, 0).projectGUID
                this.$refs.table.refresh()
                this.$forceUpdate()
            })
        },
        methods: {
            contractNoChange (e) {
                console.log(e)
                this.$refs.table.refresh()
            },
            clear () {
                this.queryParam = {
                    ProjectID: this.queryParam.ProjectID,
                    ProjectGUID: this.queryParam.ProjectGUID
                }
                this.$refs.table.refresh()
            },
            ac (action) {
                return ac(action, this.$route)
            },
            handleToItem (record) {
                this.$router.push({ path: `/contract/item/${record.contractGuid}?type=view` })
            },
            handleToEdit (record) {
                this.$router.push({ path: `/contract/item/${record.contractGuid}?type=update` })
            },
            handleToAdd () {
                this.$router.push({ path: `/contract/item/0?type=create&ProjectGUID=` + this.queryParam.ProjectGUID })
            },
            handleToDel (record) {
                const that = this
                this.$confirm({
                    title: '删除合同',
                    content: '是否确定删除选中合同信息?',
                    onOk () {
                        ContractService.delete(record.contractGuid).then(res => {
                            if (res.result.data) {
                                that.$message.info('删除成功')
                                that.$refs.table.refresh()
                            } else {
                                that.$message.error(res.result.msg)
                            }
                        })
                    },
                    onCancel () {

                    }
                })
            },
            formSearch () {
                this.$refs.table.refresh()
            },
            search () {
                this.show = !this.show
                this.$refs.table.refresh(true)
            },
            onSelect (value, option) {
                storage.set('POS', option.pos)
                this.queryParam.ProjectID = option.$options.propsData.dataRef.projectCode
                this.projectType = option.$options.propsData.dataRef.type
                if (typeof value === 'number') {
                    this.city = value
                    this.queryParam.ProjectGUID = ''
                } else {
                    this.queryParam.ProjectGUID = value
                }
                this.$refs.table.refresh()
                this.$forceUpdate()
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

  .project-type-tips {
    line-height: 32px;
    color: #ff0000;
  }

  .ant-radio-group .ant-radio-wrapper {
    color: #fff;
  }

</style>
