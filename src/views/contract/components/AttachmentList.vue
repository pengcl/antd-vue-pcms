<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="4">
                <a-upload
                  :disabled="type === 'view'"
                  :before-upload="beforeUpload"
                >
                  <a-button>请选择</a-button>
                </a-upload>
              </th>
            </tr>
            <tr>
              <th style="width: 25%">操作</th>
              <th style="width: 25%">附件</th>
              <th style="width: 25%">备注</th>
              <th style="width: 25%">最后修改日期</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!file.isDeleted" v-for="file in fileList" :key="file.id">
              <td>
                <a-button :loadding="loading" @click="del(file.id)" type="danger" icon="delete"></a-button>
              </td>
              <td>{{ file.name }}</td>
              <td>{{ file.creator }}</td>
              <td>{{ file.date | moment }}</td>
            </tr>
          </tbody>
        </table>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
  import { Base as BaseService } from '@/api/base'

  export default {
    name: 'AttachmentList',
    data () {
      return {
        fileList: [],
        form: this.$form.createForm(this),
        loading: false
      }
    },
    props: {
      data: {
        type: Object,
        default: null
      },
      type: {
        type: String,
        default: 'view'
      },
      id: {
        type: String,
        default: '0'
      }
    },
    created () {
      BaseService.masterID(this.data.contract.contractGuid).then(res => {
        this.data.fileMasterId = res.result.data
        this.getFiles()
      })
    },
    methods: {
      getFiles () {
        BaseService.fileList(this.data.fileMasterId, this.data.contract.contractGuid, '', '').then(_res => {
          const data = _res.result.data
          const fileList = []
          data.forEach(item => {
            if (item) {
              fileList.push({
                date: item.creationTime,
                creator: item.creatorUser,
                name: item.fileName,
                file: item.fileUrl,
                id: item.id,
                masterID: item.masterID
              })
            }
          })
          this.fileList = fileList
        })
      },
      del (id) {
        const hide = this.$message.loading('删除中..', 0)
        BaseService.removeFile(id).then(res => {
          hide()
          if (res.result.statusCode === 200) {
            this.$message.success('删除成功')
            this.getFiles()
          } else {
            this.$message.error('删除失败')
          }
        })
      },
      beforeUpload (file) {
        this.handleUpload(file)
        return false
      },
      handleUpload (file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('masterId', this.data.fileMasterId)
        formData.append('businessID', this.id)
        formData.append('businessType', 'Contract')
        formData.append('subInfo1', '') // 文件类型
        formData.append('subInfo2', file.name) // 文件名
        formData.append('subInfo3', this.data.contract.contractGuid) // 合同id
        this.uploading = true

        // You can use any AJAX library you like
        const _this = this
        const hide = _this.$message.loading('上传中', 0)
        this.$http.post('/api/services/app/UploadAppservice/CommonUpload', formData, {
          contentType: false,
          processData: false,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
          .then((res) => {
            hide()
            if (res.result.statusCode === 200) {
              const data = res.result.data
              _this.fileList.push({
                date: data.creationTime,
                creator: data.creatorUser,
                name: data.fileName,
                file: data.fileUrl,
                id: data.id,
                masterID: data.masterID
              })
              _this.data.fileMasterId = data.masterID
              _this.$message.success('上传成功')
              _this.$emit('ok', res.url)
              _this.visible = false
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
          white-space: nowrap;

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
          text-align: center;

          button {
            margin-right: 10px;
          }
        }
      }
    }
  }

  .ant-upload-disabled {
    button {
      color: rgba(0, 0, 0, 0.25);
      background-color: #f5f5f5;
      border-color: #d9d9d9;
    }
  }
</style>
