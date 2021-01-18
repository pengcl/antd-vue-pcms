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

      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" v-if="show" class="search-form"  @keyup.enter.native="search">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="指令编号">
              <a-input v-model="queryParam.VONo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="申报日期">
              <a-date-picker v-model="queryParam.startTime" valueFormat="YYYY-MM-DD"></a-date-picker
              ><span style="margin: 0 10px;color: #fff">至</span
              ><a-date-picker v-model="queryParam.endTime" valueFormat="YYYY-MM-DD"></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button type="success" @click="search">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
            <a-button type="success" style="margin-left: 20px" @click="reset">清空</a-button>
            <a-button type="success" style="margin-left: 20px" v-if="$refs.table" :disabled="$refs.table._data.localDataSource.length < 1" @click="exportExcel">导出</a-button>
          </a-col>
        </a-row>
      </a-form>
      <s-table
        style="margin-top: 10px"
        ref="table"
        size="default"
        rowKey="cipGuid"
        bordered
        :columns="columns"
        :data="loadData"
        :scroll="{ x: 2600 }"
        showPagination="auto"
      >
        <span slot="no" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <a slot="contractNo" @click="$router.push({ path: `/contract/item/${record.contractGuid}?type=view` })" slot-scope="text,record">
          {{text}}
        </a>
        <a slot="voNo" @click="$router.push({ path: `/change/cip/item/${record.cipGuid}?type=view&contractGuid=${record.contractGuid}&stage=CIP` })" slot-scope="text,record">
          {{text}}
        </a>
        <span slot="creationTime" slot-scope="text">{{text | dateZH}}</span>
        <span slot="cipAmount" slot-scope="text">{{text | NumberFormat}}</span>
        <span slot="pmiCreationTime" slot-scope="text">{{text | dateZH}}</span>
        <span slot="voCreationTime" slot-scope="text">{{text | dateZH}}</span>
        <span slot="voAmount" slot-scope="text">{{text | NumberFormat}}</span>
        <template slot="voAuditStatus" slot-scope="text,record">
          <span v-if="!record.voGuid">{{text}}</span>
          <a v-if="record.voGuid" @click="$router.push({ path: `/change/vo/item/${record.voGuid}?type=view&contractGuid=${record.contractGuid}&stage=VO` })" >{{text}}</a>
        </template>
        <span slot="isBeforeApply" slot-scope="text">{{ text ? '是' : '否'}}</span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import storage from 'store'
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
// import { getRoleList, getServiceList } from '@/api/manage'

import CreateForm from '@/views/list/modules/CreateForm'
import { ProjectService } from '@/views/project/project.service'
import { formatList } from '../../../mock/util'
import { fixedList, getPosValue, nullFixedList } from '@/utils/util'
import { ChangeService } from '@/views/change/change.service'
import { ac } from '@/views/user/user.service'

const columns = [
  {
    title: '序号',
    dataIndex: 'no',
    width : 50,
    scopedSlots: { customRender: 'no' }
  },
  {
    title: '合同编号',
    dataIndex: 'contractNo',
    width : 241,
    scopedSlots: { customRender: 'contractNo' },
    sorter : true
  },
  {
    title: '变更编号',
    dataIndex: 'voNo',
    width : 275,
    scopedSlots: { customRender: 'voNo' },
    sorter : true
  },
  {
    title: '审核状态',
    dataIndex: 'cipStatus',
    width : 80,
    scopedSlots: { customRender: 'cipStatus' }
  },
  {
    title: 'PMI状态',
    width : 80,
    dataIndex: 'pmiStatus'
  },
  {
    title: 'PMI编号',
    width : 275,
    dataIndex: 'pmiNo',
    sorter : true
  },
  {
    title: '变更名称',
    width : 251,
    dataIndex: 'voName'
  },
  {
    title: '变更类型',
    width : 100,
    dataIndex: 'voType'
  },
  {
    title: '申报日期',
    width : 150,
    dataIndex: 'creationTime',
    scopedSlots: { customRender: 'creationTime' },
    sorter : true
  },
  {
    title: '申报金额',
    width : 180,
    dataIndex: 'cipAmount',
    scopedSlots: { customRender: 'cipAmount' },
    sorter : true
  },
  {
    title: '变更日期',
    width : 150,
    dataIndex: 'pmiCreationTime',
    scopedSlots: { customRender: 'pmiCreationTime' },
    sorter : true
  },
  {
    title: '上报为后补指令',
    width : 110,
    dataIndex: 'isBeforeApply'
  },
  {
    title: '确认状态',
    width : 130,
    dataIndex: 'voAuditStatus',
    scopedSlots: { customRender: 'voAuditStatus' }
  },
  {
    title: '确认日期',
    width : 150,
    dataIndex: 'voCreationTime',
    scopedSlots: { customRender: 'voCreationTime' },
    sorter : true
  },
  {
    title: '确认金额',
    width : 180,
    dataIndex: 'voAmount',
    scopedSlots: { customRender: 'voAmount' },
    sorter : true
  }
]

export default {
  name: 'AccountList',
  components: {
    STable,
    Ellipsis,
    CreateForm
  },
  data () {
    this.columns = columns
    return {
      // create model
      cities: [],
      show: false,
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        if(!this.queryParam.ProjectGUID){
          return nullFixedList(requestParameters)
        }else{
          return ChangeService.getVoBookInfoBySearch(requestParameters).then(res => {
              return fixedList(res, parameter)
          })
        }
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    // getRoleList({ t: new Date() })
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
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    onSelect (value, option) {
      storage.set('POS', option.pos)
      this.queryParam.ProjectID = option.$options.propsData.dataRef.projectCode
      this.queryParam.ProjectGUID = value.projectGUID
      this.$refs.table.clearSelected()
      this.$refs.table.refresh()
      this.$forceUpdate()
    },
    search(){
      console.log('table-info',this.$refs.table)
      this.$refs.table.clearSelected()
      this.$refs.table.refresh()
    },
    exportExcel(){
      ChangeService.exportVOBook(this.queryParam).then(res =>{
        if(res.result.statusCode === 200){
          window.location = res.result.data
          this.$message.success('文件导出中，请注意查收')
        }
      })
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
