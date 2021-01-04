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
            <a-col :md="24" :sm="24" style="font-size: 16px;font-weight: bold;text-decoration: underline">
              基本资料
            </a-col>
            <a-col :md="24" :sm="24">
               <base-info
                title="基本资料"
                :data="form"
                :contract="contract"
                :type="type"
                :id="id"
                stage="latent"
                ref="baseInfo"
              ></base-info>
            </a-col>
            <a-col :md="24" :sm="24"  style="font-size: 16px;font-weight: bold;text-decoration: underline">
             附件
            </a-col>
              <attachment-list :data="form" :type="type" :id="id" stage="latent"></attachment-list>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator" style="margin-top:8px;">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-button type="success" :loading="loading.startBPM" v-if="type === 'view' && form.voMasterInfo.auditStatus === '未审核'  && ac('EDIT')" @click="startBPM">启动审批流程</a-button>
            <a-button type="success" :loading="loading.showBPM" v-if="form.voMasterInfo.auditStatus === '已审核' || form.voMasterInfo.auditStatus === '审核中' && ac('VIEW')" @click="showBPM">查看审批流程</a-button>

          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="24" :sm="24" style="margin-top: 10px">
            <a-button type="success" :loading="loading.save" v-if="type === 'view' &&form.voMasterInfo.auditStatus === '未审核' && ac('EDIT')" @click="$router.push({ path: `/change/cip/latent/item/${id}?type=edit&contractGuid=${contractGuid}` })">编辑</a-button>
            <a-button type="success" :loading="loading.save" v-if="type !== 'view' && ac(type === 'add' ? 'ADD' : 'EDIT')" @click="save()" >储存</a-button>
            <a-button type="danger" :loading="loading.cancel" v-if="type === 'view' && form.voMasterInfo.auditStatus === '未审核' && ac('DELETE')" @click="cancel">废弃</a-button>
            <a-button type="danger" @click="back">关闭</a-button>
          </a-col>
        </a-row>
      </div>
    </a-card>

  </page-header-wrapper>
</template>

<script>
  import BaseInfo from '@/views/change/cip/latent/components/BaseInfo'
  import AttachmentList from '@/views/change/cip/components/AttachmentList'
  import { ChangeService } from '@/views/change/change.service'
  import { ProjectService } from '@/views/project/project.service'
  import { SwaggerService } from '@/api/swagger.service'
  import { Base as BaseService, DIALOGCONFIG } from '@/api/base'
  import { ac } from '@/views/user/user.service'

  export default {
    name: 'ChangeItem',
    components: {  AttachmentList,  BaseInfo },
    data () {
      return {
        tabActiveKey: 1,
        preActiveKey : 1,
        pmiUrl : '',
        loading: {
          startBPM : false,
          save : false,
          cancel : false,
          showBPM : false
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
      } else {
        this.contract.cnotractGuid = this.contractGuid
        this.initCreateForm()
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
        // this.loading.save = true
        let isValid = true
        this.$refs.form.validate(valid => {
          if (!valid) {
            isValid = false
          }
        })
        if (isValid) {
          // this.form.contractNo = this.contract.contractNo
          // console.log('saveData', this.form)
          // if (this.type == 'add') {
          //   this.form.voMasterInfo.stage = this.stage // 为VO时则为cip转vo
          //   if (this.form.fileMasterId == undefined || this.form.fileMasterId == '') {
          //     this.form.fileMasterId = 0
          //   }
          //   if( this.form.voMasterInfo.cipType === 129){
          //     this.form.vobqNewlst = []
          //   }
          //   this.loading.save = true
          //   ChangeService.create(this.form).then((res) => {
          //     this.loading.save = false
          //     if (res.result.statusCode === 200) {
          //       this.$message.success('创建成功')
          //       this.form.voMasterInfo.voGuid = res.result.data
          //       this.showBudgets(true)
          //     }
          //   }).catch((e) => {
          //     console.log('e',e)
          //     this.loading.save = false
          //     this.$message.error('创建失败，表单未填写完整')
          //   })
          // } else if (this.type == 'edit') {
          //   this.loading.save = true
          //   ChangeService.update(this.form).then((res) => {
          //     this.loading.save = false
          //     console.log(res)
          //     if (res.result.statusCode === 200) {
          //        if(callback == undefined){
          //         this.$message.success('修改成功')
          //         this.showBudgets(res.result.data.bAmountIsChangeResult)
          //        }else{
          //          callback()
          //        }
          //     }
          //   }).catch((e) => {
          //     console.log('error',e)
          //     this.loading.save = false
          //     this.$message.error('修改失败，表单未填写完整')
          //     if(callback !== undefined){
          //       this.loading.startBPM = false
          //     }
          //   })
          // }
        }else{
          this.loading.save = false
        }
      },
      startBPM () {
        // this.loading.startBPM = true
        const that = this
        // this.save(innerStartBPM)
        // innerStartBPM()
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
        BaseService.viewBpm(this.form.voMasterInfo.voGuid).then(res => {
          this.loading.showBPM= false
          window.open(res.result.data)
        })
      },
      back () {
        this.$router.push({ path: `/change/cip/latent/list/${this.contractGuid}` })
      },
      // 初始化新增cip信息的voMasterInfo对象
      initCreateForm () {
        this.form.cipid = this.form.cipid || 0
        this.form.voMasterInfo.id = 0
        this.form.voMasterInfo.isDeleted = false
        this.form.voMasterInfo.contractID = this.contractGuid
        this.form.voMasterInfo.createMode = 'M'
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
      }
    }
  }
</script>