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
              <a-form-item label="状态"> {{form.voMasterInfo.auditStatus}}</a-form-item>
            </a-col>
          </a-row>

          <a-tabs v-model="tabActiveKey" :animated="false" @change="handleTabChange">
            <a-tab-pane :key="1" tab="基本资料">
              <base-info
                title="基本资料"
                :data="form"
                :contract="contract"
                :type="type"
                :id="id"
                :stage="stage"
                ref="baseInfo"
              ></base-info>
            </a-tab-pane>
            <a-tab-pane :key="2" tab="造价估算" forceRender v-if="form.voMasterInfo.cipType !== 129">
              <cost-estimates
                title="造价估算"
                :data="form"
                :contract="contract"
                v-if="contract.contractGuid && project "
                :project="project"
                :type="type"
                :id="id"
                :stage="stage"
                ref="costEstimates"
              ></cost-estimates>
            </a-tab-pane>
            <a-tab-pane v-if="type !== 'add' && form.voMasterInfo.cipType !== 129" :key="3" tab="预算调整"  >
              <budget-list title="预算调整" :data="form" :contract="contract" :type="type" :id="id" :stage="stage"></budget-list>
            </a-tab-pane>
            <a-tab-pane :key="4" tab="附加资料" >
              <attachment-data
                title="附加资料"
                :data="form"
                :contract="contract"
                :type="type"
                :id="id"
                :stage="stage"
              ></attachment-data>
            </a-tab-pane>
            <a-tab-pane :key="5" tab="附件" >
              <attachment-list :data="form" :type="type" :id="id" :stage="stage"></attachment-list>
            </a-tab-pane>
            <!-- <a-tab-pane :key="6" tab="流程" >
              <process :data="form" :type="type" :id="id"></process>
            </a-tab-pane> -->
          </a-tabs>
        </a-form>
      </div>

      <div class="table-operator" style="margin-top:8px;">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-button type="success" :loading="loading.startBPM" v-if="type === 'view' && form.voMasterInfo.createMode !== 'C' && form.voMasterInfo.auditStatus === '未审核'  && ac('EDIT')" @click="startBPM">启动审批流程</a-button>
            <a-button type="success" :loading="loading.showBPM" v-if="type === 'view' && (form.voMasterInfo.auditStatus === '已审核' || form.voMasterInfo.auditStatus === '审核中') && ac('VIEW')" @click="showBPM">查看审批流程</a-button>

            <a-button type="success" :loading="loading.createPMI" v-if="type === 'view' && stage === 'CIP' && form.voMasterInfo.auditStatus === '已审核' && !pmiUrl && ac('ADD')" @click="createPMI">生成项目指令</a-button>
            <a-button type="success" :loading="loading.showPMI" v-if="type === 'view' && stage === 'CIP'  && pmiUrl  && ac('VIEW')" @click="showPMI">查看项目指令</a-button>

            <a-button type="success" :loading="loading.startCBPM" v-if="type === 'view' && form.voMasterInfo.createMode === 'C' && form.voMasterInfo.auditStatus === '未审核'  && ac('OneClickAudit')" @click="startCBPM">审核通过</a-button>
            <a-button type="danger" :loading="loading.cancelCBPM" v-if="type === 'view' && (form.voMasterInfo.auditStatus === '已审核' ) && form.voMasterInfo.createMode === 'C' && ac('OneClickUnAudit')" @click="cancelCBPM">取消审核</a-button>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="24" :sm="24" style="margin-top: 10px">
            <a-button type="success" :loading="loading.save" v-if="type === 'view' &&form.voMasterInfo.auditStatus === '未审核' && ac('EDIT')" @click="$router.push({ path: `/change/${stage.toLowerCase()}/item/${id}?type=edit&contractGuid=${contractGuid}&stage=${stage}` })">编辑</a-button>
            <a-button type="success" :loading="loading.save" v-if="type !== 'view' && ac(type === 'add' ? 'ADD' : 'EDIT')" @click="save()" >储存</a-button>
            <a-button type="danger" :loading="loading.cancel" v-if="type === 'view' && form.voMasterInfo.auditStatus === '未审核' && ac('DELETE')" @click="cancel">废弃</a-button>
            <a-button type="danger" @click="back">关闭</a-button>
          </a-col>
        </a-row>
      </div>
    </a-card>

    <compute-budgets-modal
      ref="budgets"
      :data="form"
      :contractGuid="contractGuid"
      :stage="stage"
      :destroyOnClose="true"
    ></compute-budgets-modal>
  </page-header-wrapper>
</template>

<script>
  import BaseInfo from '@/views/change/cip/components/BaseInfo'
  import CostEstimates from '@/views/change/cip/components/CostEstimates'
  import BudgetList from '@/views/change/cip/components/BudgetList'
  import AttachmentData from '@/views/change/cip/components/AttachmentData'
  import AttachmentList from '@/views/change/cip/components/AttachmentList'
  import ComputeBudgetsModal from '@/views/change/cip/components/modal/ComputeBudgetsModal'
  import { ChangeService } from '@/views/change/change.service'
  import { ProjectService } from '@/views/project/project.service'
  import { SwaggerService } from '@/api/swagger.service'
  import { Base as BaseService, DIALOGCONFIG } from '@/api/base'
  import { ac } from '@/views/user/user.service'

  export default {
    name: 'ChangeItem',
    components: {  AttachmentList, AttachmentData, BudgetList, CostEstimates, BaseInfo,ComputeBudgetsModal },
    data () {
      return {
        tabActiveKey: 1,
        preActiveKey : 1,
        pmiUrl : '',
        loading: {
          startBPM : false,
          save : false,
          cancel : false,
          showBPM : false,
          createPMI : false,
          showPMI : false,
          startCBPM : false,
          cancelCBPM : false,
        },
        disabled:false,
        contract: SwaggerService.getForm('ContractOutputDto'),
        form: SwaggerService.getForm('VOAllInfoDto'),
        project: null,
      }
    },
    created () {
      ChangeService.changeItem({ guid: this.contractGuid }).then((res) => {
        this.contract = res.result
        console.log('change.item.cntract', this.contract)
        ProjectService.view2(this.contract.projectID).then((res) => {
          this.project = res.result.data
          console.log('change.project',this.project)
        })
      })
      if (this.type !== 'add') {
        ChangeService.item(this.id).then((res) => {
          this.form = res.result.data
          console.log('change.item.data', this.form)
        })
        if(this.stage === 'CIP' && this.type === 'view'){
          ChangeService.viewPMI(this.id).then(res => {
            if(res.result.data){
              this.pmiUrl = res.result.data
            }
          })
        }
      } else {
        if (this.stage === 'VO') {
          ChangeService.voItem(this.id).then((res) => {
            this.form = res.result.data
            console.log('change.item.data', this.form)
          })
        } else {
          this.contract.cnotractGuid = this.contractGuid
          this.initCreateForm()
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
    methods: {
      ac (action) {
        return ac(action, this.$route)
      },
      approve () {
        console.log('approve')
      },
      save (callback) {
        this.loading.save = true
        let isValid = true
        const validateForms = [
          {
            activeKey: 1,
            key: 'baseInfo'
          }
        ]
        if( this.form.voMasterInfo.cipType != 129){
          validateForms.push( {
            activeKey: 2,
            key: 'costEstimates'
          })
        }
        for (let i = 0; i < validateForms.length; i++) {
          const item = validateForms[i]
          console.log('refs',this.$refs[item.key],item.key,this.$refs)
          this.$refs[item.key].$refs.form.validate(valid => {
            if (!valid) {
              this.disabled = false
              isValid = false
              this.tabActiveKey = item.activeKey
            }
          })
          if (!isValid) {
            break
          }
        }
        if(!this.checkBqList()){
          this.tabActiveKey = 2
          this.loading.save = false
          return
        }
        if(!this.$refs.baseInfo.getPartys()){
          this.loading.save = false
          return
        }
        if (isValid) {
          this.form.contractNo = this.contract.contractNo
          console.log('saveData', this.form)
          if (this.type == 'add') {
            this.form.voMasterInfo.stage = this.stage // 为VO时则为cip转vo
            if (this.form.fileMasterId == undefined || this.form.fileMasterId == '') {
              this.form.fileMasterId = 0
            }
            // if(this.form.voMasterInfo.cipType == undefined || this.form.voMasterInfo.cipType == ''){
            //   this.form.voMasterInfo.cipType = 0
            // }
            if( this.form.voMasterInfo.cipType === 129){
              this.form.vobqNewlst = []
            }
            this.loading.save = true
            ChangeService.create(this.form).then((res) => {
              this.loading.save = false
              if (res.result.statusCode === 200) {
                this.$message.success('创建成功')
                this.form.voMasterInfo.voGuid = res.result.data
                this.showBudgets(true)
              }
            }).catch((e) => {
              console.log('e',e)
              this.loading.save = false
              this.$message.error('创建失败，表单未填写完整')
            })
          } else if (this.type == 'edit') {
            this.loading.save = true
            ChangeService.update(this.form).then((res) => {
              this.loading.save = false
              console.log(res)
              if (res.result.statusCode === 200) {
                 if(callback == undefined){
                  this.$message.success('修改成功')
                  this.showBudgets(res.result.data.bAmountIsChangeResult)
                 }else{
                   callback()
                 }
              }
            }).catch((e) => {
              console.log('error',e)
              this.loading.save = false
              this.$message.error('修改失败，表单未填写完整')
              if(callback !== undefined){
                this.loading.startBPM = false
              }
            })
          }
        }else{
          this.loading.save = false
        }
      },
      startBPM () {
        this.loading.startBPM = true
        if(!this.form.voMasterInfo.budgetIsConfirm && this.form.vobqNewlst.length > 0){
          this.$message.warn('未确认预算，无法发起审批流程')
          this.loading.startBPM= false
          return
        }
        const that = this
        // this.save(innerStartBPM)
        innerStartBPM()
        function innerStartBPM(){
          ChangeService.startBMP({ guid : that.form.voMasterInfo.voGuid, sProjectCode : that.project.projectCode}).then(res => {
            if(res.result.statusCode === 200){
              window.open(res.result.data)
              // window.location.reload()
              that.loading.startBPM = false
              that.back()
            }
          }).catch(() =>{
            that.loading.startBPM = false
          })
        }
      },
      showBPM(){
        this.loading.showBPM = true
        let action = 'viewBpm'
        if(this.form.voMasterInfo.createMode === 'C'){
          action = 'viewCostBpm'
        }
        BaseService[action](this.form.voMasterInfo.voGuid).then(res => {
          this.loading.showBPM= false
          window.open(res.result.data)
        })
      },
      back () {
        this.$router.push({ path: `/change/cip/list` })
      },
      // 初始化新增cip信息的voMasterInfo对象
      initCreateForm () {
        this.form.cipid = this.form.cipid || 0
        this.form.voMasterInfo.id = 0
        this.form.voMasterInfo.isDeleted = false
        this.form.voMasterInfo.contractID = this.contractGuid
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
        this.form.voMasterInfo.packageContractorQuotation = this.form.voMasterInfo.packageContractorQuotation || 0
        this.form.voMasterInfo.consultantEstimatedAmount = this.form.voMasterInfo.consultantEstimatedAmount || 0
        this.form.voMasterInfo.currencyExchangeRate = this.form.voMasterInfo.currencyExchangeRate || 1
        this.form.voMasterInfo.effectDay = this.form.voMasterInfo.effectDay || 0
        this.form.voMasterInfo.isBeforeApply = this.form.voMasterInfo.isBeforeApply == undefined || this.form.voMasterInfo.isBeforeApply == null || this.form.voMasterInfo.isBeforeApply == '' ? true : this.form.voMasterInfo.isBeforeApply
        this.form.voMasterInfo.isTrip = this.form.voMasterInfo.isTrip || false
        this.form.voMasterInfo.budgetIsConfirm = this.form.voMasterInfo.budgetIsConfirm || false
        this.form.voMasterInfo.useStore =  0
        // this.$forceUpdate()
      },
      handleTabChange(activieKey){
        if(this.preActiveKey == 2 && activieKey != this.preActiveKey){
          //验证造价估算
          if(!this.checkBqList()){
            this.tabActiveKey = 2
            this.$forceUpdate()
          }
        }else{
          this.preActiveKey = activieKey
        }

      },
      //验证造价估算必填值
      checkBqList(){
        if(this.form.vobqNewlst && this.form.vobqNewlst.length > 0){
          for(var i in this.form.vobqNewlst){
            var item = this.form.vobqNewlst[i]
            if(!item.isDeleted){
              if(item.costCenter == '' || item.itemType == ''){
                this.$message.warn('请选择【造价估算】的“业态成本中心”和“清单项类别”')
                return false
              }
            }
          }
        }
        return true
      },
      //废弃
      cancel(){
        const that = this
        this.$confirm({
          title : '废弃提醒',
          content : '是否确认废弃该变更？',
          onOk () {
            that.loading.cancel = true
            ChangeService.delete(that.form.voMasterInfo.voGuid).then(res =>{
              that.loading.cancel = false
              console.log('res',res)
              if(res.result.statusCode === 200){
                that.$message.success('废弃成功')
                that.$router.push({ path: `/change/cip/list` })

              }
            }).catch((e) =>{
              console.log('e',e)
              that.loading.cancel = false
            })
            //调用废弃接口
            console.log('进入废弃功能按钮点击事件')
          },
          onCancel(){

          }
        })
      },
      //生成项目指令
      createPMI () {
        this.loading.createPMI = true
        ChangeService.createPMI({ CIPGuid : this.form.voMasterInfo.voGuid}).then(res => {
          this.loading.createPMI = false
          if(res.result.statusCode === 200){
            // console.log('res',res.result.data,window)
            // setTimeout(function(){
              window.open(res.result.data)
            // },0)
            this.pmiUrl = res.result.data
          }
        }).catch(() =>{
          this.loading.createPMI = false
        })
        this.$message.success('生成文档所需时间1-2分钟左右，请稍等...')
      },
      showPMI(){
        window.open(this.pmiUrl)
      },
      showBudgets(bAmountIsChangeResult){
        const stageLower = this.stage.toLowerCase()
        const budgetlst = this.form.vobqNewlst == null ? [] : this.form.vobqNewlst.filter(item => !item.isDeleted )
        if(budgetlst && budgetlst.length > 0 && bAmountIsChangeResult){
          this.$refs.budgets.showModal()
        }else{
          location.href = `/change/${stageLower}/item/${this.form.voMasterInfo.voGuid}?type=view&contractGuid=${this.contractGuid}&stage=${this.stage}`
        }
      },
      startCBPM(){
        this.loading.startCBPM = true
        ChangeService.vOAuditWithOutWorkFlow(form.voMasterInfo.voGuid).then(res =>{
          this.loading.startCBPM = false
          if(res.result.statusCode === 200){
            this.$message.success('已审核通过')
            location.reload(true)
          }
        }).catch(() =>{
          this.loading.startCBPM = false
        })
      },
      cancelCBPM(){
        this.loading.cancelCBPM = true
        ChangeService.vOCancelAuditWithOutWorkFlow(form.voMasterInfo.voGuid).then(res =>{
          this.loading.cancelCBPM = false
          if(res.result.statusCode === 200){
            this.$message.success('已取消审核')
            location.reload(true)
          }
        }).catch(() =>{
          this.loading.cancelCBPM = false
        })
      }
    }
  }
</script>
