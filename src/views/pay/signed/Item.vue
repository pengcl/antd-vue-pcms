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
          <a-button-group v-if="type !== 'view' && form.auditStatus === '未审核' && ac('EDIT')">
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
    import { Base as BaseService } from '@/api/base'
    import { ac } from '@/views/user/user.service'

    export default {
        name: 'Item',
        components: { PayDetail, BaseInfo },
        data () {
            return {
                baseInfo: null,
                approveStatus: false,
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
            ac (action) {
                return ac(action, this.$route)
            },
            save () {
                if (this.type === 'create') {
                    const contractList = []
                    let masterInfoDetailList = []
                    if (this.form.contractMasterInfo['detailList'].length > 0) {
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
                    }
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
                    if (this.form.contractNSCInfoList.length > 0) {
                        this.form.contractNSCInfoList.forEach(item => {
                            if (item.detailList) {
                                item.detailList.forEach(v => {
                                    v.detailContractType = '分合同'
                                    v.mainContractGID = this.id
                                    v.secondaryContractGID = item.contractGID
                                })
                            }
                            const params = {
                                contractType: '分合同',
                                mainContractGID: this.id,
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
                    }
                    contractList.push(contractMasterInfo)
                    if (contractNSCInfoList.length > 0) {
                        contractNSCInfoList.forEach(item => {
                            contractList.push(item)
                        })
                    }
                    if (this.form.billList.length > 0) {
                        this.form.billList.forEach(item => {
                            item.contractGID = this.id
                        })
                    }
                    const body = {
                        contractGID: this.id,
                        paymentPhase: this.form['paymentPhase'],
                        paymentReceiveDate: this.form['paymentReceiveDate'],
                        expenseAccountType: this.form['expenseAccountType'],
                        paymentMethod: this.form['paymentMethod'],
                        paymentContent: this.form['paymentContent'],
                        attachmentID: this.form['masterID'],
                        contractList: contractList,
                        billList: this.form.billList
                    }
                    SignedService.create(body).then(res => {
                        if (res.result.data) {
                            this.$message.success('创建成功')
                            if (this.approveStatus) {
                                SignedService.approve(res.result.data).then(_res => {
                                    if (_res.result.data) {
                                        this.$message.success('已启动审批流程')
                                        const tempwindow = window.open('_blank')
                                        tempwindow.location = _res.result.data
                                        this.$router.push({
                                            path: '/pay/signed/list'
                                        })
                                    }
                                })
                            } else {
                                this.$router.push({
                                    path: '/pay/signed/list'
                                })
                            }
                        }
                    })
                } else {
                    if (this.form.contractNSCInfoList.length > 0) {
                        this.form.contractNSCInfoList.forEach(item => {
                            if (item.detailList) {
                                item.detailList.forEach(v => {
                                    v.mainContractGID = this.form.contractGID
                                    v.secondaryContractGID = item.contractGID
                                })
                            }
                        })
                    }
                    if (this.form.billList.length > 0) {
                        this.form.billList.forEach(item => {
                            item.contractGID = this.form.contractGID
                            item.paymentGID = this.id
                        })
                    }
                    SignedService.update(this.form).then(res => {
                        if (res.result.data) {
                            this.$message.success('修改成功')
                            if (this.approveStatus) {
                                SignedService.approve(this.id).then(_res => {
                                    if (_res.result.data) {
                                        this.$message.success('已启动审批流程')
                                        const tempwindow = window.open('_blank')
                                        tempwindow.location = _res.result.data
                                        this.$router.push({
                                            path: '/pay/signed/list'
                                        })
                                    }
                                })
                            } else {
                                this.$router.push({
                                    path: '/pay/signed/list'
                                })
                            }
                        }
                    })
                }
            },
            back () {
                this.$router.push({
                    path: '/pay/signed/list'
                })
            },
            approve () {
                this.approveStatus = true
                this.save()
            },
            view () {
                BaseService.viewBpm(this.id).then(res => {
                    const tempwindow = window.open('_blank')
                    tempwindow.location = res.result.data
                })
            },
        }

    }
</script>

<style lang="less" scoped>
  .ant-btn-group {
    margin-right: 8px;
  }
</style>