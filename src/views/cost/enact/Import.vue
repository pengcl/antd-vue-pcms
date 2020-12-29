<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form-model
        ref="form"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-model-item label="模板文件" prop="nameCN">
              <a v-if="isDownload" :href="tempUrl" target="_blank">下载模板文件</a>
            </a-form-model-item>
          </a-col>

          <a-col :md="24" :sm="24">
            <a-form-model-item label="导入预算文件" extra="请按照模板文件格式导入" prop="file">
              <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload" accept=".xlsx">
                <a-button>
                  <a-icon type="upload"/>
                  选择文件
                </a-button>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <a-row>
        <a-col :md="12" :sm="24">
          <a-button-group style="float: left">
            <a-button
              :disabled="fileList.length === 0"
              :loading="uploading"
              type="success"
              @click="handleUpload">{{ uploading ? 'Uploading' : '导入' }}
            </a-button>
            <a-button type="danger" style="margin-left: 5px" @click="back">关闭</a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import {CostService} from '@/views/cost/cost.service'
  import {SwaggerService} from '@/api/swagger.service'
  import {SupplierService} from "@/views/supplier/supplier.service";

  export default {
    data() {
      return {
        isDownload: false,
        tempUrl: '',
        fileList: [],
        formData: new FormData(),
        uploading: false
      }
    },
    computed: {
      id() {
        return this.$route.query.ProjectGUID
      }
    },
    filters: {},
    created() {
      CostService.budgetTemplateFile({Id: this.id}).then(res => {
        if (res.result.statusCode === 200) {
          if (res.result.data === '') {
            this.$message.error('无模板数据,请联系管理员')
          } else {
            this.tempUrl = process.env.VUE_APP_API_BASE_URL + res.result.data
            this.$forceUpdate()
          }
        }
      })
    },
    methods: {
      back() {
        this.$router.push({path: `/cost/enact/list`})
      },
      handleRemove(file) {
        const index = this.fileList.indexOf(file)
        const newFileList = this.fileList.slice()
        newFileList.splice(index, 1)
        this.fileList = newFileList
      },
      beforeUpload(file) {
        // 重新加载文件列表
        this.fileList = []
        this.fileList = [...this.fileList, file]
        // 组装提交的信息
        this.formData = new FormData()
        this.formData.append('File', file)
        this.formData.append('Id', this.id)
        return false
      },
      handleUpload() {
        this.uploading = true
        const _this = this
        this.$http.post('/api/services/app/BudgetSubPlan/ProjectBudgetUpload', this.formData, {
          contentType: false,
          processData: false,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then((res) => {
          if (res.result.statusCode === 200) {
            _this.$message.success('上传成功')
            this.back()
          }
        }).catch(() => {
          this.uploading = false
        })
      }
    }
  }

</script>
<style lang="less" scoped>
  /deep/ .ant-upload-list {
    display: block !important;
    width: 30%
  }
</style>