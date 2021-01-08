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
                  :suffixIcon="cities ? '' : '加载中...'"
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
            <a-form-item label="付款单号">
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
                placeholder="请选择审批状态"
                v-model="queryParam.AuditStatus">
                <a-select-option :value="'未审核'">未审核</a-select-option>
                <a-select-option :value="'审核中'">审核中</a-select-option>
                <a-select-option :value="'已审核'">已审核</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="建立人">
              <a-input v-model="queryParam.requestUserName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="建立日期">
              <a-date-picker :value="queryParam.CreationTime_From"
                             placeholder="请选择开始时间"></a-date-picker>
              <span style="margin: 0 10px;color: #fff">至</span>
              <a-date-picker :value="queryParam.CreationTime_To"
                             placeholder="请选择结束时间"></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button type="success" @click="search">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
            <a-button type="success" style="margin-left: 20px" @click="clear">清空</a-button>
          </a-col>
        </a-row>
      </a-form>

      <a-row :gutter="48" style="margin-top: 10px">
        <a-col :md="12" :sm="24">
          <a-button type="success" @click="handleToAdd" v-if="queryParam.ProjectGUID && ac('ADD')">新增付款</a-button>
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
        <span slot="paymentAmount" slot-scope="text">
            {{text | NumberFormat}}
        </span>


        <span slot="requestDate" slot-scope="text">
            {{text | date}}
        </span>

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
              :disabled="record.auditStatus !== '未审核'"
              class="btn-info"
              type="primary"
              icon="form"
              style="margin-left: 4px"
              title="编辑"
              @click="handleToEdit(record)"></a-button>
            <a-button
              v-if="ac('DELETE')"
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
        :maskClosable="false"
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
    import { STable } from '@/components'
    import CreateForm from '@/views/list/modules/CreateForm'
    import { fixedList, getPosValue, getList } from '@/utils/util'
    import { ProjectService } from '@/views/project/project.service'
    import { formatList } from '@/mock/util'
    import { UnSignedService } from './unsigned.service'
    import storage from 'store'
    import { ac } from '@/views/user/user.service'

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
            scopedSlots: { customRender: 'paymentAmount' }
        },
        {
            title: '审批状态',
            dataIndex: 'auditStatus',
            scopedSlots: { customRender: 'auditStatus' }
        },
        {
            title: '建立日期',
            dataIndex: 'requestDate',
            scopedSlots: { customRender: 'requestDate' }
        },
        {
            title: '建立人',
            dataIndex: 'requestUserName',
            scopedSlots: { customRender: 'requestUserName' }
        },
    ]

    export default {
        name: 'ContractList',
        components: {
            STable,
            CreateForm,
        },
        data () {
            this.columns = columns
            return {
                // create model
                cities: null,
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
                queryParam: {},
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    if (this.queryParam.ProjectCode) {
                        return UnSignedService.items(requestParameters).then(res => {
                            return fixedList(res, requestParameters)
                        })
                    }
                },
                selectedRowKeys: [],
                selectedRows: []
            }
        },
        created () {
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
                const value = getPosValue(this.cities)
                this.queryParam.ProjectCode = value.projectCode ? value.projectCode : getList(this.cities, 0).projectCode
                this.projectType = value.type ? value.type : getList(this.cities, 0).type
                this.queryParam.ProjectGUID = value.projectGUID ? value.projectGUID : getList(this.cities, 0).projectGUID
                this.$refs.table.refresh()
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
            clear () {
                this.queryParam = {
                    ProjectCode: this.queryParam.ProjectCode,
                    ProjectGUID: this.queryParam.ProjectGUID
                }
                this.$refs.table.refresh()
            },
            ac (action) {
                return ac(action, this.$route)
            },
            handleToItem (record) {
                this.$router.push({ path: `/pay/unsigned/item/${record.gid}?type=view&projectGUID=` + this.queryParam.ProjectGUID })
            },
            handleToEdit (record) {
                this.$router.push({ path: `/pay/unsigned/item/${record.gid}?type=update&projectGUID=` + this.queryParam.ProjectGUID })
            },
            handleToAdd () {
                this.$router.push({ path: '/pay/unsigned/item/0?type=create&projectGUID=' + this.queryParam.ProjectGUID })
            },
            search () {
                this.show = !this.show
                this.$refs.table.refresh(true)
            },
            onSelect (value, option) {
                storage.set('POS', option.pos)
                this.queryParam.ProjectCode = option.$options.propsData.dataRef.projectCode
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
            onSelectChange (selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                this.selectedRows = selectedRows
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

  /deep/ .ant-table-footer {
    padding-bottom: 0;
  }

</style>
