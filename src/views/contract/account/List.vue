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
              <a-button type="success" style="margin-left: 10px" @click="exportExcel">导出Excel</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" v-if="show" class="search-form"
              @keyup.enter.native="formSearch">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="合同编号">
              <a-input v-model="queryParam.ContractNo"
                       placeholder="请输入合同编号"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合同名称">
              <a-input v-model="queryParam.ContractName"
                       placeholder="请输入合同名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合作方">
              <a-input v-model="queryParam.VendorName"
                       placeholder="请输入合作方"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="经办人">
              <a-input v-model="queryParam.CreatorUser"
                       placeholder="请输入经办人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="审批状态">
              <a-select
                placeholder="请选择审批状态"
                v-model="queryParam.AuditStatus"
                v-decorator="[queryParam.auditStatus, { rules: [{required: true, message: '请选择'}] }]">
                <a-select-option :value="'未审核'">未审核</a-select-option>
                <a-select-option :value="'审核中'">审核中</a-select-option>
                <a-select-option :value="'已审核'">已审核</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="结算状态">
              <a-select
                placeholder="请选择结算状态"
                v-model="queryParam.BalanceStatus">
                <a-select-option :value="'未结算'">未结算</a-select-option>
                <a-select-option :value="'阶段结算'">阶段结算</a-select-option>
                <a-select-option :value="'结算中'">结算中</a-select-option>
                <a-select-option :value="'最终结算'">最终结算</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="申请部门">
              <a-tree-select
                style="width: 100%"
                :tree-data="dps"
                :dropdown-style="{ maxHeight: '400px', overflowH: 'auto' }"
                placeholder="请选择申请部门"
                v-model="queryParam.DeptGuid"
                :suffixIcon="dps ? '' : '加载中...'">
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button type="success" @click="search">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
            <a-button type="success" style="margin-left: 20px" @click="clear">清空</a-button>
          </a-col>
        </a-row>
      </a-form>

      <s-table
        style="margin-top: 5px"
        ref="table"
        rowKey="contractGuid"
        size="default"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="false"
        showPagination="auto"
        :scroll="{ x: 'calc(700px + 50%)'}"
      >
        <span slot="contractNo" slot-scope="text,record">
          <a @click="handleToItem(record.contractGuid)">{{text}}</a>
        </span>

        <span slot="contractCategory" slot-scope="text">
            {{text === 15 ? '原合同' : text === 16 ? '补充合同' : '专业分包合同'}}
        </span>

        <span slot="signDate" slot-scope="text">
            {{text | date}}
        </span>

        <span slot="contractAmount" slot-scope="text">
            {{text | NumberFormat}}
        </span>

        <span slot="voAmount" slot-scope="text">
            {{text | NumberFormat}}
        </span>

        <span slot="preSettleAmount" slot-scope="text">
            {{text | NumberFormat}}
        </span>

        <span slot="requestAmount" slot-scope="text">
            {{text | NumberFormat}}
        </span>

        <span slot="paymentAmount" slot-scope="text">
            {{text | NumberFormat}}
        </span>

        <span slot="billAmount" slot-scope="text">
            {{text | NumberFormat}}
        </span>

      </s-table>

    </a-card>
  </page-header-wrapper>
</template>

<script>
    import { STable } from '@/components'
    import { Base as BaseService } from '@/api/base'
    import CreateForm from '@/views/list/modules/CreateForm'
    import { fixedList, getPosValue, getList } from '@/utils/util'
    import { ProjectService } from '@/views/project/project.service'
    import { formatList } from '@/mock/util'
    import storage from 'store'
    import { ac } from '@/views/user/user.service'
    import { AccountService } from './account.service'
    import { ProjectRolesService } from '@/views/role/project/projectRoles.service'

    const _formatList = (items) => {
        const list = []
        items.forEach(item => {
            if (item.children && item.children.length > 0) {
                item.selectable = false
                item.children = _formatList(item.children)
            } else {
                item.children = null
            }
            item.label = item.orgName
            item.value = item.orgGID
            list.push(item)
        })
        return list
    }

    const columns = [
        {
            title: '审批状态',
            dataIndex: 'auditStatus',
            width: 90,
        },
        {
            title: '结算状态',
            dataIndex: 'balanceStatus',
            width: 90
        },
        {
            title: '合同编号',
            dataIndex: 'contractNo',
            width: 110,
            scopedSlots: { customRender: 'contractNo' },
            sorter: true
        },
        {
            title: '合同名称',
            width: 300,
            dataIndex: 'contractName',
        },
        {
            title: '合同类型',
            dataIndex: 'contractCategory',
            width: 130,
            scopedSlots: { customRender: 'contractCategory' }
        },
        {
            title: '签约日期',
            dataIndex: 'signDate',
            width: 120,
            scopedSlots: { customRender: 'signDate' },
            sorter: true
        },
        {
            title: '币种',
            width: 90,
            dataIndex: 'currency',
        },
        {
            title: '合同金额',
            dataIndex: 'contractAmount',
            align: 'center',
            width: 180,
            scopedSlots: { customRender: 'contractAmount' },
            sorter: true
        },
        {
            title: '累计变更金额',
            dataIndex: 'voAmount',
            align: 'center',
            width: 180,
            scopedSlots: { customRender: 'voAmount' },
            sorter: true
        },
        {
            title: '预估结算金额',
            dataIndex: 'preSettleAmount',
            align: 'center',
            width: 180,
            scopedSlots: { customRender: 'preSettleAmount' },
            sorter: true
        },
        {
            title: '累计申请批准金额',
            dataIndex: 'requestAmount',
            align: 'center',
            width: 180,
            scopedSlots: { customRender: 'requestAmount' },
            sorter: true
        },
        {
            title: '累计支付金额',
            dataIndex: 'paymentAmount',
            align: 'center',
            width: 180,
            scopedSlots: { customRender: 'paymentAmount' },
            sorter: true
        },
        {
            title: '累计发票金额',
            dataIndex: 'billAmount',
            align: 'center',
            width: 180,
            scopedSlots: { customRender: 'billAmount' },
            sorter: true
        },
        {
            title: '甲方单位',
            width: 180,
            dataIndex: 'partyName',
        },
        {
            title: '乙方单位',
            width: 180,
            dataIndex: 'parcon',
        },
        {
            title: '所属项目',
            width: 180,
            dataIndex: 'projectName',
        },
        {
            title: '申请部门',
            width: 130,
            dataIndex: 'departmentName',
        },
        {
            title: '经办人',
            width: 100,
            align: 'center',
            dataIndex: 'creatorUser',
        },
    ]

    export default {
        name: 'ContractAccountList',
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
                dps: null,
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    if (this.queryParam.ProjectID) {
                        return AccountService.items(requestParameters).then(res => {
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
                this.queryParam.ProjectID = value.projectCode ? value.projectCode : getList(this.cities, 0).projectCode
                this.projectType = value.type ? value.type : getList(this.cities, 0).type
                this.queryParam.ProjectGUID = value.projectGUID ? value.projectGUID : getList(this.cities, 0).projectGUID
                this.$refs.table.refresh()
                this.$forceUpdate()
            })
            BaseService.departmentList().then(res => {
                this.departmentList = res.result.data
            })
            ProjectRolesService.dps('').then(res => {
                const dps = _formatList([res.result.data])
                this.dps = dps
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
            formSearch () {
                this.$refs.table.refresh()
            },
            clear () {
                this.queryParam = {
                    ProjectID: this.queryParam.ProjectID,
                    ProjectGUID: this.queryParam.ProjectGUID
                }
                this.$refs.table.refresh()
            },
            exportExcel () {
                const parameter = Object.assign({
                    SkipCount: 0,
                    MaxResultCount: 9999
                })
                const requestParameters = Object.assign({}, parameter, this.queryParam)
                AccountService.exportExcel(requestParameters).then(res => {
                    if (res.result.data) {
                        const _window = window.open('_blank')
                        _window.location = res.result.data
                    }
                })
            },
            handleToItem (id) {
                this.$router.push({ path: `/contract/account/item/${id}?type=view` })
            },
            ac (action) {
                return ac(action, this.$route)
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
