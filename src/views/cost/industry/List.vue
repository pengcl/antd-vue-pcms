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
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button :disabled="!queryParam.ProjectGUID" type="success" @click="handleToAdd">新增</a-button>
        <a-button type="primary" style="margin-left: 5px" @click="show = !show">
          <a-icon type="search"></a-icon>
        </a-button>
      </div>

      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" v-if="show" class="search-form">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="编号">
              <a-input v-model="queryParam.tradePackageCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="规划名称">
              <a-input v-model="queryParam.packageTitle"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="提交状态">
              <a-select
                placeholder="请选择"
                v-model="queryParam.AuditStatus"
                v-decorator="[queryParam.AuditStatus, { rules: [{required: true, message: '请选择'}] }]">
                <a-select-option value="1">草拟中</a-select-option>
                <a-select-option value="2">已审批</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button type="success" @click="search()">搜索</a-button>
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
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a-button type="success" icon="file-text" title="查看" @click="handleToItem(record)"></a-button>
            <a-button
              type="primary"
              icon="form"
              style="margin-left: 4px"
              title="编辑"
              @click="handleToEdit(record)"></a-button>
            <a-button
              type="danger"
              icon="delete"
              style="margin-left: 4px"
              @click="handleToRemove(record)"
              title="删除"></a-button>
          </template>
        </span>

        <span slot="dateAction" slot-scope="text, record">
          {{record.packageDate | date}}
        </span>

        <span slot="tradePackageCode" slot-scope="text, record">
            <a @click="getBudgetAmt(record)">{{text}}</a>
        </span>
      </s-table>

      <a-row style="margin-top: 10px">
        <a-col :md="12" :sm="24">
          <a-button type="success"  :disabeld="!pid || selectedPackage.contractGUID" @click="hanldeAddBugetItem">新增预算</a-button>
          <!-- <a-button type="danger" style="margin-left: 10px" v-if="budgetId" @click="handleRemoveBudgetItem">删除预算</a-button> -->
        </a-col>
        <!-- <a-col :md="12" :sm="24">
          <a-form :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item label="招标盈余">
                  300.00
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="预计变更">
                  300.00
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col> -->
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
      >
        <span slot="itemAction" slot-scope="text, record">
          <template>
            <a-button
              type="danger"
              icon="delete"
              :disabled="!pid || selectedPackage.projectTenderPackageId || selectedPackage.contractGUID"
              style="margin-left: 4px"
              @click="handleRemoveBudgetItem(record)"
              title="删除"></a-button>
          </template>
        </span>
        <a slot="contractGUID" slot-scope="text, record" @click="jumpToContract" >{{selectedPackage.contractGUID}}</a>
        <a slot="projectTenderPackage" slot-scope="text, record" @click="jumpToProjectTenderPackage" >{{selectedPackage.projectTenderPackage}}</a>
      </s-table>
    </a-card>
    <industry-modal ref="industryModal"></industry-modal>
  </page-header-wrapper>
</template>

<script>
    import moment from 'moment'
    import { STable, Ellipsis } from '@/components'
    import StepByStepModal from '@/views/list/modules/StepByStepModal'
    import { ProjectService } from '@/views/project/project.service'
    import { formatList } from '../../../mock/util'
    import {CostService} from "@/views/cost/cost.service";
    import {fixedList, getPosValue} from "@/utils/util";
    import {nullFixedList} from "@/utils/util";
    import IndustryModal from '@/views/cost/industry/modal/IndustryModal'
    import storage from "store";

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
            scopedSlots: { customRender: 'tradePackageCode' }
        },
        {
            title: '分判包描述',
            dataIndex: 'packageTitle'
        },
        {
            title: '预算金额',
            dataIndex: 'budgetAmount'
        },
        {
            title: '日期',
            dataIndex: 'packageDate'
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
            dataIndex: 'costCenterName',
        },
        {
            title: '科目名称',
            dataIndex: 'elementInfoNameCN'
        },
        {
            title: '行业',
            dataIndex: 'budgetTitle',
        },
        {
            title: '金额',
            dataIndex: 'budgetValue',
            scopedSlots: { customRender: 'callNo' }
        },
        {
            title: '招投标包',
            dataIndex: 'ss',
            scopedSlots: { customRender: 'projectTenderPackageId' }
        },
        {
            title: '合同',
            dataIndex: 'aa',
            scopedSlots: { customRender: 'contractGUID' }
        }
    ]
    export default {
        name: 'TableList',
        components: {
            STable,
            Ellipsis,
            StepByStepModal,
            IndustryModal
        },
        data () {
            this.columns = columns
            this._columns = _columns
            return {
                pid: '',
                cities: [],
                show: false,
                visible: false,
                confirmLoading: false,
                mdl: null,
                budgetId : '',
                selectedPackage : null,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: { ProjectGUID:this.$route.query.ProjectGUID },
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    this.selectedPackage = null
                    this.pid = ''
                    const requestParameters = Object.assign({}, parameter, { ProjectGUID: this.queryParam.ProjectGUID })
                    if (typeof requestParameters.ProjectGUID !== 'undefined' && requestParameters.ProjectGUID!='') {
                      return CostService.industryItems(requestParameters)
                        .then(res => {
                          if(res.result.data!=null) {
                            return fixedList(res, requestParameters)
                          }
                        })
                    } else {
                      return nullFixedList(requestParameters)
                    }
                },
                loadData2: parameter => {
                  const requestParameters = Object.assign({}, parameter, this.queryParam)
                  if (this.pid){
                    return CostService.budgetItems({ Id: this.pid })
                      .then(res => {
                        if(res.result.data!=null) {
                          return res.result
                        }
                      })
                  }else{
                    return new Promise((resolve, reject) => {
                      resolve({data : []})
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
              this.queryParam.ProjectID = value.projectCode
              this.queryParam.ProjectGUID = value.projectGUID
              this.$forceUpdate()
              this.$refs.table.refresh(true)
            })
            function setSelectable(datas){
              datas.forEach(item =>{
                if(item.children && item.children.length > 0){
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
          ProjectGUID(){
            return this.$route.query.ProjectGUID
          },
          rowSelection () {
              return {
                  selectedRowKeys: this.selectedRowKeys,
                  onChange: this.onSelectChange
              }
          }
        },
        methods: {
            getBudgetAmt (record) {
              this.selectedPackage = record
              this.pid = record.id
              this.$refs.table2.refresh(true)
              // CostService.budgetItems({ Id: this.pid }).then(res => {
              //   this.budgetItems = res.result.data
              // })
            },
            handleToItem (record) {
                this.$router.push({ path: `/cost/industry/item/${record.id}?ProjectGUID=${this.queryParam.ProjectGUID}&type=view` })
            },
            handleToEdit (record) {
                this.$router.push({ path: `/cost/industry/item/${record.id}?ProjectGUID=${this.queryParam.ProjectGUID}&type=edit` })
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
            handleEdit (record) {
                this.visible = true
                this.mdl = { ...record }
            },
            handleOk () {
                const form = this.$refs.createModal.form
                this.confirmLoading = true
                form.validateFields((errors, values) => {
                    if (!errors) {
                        if (values.id > 0) {
                            // 修改 e.g.
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve()
                                }, 1000)
                            }).then(res => {
                                this.visible = false
                                this.confirmLoading = false
                                // 重置表单数据
                                form.resetFields()
                                // 刷新表格
                                this.$refs.table.refresh()

                                this.$message.info('修改成功')
                            })
                        } else {
                            // 新增
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve()
                                }, 1000)
                            }).then(res => {
                                this.visible = false
                                this.confirmLoading = false
                                // 重置表单数据
                                form.resetFields()
                                // 刷新表格
                                this.$refs.table.refresh()

                                this.$message.info('新增成功')
                            })
                        }
                    } else {
                        this.confirmLoading = false
                    }
                })
            },
            handleCancel () {
                this.visible = false

                const form = this.$refs.createModal.form
                form.resetFields() // 清理表单数据（可不做）
            },
            handleToRemove (record){
              this.$message.warn('暂无接口，无法实现该功能')
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
              this.show = !this.show
              this.$refs.table.refresh(true)
            },
            hanldeAddBugetItem(){
              if(this.pid){
                this.$refs.industryModal.show(this.pid)
              }
            },
            handleRemoveBudgetItem(record){
              const that = this
              this.$confirm({
                title : '删除预算',
                content : '是否确定删除选中预算?',
                onOk () {
                  console.log('record',record,that.pid)
                  CostService.removeBudgetItem({packageId : that.pid , budgetItemId : record.id}).then(res =>{
                    if(res.result.statusCode === 200){
                      that.$message.info('预算删除成功').then(() =>{
                        that.$refs.table2.refresh()
                      })
                    }
                  })
                },
                onCancel(){

                }
              })
            },
            jumpToContract(){
              this.$router.push({ path: `/contract/item/${this.selectedPackage.contractGuid}?type=view` })
            },
            jumpToProjectTenderPackage(){
              this.$router.push({ path: `/cost/bid/item/1?ProjectGUID=${this.selectedPackage.projectTenderPackage}&type=view` })
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
</style>
