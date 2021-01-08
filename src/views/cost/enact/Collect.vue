<template>
  <page-header-wrapper :property="{}">
    <a-card :bordered="false">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }">
        <a-row>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="项目分期信息" prop="projectName">
              <a-input
                :disabled="true"
                v-model="form.projectName"
              >
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="项目预算标题" prop="planPackageTitle">
              <a-input
              v-model="form.planPackageTitle"
              >
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="项目预算说明" prop="remarks">
              <a-textarea
                v-model="form.remarks"
                rows="3">
              </a-textarea>
            </a-form-model-item>
          </a-col>
          <s-table
            style="margin-top: 5px"
            ref="table"
            size="default"
            rowKey="code"
            bordered
            :columns="columns"
            :data="loadData"
            :alert="false"
            :scroll="{ x: columnsWidth,y: 500 }"
            showPagination="auto"
          >
          <span slot="description" slot-scope="text">
            <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
          </span>
            <span slot="cost" slot-scope="text">
            <p style="text-align: right">
              <span style="font-weight: bold;padding-right: 10px">{{text.amount|NumberFormat}}</span>
            </p>
          </span>
          </s-table>
        </a-row>
        <a-row style="margin-top: 10px">
          <a-col :md="12" :sm="24">
            <a-button v-if="form.auditStatus === '未审核'" type="primary" style="margin-right: 20px" @click="runAudit">启动审批流程
            </a-button>
            <a-button v-if="form.auditStatus !== '未审核'" type="success" style="margin-right: 20px" @click="viewAudit">查看审批流程
            </a-button>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-button-group style="float: right">
              <a-button type="danger" style="margin-left: 5px" @click="back">关闭</a-button>
            </a-button-group>
          </a-col>
        </a-row>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import {CostService} from '@/views/cost/cost.service'
  import {SwaggerService} from '@/api/swagger.service'
  import {Ellipsis, STable} from '@/components'
  import {fixedList} from "@/utils/util";

  const defaultColumns = [

    {
      title: '科目代码',
      className: 'title-center',
      dataIndex: 'code',
      width: 100,
      fixed: 'left'
    },
    {
      title: '科目名称',
      className: 'title-center',
      width: 300,
      fixed: 'left',
      dataIndex: 'name'
    }
  ]

  const columns = defaultColumns

  export default {
    name: 'Table',
    components: {
      STable,
      Ellipsis
    },
    data() {
      this.columns = columns
      return {
        titleIds: [],
        auditStatus: '',
        cities: null,
        visible: false,
        confirmLoading: false,
        mdl: null,
        columnsWidth: 400,
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        loading: {
          save: false
        },
        form: SwaggerService.getForm('BudgetPlanPackageEditOutputDtoResultModel'),
        startBPMUrl: '',
        viewBPMUrl: '',
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const _columns = JSON.parse(JSON.stringify(defaultColumns))
          const result = {
            result: {
              data: []
            }
          }
          return CostService.items({Id: this.ProjectGUID}).then(res => {
            return CostService.subjectItems({Id: this.ProjectGUID})
              .then(res2 => {
                if (res2.result.data != null) {
                  this.columnsWidth = 400 + res2.result.data.costCenterBudgetSubPlans.length * 200
                  if (this.columnsWidth < 1560) {
                    this.columnsWidth = 1560
                  }
                  let index = 0
                  res2.result.data.costCenterBudgetSubPlans.forEach(subjectItem1 => {
                    ++index
                    const obj = {}
                    obj.title = subjectItem1.costCenterName
                    obj.className = 'title-center'
                    obj.dataIndex = 'cost' + subjectItem1.costCenterId
                    obj.scopedSlots = {customRender: 'cost'}
                    if (index !== res2.result.data.costCenterBudgetSubPlans.length) {
                      obj.width = (this.columnsWidth - 400) / res2.result.data.costCenterBudgetSubPlans.length
                    }
                    _columns.push(obj)
                    this.titleIds.push('cost' + subjectItem1.costCenterId)
                  })
                  this.columns = _columns
                  this.$forceUpdate()
                  res.result.data.forEach(item => {
                    const obj = {}
                    obj['id'] = item.id
                    obj['code'] = item.code
                    obj['name'] = item.nameCN

                    if (res2.result.data != null) {
                      res2.result.data.costCenterBudgetSubPlans.forEach(subjectItem2 => {
                        // 加载成本
                        const costName = 'cost' + subjectItem2.costCenterId
                        subjectItem2.mainElements.forEach(itemA => {
                          if (item.id === itemA.elementTypeId) {
                            obj[costName] = {
                              amount: itemA.amount,
                              percentage: itemA.percentage
                            }
                          }
                        })
                        if (!obj[costName]) {
                          obj[costName] = {
                            amount: 0,
                            percentage: 0
                          }
                        }
                      })
                    }
                    result.result.data.push(obj)
                  })
                }
                return fixedList(result, parameter)
              })
          })
        },
        rules: {
          planPackageTitle: [{ required: true, message: '请输入项目预算标题', trigger: 'blur' }]
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    filters: {},
    created() {
      this.loadData()
      CostService.budgetPlanAuditItem({ Id: this.ProjectGUID }).then(res => {
        this.form = res.result.data
        this.$forceUpdate()
      })
    },
    computed: {
      ProjectGUID() {
        return this.$route.query.ProjectGUID
      }
    },
    methods: {
      back() {
        this.$router.push({path: `/cost/enact/list`})
      },
      runAudit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading.save = true
            CostService.budgetPlanAuditSave(this.form).then(res => {
              if (res.result.statusCode === 200) {
                this.form = res.result.data
                this.loading.save = false
                const tempwindow = window.open('_blank')
                tempwindow.location = res.result.data.startBPMUrl
              }
            }).catch(() => {
              this.loading.save = false
            })
          }
        })
      },
      viewAudit() {
        const tempwindow = window.open('_blank')
        tempwindow.location = this.form.viewBPMUrl
      }
    }
  }
</script>

<style lang="less" scoped>
  table {
    margin: 15px 0;
    width: 100%;
    border-width: 1px 1px 0 0;
    border-radius: 3px 3px 0 0;
    border-style: solid;
    border-color: #ccc;

    thead {
      tr {
        th {
          background-color: #06c;
          color: #fff;
          font-weight: normal;
          border-width: 0 0 1px 1px;
          border-style: solid;
          border-color: #ccc;

          button {
            margin-right: 10px;
          }
        }
      }
    }

    tbody {
      tr {
        td {
          padding: 0.5em 0.6em 0.4em 0.6em !important;
          border-width: 0 0 1px 1px;
          border-style: solid;
          border-color: #ccc;

          button {
            margin-right: 10px;
          }
        }
      }
    }
  }

  /deep/ .ant-table-row-level-1 {
    background: #d7f4ff !important;
  }
</style>
