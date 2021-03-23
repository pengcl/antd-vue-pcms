<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th colspan="5">
              <a-button :disabled="type === 'view'" icon="plus" @click="add">新增</a-button>
            </th>
          </tr>
          <tr>
            <th style="width: 20%">操作</th>
            <th style="width: 20%">附件</th>
            <th style="width: 20%">页数</th>
            <th style="width: 20%">备注</th>
            <th style="width: 20%">最后修改日期</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="!file.isDeleted" v-for="(file,index) in fileList" :key="index">
            <td>
              <a-upload
                :multiple="false"
                :disabled="type === 'view'"
                v-if="!file.name && file.filePage"
                :before-upload="beforeUpload"
              >
                <a-button @click="choose(index)">请选择</a-button>
              </a-upload>
              <a-button :disabled="type === 'view'" v-if="file.id" :loadding="loading" @click="del(index)" type="danger"
                        icon="delete"></a-button>
            </td>
            <td><a :href="file.url" target="_blank">{{file.name}}</a></td>
            <td>
              <a-input-number v-model="file.filePage" :disabled="type === 'view'"></a-input-number>
              <p v-if="!file.filePage" style="color: red;margin-bottom: 0">请填写页数</p>
            </td>
            <td>
              <a-input v-model="file.remark" :disabled="type === 'view'"></a-input>
            </td>
            <td>{{ file.date | date }}</td>
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
                loading: false,
                index: 0
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
            if (this.id !== '0') {
                BaseService.masterID(this.data.contract.contractGuid).then(res => {
                    this.data.fileMasterId = res.result.data
                    this.getFiles()
                })
            }
        },
        methods: {
            choose (index) {
                this.index = index
            },
            add () {
                const params = {
                    isTemp: true,
                    date: '',
                    creator: '',
                    name: '',
                    url: '',
                    remark: '',
                    filePage: '',
                    id: 0,
                    masterID: this.data.fileMasterId
                }
                this.fileList.push(params)
            },
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
                                url: item.fileUrl,
                                remark: item.remark,
                                id: item.id,
                                masterID: item.masterID,
                                filePage: item.filePage
                            })
                        }
                    })
                    this.fileList = fileList
                })
            },
            del (index) {
                if (this.fileList[index].isTemp) {
                    if (this.fileList[index].id) {
                        this.removeFile(this.fileList[index].id)
                    }
                    this.fileList.splice(index, 1)
                } else {
                    this.removeFile(this.fileList[index].id)
                }
                this.$forceUpdate()
            },
            removeFile (id) {
                const hide = this.$message.loading('删除中..', 0)
                BaseService.removeFile(id).then(res => {
                    hide()
                    if (res.result.statusCode === 200) {
                        this.$message.success('删除成功')
                        if (this.type !== 'create') {
                            this.getFiles()
                        }

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
                formData.append('businessID', this.id === '0' ? '' : this.id)
                formData.append('businessType', 'Contract')
                formData.append('remark', this.fileList[this.index].remark) // 文件类型
                formData.append('filePage', this.fileList[this.index].filePage)
                formData.append('subInfo1', '')
                formData.append('subInfo2', '') // 文件名
                formData.append('subInfo3', '') // 合同id
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
                            _this.fileList[this.index].date = data.creationTime
                            _this.fileList[this.index].creator = data.creatorUser
                            _this.fileList[this.index].name = data.fileName
                            _this.fileList[this.index].url = data.fileUrl
                            _this.fileList[this.index].id = data.id
                            _this.fileList[this.index].filePage = data.filePage
                            _this.fileList[this.index].masterID = data.masterID
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
</style>
