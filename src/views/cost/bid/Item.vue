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
                :format="dateFormat"
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
                  <a-button :disabled="type === 'view'" icon="plus" type="success">
                    新增行业分判包
                  </a-button>
                </th>
              </tr>
              <tr>
                <th style="width: 20%">操作</th>
                <th style="width: 20%">行业分判包编号</th>
                <th style="width: 20%">描述</th>
                <th style="width: 20%">范围</th>
                <th style="width: 20%">金额</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>
                  <a-button :disabled="type === 'view'" icon="delete" type="danger"></a-button>
                </td>
                <td>
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                    <a-select-option value="1">广州永沛房地产开发有限公司</a-select-option>
                  </a-select>
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              </tbody>
            </table>
          </a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
              <tr>
                <th colspan="5">
                  <a-button :disabled="type === 'view'" icon="plus" type="success">
                    招投标计划
                  </a-button>
                </th>
              </tr>
              <tr>
                <th style="width: 20%">工作项</th>
                <th style="width: 20%">计划开始时间</th>
                <th style="width: 20%">计划完成时间</th>
                <th style="width: 20%">实际完成时间</th>
                <th style="width: 20%">备注</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>
                  <a-button :disabled="type === 'view'" icon="delete" type="danger"></a-button>
                </td>
                <td>
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                    <a-select-option value="1">广州永沛房地产开发有限公司</a-select-option>
                  </a-select>
                </td>
                <td></td>
                <td></td>
                <td></td>
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

  export default {
    name: 'Edit',
    data () {
      return {
        centers: [],
        costCenters: [],
        budgetTypeItems: [],
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
      handleToSave () {
        this.form.projectGUID = this.ProjectGUID
        CostService.industryCreate(this.form).then(res => {
          if (res.result.statusCode === 200) {
            const that = this
            this.$confirm({
              title : that.type === 'edit' ? '修改提示' : '添加提示',
              content : that.type === 'edit' ? '继续修改' : '继续添加',
              onOk () {
                if ( that.type === 'add' ) {
                  that.form = SwaggerService.getForm('TenderPackageCreateInputDto')
                  that.$forceUpdate()
                }
              },
              onCancel(){
                that.$router.push({ path: `/cost/industry/list?ProjectGUID=${that.ProjectGUID}`})
              }
            })
          }
        })
      },
      back () {
        this.$router.push({ path: `/cost/industry/list?ProjectGUID=${this.ProjectGUID}`})
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