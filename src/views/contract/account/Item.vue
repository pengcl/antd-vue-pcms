<template>
  <page-header-wrapper>
    <a-card v-if="form && project" :bordered="false">
      <a-tabs v-model="activeKey" :animated="false">
        <a-tab-pane forceRender :key="1" tab="基本资料">
          <base-info
            ref="baseInfo"
            :companies="selection.companies"
            :project="project"
            :data="form"
            :type="type"
            :id="id"/>
        </a-tab-pane>
        <a-tab-pane forceRender :key="2" tab="合同信息">
          <contract-info ref="contractInfo" :data="form" :type="type" :id="id"/>
        </a-tab-pane>
        <a-tab-pane v-if="id !== '0'" forceRender :key="3" tab="预算调整">
          <budget-list :data="form" :type="type" :id="id"/>
        </a-tab-pane>
        <a-tab-pane forceRender :key="4" tab="合同量清单">
          <contract-list
            ref="contractList"
            @validate-field="showValidate"
            :activeKey="activeKey"
            :project="project"
            :data="form"
            :type="type"
            :id="id"/>
        </a-tab-pane>
        <a-tab-pane forceRender :key="5" tab="付款条款">
          <pay-info :data="form" :type="type" :id="id"/>
        </a-tab-pane>
        <a-tab-pane forceRender :key="6" tab="附件">
          <attachment-list :data="form" :type="type" :id="id"/>
        </a-tab-pane>
        <a-tab-pane forceRender :key="7" tab="相关合同">
          <relevant-contract :data="contractBookForm" :type="type" :id="id"/>
        </a-tab-pane>
        <a-tab-pane forceRender :key="8" tab="合同变更">
          <contract-changes :data="changeForm" :type="type" :id="id"/>
        </a-tab-pane>
        <a-tab-pane forceRender :key="9" tab="付款信息">
          <payment-info :data="contractBookForm" :type="type" :id="id"/>
        </a-tab-pane>
        <a-tab-pane forceRender :key="10" tab="发票信息">
          <invoice-info :data="contractBookForm" :type="type" :id="id"/>
        </a-tab-pane>
        <a-tab-pane forceRender :key="11" tab="结算信息">
          <billing-info :data="contractBookForm" :type="type" :id="id"/>
        </a-tab-pane>
      </a-tabs>
      <a-row :gutter="48">
        <!--<a-col
          :md="24"
          :sm="24"
          style="margin-bottom: 10px">
          <a-button-group v-if="type === 'view' && form.contract.auditStatus === '未审核' && ac('VIEW')">
            <a-button :loading="loading.bpm" @click="bpm" type="success">
              启动审批流程
            </a-button>
          </a-button-group>
          <a-button-group v-if="type === 'view' && form.contract.auditStatus !== '未审核' && ac('VIEW')">
            <a-button :loading="loading.view" @click="view" type="success">
              查看审批
            </a-button>
          </a-button-group>
        </a-col>-->
        <a-col :md="24" :sm="24" style="margin-top: 10px">
          <a-button-group>
            <a-button @click="back" type="danger">
              关闭
            </a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </a-card>
    <a-modal
      v-if="dialog.visible"
      :title="dialog.title"
      :visible="dialog.visible"
      :okText="dialog.confirmText"
      :cancelText="dialog.cancelText"
      :maskClosable="false"
      @ok="dialog.confirm"
      @cancel="dialog.cancel"
    >
      <p>{{ dialog.content }}</p>
    </a-modal>
    <contract-compute-budgets
      ref="budgets"
      :visible="show"
      :contractGuid="contractGuid"
      :amount="form.contract.contractEffectAmount"
      :contract="form.contract"
      :destroyOnClose="true"
      @cancel="handleCancel()"
      @ok="handleOk()"></contract-compute-budgets>
  </page-header-wrapper>
</template>
<script>
    import BaseInfo from '@/views/contract/account/components/BaseInfo'
    import ContractInfo from '@/views/contract/account/components/ContractInfo'
    import PayInfo from '@/views/contract/account/components/PayInfo'
    import ContractList from '@/views/contract/account/components/ContractList'
    import BudgetList from '@/views/contract/account/components/BudgetList'
    import AttachmentList from '@/views/contract/account/components/AttachmentList'
    import { Base as BaseService, DIALOGCONFIG } from '@/api/base'
    import { ContractService } from '@/views/contract/contract.service'
    import { SwaggerService } from '@/api/swagger.service'
    import { ProjectService } from '@/views/project/project.service'

    import { Company as CompanyService } from '@/api/company'
    import ContractComputeBudgets from '@/views/contract/components/computeBudgets/index'
    import ContractComputeReplenishBudgets from '@/views/contract/components/computeBudgets/replenish'
    import { ac } from '@/views/user/user.service'
    import { AccountService } from './account.service'
    import RelevantContract from '@/views/contract/account/components/RelevantContract'
    import ContractChanges from '@/views/contract/account/components/ContractChanges'
    import PaymentInfo from '@/views/contract/account/components/PaymentInfo'
    import InvoiceInfo from '@/views/contract/account/components/InvoiceInfo'
    import BillingInfo from '@/views/contract/account/components/BillingInfo'
    import { ChangeService } from '../../change/change.service'

    export default {
        name: 'ContractAccountItem',
        components: {
            BillingInfo,
            InvoiceInfo,
            PaymentInfo,
            ContractChanges,
            RelevantContract,
            ContractComputeReplenishBudgets,
            ContractComputeBudgets,
            AttachmentList,
            BudgetList,
            ContractList,
            PayInfo,
            ContractInfo,
            BaseInfo
        },
        data () {
            return {
                disabled: false,
                activeKey: 1,
                loading: {
                    bpm: false,
                    save: false,
                    view: false
                },
                contractBookForm: null,
                changeForm: null,
                project: null,
                dialog: DIALOGCONFIG,
                selection: {},
                contractGuid: null,
                show: false,
                form: SwaggerService.getForm('ContractAllInfoDto'),
                contractSourceBQList: null
            }
        },
        created () {
            this.getData()
            AccountService.contractBookInfo(this.id).then(res => {
                this.contractBookForm = res.result.data
            })
            ChangeService.changeItems({ ContractGuid: this.id, SkipCount: 0, MaxResultCount: 9999 }).then(res => {
                this.changeForm = res.result.data.items
            })

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
            },
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
            getCompanies () { // 获取甲方公司待选列表
                const companies = ContractService.filterParties(18, this.form.contractPartylst)
                CompanyService.item(this.project.companyCode).then(res => {
                    const company = res.result.data
                    this.selection.companies = [company]
                    if (companies.length < 1) {
                        const party = {
                            contractID: this.id === '0' ? '' : this.id,
                            id: 0,
                            partyID: company.id,
                            partyName: company.nameCN,
                            partyGuid: '',
                            partyType: 18,
                            percentage: 0
                        }
                        this.form.contractPartylst.push(party)
                    }
                    this.$forceUpdate()
                })
            },
            showValidate (e) {
                this.$refs[e.component].$refs.form.validateField(e.filed, valid => {
                    alert(valid)
                    this.activeKey = 1
                })
            },
            showBudgets () {
                this.show = true
            },
            getData () {
                this.form = SwaggerService.getForm('ContractAllInfoDto')
                this.contractSourceBQList = JSON.parse(JSON.stringify(this.form.contractBQNewlst))
                if (this.$refs.baseInfo) {
                    this.$refs.baseInfo.tender = {}
                }
                if (this.id !== '0') {
                    ContractService.item(this.id).then(res => {
                        this.form = res.result.data
                        this.contractSourceBQList = JSON.parse(JSON.stringify(this.form.contractBQNewlst))
                        this.form.master = {}
                        this.form.contract.currencyExchangeRate = 1
                        ProjectService.view2(this.form.contract.projectID).then(res => {
                            this.project = res.result.data
                            this.getCompanies()
                        })
                    })
                } else {
                    this.form.fileMasterId = 0
                    this.form.contract.id = 0
                    this.form.contract.isDeleted = false
                    this.form.contract.currencyID = 3
                    this.form.contract.baseCurrencyID = 3
                    this.form.contract.contractAmount = 0
                    this.form.contract.contractEffectAmount = 0
                    this.form.contract.contractPSAmount = 0
                    this.form.contract.contractOPTAmount = 0
                    this.form.contract.contractPCPreAmount = 0
                    this.form.contract.contractDSAmount = 0
                    this.form.contract.subNo = 0
                    this.form.contract.serialNo = 0
                    this.form.master = {}
                    this.form.contract.currencyExchangeRate = 1
                    ProjectService.view(this.ProjectGUID).then(res => {
                        this.project = res.result.data
                        this.form.contract.projectID = this.project.projectCode
                        this.form.contract.companyID = this.project.companyCode
                        this.getCompanies()
                    })
                }
            },
            view () {
                this.loading.view = true
                BaseService.viewBpm(this.form.contract.contractGuid).then(res => {
                    this.loading.view = false
                    const _window = window.open('_blank')
                    _window.location = res.result.data
                })
            },
            bpm () {
                this.loading.bpm = true
                ContractService.bpm(this.form.contract.contractGuid, this.form.contract.projectID).then(res => {
                    this.loading.bpm = false
                    const _window = window.open('_blank')
                    _window.location = res.result.data
                    this.$router.push({ path: `/contract/list` })
                })
            },
            save () {
                let isValid = true
                const validateForms = [
                    {
                        activeKey: 1,
                        key: 'baseInfo'
                    }, {
                        activeKey: 2,
                        key: 'contractInfo'
                    }, {
                        activeKey: 4,
                        key: 'contractList'
                    }
                ]
                validateForms.forEach((item, index) => {
                    this.$refs[item.key].$refs.form.validate(valid => {
                        if (!valid) {
                            isValid = false
                            this.activeKey = item.activeKey
                        }
                    })
                })

                for (let i = 0; i < validateForms.length; i++) {
                    const item = validateForms[i]
                    this.$refs[item.key].$refs.form.validate(valid => {
                        if (!valid) {
                            isValid = false
                            this.activeKey = item.activeKey
                        }
                    })
                    if (!isValid) {
                        break
                    }
                }

                if (isValid) {
                    let items = JSON.parse(JSON.stringify(this.form.contractBQNewlst))
                    items = items.filter(item => !item.isDeleted)
                    if (items.length > 0) {
                        this.loading.save = true
                        this.disabled = true
                        ContractService[this.type](this.form).then((res, err) => {
                            this.disabled = false
                            this.loading.save = false
                            if (res.result.statusCode === 200) {
                                this.contractGuid = this.type === 'create' ? res.result.data : res.result.data.contractGuid
                                const show = this.type === 'create' ? this.form.contract.contractAmount > 0 : res.result.data.bAmountIsChangeResult
                                if (show) {
                                    this.showBudgets()
                                } else {
                                    this.$message.success('保存成功')
                                }
                            }
                        })
                    } else {
                        alert('您要在合同量清单中至少选择一条带数项！')
                        this.activeKey = 4
                    }
                }
            },
            handleChange (selectedItems) {
                this.selectedItems = selectedItems
            },
            back () {
                this.$router.push({ path: `/contract/account/list` })
            },
            handleToEdit () {
                this.$router.push({ path: `/contract/item/${this.id}?type=edit` })
            },
            handleCancel () {
                this.show = false
                this.$router.push('/contract/list')
            },
            handleOk () {
                this.$refs.budgets.$refs.form.validate(valid => {
                    if (valid) {
                        const type = this.form.contract.budgetIsConfirm ? 'update' : 'create'
                        const form = {
                            contractGuid: this.contractGuid,
                            useStore: this.$refs.budgets.queryParam.useStore,
                            budgetIsConfirm: true
                        }
                        if (this.form.contract.contractCategory === 16) {
                            if (form.useStore === 108) {
                                form.contractUsePlanlst = this.$refs.budgets.$refs.table.localDataSource
                            }
                            if (form.useStore === 109) {
                                form.contractUseSurpluslst = this.$refs.budgets.$refs.table.localDataSource
                            }
                            if (form.useStore === 110) {
                                form.contractUseGeneralTradePlanlst = this.$refs.budgets.$refs.table.localDataSource
                            }
                            ContractService[type + 'Budgets_' + this.$refs.budgets.queryParam.useStore](form).then(res => {
                                if (res.result.statusCode === 200) {
                                    this.show = false
                                    this.$message.success('确认成功')
                                    location.href = `/contract/item/${res.result.data}?type=view`
                                }
                            })
                        } else {
                            form.contractBudgetAdjustlst = this.$refs.budgets.$refs.table.localDataSource
                            ContractService[type + 'Budgets'](form).then(res => {
                                if (res.result.statusCode === 200) {
                                    this.show = false
                                    this.$message.success('确认成功')
                                    location.href = `/contract/item/${res.result.data}?type=view`
                                }
                            })
                        }
                    }
                })
            },
            review () {
                ContractService.review(this.id).then(res => {
                    if (res.result.data) {
                        this.contractGuid = this.id
                        this.showBudgets()
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
