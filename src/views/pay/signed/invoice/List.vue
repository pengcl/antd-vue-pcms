<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-row :gutter="48">
        <a-col :md="24" :sm="24">
          <div class="table-wrapper">
            <table>
              <thead>
              <tr>
                <th colspan="9">
                  <a-button icon="plus" @click="add">
                    新增发票
                  </a-button>
                </th>
              </tr>
              <tr>
                <th>操作</th>
                <th>票据类型</th>
                <th>编号</th>
                <th>发票金额</th>
                <th>税率</th>
                <th>不含税金额</th>
                <th>发票日期</th>
                <th>发票附件</th>
                <th>备注</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="!item.isDeleted" v-for="(item,index) in billList" :key="index">
                <td>
                  <a-upload name="file"
                            :multiple="false"
                            v-if="item.billType"
                            :before-upload="beforeUpload">
                    <a-button @click="choose(index)">请选择</a-button>
                  </a-upload>
                  <a-button @click="del(index)" icon="close">
                    删除
                  </a-button>
                </td>
                <td>
                  <a-select
                    placeholder="请选择"
                    @change="onchange"
                    v-model="item.billType"
                    v-decorator="['item.billType', { rules: [{required: true, message: '请选择票据类型'}] }]">
                    <a-select-option
                      v-for="type in billTypeList"
                      :value="type"
                      :key="type">{{ type }}
                    </a-select-option>
                  </a-select>
                </td>
                <td>
                  <a-input v-model="item.billNum"></a-input>
                </td>
                <td>
                  <a-input-number v-model="item.billAmount"
                                  :min="0"
                                  :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                                  :precision="2"></a-input-number>
                </td>
                <td>
                  <a-input-number v-model="item.taxRate"
                                  :min="0"
                                  :max="100"
                                  :formatter="value => `${value}%`"
                                  :parser="value => value.replace('%', '')"></a-input-number>
                </td>
                <td>
                  <a-input-number v-model="item.noTaxAmount"
                                  :min="0"
                                  :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                                  :precision="2"></a-input-number>
                </td>
                <td>
                  <a-date-picker v-model="item.billDate"></a-date-picker>
                </td>
                <td>
                  <a :href="item.billFileUrl" target="_blank" v-if="item.billFileName">{{item.billFileName}}</a>
                </td>
                <td>
                  <a-input v-model="item.remark"></a-input>
                </td>
              </tr>
              <tr>
                <td colspan="2">发票合计</td>
                <td colspan="7"></td>
              </tr>
              <tr>
                <td colspan="2">累计发票金额</td>
                <td colspan="7"></td>
              </tr>
              <tr>
                <td colspan="2">累计票款差额</td>
                <td colspan="7"></td>
              </tr>
              </tbody>
            </table>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import { SignedService } from '@/views/pay/signed/signed.service'

    export default {
        name: 'List',
        data () {
            return {
                billList: [],
                billType: '',
                billTypeList: []
            }
        },
        created () {
            SignedService.billList().then(res => {
                this.billTypeList = res.result.data
            })
        },
        methods: {
            add () {
                const item = {
                    isDeleted: false,
                    isTemp: true,
                    billType: '',
                    billNum: '',
                    billAmount: '',
                    taxRate: '',
                    noTaxAmount: '',
                    billDate: '',
                    billFileID: '',
                    billFileName: '',
                    billFileUrl: '',
                    remark: ''
                }
                this.billList.push(item)
            },
            del (index) {
                if (this.billList[index].isTemp) {
                    if (this.billList[index].billFileID) {
                        this.removeFile(this.billList[index].billFileID)
                    }
                    this.billList.splice(index, 1)
                } else {
                    this.removeFile(this.billList[index].billFileID)
                    this.billList[index].isDeleted = true
                }
                this.$forceUpdate()
            },
            beforeUpload (file) {
                this.handleUpload(file)
                return false
            },
            handleUpload (file) {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('masterId', this.data['masterID'])
                formData.append('businessID', this.id)
                formData.append('businessType', 'bill')
                formData.append('subInfo1', this.billType) //文件类型
                formData.append('subInfo2', file.name) // 文件名
                formData.append('subInfo3', this.data['contractGID']) // 合同id
                this.uploading = true
                const _this = this
                this.$http.post('/api/services/app/UploadAppservice/CommonUpload', formData, {
                    contentType: false,
                    processData: false,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                    .then((response) => {
                        this.data.billList[this.index].billFileID = response.result.data.id
                        this.data.billList[this.index].billFileName = response.result.data.fileName
                        this.data.billList[this.index].billFileUrl = response.result.data.fileUrl
                        this.masterID = response.result.data.masterID
                        this.$forceUpdate()
                        _this.$message.success('上传成功')
                        _this.$emit('ok', response.url)
                        _this.visible = false
                    })
            },
            removeFile (id) {
                BaseService.removeFile(id).then(res => {
                    console.log(res)
                })
            },
            choose (index) {
                this.index = index
            },
            onchange (value) {
                this.billType = value
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