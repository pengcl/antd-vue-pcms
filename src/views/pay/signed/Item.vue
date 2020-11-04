<template>
  <page-header-wrapper :title="type === 'view' ? '查看合同付款' : type === 'update' ? '编辑合同付款' : '新增合同付款'">
    <a-card :bordered="false">
      <a-tabs default-active-key="1" :animated="false">
        <a-tab-pane key="1" tab="基本资料">
          <base-info :data="form" :type="type" :id="id"></base-info>
        </a-tab-pane>
        <a-tab-pane key="2" tab="进度款支付明细表">
          <pay-detail :data="form" :type="type" :id="id"></pay-detail>
        </a-tab-pane>
      </a-tabs>

      <a-row :gutter="48">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group>
            <a-button :disabled="type === 'view'" @click="approve()" type="success">
              启动审批流程
            </a-button>
          </a-button-group>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-button-group v-if="type !== 'view'">
            <a-button @click="save" type="success">
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
    import BaseInfo from '@/views/pay/signed/components/BaseInfo'
    import PayDetail from './components/PayDetail'
    import { SwaggerService } from '@/api/swagger.service'
    import { SignedService } from './signed.service'

    export default {
        name: 'Item',
        components: { PayDetail, BaseInfo },
        data () {
            return {
                baseInfo: null,
                form: SwaggerService.getForm('PaymentViewDto')
            }
        },
        computed: {
            id () {
                return this.$route.params.id
            },
            type () {
                return this.$route.query.type
            }
        },
        created () {
            if (this.type === 'view') {
                SignedService.viewInfo(this.id).then(res => {
                    this.form = res.result.data
                    SignedService.masterID(this.id).then(_res => {
                        this.form.masterID = _res.result.data
                    })
                })
            } else if (this.type === 'update') {
                SignedService.updateInfo(this.id).then(res => {
                    this.form = res.result.data
                    SignedService.masterID(this.id).then(_res => {
                        this.form.masterID = _res.result.data
                    })
                })
            } else {
                SignedService.getCreateData(this.id).then(res => {
                    this.form = res.result.data
                    this.form.masterID = 0
                    this.form.contractMasterInfo.detailList = []
                    this.form.billList = []
                })
            }

        },
        methods: {
            save () {
                if (this.type === 'create') {
                    const contractList = []
                    let masterInfoDetailList = []
                    this.form.contractMasterInfo['detailList'].forEach(item => {
                            const params = {
                                detailContractType: '主合同',
                                mainContractGID: this.form.contractMasterInfo['contractGID'],
                                secondaryContractGID: this.form.contractMasterInfo['contractGID'],
                                paymentType: item.paymentType,
                                paymentAmount: item.paymentAmount,
                                paymentUse: item.paymentUse,
                                vendorGID: item.vendorGID,
                                vendorName: item.vendorName,
                                vendorBankGID: item.vendorBankGID,
                                vendorBankName: item.vendorBankName,
                                vendorBankAccounts: item.vendorBankAccounts
                            }
                            masterInfoDetailList.push(params)
                        }
                    )
                    const contractMasterInfo = {
                        contractType: '主合同',
                        mainContractGID: this.form.contractMasterInfo['contractGID'],
                        secondaryContractGID: this.form.contractMasterInfo['contractGID'],
                        paymentRequestAmount: this.form.contractMasterInfo['paymentRequestAmount'],
                        progressSendDate: this.form.contractMasterInfo['progressSendDate'],
                        progressRequestAmount: this.form.contractMasterInfo['progressRequestAmount'],
                        progressConfirmDate: this.form.contractMasterInfo['progressConfirmDate'],
                        progressValuationDate: this.form.contractMasterInfo['progressValuationDate'],
                        progressApproveDate: this.form.contractMasterInfo['progressApproveDate'],
                        paymentBusinessType: this.form.contractMasterInfo['paymentBusinessType'],
                        detailList: masterInfoDetailList
                    }
                    let contractNSCInfoList = []
                    this.form.contractNSCInfoList.forEach(item => {
                        item.detailList.forEach(v => {
                            v.detailContractType = '分合同'
                            v.mainContractGID = item.contractGID
                            v.secondaryContractGID = item.contractGID
                        })
                        const params = {
                            contractType: '分合同',
                            mainContractGID: item.contractGID,
                            secondaryContractGID: item.contractGID,
                            paymentRequestAmount: item.paymentRequestAmount,
                            progressSendDate: item.progressSendDate,
                            progressRequestAmount: item.progressRequestAmount,
                            progressConfirmDate: item.progressConfirmDate,
                            progressValuationDate: item.progressValuationDate,
                            progressApproveDate: item.progressApproveDate,
                            paymentBusinessType: item.paymentBusinessType,
                            detailList: item.detailList
                        }
                        contractNSCInfoList.push(params)
                    })
                    contractList.push(contractMasterInfo)
                    contractNSCInfoList.forEach(item => {
                        contractList.push(item)
                    })
                    this.form.billList.forEach(item => {
                        item.contractGID = this.id
                    })
                    const body = {
                        contractGID: this.id,
                        paymentPhase: this.form['paymentPhase'],
                        paymentReceiveDate: this.form['paymentReceiveDate'],
                        expenseAccountType: this.form['expenseAccountType'],
                        paymentContent: this.form['paymentContent'],
                        attachmentID: this.form['masterID'],
                        contractList: contractList,
                        billList: this.form.billList
                    }
                    SignedService.create(body).then(res => {
                        console.log(res)
                    })
                } else {

                }
            },
            back () {
                this.$router.push({
                    path: '/pay/signed/list'
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