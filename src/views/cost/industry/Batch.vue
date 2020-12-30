<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="12">
            <a-form-item label="房产项目名称（中）">
              <a-input :disabled="true" :value="form.projectName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="12">
            <a-form-item label="项目编号">
              <a-input :disabled="true" :value="form.projectCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="12">
            <a-form-item label="批次">
              <a-input :disabled="true" :value="form.batchCode"> </a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="12">
            <a-form-item label="审核状态">
              <a-input :disabled="true" :value="form.auditStatus || '未审批'"> </a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="标题" prop="batchTitle">
              <a-input v-model="form.batchTitle" :disabled="type === 'view'"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="备注">
              <a-textarea v-model="form.description" :disabled="type === 'view'"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="48" style="margin-bottom:10px">
          <a-col>
            <div
              style="padding-top:5px; padding-bottom:5px;padding-left:30px;background-color:#f5f5f5;border-bottom:0;border:1px solid #ccc;margin-top: 20px"
            >
              <a-button :disabled="type === 'view'" icon="plus" @click="add()"> 新增 </a-button>
            </div>
            <a-table
              ref="table"
              :row-key="record => record.id"
              :columns="columns"
              :data-source="this.form.tenderPackages"
              :scroll="{ y: '300px' }"
              bordered
              :pagination="false"
              :rowClassName="setRowClassName"
            >
              <span slot="action" slot-scope="text, item, index">
                <a-button
                  type="danger"
                  icon="delete"
                  style="margin-left: 4px"
                  :disabled="type === 'view'"
                  @click="del(item, index)"
                  title="删除"
                ></a-button>
              </span>
              <template slot="costCenters" slot-scope="text">
                <span v-for="item in text" :key="JSON.stringify(item)"> {{ item.costCenterName }}; </span>
              </template>
              <span slot="budgetAmount" slot-scope="text">{{ text | NumberFormat }}</span>
            </a-table>
          </a-col>
        </a-row>
      </a-form-model>
      <a-row>
        <a-col :md="12" :sm="24">
          <a-button
            type="success"
            :loading="loading.startBPM"
            style="margin-right: 20px"
            v-if="type === 'view' && form.auditStatus === '未审核'"
            @click="startBPM"
          >启动审批流程</a-button
          >
        </a-col>
        <a-col :md="12" :sm="24">
          <a-button-group style="float: right">
            <a-button
              type="success"
              @click="$router.push({ path: `/cost/industry/batch/${form.tenderPackageBatchGUID}?ProjectGUID=${ProjectGUID}&type=edit` })"
              v-if="type === 'view' && form.auditStatus === '未审核'"
            >编辑</a-button
            >
            <a-button type="success" :loading="loading.save" @click="handleToSave" v-if="type !== 'view'">储存</a-button>
            <a-button type="danger" style="margin-left: 5px" @click="back">关闭</a-button>
          </a-button-group>
        </a-col>
      </a-row>
      <industry-package-batch-modal
        v-if="this.form.tenderPackages"
        ref="industryPackageBatchModal"
        :visible="show.tenderShow"
        :selecteds="getSelecteds()"
        :ProjectGUID="ProjectGUID"
        @cancel="handleCancel()"
        @ok="handleOk()"
      ></industry-package-batch-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { CostService } from '@/views/cost/cost.service'
import { SwaggerService } from '@/api/swagger.service'
import { ProjectService } from '@/views/project/project.service'
import { formatList } from '@/mock/util'
import { compare } from '@/utils/util'
import IndustryPackageBatchModal from './modal/industryPackageBatchModal.vue'

const columns = [
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  },
  {
    title: '行业分判包编号',
    dataIndex: 'tradePackageCode',
    scopedSlots: { customRender: 'tradePackageCode' }
  },
  {
    title: '描述',
    dataIndex: 'packageTitle'
  },
  {
    title: '范围',
    dataIndex: 'costCenters',
    scopedSlots: { customRender: 'costCenters' }
  },
  {
    title: '金额',
    dataIndex: 'budgetAmount',
    scopedSlots: { customRender: 'budgetAmount' }
  }
]
export default {
  name: 'IndustryBatch',
  components: { IndustryPackageBatchModal },
  data () {
    return {
      loading: { save: false,startBPM : false,showBPM : false },
      show: { tenderShow: false },
      columns: columns,
      rules: {
        batchTitle: [{ required: true, trigger: 'blur', message: '请输入批次标题' }]
      },
      form: SwaggerService.getForm('TenderPackageBatchRegOutputDto')
    }
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
    packageId(){
      return this.$route.query.packageId
    }
  },
  created () {
    if (this.type === 'add') {
      ProjectService.view(this.ProjectGUID).then(res => {
        this.form.projectGUID = res.result.data.projectGUID
        this.form.projectCode = res.result.data.projectCode
        this.form.projectName = res.result.data.projectName
        this.form.tenderPackages = []
        this.appendPackage()
      })
    } else {
      CostService.getTenderPackageBatchRegByGUID(this.id).then(res => {
        if (res.result.statusCode === 200) {
          this.form = res.result.data
          this.appendPackage()
        }
      })
    }
  },
  methods: {
    add () {
      this.show.tenderShow = true
    },
    del (item, index) {
      if (item.isTemp) {
        this.form.tenderPackages.splice(index, 1)
      } else {
        item.isDeleted = true
      }
      this.$forceUpdate()
    },
    getSelecteds(){
      return this.form.tenderPackages.filter(item => !item.isDeleted)
    },
    handleToSave () {
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
      const tempRows = this.form.tenderPackages.filter(item => !item.isDeleted)
      if (tempRows.length < 1) {
        this.$message.warn('请添加需要审核的行业分判包')
        this.loading.save = false
        return
      }
      let actionName = 'createTenderPackageBatchReg'
      const submitForm = {
        projectGUID: this.form.projectGUID,
        batchTitle: this.form.batchTitle,
        description: this.form.description,
        id: this.form.id
      }
      if (this.type === 'edit') {
        ;(actionName = 'updateTenderPackageBatchReg'), (submitForm.removeTenderPackageList = this.filterPackage(2))
        submitForm.addTenderPackageList = this.filterPackage(1)
      } else {
        submitForm.tenderPackageList = this.filterPackage(0)
      }
      CostService[actionName](submitForm)
        .then(res => {
          this.loading.save = false
          if (res.result.statusCode === 200) {
            this.$message.info('保存成功')
            location.href = `/cost/industry/batch/${res.result.data.tenderPackageBatchGUID}?ProjectGUID=${this.ProjectGUID}&type=view`
          }
        })
        .catch(e => {
          this.loading.save = false
          console.log('保存行业分判包批次失败', e)
          this.$message.error('保存行业分判包批次失败')
        })
    },
    back () {
      this.$router.push({ path: `/cost/industry/list` })
    },
    setRowClassName (record, index) {
      if (record.isDeleted) {
        return 'delete-row'
      }
      return ''
    },
    handleCancel () {
      this.show.tenderShow = false
    },
    handleOk () {
      this.show.tenderShow = false
      const selectedRows = this.$refs.industryPackageBatchModal.selectedRows
      console.log('selectedRows', selectedRows)
      if (!this.form.tenderPackages) {
        this.form.tenderPackages = []
      }
      const unRepeatRows = []
      selectedRows.forEach(item => {
        let repeat = false
        for (var i in this.form.tenderPackages) {
          var row = this.form.tenderPackages[i]
          if (row.id === item.id) {
            repeat = true
            if (row.isDeleted) {
              row.isDeleted = false
            }
            break
          }
        }
        if (!repeat) {
          item.isTemp = true
          this.form.tenderPackages.push(item)
        }
      })
      this.$forceUpdate()
    },
    // 过滤分判包信息供提交使用
    // flag : 0: 全部，1:只要新增的，2:只要被删除的
    filterPackage (flag) {
      const packages = []
      this.form.tenderPackages.forEach(item => {
        const temp = {}
        if (flag === 0 || (flag === 1 && item.isTemp) || (flag === 2 && item.isDeleted)) {
          temp.tenderPackageId = item.id // tenderPackageGUID
          packages.push(temp)
        }
      })
      return packages
    },
    startBPM(){
      this.loading.startBPM = true
      CostService.tenderPackageBatchStartBPM(this.form.tenderPackageBatchGUID).then(res =>{
        this.loading.startBPM = false
        if(res.result.statusCode === 200){
          setTimeout(function(){
            window.open(res.result.data)
          },200)
        }
      }).catch((e) =>{
        this.loading.startBPM = false
      })
    },
    showBPM(){
      this.loading.showBPM= true
      BaseService.viewBpm(this.form.tenderPackageBatchGUID).then(res => {
        this.loading.showBPM= false
        if(res.result.statusCode === 200){
          setTimeout(function(){
            window.open(res.result.data)
          },200)
        }
      })
    },
    appendPackage(){
      if(this.packageId){
        CostService.industryItem({ Id: this.packageId }).then(res => {
          if(res.result.statusCode === 200){
            if(this.type === 'add'){
              this.form.tenderPackages.push(res.result.data)
            }else{
              const repeatPackages = this.form.tenderPackages.filter(item => item.id === res.result.data.id)
              if(repeatPackages.length < 1){
                this.form.tenderPackages.push(res.result.data)
              }
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .delete-row {
  display: none;
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
.ant-btn-group {
  margin-right: 8px;
}
</style>
