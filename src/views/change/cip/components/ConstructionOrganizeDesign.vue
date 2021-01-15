<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form-model ref="form" :model="data" :rules="rules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="12">
            <a-form-model-item label="项目名称">
              <a-input :disabled="true" :value="project.projectName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="12">
            <a-form-item label=" " :colon="false" style="text-align:right">
              <span class="label-primary">{{data.auditStatus}}</span>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="12">
            <a-form-model-item label="施工组织文案名称" prop="bdName">
              <a-input v-model="data.bdName" :disabled="type === 'view'"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="施工单位名称" prop="partylst">
              <a-select 
              :disabled="type === 'view'"
              v-model="partylst"
              mode="multiple"
              placeholder="请选择"
              @change="partyChange"
              option-filter-prop="children"
              >
                <a-select-option
                  v-for="option in selection.parties"
                  :key="option.partyID"
                  :value="option.partyID">
                  {{ option.partyName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-row>
              <a-col :span="10">
                <a-form-model-item label="编制日期" prop="writeDate">
                  <a-date-picker v-model="data.writeDate" :disabled="type === 'view'" placeholder="请选择编制日期"> </a-date-picker>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="备注">
              <a-textarea v-model="data.remark" :disabled="type === 'view'" placeholder="请输入备注"></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <a-row :gutter="48">
        <div>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
                <tr>
                  <th colspan="5">
                    <a-button icon="plus" @click="add" :disabled="type === 'view'"> 新增 </a-button>
                  </th>
                </tr>
                <tr>
                  <th>操作</th>
                  <th>附件名称</th>
                  <th>附件页数</th>
                  <th>最后修改时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in fileList" v-if="item != null" :key="index">
                  <td>
                    <a-upload
                      name="file"
                      v-if="item.filePage && item.id === 0"
                      :multiple="false"
                      :before-upload="beforeUpload"
                    >
                      <a-button @click="choose(index)">上传附件</a-button>
                    </a-upload>
                    <a-button @click="del(index)" :disabled="type === 'view'" icon="close"> 删除 </a-button>
                  </td>
                  <td>
                    <a :href="item.fileUrl" target="_blank" v-if="item.fileName">{{ item.fileName }}</a>
                  </td>
                  <td>
                    <a-input-number
                      :min="1"
                      v-model="item.filePage"
                      @change="onFilePageChange"
                      :disabled="item.id > 0"
                    ></a-input-number>
                  </td>
                  <td>
                    <a-input :value="item.creationTime | moment" :disabled="true"></a-input>
                  </td>
                </tr>
              </tbody>
            </table>
          </a-col>
        </div>
      </a-row>
      <div class="table-operator">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-button type="success" :loading="loading.startBPM" v-if="type === 'view' && (data.auditStatus === '未审核') && ac('EDIT')" @click="startBPM"
              >启动审批流程</a-button
            >
            <a-button type="success" :loading="loading.showBPM" v-if="type === 'view' && (data.auditStatus == '审核中' || data.auditStatus == '已审核') && ac('VIEW')" @click="showBPM">查看审批流程</a-button>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="24" :sm="24" style="margin-top: 10px">
            <a-button type="success" :loading="loading.save" v-if="type === 'view' && ac('EDIT') && data.auditStatus === '未审核'" @click="$router.push({ path: `/change/cip/constructionOrganizeDesign/${contractGuid}?projectCode=${projectCode}&type=edit` })">编辑</a-button>
            <a-button type="success" :loading="loading.save" v-if="type != 'view' && ac(type === 'add' ? 'ADD' : 'EDIT')" @click="save()">储存</a-button>
            <a-button type="danger" @click="back">关闭</a-button>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { ChangeService } from '@/views/change/change.service'
import { ProjectService } from '@/views/project/project.service'
import moment from 'moment'
import { SwaggerService } from '@/api/swagger.service'
import { Base as BaseService } from '@/api/base'
  import { ac } from '@/views/user/user.service'

export default {
  name: 'ConstrctionOrganizeDesign',
  data() {
    return {
      selection: { parties : [] },
      partylst : [],//已选施工单位
      project : SwaggerService.getForm('ProjectListDto'),
      data : SwaggerService.getForm('ContractBuildingDesignDto'),
      loading: {
        save: false,
        startBPM: false,
        showBPM: false,
      },
      fileList: [],
      filePage: null,
      index: 0,
      rules: {
        bdName: [{ trigger: 'blur', message: '请输入施工组织文案名称', required: true }],
        partylst: [{ validator : this.checkPartylst, trigger: 'change' }],
        writeDate: [{ required: true, message: '请输入编制日期', trigger: 'change' }],
      },
    }
  },
  computed: {
    type() {
      return this.$route.query.type
    },
    contractGuid() {
      return this.$route.params.contractGuid
    },
    projectCode(){
      return this.$route.query.projectCode
    }
  },
  created() {
    if (this.type !== 'add') {
      ChangeService.buildingDesignItem(this.contractGuid).then((res) => {
        this.data = res.result.data
        console.log('change.constructionOrganizeDesign.data', this.data)
        BaseService.fileList(this.data.fileMasterId, this.data.bdGuid, '', '').then(_res => {
          this.fileList = _res.result.data
        })
        if(this.data.partylst && this.data.partylst.length > 0){
          this.data.partylst.forEach(item =>{
            let repeat = false
            this.partylst.push(item.partyID)
          })
        }
      })
    }else{
      this.initData()
    }
    ProjectService.view2(this.projectCode).then((res) => {
      this.project = res.result.data
      console.log('change.project',this.project)
    })
    // 获取可选抄送单位
    ChangeService.contractPartyForBd(this.contractGuid).then((item) => {
      // this.selection.parties = item.result.data
      item.result.data.forEach(item => {
        let repeatParties = this.selection.parties.filter(party => party.partyID === item.partyID)
        if(repeatParties.length < 1){
          this.selection.parties.push(item)
        }
        
      })
      this.$forceUpdate()
    })
  },
  methods: {
    ac (action) {
        return ac(action, this.$route)
      },
    splitVal(val) {
      return val ? val.split(';') : null
    },
    save(callback) {
      let isValid = true
      this.$refs.form.validate(valid => {
        if (!valid) {
          isValid = false
        }
      })
      console.log('this.data',this.data)
      if(isValid){
        this.loading.save = true
        let actionType = 'updateBuildingDesign'
        if(this.type === 'add'){
          actionType = 'createBuildingDesign'
        }
        ChangeService[actionType](this.data).then(res =>{
          this.loading.save = false
          if(res.result.statusCode === 200){
            if(callback != undefined){
              callback()
            }else{
              this.$message.info('保存成功')
              location.href=`/change/cip/constructionOrganizeDesign/${this.contractGuid}?projectCode=${this.projectCode}&type=view`
            }
          }
        }).catch(() =>{
          this.loading.save = false
          this.$message.error('保存失败,请联系管理员')
        })
      }
    },
    startBPM() {
      this.loading.startBPM = true
      const that = this
      innerStartBPM()
      // this.save(innerStartBPM)
      function innerStartBPM(){
        ChangeService.startBuildingDesignBPM({ BDGuid : that.data.bdGuid, sProjectCode : that.data.projectCode}).then(res => {
          if(res.result.statusCode === 200){
            console.log('审批地址',res.result.data)
            that.loading.startBPM = false
            window.open(res.result.data)
            // window.location.reload()
          }
        }).catch(() =>{
          that.loading.startBPM = false
        })
      }
    },
    showBPM(){
      this.loading.showBPM = true
      BaseService.viewBpm(this.data.bdGuid).then(res => {
        this.loading.showBPM= false
        window.open(res.result.data)
      })
    },
    onFilePageChange(value) {
      this.filePage = value
    },
    add() {
      const item = {
        id: 0,
        isDeleted: false,
        isTemp: true,
        fileType: '',
        fileName: '',
        fileUrl: '',
        creationTime: '',
        creatorUser: ''
      }
      if (this.fileList) {
        this.fileList.push(item)
      } else {
        let fileList = []
        fileList.push(item)
        this.fileList = fileList
      }

      this.$forceUpdate()
    },
    del(index) {
      const that = this
      this.$confirm({
        title: '删除提示',
        content: '是否确认删除该附件？',
        onOk() {
          console.log('点击了删除的确认事件', index, that.fileList[index])
          if (that.fileList[index].id) {
            BaseService.removeFile(that.fileList[index].id).then((res) => {
              if (res.result.statusCode === 200) {
                that.$message.info('附件删除成功')
                that.fileList.splice(index, 1)
                that.$forceUpdate()
              }
            })
          } else {
            that.fileList.splice(index, 1)
            that.$forceUpdate()
          }
        },
        onCancel() {},
      })
    },
    choose (index) {
        this.index = index
    },
    beforeUpload(file) {
      this.handleUpload(file)
      return false
    },
    handleUpload(file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('masterId', this.data.fileMasterId)
      formData.append('businessID', '')
      formData.append('businessType', 'BuildingDesign')
      formData.append('subInfo1', '') //
      formData.append('subInfo2', '') //
      formData.append('subInfo3', '') //
      formData.append('filePage', this.filePage) // 附件页数
      this.uploading = true
      const _this = this
      this.$http
        .post('/api/services/app/UploadAppservice/CommonUpload', formData, {
          contentType: false,
          processData: false,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        .then((response) => {
          if(response.result.statusCode === 200){
            _this.fileList[this.index] = Object.assign(this.fileList[this.index], response.result.data)
            _this.data.fileMasterId = response.result.data.masterID
            _this.$message.success('上传成功')
            _this.$emit('ok', response.url)
            _this.visible = false
            _this.$forceUpdate()
          }
        })
    },
    back (){
        this.$router.push({ path: `/change/cip/list` })
    },
    partyChange(vals) {
      var that = this
      console.log('cc',vals)
      // 整理抄送公司
      // 将抄送下拉框信息放入到voPartyLst中
      vals.forEach(item => {
        const copySendParty = getCopyPartyByID(item)
        if (copySendParty) {
          var repeatData = getPartyByID(item, true)
          if (repeatData === undefined) {
            const temp = Object.assign({}, copySendParty)
            temp.id = 0
            temp.bdGuid = this.data.bdGuid
            temp.isDeleted = false
            temp.isTemp = true
            this.data.partylst.push(temp)
          } else {
            repeatData.isDeleted = false
          }
        }
      })
      // 清理vopartyLst中比cc多出的公司信息
      this.data.partylst.forEach((party, index) => {
        if (party.isSendCopy) {
          if (vals.indexOf(party.partyID) < 0) {
            if (party.isTemp) {
              this.data.partylst.splice(index, 1)
            } else {
              party.isDeleted = true
            }
          }
        }
      })

      // 根据partID及抄送与否 获取修改voPartyLst对象中的对应公司信息
      function getPartyByID (partyID) {
        var party = that.data.partylst.filter(item => item.partyID === partyID )
        if (party.length > 0) {
          return party[0]
        }
      }

      // 根据partID 获取抄送公司列表中的公司信息
      function getCopyPartyByID (partyID) {
        const party = that.selection.parties.filter(item => item.partyID === partyID)
        if (party.length > 0) {
          return party[0]
        }
      }

      this.$forceUpdate()
    },
    checkPartylst(rule,value,callback){
      console.log('value',value,this.partylst)
      if(this.partylst.length < 1){
        callback(new Error('请选择施工单位名称'))
      }else{
        callback()
      }
    },
    initData(){
      this.data.id = 0
      this.data.isAudit = false
      this.data.fileMasterId = 0
      this.data.contractGuid = this.contractGuid
      this.data.contrtactGuid = this.contractGuid
      this.data.projectCode = this.projectCode
      this.data.auditStatus = '未申请'
    }
  },
}
</script>

<style lang="less" scoped>
.label-primary {
  border-color: #3A44E1;
  color: #FFF;
  background-color: #666EE8;
  padding: 8px 15px;
  line-height: 20px;
  border-radius: 5px;
}
table {
  margin: 15px 0;
  width: 100%;
  border-width: 1px 1px 0 0;
  border-radius: 3px 3px 0 0;
  border-style: solid;
  border-color: #ccc;

  thead {
    tr {
      &:first-child {
        th {
          background-color: #f5f5f5;
        }
      }
      th {
        background-color: #06c;
        color: #fff;
        font-weight: normal;
        border-width: 0 0 1px 1px;
        border-style: solid;
        border-color: #ccc;

        button {
          margin-right: 10px;
        }
      }
    }
  }

  tbody {
    tr {
      td {
        padding: 0.5em 0.6em 0.4em 0.6em !important;
        border-width: 0 0 1px 1px;
        border-style: solid;
        border-color: #ccc;

        button {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
