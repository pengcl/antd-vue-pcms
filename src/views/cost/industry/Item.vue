<template>
  <page-header-wrapper>
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }">
    <a-card :bordered="false">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-model-item prop="tradePackageCode" label="分判包编号">
              <a-input :disabled="true" v-model="form.tradePackageCode"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item prop="packageDate" label="日期">
              <a-date-picker
                :disabled="type === 'view'"
                v-model="form.packageDate"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item prop="packageTitle" label="分判包描述">
              <a-input
                :disabled="type === 'view'"
                v-model="form.packageTitle"
              >
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item prop="costCenters" label="范围">
              <a-select
                :disabled="type === 'view'"
                mode="multiple"
                size="default"
                placeholder="请选择"
                @change="onChange"
                v-model="centers"
              >
                <a-select-option v-for="option in costCenters" :key="JSON.stringify(option)" :value="option.id">
                  {{ option.costCenterName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item prop="itemTypeId" label="分判包类型">
              <a-select
                :disabled="type === 'view'"
                placeholder="请选择"
                v-model="form.itemTypeId"
              >
                <a-select-option v-for="option in budgetTypeItems" :key="JSON.stringify(option)" :value="option.id">
                  {{ option.nameCN }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item prop="elementTypeId" label="科目类型">
              <a-select
                :disabled="type === 'view'"
                placeholder="请选择"
                v-model="form.elementTypeId"
              >
                <a-select-option v-for="option in elementItems" :key="JSON.stringify(option)" :value="option.id">
                  {{ option.nameCN }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item prop="budgetAmount" label="金额">
              <a-input :disabled="true" v-model="form.budgetAmount" placeholder="汇总明细项金额"></a-input>
            </a-form-model-item>
          </a-col>
          <!--          <a-col :md="24" :sm="24">-->
          <!--            <table>-->
          <!--              <thead>-->
          <!--                <tr>-->
          <!--                  <th colspan="6">-->
          <!--                    <a-button :disabled="type === 'view'">-->
          <!--                      新增行业预算-->
          <!--                    </a-button>-->
          <!--                  </th>-->
          <!--                </tr>-->
          <!--                <tr>-->
          <!--                  <th style="width: 10%">操作</th>-->
          <!--                  <th style="width: 18%">科目</th>-->
          <!--                  <th style="width: 18%">行业</th>-->
          <!--                  <th style="width: 18%">子行业</th>-->
          <!--                  <th style="width: 18%">金额</th>-->
          <!--                  <th style="width: 18%">成本中心</th>-->
          <!--                </tr>-->
          <!--              </thead>-->
          <!--              <tbody>-->
          <!--                <tr>-->
          <!--                  <td>-->
          <!--                    <a-button :disabled="type === 'view'" icon="delete" type="danger"></a-button>-->
          <!--                  </td>-->
          <!--                  <td>-->
          <!--                    <a-select-->
          <!--                      :disabled="type === 'view'"-->
          <!--                      placeholder="请选择"-->
          <!--                    >-->
          <!--                      <a-select-option value="1">广州永沛房地产开发有限公司</a-select-option>-->
          <!--                    </a-select>-->
          <!--                  </td>-->
          <!--                  <td></td>-->
          <!--                  <td></td>-->
          <!--                  <td></td>-->
          <!--                  <td></td>-->
          <!--                </tr>-->
          <!--              </tbody>-->
          <!--            </table>-->
          <!--          </a-col>-->
        </a-row>
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
    </a-form-model>
  </page-header-wrapper>
</template>

<script>
  import { CostService } from '@/views/cost/cost.service'
  import { SwaggerService } from '@/api/swagger.service'
  import moment from "moment";

  export default {
    name: 'Edit',
    data () {
      return {
        centers: [],
        costCenters: [],
        budgetTypeItems: [],
        elementItems: [],
        form: SwaggerService.getForm('TenderPackageCreateInputDto'),
        rules: {
          packageDate: [{ required: true, message: '请选择日期', trigger: 'blur' }],
          packageTitle: [{ required: true, message: '请输入分判包描述', trigger: 'blur' }],
          costCenters: [{ required: true, message: '请选择范围', trigger: 'change' }],
          itemTypeId: [{ required: true, message: '请选择分判包类型', trigger: 'change' }],
          elementTypeId: [{ required: true, message: '请选择科目类型', trigger: 'change' }]
        }
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
      getValue (form, index) {
        const values = []
        const centers = form.costCenters ? form.costCenters : []
        centers.forEach((item, idsIndex) => {
          values.push(item.costCenterId)
        })
        return values
      }
    },
    created () {
      //分判包类型
      CostService.budgetTypeItems().then(res => {
        this.budgetTypeItems = JSON.parse(JSON.stringify(res.result.data))
        this.$forceUpdate()
      })
      //科目类型
      CostService.items().then(res => {
        this.elementItems = JSON.parse(JSON.stringify(res.result.data))
        this.$forceUpdate()
      })

      const requestParameters = Object.assign({ Id: this.ProjectGUID })
      CostService.centers(requestParameters).then(res => {
        this.costCenters = JSON.parse(JSON.stringify(res.result.data))
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
      }else{
        this.form.packageDate = moment(new Date())
      }
    },
    methods: {
      onChange (value, option) {
        this.form.costCenters = []
        option.forEach(item => {
          this.form.costCenters.push(JSON.parse(item.data.key).id)
        })
      },
      handleToSave () {
        this.$refs.form.validate(valid => {
          if(valid){
            this.form.projectGUID = this.ProjectGUID
            CostService.industryCreate(this.form).then(res => {
              if (res.result.statusCode === 200) {
                this.$message.info(this.type === 'edit' ? '修改成功' : '新增成功')
              }
            })
          }
        })

      },
      back () {
        this.$router.push({ path: `/cost/industry/list`})
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
