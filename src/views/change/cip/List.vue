<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="项目">
                <a-tree-select
                  :treeData="cities"
                  placeholder="请选择"
                  style="width: 100%"
                  v-model="queryParam.ProjectGUID"
                  :dropdown-style="{ maxHeight: '400px', overflowH: 'auto' }"
                  @select="onSelect"
                />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-button icon="search" type="primary" @click="show = !show"></a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-form  :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" v-if="show" class="search-form">
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
            <a-form-item label="本地合同编号">
              <a-input v-model="queryParam.LocalContractNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合作方">
              <a-input v-model="queryParam.VendorName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合同类型">
              <a-select v-model="queryParam.ContractCategory">
                <a-select-option value="">所有</a-select-option>
                <a-select-option v-for="item in categoryTypes" :key="item.id" :value="item.id">
                  {{item.nameCN}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="结算状态" >
              <a-select v-model="queryParam.balanceStatus">
                <a-select-option value="">所有</a-select-option>
                <a-select-option value="未结算">未结算</a-select-option>
                <a-select-option value="阶段结算">阶段结算</a-select-option>
                <a-select-option value="结算中">结算中</a-select-option>
                <a-select-option value="最终结算">最终结算</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button type="success" @click="search">搜索</a-button>
            <a-button type="success" style="margin-left: 20px" @click="reset">清空</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
          </a-col>
        </a-row>
      </a-form>

      <a-row :gutter="48">
        <a-col :md="24" :sm="24">
          合同列表
        </a-col>
      </a-row>
      <s-table
        :columns="columns"
        rowKey="contractGuid"
        :data="loadData"
        bordered
        :scroll="{ x: 1300 }"
        :rowSelection="rowSelection"
        ref="table"
      >
        <a
          slot="contractNo"
          slot-scope="text, record"
          href="javascript:void(0)"
          @click="handleToContractInfo(record)"
        >{{ text }}</a
        >
        <span slot="contractAmount" slot-scope="text">{{ text | NumberFormat }}</span>
        <span slot="preSettleAmount" slot-scope="text">{{ text | NumberFormat }}</span>
        <template slot="footer">
          <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-row :gutter="48">
              <a-col :md="12" :sm="24">
                <a-form-item label="累计变更金额">{{ totalChangeAmt | NumberFormat }}</a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="变更比例">{{ totalChangeRate }}</a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </template>
      </s-table>
      <a-row :gutter="48" style="margin-top: 10px">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button
            type="success"
            v-if="ac('ADD')"
            @click="handleToAdd"
            :disabled="
              !queryParam2.contractGuid ||
                (professionType.indexOf(contractSelected.contractProfession) > -1 && !contractSelected.bdIsComplete)
            "
          >新增</a-button
          >
          <a-button
            type="success"
            style="margin-left: 20px"
            @click="handleCipToVo"
            v-if="ac('ADD')"
            :disabled="
              tableSelected.cipGuid == undefined ||
                tableSelected.auditStatus.indexOf('已审核') < 0 ||
                tableSelected.cipType === 131 ||
                tableSelected.voStatus.indexOf('审核') > -1
            "
          >CIP转VO
          </a-button>
          <a-button
            type="success"
            v-if="ac('ADD')"
            style="margin-left: 20px"
            :disabled="
              contractSelected.contractGuid == undefined ||
                professionType.indexOf(contractSelected.contractProfession) < 0
            "
            @click="handleDesign"
          >施工组织设计</a-button
          >
          <a-button
            type="success"
            v-if="ac('ADD')"
            @click="handleToAddLatent"
            style="margin-left: 20px"
            :disabled="
              !queryParam2.contractGuid ||
                (professionType.indexOf(contractSelected.contractProfession) > -1 && !contractSelected.bdIsComplete)
            "
          >潜在变更申报</a-button
          >
        </a-col>
        <a-col :md="24" :sm="24"> 变更列表</a-col>
      </a-row>
      <s-table
        style="margin-top: 5px"
        ref="table2"
        rowKey="cipGuid"
        bordered
        :scroll="{ x: 1400 }"
        :columns="_columns"
        :alert="false"
        :data="loadData2"
        :rowSelection="rowSelection2"
      >
        <div slot="voStatus" slot-scope="text, record">
          <a v-if="text !== '待确认'" @click="showVO(record)">{{ text }}</a>
          <span v-if="text === '待确认'">{{ text }}</span>
        </div>

        <span slot="cipAmount" slot-scope="text">{{ text | NumberFormat }}</span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a-button
              class="btn-success"
              type="primary"
              icon="file-text"
              v-if="ac('VIEW')"
              title="查看"
              @click="handleToItem(record)"
            >
            </a-button>
            <a-button
              class="btn-info"
              type="primary"
              icon="form"
              style="margin-left: 4px"
              title="编辑"
              v-if="ac('EDIT')"
              :disabled="record.auditStatus.indexOf('未审核') < 0"
              @click="handleToEdit(record)"
            ></a-button>
          </template>
        </span>
        <template slot="spotVisaCount" slot-scope="text, record">
          <a
            v-if="
              record.qzCanCreate
            "
            @click="$router.push(`/change/cip/certificate/list/${record.cipGuid}`)"
          >{{ text }}</a
          >
          <span
            v-if="
              !record.qzCanCreate
            "
          >{{ text }}</span
          >
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import storage from 'store'
import { STable, Ellipsis } from '@/components'
// import { getRoleList, getServiceList } from '@/api/manage'

import StepByStepModal from '@/views/list/modules/StepByStepModal'
import CreateForm from '@/views/list/modules/CreateForm'
import { ChangeService } from '@/views/change/change.service'
import { ProjectService } from '@/views/project/project.service'
import { fixedList, getPosValue, nullFixedList } from '@/utils/util'
import { ContractService } from '@/views/contract/contract.service'
import { formatList } from '../../../mock/util'
import { ac } from '@/views/user/user.service'

const columns = [
  {
    title: '审批状态',
    dataIndex: 'auditStatus',
    scopedSlots: { customRender: 'auditStatus' },
    width: 100
  },
  {
    title: '结算状态',
    dataIndex: 'balanceStatus',
    width: 100
  },
  {
    title: '合同编号',
    dataIndex: 'contractNo',
    scopedSlots: { customRender: 'contractNo' },
    width: 250
  },
  {
    title: '合同名称',
    dataIndex: 'contractName',
    width: 250
  },
  {
    title: '币种',
    dataIndex: 'currency',
    width: 80
  },
  {
    title: '合同金额',
    dataIndex: 'contractAmount',
    scopedSlots: { customRender: 'contractAmount' },
    width: 150
  },
  {
    title: '预计结算金额',
    dataIndex: 'preSettleAmount',
    scopedSlots: { customRender: 'preSettleAmount' },
    wdith: 150
  },
  {
    title: '签约日期',
    dataIndex: 'signDate',
    width: 120
  }
]

const _columns = [
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  },
  {
    title: '审核状态',
    dataIndex: 'auditStatus',
    scopedSlots: { customRender: 'auditStatus' },
    width: 100
  },
  {
    title: '变更编号',
    dataIndex: 'voNo',
    width: 320
  },
  {
    title: '申请金额',
    dataIndex: 'cipAmount',
    scopedSlots: { customRender: 'cipAmount' },
    width: 150
  },
  {
    title: '申报日期',
    dataIndex: 'createTime',
    width: 120
  },
  {
    title: '变更类型',
    dataIndex: 'voType',
    scopedSlots: { customRender: 'voType' },
    width: 120
  },
  {
    title: '变更确认',
    dataIndex: 'voStatus',
    scopedSlots: { customRender: 'voStatus' },
    width: 150
  },
  {
    title: '相关现场签证',
    dataIndex: 'spotVisaCount',
    scopedSlots: { customRender: 'spotVisaCount' },
    width: 150
  }
]

export default {
  name: 'ChangePmiList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    this.columns = columns
    this._columns = _columns

    return {
      // create model
      cities: [],
      professionType: [111, 112, 113, 114, 126],
      show: false,
      visible: false,
      confirmLoading: false,
      mdl: null,
      loading: { delCer: false },
      // 高级搜索 展开/关闭
      advanced: false,
      categoryTypes : [],
      // 合同列表查询参数
      queryParam: {},
      // 变更列表查询参数
      queryParam2: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        this.queryParam2.contractGuid = null
        this.contractSelected = {}
        if (this.$refs.table2) {
          this.$refs.table2.clearSelected()
          this.$refs.table2.refresh()
        }
        if (!this.queryParam.ProjectID) {
          return nullFixedList(requestParameters)
        }
        return ChangeService.items(requestParameters).then(res => {
          return fixedList(res, parameter)
        })
      },
      // 变更列表加载数据方法 必须为 Promise 对象
      loadData2: parameter => {
        this.tableSelected = {}
        const requestParameters = Object.assign({}, parameter, this.queryParam2)
        if (!this.queryParam2.contractGuid) {
          return nullFixedList(requestParameters)
        }
        return ChangeService.changeItems(requestParameters).then(res => {
          return fixedList(res, parameter)
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      totalChangeAmt: 0,
      totalChangeRate: 0,
      // 记录变更列表选中行信息
      tableSelected: {},
      // 记录合同选择行信息
      contractSelected: {},
      selectedRowKeys2: [],
      selectedRows2: []
    }
  },
  created () {
    // getRoleList({ t: new Date() })
    // 加载项目查询条件选项
    ProjectService.tree().then(res => {
      const cities = []
      res.result.data.citys.forEach(item => {
        const children = formatList(item.projects.items)
        cities.push({
          label: item.city.nameCN,
          value: item.city.id,
          children: children,
          selectable: false
        })
      })
      this.cities = cities
      const value = getPosValue(this.cities)
      this.queryParam.ProjectID = value.projectCode
      this.queryParam.ProjectGUID = value.projectGUID
      console.log(this.queryParam)
      this.$forceUpdate()
      this.$refs.table.refresh()
    })

    ContractService.types().then(res =>{
      if(res.result.statusCode === 200){
        this.categoryTypes = res.result.data
        this.$forceUpdate()
      }
    })

  },
  activated(){
    this.search()
  },
  computed: {
    // 合同列表行选中事件监听
    rowSelection () {
      const that = this
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        type: 'radio',
        onSelect: function (record, selected, selectRows, nativeEvent) {
          // 初始化变更列表查询条件
          that.queryParam2.contractGuid = record.contractGuid
          // 修改合同列表中‘累计变更金额’，‘变更比例’值
          that.totalChangeAmt = record.sumVOAmount
          that.totalChangeRate = record.voRate
          that.contractSelected = record
          // 刷新变更列表
          that.$refs.table2.refresh()
          // 清空变更列表选中数据
          that.tableSelected = {}
        }
      }
    },
    // 变更列表行选中事件监听
    rowSelection2 () {
      const that = this
      return {
        type: 'radio',
        selectedRowKeys: this.selectedRowKeys2,
        onChange : function(selectedRowKeys, selectedRows) {
          console.log('sss',selectedRowKeys,selectedRows)
          that.selectedRowKeys2 = selectedRowKeys
          that.selectedRows2 = selectedRows
        },
        onSelect: function (record, selected, selectRows, nativeEvent) {
          that.tableSelected = record
        }
      }
    }
  },
  methods: {
    ac (action) {
      return ac(action, this.$route)
    },
    handleToItem (record) {
      this.$router.push({
        path: `/change/cip/item/${record.cipGuid}?type=view&contractGuid=${this.queryParam2.contractGuid}&stage=CIP`
      })
    },
    handleToEdit (record) {
      this.$router.push({
        path: `/change/cip/item/${record.cipGuid}?type=edit&contractGuid=${this.queryParam2.contractGuid}&stage=CIP`
      })
    },
    handleToAdd () {
      if (this.queryParam2.contractGuid != undefined) {
        this.$router.push({
          path: `/change/cip/item/0?type=add&contractGuid=${this.queryParam2.contractGuid}&stage=CIP`
        })
      } else {
        this.$message.warn('请先选择合同')
      }
    },
    // cip转vo 方法
    handleCipToVo () {
      if (this.tableSelected.voGuid != undefined) {
        this.$router.push({
          path: `/change/vo/item/${this.tableSelected.cipGuid}?type=add&contractGuid=${this.queryParam2.contractGuid}&stage=VO`
        })
      }
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
    search () {
      if (!this.queryParam.ProjectID) {
        // this.$message.warn('请选择项目')
      } else {
        this.$refs.table.clearSelected()
        this.show = !this.show
        this.$refs.table.refresh(true)
      }
    },
    onSelect (value, option) {
      storage.set('POS', option.pos)
      this.queryParam.ProjectID = option.$options.propsData.dataRef.projectCode
      this.queryParam.ProjectGUID = value.projectGUID
      this.$refs.table.clearSelected()
      this.$refs.table.refresh()
      this.$forceUpdate()
    },
    showVO (record) {
      this.$router.push({
        path: `/change/vo/item/${record.voGuid}?type=view&contractGuid=${this.queryParam2.contractGuid}&stage=VO`
      })
    },
    handleToContractInfo (record) {
      this.$router.push({ path: `/contract/item/${record.contractGuid}?type=view` })
    },
    handleDesign () {
      const type =
        this.contractSelected.bdStatus == '' || this.contractSelected.bdStatus == '未申请'
          ? 'add'
          : this.contractSelected.bdStatus == '未审核'
          ? 'edit'
          : 'view'
      this.$router.push({
        path: `/change/cip/constructionOrganizeDesign/${this.contractSelected.contractGuid}?projectCode=${this.contractSelected.projectID}&type=${type}`
      })
    },
    handleToAddLatent () {
      if (this.queryParam2.contractGuid != undefined) {
        this.$router.push({
          path: `/change/cip/latent/list/${this.queryParam2.contractGuid}`
        })
      } else {
        this.$message.warn('请先选择合同')
      }
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

/deep/ .ant-table-footer {
  padding-bottom: 0;
}
</style>
