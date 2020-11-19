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
              <th colspan="4">公司介绍</th>
            </tr>
            <tr>
              <th style="width: 25%">操作</th>
              <th style="width: 25%">公司介绍文件</th>
              <th style="width: 25%">上传人</th>
              <th style="width: 25%">上传日期</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!file.isDeleted" v-for="(file, index) in fileList" :key="index">
              <td>
                <a-button :disabled="type === 'view'" @click="del(file.id,index)" type="danger" icon="delete"></a-button>
              </td>
              <td>{{ file.name }}</td>
              <td>{{ file.creator }}</td>
              <td>{{ file.date }}</td>
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
    name: 'AttachmentInfo',
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
      BaseService.masterID(this.data.vendor.vendorGID).then(res => {
        this.data.fileMasterId = res.result.data
        this.getFiles()
      })
    },
    methods: {
      getFiles () {
        BaseService.fileList(this.data.fileMasterId, this.data.vendor.vendorGID, '', '').then(_res => {
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
      del (id, index) {
        BaseService.removeFile(id).then(res => {
          console.log(res)
          this.fileList.splice(index, 1)
          this.$message.success('删除成功')
        })
      },
      beforeUpload (file) {
        console.log(file)
        this.handleUpload(file)
        return false
      },
      handleUpload (file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('masterId', this.data.fileMasterId)
        // 对创建类型进行判断
        if (this.type === 'create' || this.type === 'add') {
          formData.append('businessID', '')
        } else {
          formData.append('businessID', this.id)
        }
        formData.append('businessType', 'Vendor')
        formData.append('subInfo1', '') // 文件类型
        formData.append('subInfo2', file.name) // 文件名
        formData.append('subInfo3', this.data.vendor.vendorGID) // 供应商id
        this.uploading = true

        // You can use any AJAX library you like
        const _this = this
        this.$http.post('/api/services/app/UploadAppservice/CommonUpload', formData, {
          contentType: false,
          processData: false,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
          .then((res) => {
            console.log('upload response:', res)
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
            console.log(_this)
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
