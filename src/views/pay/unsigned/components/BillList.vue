<template>
  <div>
    <a-col :md="24" :sm="24">
      <div class="table-wrapper">
        <table>
          <thead>
          <tr>
            <th colspan="10">
              <a-button icon="plus" @click="add('billList')">
                新增
              </a-button>
            </th>
          </tr>
          <tr>
            <th>操作</th>
            <th>票据类型</th>
            <th>编号</th>
            <th>发票金额</th>
            <th>税率</th>
            <th>税额</th>
            <th>不含税金额</th>
            <th>发票日期</th>
            <th>发票附件</th>
            <th>备注</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="!item.isDeleted" v-for="(item,index) in data.billList" :key="index">
            <td>
              <a-upload name="file"
                        :disabled="type === 'view'"
                        :multiple="false"
                        v-if="item.billType && !item.billFileName"
                        :before-upload="beforeUpload">
                <a-button @click="choose(index)">请选择</a-button>
              </a-upload>
              <a-button @click="del(index)" :disabled="type === 'view'" icon="close">
                删除
              </a-button>
            </td>
            <td>
              <a-select
                :disabled="type === 'view'"
                placeholder="请选择"
                @change="onchange"
                v-model="item.billType"
                v-decorator="['item.billType', { rules: [{required: true, message: '请选择票据类型'}] }]">
                <a-select-option
                  v-for="type in billTypes"
                  :value="type"
                  :key="type">{{ type }}
                </a-select-option>
              </a-select>
            </td>
            <td>
              <a-input :disabled="type === 'view'" v-model="item.billNum"></a-input>
            </td>
            <td>
              <a-input-number :disabled="type === 'view'"
                              v-model="item.billAmount"
                              @change="e => billAmountChange(e,item,'billAmount')"
                              :min="0"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :precision="2"></a-input-number>
              <div style="font-size: 12px;color: red" v-if="!item.billAmount">请填写发票金额</div>
            </td>
            <td>
              <a-input-number :disabled="type === 'view'"
                              v-model="item.taxRate"
                              @change="e => taxRateChange(e,item,'taxRate')"
                              :min="0"
                              :max="100"
                              :formatter="value => `${value}%`"
                              :parser="value => value.replace('%', '')"></a-input-number>
              <div style="font-size: 12px;color: red" v-if="!item.taxRate">请填写税率</div>
            </td>
            <td>
              <a-input-number :disabled="type === 'view'"
                              v-model="item.taxAmount"
                              @change="e => taxAmountChange(e,record,'taxAmount')"
                              :min="0"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :precision="2"></a-input-number>
              <div style="font-size: 12px;color: red" v-if="!item.taxAmount">请填写税额</div>
            </td>
            <td>
              <a-input-number :disabled="true"
                              v-model="item.noTaxAmount"
                              :min="0"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :precision="2"></a-input-number>
            </td>
            <td>
              <a-date-picker :disabled="type === 'view'" v-model="item.billDate" @change="dateChange"></a-date-picker>
            </td>
            <td>
              <a :href="item.billFileUrl" target="_blank" v-if="item.billFileName">{{item.billFileName}}</a>
            </td>
            <td>
              <a-input :disabled="type === 'view'" v-model="item.remark"></a-input>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </a-col>
  </div>
</template>

<script>
    import { UnSignedService } from '../unsigned.service'
    import { Base as BaseService } from '@/api/base'

    export default {
        name: 'BillList',
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
        data () {
            return {
                billTypes: [],
                billType: ''
            }
        },
        created () {
            UnSignedService.billTypes().then(res => {
                this.billTypes = res.result.data
            })
        },
        methods: {
            taxAmountChange (value, record, key) {
                record[key] = value
                record['noTaxAmount'] = record['billAmount'] - record[key]
                this.$forceUpdate()
            },
            billAmountChange (value, record, key) {
                record[key] = value
                if (record['taxRate']) {
                    record['taxAmount'] = record[key] * (record['taxRate'] / 100) / (record['taxRate'] / 100 + 1)
                    record['noTaxAmount'] = record[key] - record['taxAmount']
                }
                this.$forceUpdate()
            },
            taxRateChange (value, record, key) {
                record[key] = value
                if (record['billAmount']) {
                    record['taxAmount'] = (record[key] / 100) * record['billAmount'] / (record[key] / 100 + 1)
                    record['noTaxAmount'] = record['billAmount'] - record['taxAmount']
                }
                this.$forceUpdate()
            },
            add (target) {
                const item = {
                    id: 0,
                    isDeleted: false,
                    gid: '00000000-0000-0000-0000-000000000000',
                    paymentOtherGID: '00000000-0000-0000-0000-000000000000',
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
                if (this.data[target]) {
                    this.data[target].push(item)
                } else {
                    this.data[target] = [item]
                }
                this.$forceUpdate()
            },
            del (index) {
                if (this.data.billList[index].isTemp) {
                    if (this.data.billList[index].billFileID) {
                        this.removeFile(this.data.billList[index].billFileID)
                    }
                    this.data.billList.splice(index, 1)
                } else {
                    this.removeFile(this.data.billList[index].billFileID)
                    this.data.billList[index].isDeleted = true
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
                formData.append('masterId', this.masterID)
                formData.append('businessID', this.type === 'create' ? '' : this.id)
                formData.append('businessType', 'bill')
                formData.append('subInfo1', this.billType) //文件类型
                formData.append('subInfo2', file.name) // 文件名
                this.uploading = true
                const _this = this
                this.$http.post('/api/services/app/UploadAppservice/CommonUpload', formData, {
                    contentType: false,
                    processData: false,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                    .then((response) => {
                        this.$emit('on-change-masterId', response.result.data.masterID)
                        this.data.billList[this.index].billFileID = response.result.data.id
                        this.data.billList[this.index].billFileName = response.result.data.fileName
                        this.data.billList[this.index].billFileUrl = response.result.data.fileUrl
                        this.$forceUpdate()
                        _this.$message.success('上传成功')
                        _this.$emit('ok', response.url)
                        _this.visible = false
                    })
            },
            dateChange (value) {
                this.$forceUpdate()
            },
            choose (index) {
                this.index = index
            },
            onchange (value) {
                this.billType = value
                this.$forceUpdate()
            },
            removeFile (id) {
                BaseService.removeFile(id).then(res => {
                    console.log(res)
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