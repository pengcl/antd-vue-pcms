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
            <tr>
              <td>
                <a-button type="danger" icon="delete"></a-button>
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
  export default {
    name: 'AttachmentInfo',
    data () {
      return {
        fileList: [],
        uploading: false
      }
    },
    methods: {
      beforeUpload (file) {
        console.log(file)
        this.handleUpload(file)
        return false
      },
      handleUpload (file) {
        console.log(file)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('BusinessType', 'Project')
        this.uploading = true

        // You can use any AJAX library you like
        const _this = this
        this.$http.post('/api/services/app/UploadAppservice/CommonUpload', formData, { contentType: false, processData: false, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
          .then((response) => {
            console.log('upload response:', response)
            // var res = response.data
            // if (response.status === 'done') {
            //   _this.imgFile = ''
            //   _this.headImg = res.realPathList[0] // 完整路径
            //   _this.uploadImgRelaPath = res.relaPathList[0] // 非完整路径
            //   _this.$message.success('上传成功')
            //   this.visible = false
            // }
            _this.$message.success('上传成功')
            _this.$emit('ok', response.url)
            _this.visible = false
          })
        /* request({
          url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
          method: 'post',
          processData: false,
          data: formData,
          success: () => {
            this.fileList = []
            this.uploading = false
            this.$message.success('upload successfully.')
          },
          error: () => {
            this.uploading = false
            this.$message.error('upload failed.')
          }
        }) */
      },
      upload (item) {
        console.log(item)
        /* const _this = this
        const formData = new FormData() */
        /* formData.append('file', data, this.fileName)
        this.$http.post('/api/services/app/UploadAppservice/CommonUpload', formData, { contentType: false, processData: false, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
          .then((response) => {
            console.log('upload response:', response)
            // var res = response.data
            // if (response.status === 'done') {
            //   _this.imgFile = ''
            //   _this.headImg = res.realPathList[0] // 完整路径
            //   _this.uploadImgRelaPath = res.relaPathList[0] // 非完整路径
            //   _this.$message.success('上传成功')
            //   this.visible = false
            // }
            _this.$message.success('上传成功')
            _this.$emit('ok', response.url)
            _this.visible = false
          }) */
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
