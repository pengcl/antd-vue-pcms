<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="项目">
                <a-cascader
                  :options="cities"
                  placeholder="请选择"
                  @change="onChange"
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
              <a-input v-model="queryParam.ContractNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="规划名称">
              <a-input v-model="queryParam.ContractName"></a-input>
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
        rowKey="key"
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
          <a-button type="success"  v-if="pid">新增预算</a-button>
          <a-button type="danger" style="margin-left: 10px">删除预算</a-button>
        </a-col>
        <a-col :md="12" :sm="24">
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
        </a-col>
      </a-row>
      <s-table
        style="margin-top: 5px"
        ref="table2"
        size="default"
        rowKey="key"
        bordered
        :columns="_columns"
        :data="loadData2"
        :alert="false"
        showPagination="auto"
      ></s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import moment from 'moment'
    import { STable, Ellipsis } from '@/components'
    import { getRoleList, getServiceList } from '@/api/manage'

    import StepByStepModal from '@/views/list/modules/StepByStepModal'
    import CreateForm from '@/views/list/modules/CreateForm'
    import { ProjectService } from '@/views/project/project.service'
    import { formatList } from '../../../mock/util'
    import {CostService} from "@/views/cost/cost.service"
    import {fixedList} from "@/utils/util"
    import {SignedService} from "@/views/pay/signed/signed.service"

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
            dataIndex: 'packageDate',
          scopedSlots: { customRender: 'dateAction'}
        },
        {
            title: '状态',
            dataIndex: 'auditStatus'
        }
    ]

    const _columns = [
        {
            title: '业态成本中心',
            dataIndex: 'action',
        },
        {
            title: '科目名称',
            dataIndex: 'no'
        },
        {
            title: '行业',
            dataIndex: 'industry',
        },
        {
            title: '金额',
            dataIndex: 'callNo',
            scopedSlots: { customRender: 'callNo' }
        },
        {
            title: '招投标包',
            dataIndex: 'createAt',
        },
        {
            title: '合同',
            dataIndex: 'approvalStatus',
        }
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
        name: 'TableList',
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
                pid: '',
                budgetItems: {},
                cities: [],
                show: false,
                visible: false,
                confirmLoading: false,
                mdl: null,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: { ProjectGUID:this.$route.query.ProjectGUID },
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, { ProjectGUID: this.queryParam.ProjectGUID })
                    if (typeof requestParameters.ProjectGUID !== 'undefined' && requestParameters.ProjectGUID!='') {
                      return CostService.industryItems(requestParameters)
                        .then(res => {
                          if(res.result.data!=null) {
                            console.log(fixedList(res, requestParameters))
                            return fixedList(res, requestParameters)
                          }
                        })
                    } else {
                      const res = {
                        'result': {
                          'data': {
                            'totalCount': 0,
                            'items': []
                          }
                        }
                      }
                      return fixedList(res, requestParameters)
                    }
                },
                loadData2: parameter => {
                  const requestParameters = Object.assign({}, parameter, this.queryParam)
                  console.log("id: ",this.pid)
                  if (this.pid){
                    return CostService.budgetItems(this.pid)
                      .then(res => {
                        if(res.result.data!=null) {
                          return fixedList(res, requestParameters)
                        }
                      })
                  }else{
                    const res = {
                      'result': {
                        'data': {
                          'totalCount': 0,
                          'items': []
                        }
                      }
                    }
                    return fixedList(res, requestParameters)
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
            this.queryParam.ProjectGUID = this.$route.query.ProjectGUID
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
                this.mdl = null
                this.visible = true
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
</style>
