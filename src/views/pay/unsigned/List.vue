<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="项目">
                <a-tree-select
                  v-model="queryParam.ProjectGUID"
                  style="width: 100%"
                  :tree-data="cities"
                  :dropdown-style="{ maxHeight: '400px', overflowH: 'auto' }"
                  search-placeholder="请选择"
                  @select="onSelect"
                />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-button type="primary" style="margin-left: 5px" @click="show = !show">
                <a-icon type="search"></a-icon>
              </a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" v-if="show" class="search-form">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="收款单号">
              <a-input v-model="queryParam.paymentOtherCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="收款单位">
              <a-input v-model="queryParam.payeePartyNameList"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="款项类型">
              <a-select
                placeholder="请选择"
                v-model="queryParam.paymentType">
                <a-select-option v-for="type in moneyTypes"
                                 :value="type"
                                 :key="type">{{type}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="审批状态">
              <a-select
                placeholder="请选择"
                v-model="queryParam.auditStatus"
                v-decorator="[queryParam.auditStatus, { rules: [{required: true, message: '请选择'}] }]">
                <a-select-option value="1">草拟中</a-select-option>
                <a-select-option value="2">已审批</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-button type="success" @click="search">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
          </a-col>
        </a-row>
      </a-form>

      <a-row :gutter="48" style="margin-top: 10px">
        <a-col :md="12" :sm="24">
          <a-button type="success" @click="handleToAdd">新增付款</a-button>
        </a-col>
      </a-row>
      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="gid"
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
            <a-button
              class="btn-success"
              type="primary"
              icon="file-text"
              title="查看"
              @click="handleToItem(record)"></a-button>
            <a-button
              :disabled="record.auditStatus !== '未审核'"
              class="btn-info"
              type="primary"
              icon="form"
              style="margin-left: 4px"
              title="编辑"
              @click="handleToEdit(record)"></a-button>
            <a-button
              :disabled="record.auditStatus !== '未审核'"
              type="danger"
              icon="delete"
              style="margin-left: 4px"
              title="删除"
              @click="remove(record)"></a-button>
          </template>
        </span>
      </s-table>

      <a-modal
        title="删除付款单"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <p>您确定要删除？</p>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import moment from 'moment'
    import { STable, Ellipsis } from '@/components'
    import { getRoleList } from '@/api/manage'

    import StepByStepModal from '@/views/list/modules/StepByStepModal'
    import CreateForm from '@/views/list/modules/CreateForm'
    import { fixedList } from '@/utils/util'
    import { ProjectService } from '@/views/project/project.service'
    import { formatList } from '../../../mock/util'
    import { UnSignedService } from './unsigned.service'

    const columns = [
        {
            title: '操作',
            dataIndex: 'action',
            width: '139px',
            scopedSlots: { customRender: 'action' }
        },
        {
            title: '付款单号',
            dataIndex: 'paymentOtherCode'
        },
        {
            title: '收款单位',
            dataIndex: 'payeePartyNameList',
            scopedSlots: { customRender: 'payeePartyNameList' }
        },
        {
            title: '款项类型',
            dataIndex: 'paymentBusinessType',
            scopedSlots: { customRender: 'paymentBusinessType' }
        },
        {
            title: '金额',
            dataIndex: 'paymentAmount',
        },
        {
            title: '审批状态',
            dataIndex: 'auditStatus',
            scopedSlots: { customRender: 'auditStatus' }
        },
        {
            title: '建立日期',
            dataIndex: 'requestDate'
        },
        {
            title: '建立人',
            dataIndex: 'requestUserName',
            scopedSlots: { customRender: 'requestUserName' }
        },
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
        name: 'ContractList',
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
                cities: [],
                moneyTypes: [],
                city: '',
                value: '',
                deleteId: '',
                projectType: '',
                show: false,
                visible: false,
                confirmLoading: false,
                mdl: null,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: { ProjectGUID: '19a6f5a0-d192-4875-8397-7945e5a33b8a', ProjectID: 'NWSC.LNXM.LN3.CC01' },
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    if (this.queryParam.ProjectGUID && this.queryParam.ProjectID) {
                        const requestParameters = Object.assign({}, parameter, this.queryParam)
                        return UnSignedService.items(requestParameters).then(res => {
                            return fixedList(res, requestParameters)
                        })
                    } else {
                        return []
                    }
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
            getRoleList({ t: new Date() })
            ProjectService.tree().then(res => {
                const cities = []
                res.result.data.citys.forEach(item => {
                    const children = formatList(item.projects.items)
                    cities.push({
                        label: item.city.nameCN,
                        value: item.city.id,
                        children: children
                    })
                })
                this.cities = cities
                this.$forceUpdate()
            })
            UnSignedService.moneyTypes().then(res => {
                this.moneyTypes = res.result.data
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
                this.$router.push({ path: `/pay/unsigned/item/${record.gid}?type=view` })
            },
            handleToEdit (record) {
                this.$router.push({ path: `/pay/unsigned/item/${record.gid}?type=update` })
            },
            handleToAdd () {
                this.$router.push({ path: '/pay/unsigned/item/0?type=create' })
            },
            handleAdd () {
                this.mdl = null
                this.visible = true
            },
            handleEdit (record) {
                this.visible = true
                this.mdl = { ...record }
            },
            search () {
                console.log('search')
                this.show = !this.show
                this.$refs.table.refresh(true)
            },
            onSelect (value, option) {
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
            },
            remove (record) {
                this.visible = true
                this.deleteId = record.gid
            },
            handleOk () {
                this.confirmLoading = true
                UnSignedService.delete(this.deleteId).then(res => {
                    if (res.result.data) {
                        this.visible = false
                        this.confirmLoading = false
                        this.$message.success('删除成功')
                        this.$refs.table.refresh(true)
                    }
                })
            },
            handleCancel () {
                this.visible = false
            },
            handleSub (record) {
                if (record.status !== 0) {
                    this.$message.info(`${record.no} 订阅成功`)
                } else {
                    this.$message.error(`${record.no} 订阅失败，规则已关闭`)
                }
            },
            onSelectChange (selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                this.selectedRows = selectedRows
            },
            toggleAdvanced () {
                this.advanced = !this.advanced
            },
            resetSearchForm () {
                this.queryParam = {
                    date: moment(new Date())
                }
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

  /deep/ .ant-table-footer {
    padding-bottom: 0;
  }

</style>
