<template>
  <div>
    <a-col :md="24" :sm="24">
      <div class="table-wrapper">
        <table>
          <thead>
          <tr>
            <th colspan="5">
              <a-button icon="plus" @click="add" :disabled="type === 'view'">
                新增
              </a-button>
            </th>
          </tr>
          <tr>
            <th>操作</th>
            <th>文件名称</th>
            <th>文件页数</th>
            <th>上传时间</th>
            <th>上传人</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in fileList" :key="index" v-if="!item.isDeleted">
            <td>
              <a-upload name="file"
                        :disabled="type === 'view'"
                        :multiple="false"
                        v-if="item.filePage && !item.fileName"
                        :before-upload="beforeUpload">
                <a-button @click="choose(index)">请选择</a-button>
              </a-upload>
              <a-button @click="del(index)" :disabled="type === 'view'" icon="close">
                删除
              </a-button>
            </td>
            <td>
              <a :href="item.fileUrl" target="_blank" v-if="item.fileName">{{item.fileName}}</a>
            </td>
            <td>
              <a-input-number v-model="item.filePage" :disabled="type === 'view'"></a-input-number>
              <p v-if="!item.filePage" style="color: red;margin-bottom: 0">请填写页数</p>
            </td>
            <td>
              {{item.creationTime | date}}
            </td>
            <td>
              {{item.creatorUser}}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </a-col>
  </div>
</template>

<script>
    import { Base as BaseService } from '@/api/base'

    export default {
        name: 'AttachmentList',
        data () {
            return {
                fileList: [],
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
            },
            masterID: {
                type: Number,
                default: 0
            }
        },
        created () {

        },
        watch: {
            'data.attachmentID' (value) {
                if (value) {
                    if (this.type !== 'create') {
                        this.getFileList(value)
                    }
                }
            }
        },
        methods: {
            getFileList (id) {
                BaseService.fileList(id, this.id, '', '').then(res => {
                    const fileList = []
                    if (res.result.data.length > 0) {
                        res.result.data.forEach(item => {
                            fileList.push({
                                isDeleted: false,
                                isTemp: false,
                                fileName: item.fileName,
                                fileUrl: item.fileUrl,
                                fileId: item.id,
                                filePage: item.filePage,
                                creationTime: item.creationTime,
                                creatorUser: item.creatorUser
                            })
                        })
                        this.fileList = fileList
                        this.$forceUpdate()
                    }
                })
            },
            add () {
                const item = {
                    isDeleted: false,
                    isTemp: true,
                    fileName: '',
                    fileUrl: '',
                    fileId: '',
                    filePage:'',
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
            choose (index) {
                this.index = index
            },
            del (index) {
                if (this.fileList[index].isTemp) {
                    if (this.fileList[index].fileId) {
                        this.removeFile(this.fileList[index].fileId)
                    }
                    this.fileList.splice(index, 1)
                } else {
                    this.removeFile(this.fileList[index].fileId)
                    this.fileList[index].isDeleted = true
                }
                this.$forceUpdate()
            },
            removeFile (id) {
                BaseService.removeFile(id).then(res => {
                    console.log(res)
                })
            },
            beforeUpload (file) {
                this.handleUpload(file)
                return false
            },
            handleUpload (file) {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('masterId', this.masterID)
                formData.append('businessID', this.type === 'create' ? '' : this.id)
                formData.append('businessType', 'paymentOther')
                formData.append('filePage', this.fileList[this.index].filePage)
                formData.append('subInfo1', '') // 文件名
                formData.append('subInfo2', '')
                this.uploading = true
                const _this = this
                this.$http.post('/api/services/app/UploadAppservice/CommonUpload', formData, {
                    contentType: false,
                    processData: false,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                    .then((response) => {
                        this.$emit('on-change-masterId', response.result.data.masterID)
                        this.fileList[this.index].fileName = response.result.data.fileName
                        this.fileList[this.index].fileId = response.result.data.id
                        this.fileList[this.index].filePage = response.result.data.filePage
                        this.fileList[this.index].creationTime = response.result.data.creationTime
                        this.fileList[this.index].creatorUser = response.result.data.creatorUser
                        this.fileList[this.index].fileUrl = response.result.data.fileUrl
                        _this.$message.success('上传成功')
                        _this.$emit('ok', response.url)
                        _this.visible = false
                    })
            },
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