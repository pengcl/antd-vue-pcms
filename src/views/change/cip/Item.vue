<template>
  <page-header-wrapper>
    <a-card v-if="contract" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <a-form-item label="项目编码">
                {{ contract.projectID }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="房产项目名称(中文)">
                {{ contract.projectName }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="房产项目名称(英文)">
                {{ contract.projectEnName || '-' }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="中央合同编号">
                {{ contract.contractNo }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="本地合同编号">
                {{ contract.localContractNo }}
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="合同名称">
                {{ contract.contractName }}
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="编号"></a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="状态"> 草拟中 (1.6)</a-form-item>
            </a-col>
          </a-row>

          <a-tabs default-active-key="1" :animated="false">
            <a-tab-pane key="1" tab="基本资料">
              <base-info
                title="基本资料"
                :data="form"
                :contract="contract"
                :type="type"
                :id="id"
                ref="baseInfo"
              ></base-info>
            </a-tab-pane>
            <a-tab-pane key="2" tab="造价估算">
              <cost-estimates
                title="造价估算"
                :data="form"
                :contract="contract"
                :project="project"
                :type="type"
                :id="id"
              ></cost-estimates>
            </a-tab-pane>
            <a-tab-pane key="3" tab="预算调整">
              <budget-list title="预算调整" :data="form" :type="type" :id="id"></budget-list>
            </a-tab-pane>
            <a-tab-pane key="4" tab="附加资料">
              <attachment-data
                title="附加资料"
                :data="form"
                :contract="contract"
                :type="type"
                :id="id"
                :stage="stage"
              ></attachment-data>
            </a-tab-pane>
            <a-tab-pane key="5" tab="附件">
              <attachment-list :data="form" :type="type" :id="id"></attachment-list>
            </a-tab-pane>
            <a-tab-pane key="6" tab="流程">
              <process :data="form" :type="type" :id="id"></process>
            </a-tab-pane>
          </a-tabs>
        </a-form>
      </div>

      <div class="table-operator">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-button type="success" v-if="type != 'view'" @click="startUp">启动审批流程</a-button>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="24" :sm="24" style="margin-top: 10px">
            <a-button type="success" v-if="type != 'view'" @click="save">储存</a-button>
            <a-button type="danger" @click="back">关闭</a-button>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import BaseInfo from '@/views/change/cip/components/BaseInfo'
  import CostEstimates from '@/views/change/cip/components/CostEstimates'
  import BudgetList from '@/views/change/cip/components/BudgetList'
  import AttachmentData from '@/views/change/cip/components/AttachmentData'
  import AttachmentList from '@/views/change/cip/components/AttachmentList'
  import Process from '@/views/change/cip/components/Process'
  import { ChangeService } from '@/views/change/change.service'
  import { ProjectService } from '@/views/project/project.service'
  import { SwaggerService } from '@/api/swagger.service'

  export default {
    name: 'ChangeItem',
    components: { Process, AttachmentList, AttachmentData, BudgetList, CostEstimates, BaseInfo },
    data () {
      return {
        tabActiveKey: 1,
        loading: false,
        contract: SwaggerService.getForm('ContractOutputDto'),
        form: SwaggerService.getForm('VOAllInfoDto'),
        project: null
      }
    },
    created () {
      ChangeService.changeItem({ guid: this.contractGuid }).then((res) => {
        this.contract = res.result
        console.log('change.item.cntract', this.contract)
        ProjectService.view2(this.contract.projectID).then((res) => {
          this.project = res.result.data
        })
      })
      if (this.type !== 'add') {
        ChangeService.item(this.id).then((res) => {
          this.form = res.result.data
          console.log('change.item.data', this.form)
          if (this.form.voMasterInfo == null) {
            this.form.voMasterInfo = {}
          }
        })
      } else {
        if (this.stage === 'VO') {
          ChangeService.voItem(this.id).then((res) => {
            this.form = res.result.data
            console.log('change.item.data', this.form)
            if (this.form.voMasterInfo == null) {
              this.form.voMasterInfo = {}
            }
          })
        } else {
          this.contract.cnotractGuid = this.contractGuid
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
      contractGuid () {
        return this.$route.query.contractGuid
      },
      stage () {
        return this.$route.query.stage
      }
    },
    watch: {},
    methods: {
      approve () {
        console.log('approve')
      },
      save () {
        let isValid = true
        const validateForms = [
          {
            activeKey: 1,
            key: 'baseInfo'
          }
        ]
        validateForms.forEach((item, index) => {
          this.$refs[item.key].$refs.form.validate(valid => {
            if (!valid) {
              isValid = false
              this.tabActiveKey = item.activeKey
            }
          })
        })

        for (let i = 0; i < validateForms.length; i++) {
          const item = validateForms[i]
          this.$refs[item.key].$refs.form.validate(valid => {
            if (!valid) {
              isValid = false
              this.tabActiveKey = item.activeKey
            }
          })
          if (!isValid) {
            break
          }
        }

        /* const partyResult = this.$refs.baseInfo.getPartys()
        if (!partyResult) {
          return
        } */
        if (isValid) {
          this.form.contractNo = this.contract.contractNo
          console.log('saveData', this.form)
          if (this.type == 'add') {
            if (this.form.fileMasterId == undefined || this.form.fileMasterId == '') {
              this.form.fileMasterId = 0
            }
            this.initCreateForm()

            this.loading = true
            ChangeService.create(this.form).then((res) => {
              this.loading = false
              console.log(res)
              if (res.result.statusCode === 200) {
                this.$message.info('创建成功')
                this.$router.push({ path: `/change/pmi` })
              }
            }).catch(() => {
              this.$message.error('创建失败，表单未填写完整')
            })
          } else if (this.type == 'edit') {
            this.loading = true
            ChangeService.update(this.form).then((res) => {
              this.loading = false
              console.log(res)
              if (res.result.statusCode === 200) {
                this.$message.info('修改成功')
                this.$router.push({ path: `/change/pmi` })
              }
            }).catch(() => {
              this.$message.error('修改失败，表单未填写完整')
            })
          }
        }
      },
      startUp () {
        this.$message.warn('功能尚未实现')
      },
      back () {
        console.log('back')
        this.$router.push({ path: `/change/pmi` })
      },
      // 初始化新增cip信息的voMasterInfo对象
      initCreateForm () {
        this.form.cipid = this.form.cipid || 0
        this.form.voMasterInfo.id = 0
        this.form.voMasterInfo.isDeleted = false
        this.form.voMasterInfo.contractID = this.contract.contractGuid
        this.form.voMasterInfo.createMode = 'M'
        this.form.voMasterInfo.stage = this.stage // 为VO时则为cip转vo
        this.form.voMasterInfo.verMajor = 0
        this.form.voMasterInfo.verMinor = 0
        this.form.voMasterInfo.codeNo = 0
        this.form.voMasterInfo.codeNoIndependent = 0
        this.form.voMasterInfo.retentionAndTermsType = 0 //
        this.form.voMasterInfo.contractAmount = 0
        this.form.voMasterInfo.voAmountAccumulate = this.form.voMasterInfo.voAmountAccumulate || 0
        this.form.voMasterInfo.voAmount = this.form.voMasterInfo.voAmount || 0
        this.form.voMasterInfo.voTotalAmountDecrease = this.form.voMasterInfo.voTotalAmountDecrease || 0
        this.form.voMasterInfo.voTotalAmountIncrease = this.form.voMasterInfo.voTotalAmountIncrease || 0
      }
    }
  }
</script>
