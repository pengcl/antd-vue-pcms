<template>
  <page-header-wrapper>
    <a-card v-if="form && project" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }">
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <a-form-item label="项目编码">
                {{ project.projectCode }}
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="房产项目名称(中)">
                {{ project.projectName }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="中央合同编号">
                {{ form.contract.contractNo }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="合同名称">
                {{ form.contract.contractName }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="审批状态">
                {{ form.contract.auditStatus }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="预算确认">
                {{ form.contract.budgetIsConfirm ? '确认' : '未确认' }}
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

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
      </a-tabs>
      <a-row :gutter="48">
        <a-col v-if="type === 'update' && form.contract.auditStatus === '未审核'" :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group>
            <a-button :loading="loading.bpm" @click="bpm" type="success">
              启动审批流程
            </a-button>
          </a-button-group>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-button-group v-if="type === 'view' && form.contract.auditStatus !== '未审核'">
            <a-button :loading="loading.view" @click="view" type="success">
              查看审批
            </a-button>
          </a-button-group>
          <a-button-group>
            <a-button :loading="loading.save" v-if="type !== 'view'" @click="save()" type="success">
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
    <a-modal
      v-if="dialog.visible"
      :title="dialog.title"
      :visible="dialog.visible"
      :okText="dialog.confirmText"
      :cancelText="dialog.cancelText"
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
      :destroyOnClose="true"
      @cancel="handleCancel()"
      @ok="handleOk()"></contract-compute-budgets>
  </page-header-wrapper>
</template>
<script>
  import BaseInfo from '@/views/contract/components/BaseInfo'
  import ContractInfo from '@/views/contract/components/ContractInfo'
  import PayInfo from '@/views/contract/components/PayInfo'
  import ContractList from '@/views/contract/components/ContractList'
  import BudgetList from '@/views/contract/components/BudgetList'
  import AttachmentList from '@/views/contract/components/AttachmentList'
  import { Base as BaseService, DIALOGCONFIG } from '@/api/base'
  import { ContractService } from '@/views/contract/contract.service'
  import { SwaggerService } from '@/api/swagger.service'
  import { ProjectService } from '@/views/project/project.service'

  import { Company as CompanyService } from '@/api/company'
  import ContractComputeBudgets from '@/views/contract/components/computeBudgets/index'

  export default {
    name: 'ContractItem',
    components: { ContractComputeBudgets, AttachmentList, BudgetList, ContractList, PayInfo, ContractInfo, BaseInfo },
    data () {
      return {
        isBpm: false,
        disabled: true,
        activeKey: 1,
        loading: {
          bpm: false,
          save: false,
          view: false
        },
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
    watch: {},
    methods: {
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
      showBudgets (items, sourceItems) {
        /* const keys = []
        items.sort((a, b) => {
          return compare(b.srNo, a.srNo)
        })
        sourceItems.sort((a, b) => {
          return compare(b.srNo, a.srNo)
        })
        if (items.length !== sourceItems.length) {
          this.show = true
        } else {
          items.forEach((item, index) => {
            for (const key in item) {
              console.log(key)
            }
          })
        } */
        this.show = true
      },
      getData () {
        this.form = SwaggerService.getForm('ContractAllInfoDto')
        this.contractSourceBQList = JSON.parse(JSON.stringify(this.form.contractBQlst))
        if (this.$refs.baseInfo) {
          this.$refs.baseInfo.tender = {}
        }
        if (this.id !== '0') {
          ContractService.item(this.id).then(res => {
            this.form = res.result.data
            this.contractSourceBQList = JSON.parse(JSON.stringify(this.form.contractBQlst))
            this.form.master = {}
            this.form.contract.useStore = 2
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
          this.form.contract.subNo = 0
          this.form.contract.serialNo = 0
          this.form.master = {}
          this.form.contract.useStore = 2
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
          window.location.href = res.result.data
        })
      },
      bpm () {
        this.save(true)
        /* this.loading.bpm = true
        ContractService.bpm(this.form.contract.contractGuid, this.form.contract.projectID).then(res => {
          this.loading.bpm = false
          window.location.href = res.result.data
        }) */
      },
      save (isBpm) {
        if (isBpm) {
          this.isBpm = true
        } else {
          this.isBpm = false
        }
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
          let items = JSON.parse(JSON.stringify(this.form.contractBQlst))
          items = items.filter(item => item.isCarryData && !item.isDeleted)
          let sourceItems = JSON.parse(JSON.stringify(this.contractSourceBQList))
          sourceItems = sourceItems.filter(item => item.isCarryData && !item.isDeleted)
          if (items.length > 0) {
            this.loading.save = true
            ContractService[this.type](this.form).then((res, err) => {
              this.loading.save = false
              if (res.result.statusCode === 200) {
                this.contractGuid = res.result.data
                if (this.form.contract.contractAmount > 0) {
                  this.showBudgets(items, sourceItems)
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
        this.$router.push({ path: `/contract/list` })
      },
      handleToEdit () {
        this.$router.push({ path: `/contract/item/${this.id}?type=edit` })
      },
      handleCancel () {
        this.show = false
      },
      handleOk () {
        this.$refs.budgets.$refs.form.validate(valid => {
          if (valid) {
            const form = {
              contractGuid: this.contractGuid,
              useStore: this.$refs.budgets.useStore,
              budgetIsConfirm: true,
              contractBudgetAdjustlst: this.$refs.budgets.$refs.table.localDataSource
            }
            const type = this.form.contract.budgetIsConfirm ? 'update' : 'create'
            ContractService[type + 'Budgets'](form).then(res => {
              if (res.result.statusCode === 200) {
                if (this.isBpm) {
                  this.loading.bpm = true
                  ContractService.bpm(this.form.contract.contractGuid, this.form.contract.projectID).then(res => {
                    this.loading.bpm = false
                    window.location.href = res.result.data
                  })
                } else {
                  this.$message.success('保存成功')
                  this.$router.push('/contract/list')
                }
              }
            })
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
