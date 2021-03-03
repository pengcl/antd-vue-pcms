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
                  v-model="queryParam2.ProjectGUID"
                  @select="onSelect"
                  :suffixIcon="cities ? '' : '加载中...'">
                </a-tree-select>
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

      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" v-if="show" class="search-form"
              @keyup.enter.native="formSearch">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="合同编号">
              <a-input v-model="queryParam2.ContractNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="本地合同编号">
              <a-input v-model="queryParam2.LocalContractNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合同名称">
              <a-input v-model="queryParam2.ContractName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合作方">
              <a-input v-model="queryParam2.VendorName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合同类型">
              <a-select
                placeholder="请选择合同类型"
                v-model="queryParam2.ContractCategory">
                <a-select-option :value="15">原合同</a-select-option>
                <a-select-option :value="16">补充合同</a-select-option>
                <a-select-option :value="17">专业分包合同</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="结算状态">
              <a-select
                placeholder="请选择结算状态"
                v-model="queryParam2.BalanceStatus">
                <a-select-option :value="'未结算'">未结算</a-select-option>
                <a-select-option :value="'阶段结算'">阶段结算</a-select-option>
                <a-select-option :value="'结算中'">结算中</a-select-option>
                <a-select-option :value="'最终结算'">最终结算</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-button type="success" @click="search()">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
            <a-button type="success" style="margin-left: 20px" @click="clear">清空</a-button>
          </a-col>
        </a-row>
      </a-form>

      <s-table :columns="columns"
               :data="loadData2"
               ref="contractTable"
               rowKey="contractGuid"
               :rowSelection="rowSelection"
               :scroll="{ x: 'calc(700px + 50%)'}"
               bordered>
        <span slot="contractNo" slot-scope="text, record">
            <a @click="handleToContractInfo(record)">{{text}}</a>
        </span>

        <span slot="contractAmount" slot-scope="text">
            {{text | NumberFormat}}
        </span>

        <template slot="footer">
          <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <span>预计结算金额：{{contractAmt.contractEstimateAmount}}</span>
              </a-col>
              <a-col :md="8" :sm="24">
                <span>累计批准金额：{{contractAmt.paymentRequestAmountTotal}} 占
                  {{contractAmt.paymentRequestAmountTotalRatio || contractAmt.paymentRequestAmountTotalRatio === 0 ?
                  contractAmt.paymentRequestAmountTotalRatio + '%' : ''}}</span>
              </a-col>
              <a-col :md="8" :sm="24">
                <span>累计付款金额：{{contractAmt.paymentAmountTotal}} 占 {{contractAmt.paymentAmountTotalRatio
                  || contractAmt.paymentAmountTotalRatio === 0 ?
                  contractAmt.paymentAmountTotalRatio + '%' : ''}}</span>
              </a-col>
            </a-row>
          </a-form>

        </template>
      </s-table>


      <a-row :gutter="48" style="margin-top: 10px">
        <a-col :md="12" :sm="24">
          <a-button type="success" @click="handleToAdd" v-if="queryParam.ContractGID && canAdd && ac('ADD')">新增付款</a-button>
          <a-button type="success" style="margin-left: 10px" @click="handToInvoice" :disabled="true">发票管理</a-button>
        </a-col>
      </a-row>
      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="gid"
        bordered
        :columns="_columns"
        :data="loadData"
      >
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="creationTime" slot-scope="text">
          <template>
            <span>{{text | date}}</span>
          </template>
        </span>

        <span slot="paymentReceiveDate" slot-scope="text">
          <template>
            <span>{{text | date}}</span>
          </template>
        </span>

        <span slot="paymentRequestAmount" slot-scope="text">
          <template>
            <span>{{text | NumberFormat}}</span>
          </template>
        </span>

        <span slot="paymentAmount" slot-scope="text">
          <template>
            <span>{{text | NumberFormat}}</span>
          </template>
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
        :maskClosable="false"
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
    import { STable } from '@/components'
    import CreateForm from '@/views/list/modules/CreateForm'
    import { fixedList, getPosValue, nullFixedList, getList } from '@/utils/util'
    import { ProjectService } from '@/views/project/project.service'
    import { formatList } from '@/mock/util'
    import { SignedService } from './signed.service'
    import storage from 'store'
    import { ac } from '@/views/user/user.service'

    const columns = [
        {
            title: '合同编号',
            dataIndex: 'contractNo',
            scopedSlots: { customRender: 'contractNo' },
            width: '220px',
            sorter: true
        },
        {
            title: '合同名称',
            dataIndex: 'contractName',
            width: '300px',
            scopedSlots: { customRender: 'contractName' }
        },
        {
            title: '乙方单位',
            width: '180px',
            dataIndex: 'partyInfo',
        },
        {
            title: '币种',
            dataIndex: 'currency',
            width: '80px',
        },
        {
            title: '合同金额',
            dataIndex: 'contractAmount',
            scopedSlots: { customRender: 'contractAmount' },
            width: '150px',
            sorter: true
        },
        {
            title: '审核状态',
            dataIndex: 'auditStatus',
            scopedSlots: { customRender: 'auditStatus' },
            width: '100px'
        },
        {
            title: '结算状态',
            dataIndex: 'balanceStatus',
            width: '100px'
        }
    ]

    const _columns = [
        {
            title: '操作',
            dataIndex: 'action',
            width: '139px',
            scopedSlots: { customRender: 'action' }
        },
        {
            title: '期数',
            dataIndex: 'paymentPhase',
            sorter: true
        },
        {
            title: '申请日期',
            dataIndex: 'creationTime',
            scopedSlots: { customRender: 'creationTime' },
            sorter: true
        },
        {
            title: '付款单号',
            dataIndex: 'paymentCode',
            scopedSlots: { customRender: 'paymentCode' },
            sorter: true
        },
        {
            title: '申请批准金额',
            dataIndex: 'paymentRequestAmount',
            scopedSlots: { customRender: 'paymentRequestAmount' },
            sorter: true
        },
        {
            title: '支付金额',
            dataIndex: 'paymentAmount',
            scopedSlots: { customRender: 'paymentAmount' },
            sorter: true
        },
        {
            title: '支付日期',
            dataIndex: 'paymentReceiveDate',
            scopedSlots: { customRender: 'paymentReceiveDate' },
            sorter: true
        },
        {
            title: '付款状态',
            dataIndex: 'auditStatus',
            scopedSlots: { customRender: 'auditStatus' }
        }
    ]

    export default {
        name: 'SignedList',
        components: {
            STable,
            CreateForm,
        },
        data () {
            this.columns = columns
            this._columns = _columns
            return {
                // create model
                id: '',
                deleteId: '',
                contractAmt: {},
                canAdd: false,
                city: '',
                projectType: '',
                cities: null,
                data: [],
                show: false,
                visible: false,
                confirmLoading: false,
                mdl: null,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: {},
                queryParam2: {},
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    if (this.queryParam.ContractGID) {
                        return SignedService.paymentList(requestParameters).then(res => {
                            return fixedList(res, requestParameters)
                        })
                    } else {
                        return nullFixedList(requestParameters)
                    }
                },
                loadData2: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam2)
                    if (this.queryParam2.ProjectGUID) {
                        return SignedService.items(requestParameters).then(res => {
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
                this.queryParam2.ProjectID = value.projectCode ? value.projectCode : getList(this.cities, 0).projectCode
                this.projectType = value.type ? value.type : getList(this.cities, 0).type
                this.queryParam2.ProjectGUID = value.projectGUID ? value.projectGUID : getList(this.cities, 0).projectGUID
                this.$refs.contractTable.refresh()
                this.$forceUpdate()
            })

        },
        computed: {
            rowSelection () {
                const that = this
                return {
                    selectedRowKeys: this.selectedRowKeys,
                    onChange: this.onSelectChange,
                    type: 'radio',
                    onSelect: function (record, selected, selectRows, nativeEvent) {
                        that.queryParam.ContractGID  = record.contractGuid
                        that.getContractAmt(record.contractGuid)
                        that.$refs.table.refresh()
                    }
                }
            },
        },
        methods: {
            formSearch () {
                this.$refs.contractTable.refresh()
            },
            clear () {
                this.queryParam2 = {
                    ProjectCode: this.queryParam2.ProjectCode,
                    ProjectGUID: this.queryParam2.ProjectGUID
                }
                this.contractAmt = {}
                this.queryParam.ContractGID = ''
                this.$refs.contractTable.clearSelected()
                this.$refs.table.refresh()
                this.$refs.contractTable.refresh()
            },
            ac (action) {
                return ac(action, this.$route)
            },
            handleToContractInfo (record) {
                this.$router.push({ path: `/contract/item/${record.contractGuid}?type=view` })
            },
            handToInvoice () {
                this.$router.push({
                    path: '/pay/signed/invoice/list'
                })
            },
            remove (record) {
                this.visible = true
                this.deleteId = record.gid
            },
            getContractAmt (id) {
                SignedService.contractAmt(id).then(res => {
                    this.contractAmt = res.result.data
                    this.canAdd = res.result.data.canAdd
                })
            },
            handleToItem (record) {
                this.$router.push({ path: `/pay/signed/item/${record.gid}?type=view` })
            },
            handleToEdit (record) {
                this.$router.push({ path: `/pay/signed/item/${record.gid}?type=update` })
            },
            handleToAdd () {
                this.$router.push({ path: `/pay/signed/item/${this.queryParam.ContractGID}?type=create` })
            },
            search () {
                this.show = !this.show
                this.$refs.contractTable.refresh(true)
            },
            onSelect (value, option) {
                storage.set('POS', option.pos)
                this.queryParam2.ProjectID = option.$options.propsData.dataRef.projectCode
                this.projectType = option.$options.propsData.dataRef.type
                if (typeof value === 'number') {
                    this.city = value
                    this.queryParam2.ProjectGUID = ''
                } else {
                    this.queryParam2.ProjectGUID = value
                }
                this.contractAmt = {}
                this.id = ''
                this.$refs.contractTable.clearSelected()
                this.$refs.table.refresh()
                this.$refs.contractTable.refresh()
                this.$forceUpdate()
            },
            handleOk (e) {
                this.confirmLoading = true
                SignedService.delete(this.deleteId).then(res => {
                    if (res.result.data) {
                        this.visible = false
                        this.confirmLoading = false
                        this.$message.success('删除成功')
                        this.$refs.table.refresh(true)
                    }
                })
            },
            handleCancel (e) {
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


</style>
