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
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group v-if="activeKey === 3">
            <a-button @click="approve" type="success">
              预算确认
            </a-button>
          </a-button-group>
          <a-button-group>
            <a-button @click="approve" type="success">
              启动审批流程
            </a-button>
          </a-button-group>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-button-group>
            <a-button :loading="loading" :disabled="type === 'view'" @click="save" type="success">
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
  </page-header-wrapper>
</template>
<script>
import BaseInfo from '@/views/contract/components/BaseInfo'
import ContractInfo from '@/views/contract/components/ContractInfo'
import PayInfo from '@/views/contract/components/PayInfo'
import ContractList from '@/views/contract/components/ContractList'
import BudgetList from '@/views/contract/components/BudgetList'
import AttachmentList from '@/views/contract/components/AttachmentList'
import { ContractService } from '@/views/contract/contract.service'
import { SwaggerService } from '@/api/swagger.service'
import { ProjectService } from '@/views/project/project.service'
import { DIALOGCONFIG } from '@/api/base'
import { Company as CompanyService } from '@/api/company'

export default {
  name: 'ContractItem',
  components: { AttachmentList, BudgetList, ContractList, PayInfo, ContractInfo, BaseInfo },
  data () {
    return {
      disabled: true,
      activeKey: 1,
      loading: false,
      project: null,
      dialog: DIALOGCONFIG,
      selection: {},
      form: SwaggerService.getForm('ContractAllInfoDto')
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
    getTenders (ProjectGUID) {
    },
    getData () {
      this.form = SwaggerService.getForm('ContractAllInfoDto')
      if (this.id !== '0') {
        ContractService.item(this.id).then(res => {
          this.form = res.result.data
          this.form.master = {}
          this.form.contract.useStore = 2
          ProjectService.view2(this.form.contract.projectID).then(res => {
            this.project = res.result.data
            this.getTenders()
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
    approve () {
      console.log('approve')
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
        this.loading = true
        ContractService[this.type](this.form).then((res, err) => {
          this.loading = false
          if (res.result.statusCode === 200) {
            this.dialog.show({
              content: this.type === 'update' ? '修改成功' : '添加成功',
              title: '',
              confirmText: this.type === 'update' ? '继续修改' : '继续添加',
              cancelText: '返回上一页'
            }, (state) => {
              if (state) {
                if (this.type === 'create') {
                  this.getData()
                }
              } else {
                this.$router.push('/contract/list')
              }
            })
          }
        }).catch(() => {
          this.dialog.show({
            content: '创建失败，表单未填写完整',
            title: '',
            confirmText: '我知道了',
            cancelText: '返回上一页'
          }, (state) => {
            if (state) {

            } else {
            }
          })
        })
      }
    },
    handleChange (selectedItems) {
      this.selectedItems = selectedItems
    },
    back () {
      console.log('back')
      this.$router.push({ path: `/contract/list` })
    },
    handleToEdit () {
      console.log('handleToEdit')
      this.$router.push({ path: `/contract/item/${this.id}?type=edit` })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-btn-group {
  margin-right: 8px;
}
</style>
