<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-item label="项目编码">
              <a-input :disabled="true" :value="cipInfo.projectCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="房产项目名称(中文)">
              <a-input :disabled="true" :value="cipInfo.projectName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="房产项目名称(英文)">
              <a-input :disabled="true" :value="cipInfo.projectEnName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="中央合同编号">
              <a-input :disabled="true" :value="cipInfo.contractNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="本地合同编号">
              <a-input :disabled="true" :value="cipInfo.localContractNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="合同名称">
              <a-input :disabled="true" :value="cipInfo.contractName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="12">
            <a-form-item label="指令编号">
              <a-input :disabled="true" :value="cipInfo.voNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="12">
            <a-form-item label="指令名称">
              <a-input :disabled="true" :value="cipInfo.voName"></a-input>
            </a-form-item>
          </a-col>
           <a-col :md="24" :sm="24">
            <a-form-model-item label="申请编号" >
              <a-input :value="form.svCode" :disabled="true"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="签证原因及签证内容" prop="svContent">
              <a-textarea v-model="form.svContent" :disabled="type === 'view'"></a-textarea>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-row :gutter="48">
            <certificate-attachment-list :data="form" :type="type"></certificate-attachment-list>
            </a-row>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="申请人">
              <a-input :disabled="true" :value="form.createrUser"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="申请日期">
              <a-input :disabled="true" :value="form.creationTime | moment"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-card>

    <div class="table-operator" style="margin-top:8px;">
      <a-row :gutter="48">
        <a-col :md="24" :sm="24" >
          <a-button-group>
            <a-button v-if="type === 'view' && form.auditStatus === '未审核'" @click="approve()" type="success">
              启动审批流程
            </a-button>
          </a-button-group>
        </a-col>
      </a-row>
      <a-row :gutter="48" style="margin-top:8px">
        <a-col :md="24" :sm="24">
          <a-button-group>
            <a-button
              v-if="type !== 'view' && form.auditStatus != '审核中' && form.auditStatus != '已审核'"
              @click="save()"
              type="success"
            >
              储存
            </a-button>
            <a-button
              v-if="type === 'view' && form.auditStatus != '审核中' && form.auditStatus != '已审核'"
              @click="$router.push({ path: `/change/cip/certificate/item/${id}?type=edit&cipGuid=${cipGuid}` })"
              type="success"
            >
              编辑
            </a-button>
            <a-button @click="back()" type="danger">
              关闭
            </a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import { FooterToolBar } from '@/components'
import { ChangeService } from '@/views/change/change.service'
import { SwaggerService } from '@/api/swagger.service'
import { Base as BaseService, DIALOGCONFIG } from '@/api/base'
import { ac } from '@/views/user/user.service'
import CertificateAttachmentList from '@/views/change/cip/certificate/AttachmentList'

export default {
  name: 'Certificate',
  components: { FooterToolBar, CertificateAttachmentList },
  data () {
    return {
      loading: { save: false, startBPM: false },
      rules: {
        svContent: [{ required: true, trigger: 'blur', message: '请输入签证原因及签证内容' }]
      },
      form: SwaggerService.getForm('SpotVisaDto'),
      cipInfo: SwaggerService.getForm('ProjectListDto')
    }
  },
  created () {
    if (this.type === 'add') {
      this.initData()
    } else {
      ChangeService.getSpotVisaByGuid(this.id).then(res => {
        if (res.result.statusCode === 200) {
          this.form = res.result.data
        }
      })
    }
    this.initCipInfo()
  },
  computed: {
    id () {
      return this.$route.params.id
    },
    type () {
      return this.$route.query.type
    },
    cipGuid () {
      return this.$route.query.cipGuid
    }
  },
  methods: {
    ac (action) {
      return ac(action, this.$route)
    },
    approve () {},
    save () {
      this.loading.save = true
      let isValid = true
      this.$refs.form.validate(valid => {
        if (!valid) {
          isValid = false
        }
      })
      if (!isValid) {
        this.loading.save = false
        return
      }
      let actionName = 'createSpotVisa'
      if(this.type === 'edit'){
        actionName = 'updateSpotVisa'
      }
      ChangeService[actionName](this.form)
        .then(res => {
          this.loading.save = false
          if (res.result.statusCode === 200) {
            this.$message.info('保存成功')
            location.href = `/change/cip/certificate/item/${res.result.data}?type=view&cipGuid=${this.cipGuid}`
          }
        })
        .catch(e => {
          this.loading.save = false
          console.log('createSpotVisa error', e)
          this.$message.error('保存现场签证失败')
        })
    },
    back () {
      this.$router.push({ path: `/change/cip/certificate/list/${this.cipGuid}` })
    },
    initData () {
      this.form.id = 0
      this.form.isAudit = false
      this.form.fileMasterId = 0
    },
    initCipInfo () {
      ChangeService.getVOInfoForSpotVisa(this.cipGuid).then(res => {
        if (res.result.statusCode === 200) {
          this.cipInfo = res.result.data
          if (this.type === 'add') {
            this.form.projectCode = this.cipInfo.projectCode
            this.form.voGuid = this.cipGuid
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
table {
  margin: 15px 0;
  width: 100%;
  border-width: 1px 1px 0 0;
  border-radius: 3px 3px 0 0;
  border-style: solid;
  border-color: #ccc;

  thead {
    tr {
      th {
        background-color: #f5f5f5;
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
.ant-btn-group {
  margin-right: 8px;
}
</style>
