<template>
  <page-header-wrapper>
    <a-card v-if="true" :bordered="false">
      <a-form-model ref="form" :rules="rules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-model-item label="项目名称">
              <a-input :disabled="true" value="测试名称显示"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="施工组织文案名称" prop="s">
              <a-input :disabled="type === 'view'"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="施工单位名称" prop="a">
              <a-input :disabled="type === 'view'"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-row>
              <a-col :span="10">
                <a-form-model-item label="编制日期" prop="f">
                  <a-date-picker :disabled="type === 'view'" placeholder="请选择编制日期"> </a-date-picker>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="备注">
              <a-textarea :disabled="type === 'view'" placeholder="请输入备注"></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
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
                      <a-input v-model="item.creationTime" :disabled="true"></a-input>
                    </td>
                  </tr>
                </tbody>
              </table>
            </a-col>
          </div>
        </a-row>
      </a-form-model>
      <div class="table-operator">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-button type="success" :loading="loading.startBPM" v-if="type === 'edit'" @click="startBPM"
              >启动审批流程</a-button
            >
            <a-button type="success" :loading="loading.showBPM" v-if="true" @click="showBPM">查看审批流程</a-button>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="24" :sm="24" style="margin-top: 10px">
            <a-button type="success" :loading="loading.save" v-if="type != 'view'" @click="save">储存</a-button>
            <a-button type="danger" @click="back">关闭</a-button>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { ChangeService } from '@/views/change/change.service'
import moment from 'moment'

export default {
  name: 'ConstrctionOrganizeDesign',
  data() {
    return {
      selection: {},
      loading: {
        save: false,
        startBPM: false,
        showBPM: false,
      },
      fileList: [],
      filePage: null,
      index: 0,
      rules: {
        s: [{ trigger: 'change', message: '请输入施工组织文案名称', required: true }],
        a: [{ required: true, message: '请输入施工单位名称', trigger: 'change' }],
        f: [{ required: true, message: '请输入编制日期', trigger: 'change' }],
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
  },
  created() {
    // 获取可选抄送单位
    ChangeService.sendCopyParty({}).then((item) => {
      this.selection.sendCopyParties = item.result.data
    })
  },
  methods: {
    splitVal(val) {
      return val ? val.split(';') : null
    },
    save(callback) {},
    handleCancel() {},
    startBPM() {},
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
        creatorUser: '',
        fileInfo: '',
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
    beforeUpload(file) {
      this.handleUpload(file)
      return false
    },
    handleUpload(file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('masterId', this.data.fileMasterId)
      formData.append('businessID', '')
      formData.append('businessType', this.stage)
      formData.append('subInfo1', '') //
      formData.append('subInfo2', '') //
      formData.append('subInfo3', '') //
      formData.append('fileInfo', this.fileInfo) // 附件类型
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
          console.log('upload response:', response)

          this.fileList[this.index] = Object.assign(this.fileList[this.index], response.result.data)
          console.log('fileList[index]', this.fileList[this.index])
          _this.data.fileMasterId = response.result.data.masterID
          _this.$message.success('上传成功')
          _this.$emit('ok', response.url)
          _this.visible = false
          _this.$forceUpdate
        })
    },
    back (){
        this.$router.push({ path: `/change/pmi` })
    }
  },
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
