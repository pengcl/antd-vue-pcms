<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="分判包编号">
              <a-input :disabled="type!='view'" v-model="form.tradePackageCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="日期">
              <a-date-picker
                v-model="form.packageDate"></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="分判包描述">
              <a-input
                v-model="form.packageTitle"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="范围">
              <a-select
                mode="tags"
                size="default"
                placeholder="请选择"
                @change="onChange"
              >
                <a-select-option v-for="option in costCenters" :key="JSON.stringify(option)" :value="option.costCenterGUID">
                  {{ option.costCenterName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="分判包类型">
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
              <a-input :disabled="type!='view'" placeholder="汇总明细项金额"></a-input>
            </a-form-item>
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
      </a-form>
      <a-row>
        <a-col :md="12" :sm="24">
          <a-button type="success" style="margin-right: 20px">启动审批流程</a-button>

        </a-col>
        <a-col :md="12" :sm="24">
          <a-button-group style="float: right">
            <a-button type="success" @click="handleToSave">储存</a-button>
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
    import { getRoleList } from '@/api/manage'
    import { ProjectService } from '@/views/project/project.service'
    import { formatList } from '@/mock/util'
    import { compare } from '@/utils/util'

    export default {
        name: 'Edit',
        data () {
          return {
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
        created () {
          const requestParameters = Object.assign({ Id: this.ProjectGUID })
          CostService.centers(requestParameters).then(res => {
            this.costCenters = JSON.parse(JSON.stringify(res.result.data))
            this.$forceUpdate()
          })
          CostService.budgetTypeItems().then(res => {
            this.budgetTypeItems = JSON.parse(JSON.stringify(res.result.data))
            this.$forceUpdate()
          })
          if(type!=='view'){
            CostService.industryItem(this.id).then(res => {
               this.form = res.result.data
            })
          }
        },
        methods: {
          onChange (value, option) {
            this.form.costCenters = []
            option.forEach(item => {
              // const obj = {}
              // obj['costCenterId'] = JSON.parse(item.data.key).id
              // obj['costCenterCode'] = JSON.parse(item.data.key).costCenterCode
              // obj['costCenterName'] = JSON.parse(item.data.key).costCenterName
              this.form.costCenters.push(JSON.parse(item.data.key).id)
            })
          },
          handleToSave () {
            // console.log(this.form)
            this.form.projectGUID = this.ProjectGUID
            CostService.createIndustry(this.form).then(res => {
              if (res.result.statusCode === 200) {
                this.$message.info('修改成功')
              }
            })
          },
          back () {
            this.$router.push({ path: `/cost/industry/list?Id=${this.ProjectGUID}`})
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
