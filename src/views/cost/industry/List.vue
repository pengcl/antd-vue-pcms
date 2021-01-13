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
                >
                </a-tree-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button :disabled="!queryParam.ProjectGUID" type="success" @click="handleToAdd">新增</a-button>
        <a-button :disabled="!queryParam.ProjectGUID || this.$refs.table._data.localDataSource.length < 1" type="success" @click="addBatch">新增审批</a-button>
        <a-button :disabled="!queryParam.ProjectGUID" type="success" @click="viewBatch">查看审批</a-button>
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
            <a-form-item label="分判包编号">
              <a-input v-model="queryParam.TradePackageCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="分判包描述">
              <a-input v-model="queryParam.PackageTitle"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item prop="elementTypeId" label="科目类型">
              <a-select
                placeholder="请选择"
                v-model="queryParam.ElementTypeId"
              >
                <a-select-option value="">
                  所有
                </a-select-option>
                <a-select-option v-for="option in elementItems" :key="JSON.stringify(option)" :value="option.id">
                  {{ option.nameCN }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="状态">
              <a-select
                placeholder="请选择"
                v-model="queryParam.AuditStatus"
                >
                <a-select-option value="">所有</a-select-option>
                <a-select-option value="未审核">未审核</a-select-option>
                <a-select-option value="审核中">审核中</a-select-option>
                <a-select-option value="已审批">已审批</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button type="success" @click="search()">搜索</a-button>
            <a-button type="success" style="margin-left: 20px" @click="reset">清空</a-button>
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
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="budgetAmount" slot-scope="text">{{ text | NumberFormat }}</span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a-button type="success" icon="file-text" title="查看" @click="handleToItem(record)"></a-button>
            <a-button
              type="primary"
              icon="form"
              style="margin-left: 4px"
              title="编辑"
              @click="handleToEdit(record)"
            ></a-button>
            <a-button
              type="danger"
              icon="delete"
              style="margin-left: 4px"
              :disabled="!!record.contractGUID || !!record.projectTenderPackageId || !!record.budgetAmount"
              @click="handleToRemove(record)"
              title="删除"
            ></a-button>
          </template>
        </span>

        <span slot="packageDate" slot-scope="text, record">
          {{ record.packageDate | date }}
        </span>

        <span slot="tradePackageCode" slot-scope="text, record">
          <a @click="getBudgetAmt(record)">{{ text }}</a>
        </span>
      </s-table>

      <a-row style="margin-top: 10px">
        <a-col :md="12" :sm="24">
          <a-button
            type="success"
            :disabled="selectedPackage === null || !!selectedPackage.contractGUID"
            @click="hanldeAddBugetItem"
          >新增预算
          </a-button>
          <a-button
            type="danger"
            style="margin-left: 10px"
            v-if="this.selectedRowKeys.length > 0"
            @click="handleBatchRemoveBudgetItem"
          >删除预算</a-button
          >
        </a-col>
      </a-row>
      <s-table
        style="margin-top: 5px"
        ref="table2"
        size="default"
        rowKey="id"
        bordered
        :columns="_columns"
        :data="loadData2"
        :alert="false"
        :showPagination="false"
        :row-selection="rowSelection"
      >
        <span slot="budgetValue" slot-scope="text">{{ text | NumberFormat }}</span>
        <span slot="itemAction" slot-scope="text, record">
          <template>
            <a-button
              type="danger"
              icon="delete"
              :disabled="
                selectedPackage === null || !!selectedPackage.projectTenderPackageId || !!selectedPackage.contractGUID
              "
              style="margin-left: 4px"
              @click="handleRemoveBudgetItem(record)"
              title="删除"
            ></a-button>
          </template>
        </span>
        <template slot="contractGUID">
          <a @click="jumpToContract">{{ selectedPackage != null ? selectedPackage.contractNo : '' }}</a>
        </template>
        <template slot="projectTenderPackageId">
          <a @click="jumpToProjectTenderPackage">{{
            selectedPackage != null ? selectedPackage.projectTenderPackageCode : ''
          }}</a>
        </template>
      </s-table>
      <cost-industry-modal ref="industryModal" :refreshAllTable="refreshAllTable"></cost-industry-modal>
      <industry-package-batch-list-modal
        ref="industryPackageBatchListModal"
        v-if="queryParam.ProjectGUID"
        :ProjectGUID="queryParam.ProjectGUID"
      ></industry-package-batch-list-modal>
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
import CostIndustryModal from '@/views/cost/industry/modal/IndustryModal'
import IndustryPackageBatchListModal from '@/views/cost/industry/modal/IndustryPackageBatchListModal'
import storage from 'store'

const columns = [
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  },
  {
    title: '分判包编号',
    dataIndex: 'tradePackageCode',
    scopedSlots: { customRender: 'tradePackageCode' },
    sorter : true
  },
  {
    title: '分判包描述',
    dataIndex: 'packageTitle'
  },
  {
    title: '预算金额',
    dataIndex: 'budgetAmount',
    scopedSlots: { customRender: 'budgetAmount' },
    sorter : true
  },
  {
    title: '日期',
    dataIndex: 'packageDate',
    scopedSlots: { customRender: 'packageDate' },
    sorter : true
  },
  {
    title: '状态',
    dataIndex: 'auditStatus'
  }
]

const _columns = [
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'itemAction' }
  },
  {
    title: '业态成本中心',
    dataIndex: 'costCenterName'
  },
  {
    title: '科目名称',
    dataIndex: 'elementInfoNameCN'
  },
  {
    title: '专业',
    dataIndex: 'budgetTitle'
  },
  {
    title: '金额',
    dataIndex: 'budgetValue',
    scopedSlots: { customRender: 'budgetValue' }
  },
  {
    title: '招投标包',
    dataIndex: 'projectTenderPackageId',
    scopedSlots: { customRender: 'projectTenderPackageId' }
  },
  {
    title: '合同',
    dataIndex: 'contractGUID',
    scopedSlots: { customRender: 'contractGUID' }
  }
]

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    StepByStepModal,
    CostIndustryModal,
    IndustryPackageBatchListModal
  },
  data () {
    this.columns = columns
    this._columns = _columns
    return {
      pid: '',
      cities: null,
      show: false,
      visible: false,
      confirmLoading: false,
      mdl: null,
      elementItems: [],
      selectedPackage: null,
      handleSelected: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: { ProjectGUID: this.$route.query.ProjectGUID },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (!this.handleSelected) {
          this.selectedPackage = null
          this.pid = ''
        } else {
          this.handleSelected = false
        }
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        if (typeof requestParameters.ProjectGUID !== 'undefined' && requestParameters.ProjectGUID != '') {
          return CostService.industryItems(requestParameters).then(res => {
            if (res.result.data != null) {
              this.$refs.table2.refresh()
              return fixedList(res, requestParameters)
            }
          })
        }
      },
      loadData2: parameter => {
        if (this.pid) {
          return CostService.budgetItems({ Id: this.pid }).then(res => {
            if (res.result.data != null) {
              return res.result
            }
          })
        } else {
          return new Promise((resolve, reject) => {
            resolve({ data: [] })
          })
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
      this.queryParam.ProjectGUID = value.projectGUID ? value.projectGUID : getList(this.cities, 0).projectGUID
      this.$forceUpdate()
      this.$refs.table.refresh(true)
    })
    // 科目类型
    CostService.items().then(res => {
      const result = {
        result: {
          data: []
        }
      }
      const tempCodes = ['B', 'C', 'D', 'E', 'F', 'G']
      res.result.data.forEach(item => {
        if (tempCodes.includes(item.code)) {
          const obj = {}
          obj['id'] = item.id
          obj['nameCN'] = item.nameCN
          result.result.data.push(obj)
        }
      })
      this.elementItems = JSON.parse(JSON.stringify(result.result.data))
      this.$forceUpdate()
    })
    function setSelectable (datas) {
      datas.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.selectable = false
          setSelectable(item.children)
        }
      })
    }
  },
  props: {
    type: {
      type: String,
      default: 'view'
    }
  },
  computed: {
    ProjectGUID () {
      return this.$route.query.ProjectGUID
    },
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: record => ({
          props: {
            disabled:
              this.selectedPackage === null ||
              !!this.selectedPackage.projectTenderPackageId ||
              !!this.selectedPackage.contractGUID
          }
        })
      }
    }
  },
  activated(){
    this.$refs.table.refresh()
  },
  methods: {
    getBudgetAmt (record) {
      this.selectedPackage = record
      this.pid = record.id
      console.log('jsjsjs',this.$refs.table)
      this.$refs.table2.refresh(true)
      // CostService.budgetItems({ Id: this.pid }).then(res => {
      //   this.budgetItems = res.result.data
      // })
    },
    handleToItem (record) {
      this.$router.push({
        path: `/cost/industry/item/${record.id}?ProjectGUID=${this.queryParam.ProjectGUID}&type=view`
      })
    },
    handleToEdit (record) {
      this.$router.push({
        path: `/cost/industry/item/${record.id}?ProjectGUID=${this.queryParam.ProjectGUID}&type=edit`
      })
    },
    handleToAdd (record) {
      if (this.queryParam.ProjectGUID === '') {
        this.$message.error(`请选择项目`)
      } else {
        this.$router.push({ path: `/cost/industry/item/0?ProjectGUID=${this.queryParam.ProjectGUID}&type=add` })
      }
    },
    handleAdd () {
      if (this.pid === '') {
        this.$message.error(`请选择分判包记录`)
      } else {
        this.$router.push({ path: `/cost/industry/item/0?ProjectGUID=${this.queryParam.ProjectGUID}&type=add` })
      }
    },
    handleCancel () {
      this.visible = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleToRemove (record) {
      const that = this
      this.$confirm({
        title: '删除专业分判包',
        content: '是否确定删除选中分判包?',
        onOk () {
          CostService.industryRemove(record.id)
            .then(res => {
              if (res.result.statusCode === 200) {
                that.$message.info('专业分判包删除成功')
                that.$refs.table.refresh()
              }
            })
            .catch(() => {
              that.$message.error(res.rseult.msg)
            })
        },
        onCancel () {}
      })
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
    },
    onSelect (value, option) {
      storage.set('POS', option.pos)
      this.queryParam.projectGUID = option.$options.propsData.dataRef.projectGUID
      if (typeof value === 'number') {
        this.city = value
        this.queryParam.ProjectGUID = ''
      } else {
        this.queryParam.ProjectGUID = value
      }
      this.auditStatus = option.dataRef.auditStatus
      this.$refs.table.refresh()
      this.$forceUpdate()
    },
    search () {
      this.$refs.table.refresh(true)
    },
    hanldeAddBugetItem () {
      if (this.pid) {
        this.$refs.industryModal.show(this.pid)
      }
    },
    handleRemoveBudgetItem (record) {
      const that = this
      this.$confirm({
        title: '删除预算',
        content: '是否确定删除选中预算?',
        onOk () {
          console.log('record', record, that.pid)
          CostService.removeBudgetItem({ packageId: that.pid, budgetItemId: record.id }).then(res => {
            if (res.result.statusCode === 200) {
              that.$message.info('预算删除成功')
              that.$refs.table2.refresh()
            }
          })
        },
        onCancel () {}
      })
    },
    handleBatchRemoveBudgetItem () {
      const params = {}
      params.packageId = this.pid
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        const budgetItemList = []
        this.selectedRowKeys.forEach(item => {
          budgetItemList.push({
            tradeBudgeItemId: item
          })
        })
        params.budgetItemList = budgetItemList
      }
      const that = this
      this.$confirm({
        title: '批量删除预算',
        content: '是否确定删除选中的预算?',
        onOk () {
          CostService.removeBatchBudgetItem(params).then(res => {
            if (res.result.statusCode === 200) {
              that.$message.info('预算删除成功')
              that.selectedRowKeys = []
              that.$refs.table2.refresh()
            }
          })
        },
        onCancel () {}
      })
    },
    jumpToContract () {
      this.$router.push({ path: `/contract/item/${this.selectedPackage.contractGUID}?type=view` })
    },
    jumpToProjectTenderPackage () {
      this.$router.push({
        path: `/cost/bid/item/${this.selectedPackage.projectTenderPackageId}?ProjectGUID=${this.queryParam.ProjectGUID}&type=view`
      })
    },
    refreshAllTable (args) {
      if (args) {
        this.handleSelected = true
      }
      this.$refs.table.refresh()
    },
    addBatch(){
      CostService.projectIsNoStartAuditTenderPackageBatchReg(this.queryParam.ProjectGUID).then(res =>{
        if(res.result.statusCode === 200){
          if(res.result.data){
            this.$router.push({ path: `/cost/industry/batch/${res.result.data}?ProjectGUID=${this.queryParam.ProjectGUID}&type=edit` })
          }else{
            this.$router.push({ path: `/cost/industry/batch/0?ProjectGUID=${this.queryParam.ProjectGUID}&type=add` })
          }
        }
      }).catch((e) =>{
        console.log('专业分判包-点击新增审批失败',e)
      })
    },
    viewBatch(){
      this.$refs.industryPackageBatchListModal.visible = true
    },
    reset(){
      const tempQueryParam = { ProjectID : this.queryParam.ProjectID,ProjectGUID : this.queryParam.ProjectGUID}
      this.queryParam = tempQueryParam
      this.$refs.table.clearSelected()
      this.$refs.table.refresh()
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="less" scoped>
.search-form {
  background-color: #1e9ff2;
  padding: 20px;
  border-radius: 0.35rem;

  /deep/ .ant-form-item-label label {
    color: #fff;
  }
}
</style>
