<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form-model ref="form" :model="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-model-item label="承建商申报金额" prop="progressRequestAmount">
              <a-input-number v-model="form.progressRequestAmount"
                              :disabled="type === 'view'"
                              :min="0"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :precision="2"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="承建商申报日期" prop="progressSendDate">
              <a-date-picker style="width: 100%"
                             v-model="form.progressSendDate"
                             :disabled="type === 'view'"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="顾问公司/PQS初审金额" prop="approvalRequestAmount">
              <a-input-number v-model="form.approvalRequestAmount"
                              :disabled="type === 'view'"
                              :min="0"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :precision="2"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="顾问公司/PQS初审日期" prop="approvalRequestDate">
              <a-date-picker style="width: 100%"
                             v-model="form.approvalRequestDate"
                             :disabled="type === 'view'"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="申请结算金额" prop="progressBalanceAmount">
              <a-input-number v-model="form.progressBalanceAmount"
                              :disabled="true"
                              :min="0"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :precision="2"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="申请结算日期" prop="progressBalanceDate">
              <a-date-picker style="width: 100%"
                             v-model="form.progressBalanceDate"
                             :disabled="type === 'view'"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="结算书编号">
              <a-input v-model="form.balanceDocNo"
                       :disabled="type === 'view'"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="最后竣工日期" prop="finalCompletionDate">
              <a-date-picker style="width: 100%"
                             v-model="form.finalCompletionDate"
                             :disabled="type === 'view'"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="保修比列">
              <a-input-number v-model="form.guaranteeRatio"
                              :disabled="type === 'view'"
                              :min="0"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :precision="2"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="保修金额">
              <a-input-number v-model="form.guaranteeAmount"
                              :disabled="type === 'view'"
                              :min="0"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :precision="2"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="保修日期">
              <a-date-picker style="width: 100%"
                             v-model="form.guaranteeDate"
                             :disabled="type === 'view'"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="结算方式" prop="balanceType">
              <a-select v-model="form.balanceType"
                        :disabled="type === 'view'">
                <a-select-option :value="'阶段结算'">阶段结算</a-select-option>
                <a-select-option :value="'最终结算'">最终结算</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="经办人">
              <a-input v-model="form.operator"
                       :disabled="true"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="经办部门" prop="operatorDept">
              <a-select v-model="form.operatorDept"
                        :disabled="type === 'view'">
                <a-select-option v-for="(item,index) in departmentList"
                                 :value="item.departmentName"
                                 :key="index">{{item.departmentName}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="合同金额">
              <a-input-number v-model="form.contractAmount"
                              :disabled="true"
                              :min="0"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :precision="2"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="有效签约金额">
              <a-input-number v-model="form.contractEffectAmount"
                              :disabled="true"
                              :min="0"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :precision="2"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="专业分包（预计）结算金额">
              <a-input-number v-model="form.contractNSCPreBalanceAmount"
                              :disabled="true"
                              :min="0"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :precision="2"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="结算金额">
              <a-input-number v-model="form.settlementAmount"
                              :disabled="true"
                              :min="0"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :precision="2"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="累计进度款">
              <a-input-number v-model="form.paymentAmount"
                              :disabled="true"
                              :min="0"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :precision="2"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="应付进度余款">
              <a-input-number v-model="form.payableAmount"
                              :disabled="true"
                              :min="0"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :precision="2"></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-col :md="24" :sm="24">
          <a-form-model-item label="结算调整" prop="balanceAdjustAmount">
            <a-input-number v-model="form.balanceAdjustAmount"
                            :disabled="true"
                            :min="0"
                            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :precision="2"></a-input-number>
          </a-form-model-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-model-item label="扣款是否已处理" prop="isDealWithCutPayment">
            <a-select v-model="form.isDealWithCutPayment" :disabled="type === 'view'">
              <a-select-option :value="'是'">是</a-select-option>
              <a-select-option :value="'否'">否</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-model-item label="申报文件">
            <a :href="file.url" v-show="file.url" target="_blank">{{file.name}}</a>
          </a-form-model-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-model-item label="备注说明">
            <a-textarea v-model="form.remark"
                        :disabled="type === 'view'"></a-textarea>
          </a-form-model-item>
        </a-col>
      </a-form-model>
      <a-row :gutter="48">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group v-if="type === 'view' && form.auditStatus === '未审核' && ac('EDIT')">
            <a-button @click="approve" type="success" :disabled="bContractAuditStatus !== '已审核'">
              启动审批流程
            </a-button>
          </a-button-group>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-button-group v-if="type === 'view' && form.auditStatus !== '未审核' && ac('VIEW')">
            <a-button @click="view" type="success">
              查看审批
            </a-button>
          </a-button-group>
          <a-button-group>
            <a-button @click="back" type="danger">
              关闭
            </a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import { CheckoutService } from '../checkout.service'
    import { SwaggerService } from '@/api/swagger.service'
    import { Base as BaseService } from '@/api/base'
    import { ac } from '@/views/user/user.service'

    export default {
        name: 'CheckoutProjectList',
        data () {
            return {
                form: SwaggerService.getForm('BalanceProjectDto'),
                file: {
                    name: '',
                    id: '',
                    url: '',
                },
                departmentList:[]
            }
        },
        computed: {
            id () {
                return this.$route.params.id
            },
            type () {
                return this.$route.query.type
            },
            bContractAuditStatus () {
                return this.$route.query.bContractAuditStatus
            }
        },
        created () {
            CheckoutService.projectInfo(this.id).then(res => {
                this.form = res.result.data
                this.form.settlementAmount = this.form.progressBalanceAmount + this.form.contractNSCPreBalanceAmount
                this.form.payableAmount = this.form.settlementAmount - this.form.paymentAmount
            })
            BaseService.departmentList().then(res => {
                this.departmentList = res.result.data
            })
        },
        methods: {
            ac (action) {
                return ac(action, this.$route)
            },
            approve(){
                CheckoutService.startBPM_BalanceProject(this.id).then(res => {
                    if (res.result.data) {
                        this.$message.success('已启动审批流程')
                        const tempwindow = window.open('_blank')
                        tempwindow.location = res.result.data
                        this.$router.push({
                            path: '/checkout/contract/list'
                        })
                    }
                })
            },
            back () {
                this.$router.push({ path: '/checkout/contract/list' })
            },
            view(){
                BaseService.viewBpm(this.id).then(res => {
                    const tempwindow = window.open('_blank')
                    tempwindow.location = res.result.data
                })
            }
        }
    }
</script>

<style lang="less" scoped>
  .ant-btn-group {
    margin-right: 8px;
  }
</style>