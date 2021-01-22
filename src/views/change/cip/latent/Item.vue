<template>
  <page-header-wrapper>
    <a-card v-if="cipInfo" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <a-form-item label="项目编码">
                {{ cipInfo.projectCode }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="房产项目名称(中文)">
                {{ cipInfo.projectName }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="房产项目名称(英文)">
                {{ cipInfo.projectEnName || '-' }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="中央合同编号">
                {{ cipInfo.contractNo }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="本地合同编号">
                {{ cipInfo.localContractNo }}
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="合同名称">
                {{ cipInfo.contractName }}
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="状态"> {{form.qzvoMasterInfo.auditStatus || '未审核'}}</a-form-item>
            </a-col>
            <a-col :md="24" :sm="24" style="font-size: 16px;font-weight: bold;text-decoration: underline">
              基本资料
            </a-col>
            <a-col :md="24" :sm="24">
               <base-info
                title="基本资料"
                :data="form"
                :contract="cipInfo"
                :type="type"
                :id="id"
                stage="latent"
                ref="baseInfo"
              ></base-info>
            </a-col>
            <a-col :md="24" :sm="24"  style="font-size: 16px;font-weight: bold;text-decoration: underline">
             附件
            </a-col>
              <attachment-list :data="form" :type="type" :id="id" stage="JZ" masterInfoField="qzvoMasterInfo"></attachment-list>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator" style="margin-top:8px;">
        <a-row :gutter="48">
          <!-- <a-col :md="24" :sm="24">
            <a-button type="success" :loading="loading.startBPM" v-if="type === 'view' && form.qzvoMasterInfo.auditStatus === '未审核'  && ac('EDIT')" @click="startBPM">启动审批流程</a-button>
            <a-button type="success" :loading="loading.showBPM" v-if="form.qzvoMasterInfo.auditStatus === '已审核' || form.qzvoMasterInfo.auditStatus === '审核中' && ac('VIEW')" @click="showBPM">查看审批流程</a-button>

          </a-col> -->
        </a-row>
        <a-row :gutter="48">
          <a-col :md="24" :sm="24" style="margin-top: 10px">
            <a-button type="success" :loading="loading.save" v-if="type === 'view' &&form.qzvoMasterInfo.auditStatus === '未审核' && ac('EDIT')" @click="$router.push({ path: `/change/cip/latent/item/${id}?type=edit&contractGuid=${contractGuid}` })">编辑</a-button>
            <a-button type="success" :loading="loading.save" v-if="type !== 'view' && ac(type === 'add' ? 'ADD' : 'EDIT')" @click="save()" >储存</a-button>
            <a-button type="danger" :loading="loading.cancel" v-if="type === 'view' && form.qzvoMasterInfo.auditStatus === '未审核' && ac('DELETE')" @click="cancel">废弃</a-button>
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
        cipInfo: SwaggerService.getForm('QZVOBaseInfoDto'),
        form: SwaggerService.getForm('QZVOAllInfoDto'),
      }
    },
    created () {
       ChangeService.getQZBaseInfo(this.contractGuid).then(res =>{
        if(res.result.statusCode === 200){
          this.cipInfo = res.result.data
          this.cipInfo.contractGuid = this.contractGuid
        }
      })
      if (this.type !== 'add') {
        ChangeService.getQZVOAllInfoByGuid(this.id).then((res) => {
          this.form = res.result.data
          console.log('change.latent.data', this.form)
        })
      } else {
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
      save () {
        // this.loading.save = true
        console.log('change.latent.saveData',this.form)
        let isValid = true
        this.$refs.baseInfo.$refs.form.validate(valid => {
          if (!valid) {
            isValid = false
          }
        })
        if(!this.$refs.baseInfo.getPartys()){
          this.loading.save = false
          return
        }
        if (isValid) {
          console.log('change.latent.saveData', this.form)
          let action = 'createQZAllVoInfo'
          if(this.type === 'edit'){
            action = 'updateQZVOAllInfo'
          }
          this.loading.save = true
          ChangeService[action](this.form).then((res) => {
            this.loading.save = false
            if (res.result.statusCode === 200) {
              this.$message.success('保存成功')
              // this.form.qzvoMasterInfo.voGuid = res.result.data
              location.href= `/change/cip/latent/item/${res.result.data}?contractGuid=${this.contractGuid}&type=view` 
            }
          }).catch((e) => {
            console.log('e',e)
            this.loading.save = false
            this.$message.error('保存失败，表单未填写完整')
          })
          
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
          ChangeService.startBMP({ guid : that.form.qzvoMasterInfo.voGuid, sProjectCode : that.project.projectCode}).then(res => {
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
        BaseService.viewBpm(this.form.qzvoMasterInfo.voGuid).then(res => {
          this.loading.showBPM= false
          window.open(res.result.data)
        })
      },
      back () {
        this.$router.push({ path: `/change/cip/latent/list/${this.contractGuid}` })
      },
      // 初始化新增cip信息的voMasterInfo对象
      initCreateForm () {
        this.form.qzvoMasterInfo.id = 0
        this.form.qzvoMasterInfo.isAudit = false
        this.form.qzvoMasterInfo.contractID = this.contractGuid
        this.form.qzvoMasterInfo.createMode = 'M'
        this.form.qzvoMasterInfo.verMajor = 0
        this.form.qzvoMasterInfo.verMinor = 0
        this.form.qzvoMasterInfo.serialNo = 0
        this.form.fileMasterId = 0
        // this.$forceUpdate()
      },
      //废弃
      cancel(){
        const that = this
        this.$confirm({
          title : '废弃提醒',
          content : '是否确认废弃该潜在变更？',
          onOk () {
            that.loading.cancel = true
            ChangeService.deleteQZVOAllInfo(that.form.qzvoMasterInfo.voGuid).then(res =>{
              that.loading.cancel = false
              console.log('res',res)
              if(res.result.statusCode === 200){
                that.$message.success('废弃成功')
                that.$router.push({ path: `/change/cip/latent/list/${that.contractGuid}` })

              }
            }).catch((e) =>{
              console.log('e',e)
              that.loading.cancel = false
            })
          },
          onCancel(){

          }
        })
      }
    }
  }
</script>