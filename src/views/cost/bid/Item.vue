<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-model-item label="招投标包编号">
              <a-input :disabled="true" v-model="form.tradePackageCode"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="日期" prop="packageDate">
              <a-date-picker
                v-if="form.packageDate"
                :disabled="type === 'view'"
                v-model="form.packageDate"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="工程名称" prop="packageTitle">
              <a-input
                :disabled="type === 'view'"
                v-model="form.packageTitle"
              >
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="说明" prop="description">
              <a-textarea
                :disabled="type === 'view'"
                rows="3"
                v-model="form.description"
              >
              </a-textarea>
            </a-form-model-item>
          </a-col>
          <!--          <a-col :md="24" :sm="24">-->
          <!--            <a-form-model-item label="招投标包类型" prop="itemTypeId">-->
          <!--              <a-select-->
          <!--                :disabled="type === 'view'"-->
          <!--                placeholder="请选择"-->
          <!--                v-model="form.itemTypeId"-->
          <!--                style="width:500px"-->
          <!--              >-->
          <!--                <a-select-option v-for="option in budgetTypeItems" :key="JSON.stringify(option)" :value="option.id">-->
          <!--                  {{ option.nameCN }}-->
          <!--                </a-select-option>-->
          <!--              </a-select>-->
          <!--            </a-form-model-item>-->
          <!--          </a-col>-->
          <a-col :md="24" :sm="24">
            <a-form-item label="金额" prop="budgetAmount">
              <a-input
                :disabled="true"
                v-model="form.budgetAmount"
                placeholder="汇总明细项金额"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\\s?|(,*)/g, '')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
              <tr>
                <th colspan="5">
                  <a-button @click="addIndustry()" :disabled="type === 'view'" icon="plus" type="success">
                    新增行业分判包
                  </a-button>
                </th>
              </tr>
              <tr>
                <th style="width: 10%">操作</th>
                <th style="width: 20%">行业分判包编号</th>
                <th style="width: 25%">描述</th>
                <th style="width: 25%">范围</th>
                <th style="width: 20%">金额</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in form.tenderPackages" :key="index">
                <td>
                  <a-button
                    :disabled="getDelDisabled(index)"
                    @click="delIndustry(index)"
                    icon="delete"
                    type="danger"></a-button>
                </td>
                <td>
                  <a-form-model-item
                    class="simple"
                    style="margin-top: 20px"
                    :prop="'tenderPackages.' + index"
                    :rules="[{required: true, message: '请选择行业分判包', trigger: 'change' }]"
                  >
                    <a-select
                      v-if="industryItems.length > 0"
                      :disabled="getDisabled(index)"
                      showSearch
                      option-filter-prop="children"
                      :filter-option="filterOption"
                      placeholder="请选择"
                      v-model="form.tenderPackages[index]"
                    >
                      <a-select-option
                        v-for="(option,i) in getIndustrysList(industryItems,form.tenderPackages,form.tenderPackages[index])"
                        :key="option.id"
                        :value="option.id">
                        {{ option.packageTitle }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </td>
                <td>{{ getIndustryItem(index).packageTitle }}</td>
                <td>
                    <span v-for="childItem in getIndustryItem(index).costCenters" :key="childItem.costCenterId">
                      【 {{ childItem.costCenterName }} 】
                    </span>
                </td>
                <td>{{ getIndustryItem(index).budgetAmount | NumberFormat }}</td>
              </tr>
              </tbody>
            </table>
          </a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
              <tr>
                <th colspan="5">
                  <a-button :disabled="type === 'view'" @click="addPlan()" icon="plus" type="success">
                    招投标计划
                  </a-button>
                </th>
              </tr>
              <tr>
                <th style="width: 10%">操作</th>
                <th style="width: 25%">工作项</th>
                <th style="width: 20%">计划开始时间</th>
                <th style="width: 20%">计划完成时间</th>
                <th style="width: 25%">备注</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="!item.isDeleted" v-for="(item,index) in form.plans" :key="index">
                <td>
                  <a-button :disabled="type === 'view'" @click="delPlan(index)" icon="delete" type="danger"></a-button>
                </td>
                <td>
                  <a-form-model-item
                    class="simple"
                    style="margin-top: 20px"
                    :prop="'plans.' + index"
                    :rules="[{required: true, message: '请选择工作项', trigger: 'change' }]"
                  >
                    <a-select
                      :disabled="getPlanDisabled(index)"
                      placeholder="请选择"
                      v-model="form.plans[index].planTitle"
                    >
                      <a-select-option
                        v-for="option in matterItems"
                        :key="option.id"
                        :value="option.matterValue">
                        {{ option.matterValue }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item
                    class="simple"
                    style="margin-top: 20px"
                    :prop="'plans.' + index +'.planStartDate'"
                    :rules="[{required: true, message: '请填写日期', trigger: 'blur' }]">
                    <a-date-picker
                      :disabled="getPlanDisabled(index)"
                      v-model="form.plans[index].planStartDate"></a-date-picker>
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item
                    class="simple"
                    style="margin-top: 20px"
                    :prop="'plans.' + index +'.planEndDate'"
                    :rules="[{required: true, message: '请填写日期', trigger: 'blur' }]">
                    <a-date-picker
                      :disabled="getPlanDisabled(index)"
                      v-model="form.plans[index].planEndDate"></a-date-picker>
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item
                    class="simple"
                    style="margin-top: 20px"
                    :prop="'plans.' + index +'.remarks'"
                    :rules="[{required: false, message: '请填写描述', trigger: 'blur' }]">
                    <a-input :disabled="getPlanDisabled(index)" v-model="form.plans[index].remarks"></a-input>
                  </a-form-model-item>
                </td>
              </tr>
              </tbody>
            </table>
          </a-col>
        </a-row>
      </a-form-model>

      <a-row>
        <a-col :md="12" :sm="24">
          <a-button type="success" style="margin-right: 20px">启动审批流程</a-button>

        </a-col>
        <a-col :md="12" :sm="24">
          <a-button-group style="float: right">
            <a-button :disabled="type === 'view' || disabled" :loading="loading.save" type="success" @click="handleToSave">储存
            </a-button>
            <a-button type="danger" style="margin-left: 5px" @click="back">关闭</a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import {CostService} from '@/views/cost/cost.service'
  import {SwaggerService} from '@/api/swagger.service'
  import {addItem, removeItem} from '@/api/base'
  import moment from 'moment'

  export default {
    name: 'Edit',
    data() {
      return {
        centers: [],
        costCenters: [],
        industryItems: [],
        budgetTypeItems: [],
        tenderPackages: [],
        matterItems: [],
        plans: [],
        addTenderPackages: [],//编辑时新增的分判包列表
        removeTenderPackages: [],//编辑时移除的分判包列表
        addPlans: [],//编辑时新增的计划列表
        removePlans: [],//编辑时移除的计划列表
        loading: {
          save: false
        },
        disabled:false,
        form: SwaggerService.getForm('ProjectTenderPackageCreateInputDto'),
        rules: {
          packageDate: [{required: true, message: '请选择日期', trigger: 'blur'}],
          packageTitle: [{required: true, message: '请输入工程名称', trigger: 'blur'}],
          description: [{required: true, message: '请输入说明', trigger: 'change'}],
          itemTypeId: [{required: true, message: '请选择招投标类型', trigger: 'change'}],
          tenderPackages: [],
          plans: []

        }
      }
    },
    computed: {
      id() {
        return parseInt(this.$route.params.id)
      },
      type() {
        return this.$route.query.type
      },
      ProjectGUID() {
        return this.$route.query.ProjectGUID
      }
    },
    filters: {},
    created() {
      // CostService.budgetTypeItems().then(res => {
      //   this.budgetTypeItems = JSON.parse(JSON.stringify(res.result.data))
      //   this.$forceUpdate()
      // })
      if (this.type === 'add') {
        CostService.bidIndustryItems({ProjectGUID: this.ProjectGUID, ProjectTenderPackageId: this.id}).then(res => {
          this.industryItems = JSON.parse(JSON.stringify(res.result.data))
          this.$forceUpdate()
        })
      }
      CostService.matterItems().then(res => {
        this.matterItems = JSON.parse(JSON.stringify(res.result.data))
        this.$forceUpdate()
      })
      if (this.type !== 'add') {
        CostService.bidItem({Id: this.id}).then(res => {
          this.form = res.result.data
          if (this.form.tenderPackages) {
            CostService.bidIndustryItems({
              ProjectGUID: this.ProjectGUID,
              ProjectTenderPackageId: this.id
            }).then(res2 => {
              //获取下拉分判包列表
              this.industryItems = JSON.parse(JSON.stringify(res2.result.data))
              //组装编辑返回的下拉框内容，并判断重复
              let packages = JSON.parse(JSON.stringify(this.form.tenderPackages))
              this.form.tenderPackages = []
              packages.forEach(item => {
                let isHaving = false
                this.industryItems.forEach(industryItem => {
                  if (industryItem.id === item.id) {
                    isHaving = true
                  }
                })
                if (!isHaving) {
                  this.form.tenderPackages.push(item.id)
                  item.isEditItem = true
                  this.industryItems.push(item)
                }
              })
              this.form.plans.forEach(item => {
                item.isEditItem = true
              })
            })
          }
          this.$forceUpdate()
        })
      } else {
        this.form.packageDate = moment(new Date())
      }
    },
    methods: {
      getIndustryItem(index) {
        let industryItem = {}
        const value = this.form.tenderPackages[index]
        this.industryItems.forEach((item) => {
          if (item.id === value) {
            industryItem = item
          }
        })
        return industryItem
      },
      getDisabled(index) {
        if (this.type === 'add') {
          return false
        } else if (this.type === 'view') {
          return true
        } else {
          let isDisabled = false
          if (this.getIndustryItem(index).isEditItem) {
            isDisabled = true
          }
          return isDisabled
        }
      },
      getDelDisabled(index) {
        if (this.type === 'add') {
          return false
        } else if (this.type === 'view') {
          return true
        } else {
          let isDisabled = false
          isDisabled = this.getIndustryItem(index).isToContract
          return isDisabled
        }
      },
      getPlanDisabled(index) {
        if (this.type === 'add') {
          return false
        } else if (this.type === 'view') {
          return true
        } else {
          let isDisabled = false
          isDisabled = this.form.plans[index].isEditItem
          return isDisabled
        }
      },
      addIndustry() {
        this.form.tenderPackages.push('')
      },
      addPlan() {
        const item = {
          planTitle: '',
          planStartDate: '',
          planEndDate: '',
          remarks: '',
          isEditItem: false
        }
        addItem(item, this.form.plans)
      },
      handleToSave() {
        this.disabled = true
        this.form.itemTypeId = 0
        this.form.projectGUID = this.ProjectGUID
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading.save = true
            if (this.type === 'add') {
              CostService.bidCreate(this.form).then(res => {
                if (res.result.statusCode === 200) {
                  this.$message.info('新增成功')
                  this.loading.save = false
                  this.back()
                }
              }).catch(() => {
                this.loading.save = false
                this.disabled = false
              })
            } else {
              // 处理新增的分判包列表
              if (this.form.tenderPackages) {
                this.form.tenderPackages.forEach(item => {
                  this.industryItems.forEach(industryItem => {
                    if (item === industryItem.id && !industryItem.isEditItem) {
                      this.addTenderPackages.push({projectTenderPackageId: this.id, tenderPackageId: item})
                    }
                  })
                })
              }
              // 处理新增的计划列表
              if (this.form.plans) {
                this.form.plans.forEach(item => {
                  if (!item.isEditItem) {
                    this.addPlans.push({
                      projectTenderPackageId: this.id,
                      planTitle: item.planTitle,
                      planStartDate: item.planStartDate,
                      planEndDate: item.planEndDate,
                      remarks: item.remarks
                    })
                  }
                })
              }
              this.form.id = this.id
              this.form.addTenderPackages = this.addTenderPackages
              this.form.removeTenderPackages = this.removeTenderPackages
              this.form.addPlans = this.addPlans
              this.form.removePlans = this.removePlans
              // this.$delete(this.form, 'plans')
              // this.$delete(this.form, 'tenderPackages')
              // this.$delete(this.form, 'projectGUID')
              // this.$delete(this.form, 'projectTenderPackageGUID')
              // this.$delete(this.form, 'tradePackageCode')
              CostService.bidUpdate(this.form).then(res => {
                if (res.result.statusCode === 200) {
                  this.$message.info('修改成功')
                  this.loading.save = false
                  this.back()
                }
              }).catch(() => {
                this.loading.save = false
                this.disabled = false
              })
            }
          }
        })
      },
      back() {
        this.$router.push({path: `/cost/bid/list`})
      },
      delIndustry(index) {
        const items = this.form.tenderPackages
        if (this.type === 'edit') {
          const item = items[index]
          this.industryItems.forEach(industryItem => {
            if (industryItem.id === item && industryItem.isEditItem) {
              // 移除的计划放到移除对象
              this.removeTenderPackages.push({projectTenderPackageId: this.id, tenderPackageId: industryItem.id})
            }
          })
        }
        items.splice(index, 1)
      },
      delPlan(index) {
        const items = this.form.plans
        if (this.type === 'edit') {
          const item = items[index]
          if (item && item.isEditItem) {
            // 移除的计划放到移除对象
            this.removePlans.push({projectTenderPackageId: this.id, plansId: item.id})
          }
        }
        removeItem(index, items)
        this.$forceUpdate()
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },
      getIndustrysList(industrysItems, tenderPackages, value) {
        const _industrysItems = JSON.parse(JSON.stringify(industrysItems))
        tenderPackages.forEach(p => {
          const index = this.getIndex(_industrysItems, p)
          if (typeof index === 'number') {
            _industrysItems.splice(index, 1)
          }
        })
        const index = this.getIndex(industrysItems, value)
        if (typeof index === 'number') {
          _industrysItems.push(industrysItems[index])
        }
        return _industrysItems
      },
      getIndex(items, value) {
        let i = null
        items.forEach((item, index) => {
          if (item.id === value) {
            i = index
          }
        })
        return i
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
        &:first-child {
          th {
            background-color: #f5f5f5;
          }
        }

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

  .ant-btn-group {
    margin-right: 8px;
  }

  .simple {
    /deep/ .ant-form-item-control-wrapper.ant-col-16 {
      width: 100% !important;
    }
  }

</style>
