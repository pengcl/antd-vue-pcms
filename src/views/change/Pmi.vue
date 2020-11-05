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
                  @change="onChange"
                />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-button icon="search" type="primary" @click="show = !show"></a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" v-if="show" class="search-form">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="合同名称">
              <a-input v-model="queryParam.ContractName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合同编号">
              <a-input v-model="queryParam.ContractNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="乙方单位">
              <a-input v-model="queryParam.VendorName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button type="success" @click="search">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
          </a-col>
        </a-row>
      </a-form>

      <a-row :gutter="48">
        <a-col :md="24" :sm="24">
          合同列表
        </a-col>
      </a-row>
      <s-table :columns="columns" :data="loadData" bordered :rowSelection="rowSelection" ref="table">
        <template slot="footer">
          <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-row :gutter="48">
              <a-col :md="12" :sm="24">
                <a-form-item label="累计变更金额">{{ totalChangeAmt }}</a-form-item>
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
          <a-button type="success" @click="handleToAdd">新增CIP</a-button>
          <a-button type="success" style="margin-left: 20px">CIP转VO</a-button>
          <a-button type="success" style="margin-left: 20px" @click="handleToCertificate">现场签证</a-button>
        </a-col>
        <a-col :md="24" :sm="24">
          变更列表
        </a-col>
      </a-row>
      <s-table
        style="margin-top: 5px"
        ref="table2"
        bordered
        :columns="_columns"
        :data="loadData2"
        :rowSelection="rowSelection2"
      >
        <span slot="action" slot-scope="text,record">
          <template>
            <a-button class="btn-success" type="primary" icon="file-text" title="查看" @click="handleToItem(record)">
            </a-button>
            <a-button
              class="btn-info"
              type="primary"
              icon="form"
              style="margin-left: 4px"
              title="编辑"
              @click="handleToEdit(record)">
            </a-button>
          </template>
        </span>
      </s-table>

    </a-card>
  </page-header-wrapper>
</template>

<script>
  import moment from 'moment'
  import { STable, Ellipsis } from '@/components'
  // import { getRoleList, getServiceList } from '@/api/manage'

  import StepByStepModal from '@/views/list/modules/StepByStepModal'
  import CreateForm from '@/views/list/modules/CreateForm'
  import { ChangeService } from '@/views/change/change.service'
  import { ProjectService } from '@/views/project/project.service'
  import { fixedList } from '@/utils/util'
  import { formatList } from '../../mock/util'

  const columns = [
    {
      title: '审批状态',
      dataIndex: 'auditStatus',
      scopedSlots: { customRender: 'auditStatus' }
    },
    {
      title: '结算状态',
      dataIndex: 'balanceStatus'
    },
    {
      title: '合同编号',
      dataIndex: 'contractNo'
    },
    {
      title: '合同名称',
      dataIndex: 'contractName'

    },
    {
      title: '币种',
      dataIndex: 'currency'
    },
    {
      title: '合同金额',
      dataIndex: 'contractAmount'
    },
    {
      title: '预计结算金额',
      dataIndex: 'preSettleAmount'
    },
    {
      title: '签约日期',
      dataIndex: 'signDate'
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
      scopedSlots: { customRender: 'auditStatus' }
    },
    {
      title: '变更编号',
      dataIndex: 'voNo'
    },
    {
      title: '申请金额',
      dataIndex: 'cipAmount',
      scopedSlots: { customRender: 'cipAmount' }
    },
    {
      title: '申报日期',
      dataIndex: 'createTime'
    },
    {
      title: '变更类型',
      dataIndex: 'voType',
      scopedSlots: { customRender: 'voType' }
    },
    {
      title: '变更确认',
      dataIndex: 'voStatus',
      scopedSlots: { customRender: 'voStatus' }
    },
    {
      title: '相关现场签证',
      dataIndex: 'signID'
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
        show: false,
        visible: false,
        confirmLoading: false,
        mdl: null,
        // 高级搜索 展开/关闭
        advanced: false,
        // 合同列表查询参数
        queryParam: {},
        // 变更列表查询参数
        queryParam2: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return ChangeService.items(requestParameters)
            .then(res => {
              const data = fixedList(res, parameter)
              return data
            })
        },
        // 变更列表加载数据方法 必须为 Promise 对象
        loadData2: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam2)
          return ChangeService.changeItems(requestParameters).then(res => {
            const data = fixedList(res, parameter)
            console.log(data)
            return data
          })
        },
        selectedRowKeys: [],
        selectedRows: [],
        totalChangeAmt: 0,
        totalChangeRate: 0,
        // 记录变更列表选中行信息
        tableSelected: {}
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
        this.$forceUpdate()
      })
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
          onSelect: function (record, selected, selectRows, nativeEvent) {
            that.tableSelected = record
          }
        }
      }
    },
    methods: {
      handleToItem (record) {
        this.$router.push({ path: `/change/cip/item/${record.cipGuid}?type=view&contractGuid=${this.queryParam2.contractGuid}` })
      },
      handleToEdit (record) {
        this.$router.push({ path: `/change/cip/item/${record.cipGuid}?type=edit&contractGuid=${this.queryParam2.contractGuid}` })
      },
      handleToAdd () {
        if (this.queryParam2.contractGuid !== undefined) {
          this.$router.push({ path: `/change/cip/item/0?type=add&contractGuid=${this.queryParam2.contractGuid}` })
        } else {
          this.$message.warn('请先选择合同')
        }
      },
      handleToCertificate () {
        if (this.tableSelected.voGuid !== undefined) {
          this.$router.push({ path: `/change/certificate/${this.tableSelected.cipGuid}` })
        } else {
          this.$message.warn('请选择变更记录')
        }
      },
      // cip转vo 方法
      handleCipToVo () {

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
        this.show = !this.show
        this.$refs.table.refresh(true)
      },
      onChange (value) {
        if (value.length >= 2) {
          this.queryParam.ProjectGUID = value[value.length - 1]
          this.$refs.table.refresh(true)
        } else {
          this.queryParam.ProjectGUID = ''
          this.$refs.table.refresh(true)
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
