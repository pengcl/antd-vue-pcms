<template>
  <div>
    <a-col :md="24" :sm="24">
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
          <th>附件名称</th>
          <th>附件类型</th>
          <th>附件页数</th>
          <th>最后修改时间</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in fileList" v-if="item != null" :key="index">
          <td>
            <a-upload name="file"
                      v-if="item.fileInfo && item.filePage && item.id === 0"
                      :multiple="false"
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
            <a-select
              placeholder="请选择"
              v-model="item.fileInfo"
              @change="onChange"
              :disabled="item.id > 0"
              v-decorator="['item.fileInfo', { rules: [{required: true, message: '请选择附件类型'}] }]">
              <a-select-option
                v-for="item in fileTypeList"
                :value="item.code"
                :key="item.code">{{ item.nameCN }}
              </a-select-option>
            </a-select>
          </td>
          <td>
            <a-input-number :min="1" v-model="item.filePage" @change="onFilePageChange" :disabled="item.id > 0"></a-input-number>
          </td>
          <td>
            <a-input v-model="item.creationTime" :disabled="true"></a-input>
          </td>
        </tr>
        </tbody>
      </table>
    </a-col>
  </div>
</template>

<script>
    import { Base as BaseService } from '@/api/base'
    import { ChangeService } from '@/views/change/change.service'

    export default {
        name: 'AttachmentList',
        data () {
            return {
                selection: {},
                loading: false,
                fileTypeList: [],
                fileList: [],
                fileInfo : '',
                filePage : null,
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
            stage : {
                type : String,
                default : 'CIP'
            }
        },
        watch: {},
        created () {
            ChangeService.fileTypes().then(res => {
                this.fileTypeList = res.result.data
            })
            BaseService.masterID(this.data.voMasterInfo.voGuid).then(res => {
              this.data.fileMasterId = res.result.data
              BaseService.fileList(this.data.fileMasterId, this.data.voMasterInfo.voGuid, '', '').then(_res => {
                this.fileList = _res.result.data
              })
            })
        },
        methods: {
            choose (index) {
                this.index = index
            },
            onChange (value) {
                this.fileInfo = value
            },
            onFilePageChange(value){
              this.filePage = value
            },
            add () {
                const item = {
                    id: 0,
                    isDeleted: false,
                    isTemp: true,
                    fileType: '',
                    fileName: '',
                    fileUrl: '',
                    creationTime: '',
                    creatorUser: '',
                    fileInfo : ''
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
            del (index) {
                const that = this
                this.$confirm({
                  title : '删除提示',
                  content : '是否确认删除该附件？',
                  onOk () {
                    console.log('点击了删除的确认事件',index,that.fileList[index])
                    if(that.fileList[index].id){
                      BaseService.removeFile(that.fileList[index].id).then(res => {
                        if(res.result.statusCode === 200){
                          that.$message.info('附件删除成功')
                          that.fileList.splice(index, 1)
                          that.$forceUpdate()
                        }
                      })
                    }else{
                      that.fileList.splice(index, 1)
                      that.$forceUpdate()
                    }
                  },
                  onCancel(){

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
                formData.append('businessID', '')
                formData.append('businessType', this.stage)
                formData.append('subInfo1', '') //
                formData.append('subInfo2', '') // 
                formData.append('subInfo3', '') // 
                formData.append('fileInfo', this.fileInfo) // 附件类型
                formData.append('filePage', this.filePage) // 附件页数
                this.uploading = true
                const _this = this
                this.$http.post('/api/services/app/UploadAppservice/CommonUpload', formData, {
                    contentType: false,
                    processData: false,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then((response) => {
                    console.log('upload response:', response)
                    
                    this.fileList[this.index] = Object.assign(this.fileList[this.index],response.result.data)
                    console.log('fileList[index]',this.fileList[this.index])
                    _this.data.fileMasterId = response.result.data.masterID
                    _this.$message.success('上传成功')
                    _this.$emit('ok', response.url)
                    _this.visible = false
                    _this.$forceUpdate
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