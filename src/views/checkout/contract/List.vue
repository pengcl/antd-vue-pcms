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
            <a-form-item label="合同编号">
              <a-input v-model="queryParam.ContractNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合同名称">
              <a-input v-model="queryParam.ContractName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="供应商名称">
              <a-input v-model="queryParam.VendorName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button type="success" @click="search">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
          </a-col>
        </a-row>
      </a-form>

      <a-row>
        <a-col :md="24" :sm="24">
          合同列表
        </a-col>
      </a-row>
      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="contractGuid"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="false"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="contractNo" slot-scope="text, record">
            <a @click="handleToContractInfo(record)">{{text}}</a>
        </span>

        <span slot="contractCategory" slot-scope="text">
            {{text === 15 ? '原合同' : text === 16 ? '补充合同' : '专业分包合同'}}
        </span>

        <span slot="contractAmount" slot-scope="text">
            {{text | NumberFormat}}
        </span>

      </s-table>


      <a-row :gutter="48" style="margin-top: 10px">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button type="success"
                    @click="handleToCompleted"
                    :disabled="!contractGID || isLastBalance"
                    v-if="ac('ADD')">新增竣工证书
          </a-button>
          <a-button type="success"
                    style="margin-left: 10px"
                    @click="handleToAdd"
                    v-if="ac('C_ADD')"
                    :disabled="!balanceCertificateGID || !!balanceContractGID">
            新增合同结算
          </a-button>
          <a-button type="success" style="margin-left: 10px"
                    :disabled="bProjectAuditStatus !== '已审核' && bFinanceAuditStatus !== '已审核'">打印工程财务结算书
          </a-button>
        </a-col>
        <a-col :md="24" :sm="24">
          结算列表
        </a-col>
      </a-row>
      <s-table
        style="margin-top: 5px"
        ref="_table"
        size="default"
        rowKey="id"
        bordered
        :columns="_columns"
        :data="loadData2"
        :rowSelection="rowSelection2"
        :alert="false"
        showPagination="auto"
        :scroll="{ x: 'calc(700px + 50%)'}"
      >
        <span slot="completionDate" slot-scope="text,record">
          <a @click="handleToCompletedItem(record.gid,'update')" v-if="record.auditStatus === '未审核' && ac('EDIT')">{{text | date}}</a>
          <span v-if="record.auditStatus !== '未审核'">{{text | date}}</span>
        </span>

        <span slot="file_PdfPath" slot-scope="text,record">
            <a :href="record.file_PdfPathUrl" target="_blank" v-if="text">{{text}}</a>
        </span>


        <span slot="auditStatus" slot-scope="text,record">
            <a @click="handleToCompletedItem(record.gid,'view')" v-if="ac('VIEW')">{{text}}</a>
        </span>

        <span slot="isLastBalance" slot-scope="text">
          {{text ? '是' : '否'}}
        </span>

        <span slot="progressBalanceDate" slot-scope="text,record">
          <a @click="handleToContractItem(record.bContractGID,'update','')"
             v-if="record.bContractAuditStatus === '未审核' && ac('C_EDIT')">{{text | date}}</a>
          <span v-if="record.bContractAuditStatus !== '未审核'">{{text | date}}</span>
        </span>

        <span slot="bContractAuditStatus" slot-scope="text,record">
          <a @click="handleToContractItem(record.bContractGID,'view',record.auditStatus)">{{text}}</a>
        </span>

        <span slot="progressBalanceAmount" slot-scope="text">
          {{text | NumberFormat}}
        </span>

        <span slot="creationTime" slot-scope="text">
         {{text | date}}
        </span>

        <span slot="bContractCreationTime" slot-scope="text">
         {{text | date}}
        </span>

        <span slot="bProjectCreationTime" slot-scope="text">
         {{text | date}}
        </span>

        <span slot="bProjectAuditStatus" slot-scope="text,record">
         <a @click="handleToProjectItem(record.bProjectGID,record.bContractAuditStatus)" v-if="ac('P_APPROVE')">{{text ? (text === '未审核' ? '发起审批' : '查看审批') : ''}}</a>
        </span>

        <span slot="bFinanceCreationTime" slot-scope="text">
         {{text | date}}
        </span>

        <span slot="bFinanceAuditStatus" slot-scope="text,record">
         <a @click="handleToFinanceItem(record.bFinanceGID,record.bContractAuditStatus)" v-if="ac('F_APPROVE')">{{text ? (text === '未审核' ? '发起审批' : '查看审批') : ''}}</a>
        </span>

      </s-table>

    </a-card>
  </page-header-wrapper>
</template>

<script>
    import { STable } from '@/components'
    import { fixedList, getPosValue, nullFixedList, getList } from '@/utils/util'
    import { ProjectService } from '@/views/project/project.service'
    import { ChangeService } from '@/views/change/change.service'
    import { formatList } from '@/mock/util'
    import storage from 'store'
    import { CheckoutService } from '../checkout.service'
    import { ac } from '@/views/user/user.service'

    const columns = [
        {
            title: '合同编号',
            dataIndex: 'contractNo',
            scopedSlots: { customRender: 'contractNo' }
        },
        {
            title: '合同名称',
            dataIndex: 'contractName',
            scopedSlots: { customRender: 'contractName' }
        },
        {
            title: '审核状态',
            dataIndex: 'auditStatus',
            scopedSlots: { customRender: 'auditStatus' }
        },
        {
            title: '结算状态',
            dataIndex: 'balanceStatus',
        },
        {
            title: '合同类型',
            dataIndex: 'contractCategory',
            scopedSlots: { customRender: 'contractCategory' }
        },
        {
            title: '合同总金额(￥)',
            dataIndex: 'contractAmount',
            scopedSlots: { customRender: 'contractAmount' }
        },
        {
            title: '乙方单位',
            dataIndex: 'contractPartyCON',
        }
    ]

    const _columns = [
        {
            title: '竣工证书',
            children: [
                {
                    title: '竣工日期',
                    width: 110,
                    dataIndex: 'completionDate',
                    scopedSlots: { customRender: 'completionDate' }
                },
                {
                    title: '竣工证书',
                    dataIndex: 'file_PdfPath',
                    width: 200,
                    scopedSlots: { customRender: 'file_PdfPath' }
                },
                {
                    title: '是否最终竣工',
                    dataIndex: 'isLastBalance',
                    width: 110,
                    align: 'center',
                    scopedSlots: { customRender: 'isLastBalance' }
                },
                {
                    title: '发起日期',
                    width: 110,
                    dataIndex: 'creationTime',
                    scopedSlots: { customRender: 'creationTime' }
                },
                {
                    title: '审批状态',
                    width: 78,
                    dataIndex: 'auditStatus',
                    scopedSlots: { customRender: 'auditStatus' }
                }
            ]
        },
        {
            title: '合同结算',
            children: [
                {
                    title: '结算日期',
                    width: 110,
                    dataIndex: 'progressBalanceDate',
                    scopedSlots: { customRender: 'progressBalanceDate' }
                },
                {
                    title: '结算申请金额',
                    dataIndex: 'progressBalanceAmount',
                    align: 'center',
                    width: 180,
                    scopedSlots: { customRender: 'progressBalanceAmount' }
                },
                {
                    title: '发起日期',
                    width: 110,
                    dataIndex: 'bContractCreationTime',
                    scopedSlots: { customRender: 'bContractCreationTime' }
                },
                {
                    title: '审批状态',
                    width: 78,
                    dataIndex: 'bContractAuditStatus',
                    scopedSlots: { customRender: 'bContractAuditStatus' }
                }
            ]
        },
        {
            title: '工程结算',
            children: [
                {
                    title: '发起日期',
                    dataIndex: 'bProjectCreationTime',
                    width: 110,
                    scopedSlots: { customRender: 'bProjectCreationTime' }
                },
                {
                    title: '审批状态',
                    width: 90,
                    dataIndex: 'bProjectAuditStatus',
                    scopedSlots: { customRender: 'bProjectAuditStatus' }
                }
            ]
        },
        {
            title: '财务结算',
            children: [
                {
                    title: '发起日期',
                    dataIndex: 'bFinanceCreationTime',
                    width: 110,
                    scopedSlots: { customRender: 'bFinanceCreationTime' }
                },
                {
                    title: '审批状态',
                    width: 90,
                    dataIndex: 'bFinanceAuditStatus',
                    scopedSlots: { customRender: 'bFinanceAuditStatus' }
                }
            ]
        }
    ]

    export default {
        name: 'CheckoutContractList',
        components: {
            STable,
        },
        data () {
            this.columns = columns
            this._columns = _columns
            return {
                // create model
                contractGID: '',
                balanceCertificateGID: '',
                balanceContractGID: '',
                projectType: '',
                bProjectAuditStatus: null,
                bFinanceAuditStatus: null,
                cities: null,
                show: false,
                visible: false,
                confirmLoading: false,
                mdl: null,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: { IsBalance: true },
                queryParam2: {},
                isLastBalance: false,
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    if (this.queryParam.ProjectID) {
                        return ChangeService.items(requestParameters).then(res => {
                            return fixedList(res, parameter)
                        })
                    }

                },
                loadData2: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam2)
                    if (this.contractGID) {
                        return CheckoutService.list(this.contractGID).then(res => {
                            if (res.result.data) {
                                res.result.data.items.forEach(item => {
                                    if (item.file_PdfPath) {
                                        item.file_PdfPathUrl = (process.env.VUE_APP_API_BASE_URL + '/' + item.file_PdfPath)
                                    }
                                    if (item.isLastBalance) {
                                        this.isLastBalance = true
                                    }
                                })
                            }
                            return fixedList(res, requestParameters)
                        })
                    } else {
                        return nullFixedList(requestParameters)
                    }
                },
                selectedRowKeys: [],
                selectedRows: [],
                selectedRowKeys2: [],
                selectedRows2: []
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
                this.queryParam.ProjectID = value.projectCode ? value.projectCode : getList(this.cities, 0).projectCode
                this.projectType = value.type ? value.type : getList(this.cities, 0).type
                this.queryParam.ProjectGUID = value.projectGUID ? value.projectGUID : getList(this.cities, 0).projectGUID
                this.$refs.table.refresh()
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
                        that.contractGID = record.contractGuid
                        that.isLastBalance = false
                        that.$refs._table.refresh()
                    }
                }
            },
            rowSelection2 () {
                const that = this
                return {
                    selectedRowKeys: this.selectedRowKeys2,
                    onChange: this.onSelectChange2,
                    type: 'radio',
                    onSelect: function (record, selected, selectRows, nativeEvent) {
                        that.balanceCertificateGID = record.gid
                        that.balanceContractGID = record.bContractGID
                        that.bProjectAuditStatus = record.bProjectAuditStatus
                        that.bFinanceAuditStatus = record.bFinanceAuditStatus
                    }
                }
            }
        },
        methods: {
            ac (action) {
                return ac(action, this.$route)
            },
            handleToContractInfo (record) {
                this.$router.push({ path: `/contract/item/${record.contractGuid}?type=view` })
            },
            handleToCompletedItem (id, type) {
                this.$router.push({ path: `/checkout/completed/list/${id}?type=${type}&contractGID=` + this.contractGID })
            },
            handleToContractItem (id, type, auditStatus) {
                this.$router.push({ path: `/checkout/contract/item/${id}?type=${type}` + (auditStatus ? ('&balanceCertificateAuditStatus=' + auditStatus) : '') })
            },
            handleToProjectItem (id, auditStatus) {
                this.$router.push({ path: `/checkout/project/list/${id}?type=view&bContractAuditStatus=` + auditStatus })
            },
            handleToFinanceItem (id, auditStatus) {
                this.$router.push({ path: `/checkout/finance/list/${id}?type=view&bContractAuditStatus=` + auditStatus })
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
                this.contractGID = ''
                this.balanceCertificateGID = ''
                this.balanceContractGID = ''
                this.bProjectAuditStatus = ''
                this.bFinanceAuditStatus = ''
                this.$refs.table.clearSelected()
                this.$refs._table.clearSelected()
                this.$refs.table.refresh()
                this.$refs._table.refresh()
                this.$forceUpdate()
            },
            handleToCompleted () {
                this.$router.push({ path: `/checkout/completed/list/0?type=create&contractGID=` + this.contractGID })
            },
            handleToAdd () {
                this.$router.push({ path: '/checkout/contract/item/0?type=create&balanceCertificateGID=' + this.balanceCertificateGID })
            },
            search () {
                this.show = !this.show
                this.$refs.table.refresh(true)
            },
            onSelectChange (selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                this.selectedRows = selectedRows
            },
            onSelectChange2 (selectedRowKeys, selectedRows) {
                this.selectedRowKeys2 = selectedRowKeys
                this.selectedRows2 = selectedRows
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

