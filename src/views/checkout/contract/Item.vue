<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="合同编号">
              <a-input v-model="form.contractNo" :disabled="true"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合同名称">
              <a-input v-model="form.contractName" :disabled="true"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="结算方">
              <a-select :disabled="true"
                        v-model="form.payeePartyName">
                <a-select-option v-for="(item,index) in partyList"
                                 :value="item.partyName"
                                 :key="index">{{item.partyName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="抄送方">
              <a-select :disabled="true"
                        mode="multiple"
                        v-model="form.ccParty">
                <a-select-option v-for="(item,index) in partyList"
                                 :value="item.partyName"
                                 :key="index">{{item.partyName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <a-tabs v-model="activeKey" :animated="false">
        <a-tab-pane forceRender :key="1" tab="合同结算">
          <contract-settlement ref="contractSettlement" :data="form" :id="id" :type="type"
                               @on-change-masterId="changeAttachmentID"></contract-settlement>
        </a-tab-pane>
        <a-tab-pane forceRender :key="2" tab="造价估算">
          <cost-estimates ref="costEstimates" :data="form" :id="id" :type="type"></cost-estimates>
        </a-tab-pane>
        <a-tab-pane forceRender :key="3" tab="预算调整" v-if="type !== 'create'">
          <budget-list :data="form" :id="id" :type="type"></budget-list>
        </a-tab-pane>
        <a-tab-pane forceRender :key="4" forceRender tab="附件">
          <attachment-list :data="form" :id="id" :type="type"></attachment-list>
        </a-tab-pane>
      </a-tabs>
      <a-row :gutter="48">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group v-if="type === 'view' && form.auditStatus === '未审核' && ac('C_EDIT')">
            <a-button @click="approve" type="success"
                      :disabled="form.balanceCertificateAuditStatus !== '已审核' && !form.useStore">
              启动审批流程
            </a-button>
          </a-button-group>
          <a-button-group v-if="type === 'view' && form.auditStatus !== '未审核'">
            <a-button @click="view" type="success">
              查看审批
            </a-button>
          </a-button-group>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-button-group v-if="type === 'view' && form.auditStatus === '未审核' && ac('C_EDIT')">
            <a-button @click="edit" type="success">
              编辑
            </a-button>
          </a-button-group>
          <a-button-group v-if="type !== 'view' && ac(type === 'create' ? 'C_ADD' : 'C_EDIT')">
            <a-button @click="save" type="success" :disabled="disabled">
              储存
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

    <compute-budgets ref="budgets"
                     :data="form"
                     :type="type"
                     :contractGuid="form.contractGID"
                     :destroyOnClose="true">
    </compute-budgets>
  </page-header-wrapper>
</template>

<script>
    import ContractSettlement from '@/views/checkout/contract/components/ContractSettlement'
    import CostEstimates from '@/views/checkout/contract/components/CostEstimates'
    import BudgetList from '@/views/checkout/contract/components/BudgetList'
    import AttachmentList from '@/views/checkout/contract/components/AttachmentList'
    import { CheckoutService } from '../checkout.service'
    import { SwaggerService } from '@/api/swagger.service'
    import { ac } from '@/views/user/user.service'
    import ComputeBudgets from './modules/ComputeBudgets'
    import { Base as BaseService } from '@/api/base'

    export default {
        name: 'Edit',
        components: { ComputeBudgets, AttachmentList, BudgetList, CostEstimates, ContractSettlement },
        data () {
            return {
                form: SwaggerService.getForm('BalanceContractDto'),
                disabled: false,
                partyList: [],
                activeKey: 1,
            }
        },
        computed: {
            id () {
                return this.$route.params.id
            },
            type () {
                return this.$route.query.type
            },
            balanceCertificateGID () {
                return this.$route.query.balanceCertificateGID
            },
        },
        created () {
            this.getData()

        },
        watch: {
            '$route' (path) {
                this.getData()
            },
        },
        methods: {
            ac (action) {
                return ac(action, this.$route)
            },
            changeAttachmentID (value) {
                this.form.attachmentID = value
            },
            getPartyList (id) {
                CheckoutService.partyList(id).then(res => {
                    this.partyList = res.result.data
                })
            },
            getData () {
                if (this.type === 'create') {
                    CheckoutService.contractCreateInitData(this.balanceCertificateGID).then(res => {
                        this.form = res.result.data
                        this.form.settlementAmount = 0
                        this.form.bqList = []
                        this.getPartyList(this.form.contractGID)
                        if (this.form.ccPartyNames) {
                            this.form.ccParty = this.form.ccPartyNames.split(',')
                        }
                    })
                } else {
                    CheckoutService.contractInfo(this.id).then(res => {
                        this.form = res.result.data
                        this.form.settlementAmount = this.form.progressBalanceAmount + this.form.contractNSCPreBalanceAmount
                        this.form.payableAmount = this.form.settlementAmount - this.form.paymentAmount
                        this.getPartyList(this.form.contractGID)
                        if (this.form.ccPartyNames) {
                            this.form.ccParty = this.form.ccPartyNames.split(',')
                        }
                        if (this.form.bqList.length > 0) {
                            this.form.bqList.forEach(item => {
                                item.costCenter = item.costCenter + ''
                            })
                        }

                    })
                }
            },
            back () {
                this.$router.push({ path: '/checkout/contract/list' })
            },
            edit () {
                this.$router.push({ path: `/checkout/contract/item/${this.id}?type=update` })
            },
            approve () {
                CheckoutService.startBPM_BalanceContract(this.id).then(res => {
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
            save () {
                this.disabled = true
                this.$refs.contractSettlement.$refs.form.validate(vaild => {
                    if (vaild) {
                        CheckoutService[this.type + 'BalanceContract'](this.form).then(res => {
                            if (res.result.data) {
                                this.$message.success(this.type === 'create' ? '创建成功' : '修改成功')
                                if (this.form.balanceAdjustAmount !== 0) {
                                    this.showBudgets(this.type === 'create' ? res.result.data : res.result.data.gid)
                                } else {
                                    this.$router.push({ path: `/checkout/contract/item/${this.type === 'create' ? res.result.data : res.result.data.gid}?type=view` })
                                }
                            } else {
                                this.disabled = false
                            }
                        })
                    } else {
                        this.disabled = false
                    }
                })

            },
            showBudgets (id) {
                this.$refs.budgets.showModal(id)
            },
            view () {
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
