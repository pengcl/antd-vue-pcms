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
                        v-model="form.ccPartyNames">
                <a-select-option v-for="(item,index) in partyList"
                                 :value="item.partyName"
                                 :key="index">{{item.partyName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <a-tabs default-active-key="1" :animated="false">
        <a-tab-pane key="1" tab="合同结算">
          <contract-settlement :data="form" :id="id" :type="type"
                               @on-change-masterId="changeAttachmentID"></contract-settlement>
        </a-tab-pane>
        <a-tab-pane key="2" tab="造价估算">
          <cost-estimates :data="form" :id="id" :type="type"></cost-estimates>
        </a-tab-pane>
        <a-tab-pane key="3" tab="预算调整">
          <budget-list></budget-list>
        </a-tab-pane>
        <a-tab-pane key="4" tab="附件">
          <attachment-list></attachment-list>
        </a-tab-pane>
      </a-tabs>
      <a-row :gutter="48">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group v-if="type === 'view' && form.auditStatus === '未审核' && ac('EDIT')">
            <a-button @click="approve" type="success">
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
          <a-button-group v-if="type !== 'view' && ac(type === 'create' ? 'ADD' : 'EDIT')">
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

    export default {
        name: 'Edit',
        components: { AttachmentList, BudgetList, CostEstimates, ContractSettlement },
        data () {
            return {
                form: SwaggerService.getForm('BalanceContractDto'),
                disabled: false,
                partyList: []
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
            }
        },
        created () {
            this.getData()

        },
        watch: {
            '$route' (path) {
                this.getData()
            }
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
                        this.form.bqList = []
                        this.getPartyList(this.form.contractGID)
                        if (this.form.ccPartyNames) {
                            this.form.ccPartyNames = this.form.ccPartyNames.split(',')
                        }
                    })
                } else {
                    CheckoutService.contractInfo(this.id).then(res => {
                        this.form = res.result.data
                        this.getPartyList(this.form.contractGID)
                        if (this.form.ccPartyNames) {
                            this.form.ccPartyNames = this.form.ccPartyNames.split(',')
                        }
                    })
                }
            },
            back () {
                this.$router.push({ path: '/checkout/contract/list' })
            },
            approve () {

            },
            save () {
                CheckoutService[this.type + 'BalanceContract'](this.form).then(res => {
                    if (res.result.data) {
                        this.$message.success(this.type === 'create' ? '保存成功' : '修改成功')
                        if (this.type === 'create') {
                            this.$router.push({ path: `/checkout/contract/item/${res.result.data}?type=view` })
                        } else {
                            this.$router.push({ path: '/checkout/contract/list' })
                        }

                    }
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
