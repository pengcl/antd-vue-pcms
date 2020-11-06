<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="招投标包编号">
              <a-input :disabled="true" v-model="form.tradePackageCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="日期">
              <a-date-picker
                :disabled="type === 'view'"
                v-model="form.packageDate"></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="工程名称">
              <a-input
                :disabled="type === 'view'"
                v-model="form.packageTitle"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="说明">
              <a-input
                :disabled="type === 'view'"
                v-model="form.description"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="招投标包类型">
              <a-select
                :disabled="type === 'view'"
                placeholder="请选择"
                v-model="form.itemTypeId"
              >
                <a-select-option v-for="option in budgetTypeItems" :key="JSON.stringify(option)" :value="option.id">
                  {{ option.nameCN }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="金额">
              <a-input :disabled="true" v-model="form.budgetAmount" placeholder="汇总明细项金额"></a-input>
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
              <tr v-for="(item,index) in tenderPackages" :key="index">
                <td>
                  <a-button :disabled="type === 'view'" @click="delIndustry(index)" icon="delete" type="danger"></a-button>
                </td>
                <td>
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择"
                    v-model="item.industry"
                    @change="onChange"
                  >
                    <a-select-option  v-for="option in industryItems" :key="index + '#&' + JSON.stringify(option)" :value="option.id">
                      {{ option.packageTitle }} - {{ option.tradePackageCode}}
                    </a-select-option>
                  </a-select>
                </td>
                <td>{{item.packageTitle}}</td>
                <td>
                  <span v-for="childItem in item.centers" :key="childItem.costCenterId">
                      {{ childItem.costCenterName }}
                  </span>
                </td>
                <td>{{item.budgetAmount}}</td>
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
              <tr v-for="(item,index) in plans" :key="index">
                <td>
                  <a-button :disabled="type === 'view'" @click="delPlan(index)" icon="delete" type="danger"></a-button>
                </td>
                <td>
                  <a-input :disabled="type === 'view'" v-model="item.planTitle"></a-input>
                </td>
                <td>
                  <a-date-picker
                    :disabled="type === 'view'"
                    v-model="item.planStartDate"></a-date-picker>
                </td>
                <td>
                  <a-date-picker
                    :disabled="type === 'view'"
                    v-model="item.planEndDate"></a-date-picker>
                </td>
                <td>
                  <a-input :disabled="type === 'view'" v-model="item.remarks"></a-input>
                </td>
              </tr>
              </tbody>
            </table>
          </a-col>
        </a-row>
      </a-form>

      <a-row>
        <a-col :md="12" :sm="24">
          <a-button type="success" style="margin-right: 20px">启动审批流程</a-button>

        </a-col>
        <a-col :md="12" :sm="24">
          <a-button-group style="float: right">
            <a-button :disabled="type === 'view'" type="success" @click="handleToSave">储存</a-button>
            <a-button type="danger" style="margin-left: 5px" @click="back">关闭</a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { CostService } from '@/views/cost/cost.service'
  import { SwaggerService } from '@/api/swagger.service'
  import { addItem, removeItem, clearItems } from '@/api/base'

  export default {
    name: 'Edit',
    data () {
      return {
        centers: [],
        costCenters: [],
        industryItems: [],
        budgetTypeItems: [],
        tenderPackages:[],
        plans:[],
        form: SwaggerService.getForm('TenderPackageCreateInputDto')
      }
    },
    computed: {
      id () {
        return this.$route.params.id
      },
      type () {
        return this.$route.query.type
      },
      ProjectGUID () {
        return this.$route.query.ProjectGUID
      }
    },
    filters: {
    },
    created () {
      CostService.budgetTypeItems().then(res => {
        this.budgetTypeItems = JSON.parse(JSON.stringify(res.result.data))
        this.$forceUpdate()
      })
      return CostService.industryItems({ MaxResultCount : 1000 , ProjectGUID: this.ProjectGUID })
        .then(res => {
          this.industryItems = JSON.parse(JSON.stringify(res.result.data.items))
          this.$forceUpdate()
        })
      if (this.type !== 'add') {
        CostService.industryItem({ Id: this.id }).then(res => {
          this.form = res.result.data
          const values = []
          const centers = this.form.costCenters ? this.form.costCenters : []
          centers.forEach((item, idsIndex) => {
            values.push(item.costCenterId)
          })
          this.form.costCenters = values
          this.centers = values
        })
      }
    },
    methods: {
      addIndustry () {
        const item = {
          _id: new Date().getTime(),
          tenderPackagesID: this.id === '0' ? '' : this.id,
          id: '',
          packageTitle: '',
          tradePackageCode: '',
          centens: '',
          budgetAmount:''
        }
        addItem(item, this.tenderPackages)
      },
      addPlan () {
        const item = {
          _id: new Date().getTime(),
          planID: this.id === '0' ? '' : this.id,
          id: '',
          planTitle: '',
          planStartDate: '',
          planEndDate: '',
          remarks:''
        }
        addItem(item, this.plans)
      },
      handleToSave () {
        this.form.projectGUID = this.ProjectGUID
        //组装计划的列表数据
        if(this.plans.length>0){
          this.form.plans = []
          this.plans.forEach(item => {
            const obj = {}
            obj['planTitle'] = item.planTitle
            obj['planStartDate'] = item.planStartDate
            obj['planEndDate'] = item.planEndDate
            obj['remarks'] = item.remarks
            this.form.plans.push(obj)
          })
        }
        CostService.bidCreate(this.form).then(res => {
          if (res.result.statusCode === 200) {
            const that = this
            this.$confirm({
              title : that.type === 'edit' ? '修改提示' : '添加提示',
              content : that.type === 'edit' ? '继续修改' : '继续添加',
              onOk () {
                if ( that.type === 'add' ) {
                  that.form = SwaggerService.getForm('ProjectTenderPackageCreateInputDto')
                  that.$forceUpdate()
                }
              },
              onCancel(){
                that.$router.push({ path: `/cost/bid/list?ProjectGUID=${that.ProjectGUID}`})
              }
            })
          }
        })
      },
      back () {
        this.$router.push({ path: `/cost/bid/list?ProjectGUID=${this.ProjectGUID}`})
      },
      onChange (value, option) {
          const optionValue = option.data.key
          const index = optionValue.split('#&')[0]
          const item = JSON.parse(optionValue.split('#&')[1])
          console.log(item)
          this.tenderPackages[index]['packageTitle'] = item.packageTitle
          this.tenderPackages[index]['centers'] = item.costCenters
          this.tenderPackages[index]['id'] = item.id
          this.tenderPackages[index]['budgetAmount'] = item.budgetAmount

          this.form.tenderPackages = []
          //组装行业分判包列表数据
          this.tenderPackages.forEach(item => {
              this.form.tenderPackages.push(item.id)
          })
      },
      delIndustry (index) {
        const items = this.tenderPackages
        removeItem(index, items)
      },
      delPlan (index) {
        const items = this.plans
        removeItem(index, items)
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
        &:first-child{
          th{
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
</style>