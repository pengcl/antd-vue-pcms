<template>
  <div>
    <a-form-model ref="form" :model="data" :rules="tableRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row>
        <a-col :sm="24" :md="24">
          <div
            style="padding-top:5px; padding-bottom:5px;padding-left:30px;background-color:#f5f5f5;border-bottom:0;border:1px solid #ccc;margin-top: 20px">
            <a-button :disabled="type === 'view'" icon="plus" @click="add">新增</a-button>
            <a-button @click="clear" :disabled="type === 'view'" icon="stop">重置</a-button>
            <a-button :disabled="type === 'view'" @click="replaceByContract">按原合同条款</a-button>
            <a-button :disabled="type === 'view'" icon="plus" @click="splitBq">分摊工具</a-button>
          </div>
          <a-table
            ref="table"
            :row-key="record => record._id"
            :columns="columns"
            :data-source="data.bqList"
            :scroll="{  y: '300px' }"
            bordered
            :pagination="false"
            :rowClassName="setRowClassName"
          >
            <span slot="action" slot-scope="text, item, index">
              <template>
                <a-button @click="del(index)" :disabled="type === 'view'" icon="close">删除</a-button>
              </template>
            </span>
            <div slot="costCenter" slot-scope="text, item, index">
              <a-form-model-item
                :prop="'bqList.' + index + '.costCenter'"
                :rules="[{ required: !item.isDeleted, message: '请选择成本中心'}]"
              >
                <a-select
                  v-model="item.costCenter"
                  style="width: 300px;margin-top: 12px"
                  :disabled="type === 'view'"
                  @change="costCenterChange"
                >
                  <a-select-option :value="center.id+''" v-for="center in selection.centers"
                                   :text="center.costCenterName" :key="index">
                    {{ center.projectShortName + '-'+ center.costCenterName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <div slot="itemType" slot-scope="text, item, index">
              <a-form-model-item
                :prop="'bqList.' + index + '.itemType'"
                :rules="[{ required: !item.isDeleted, message: '请选择清单项类别' }]"
              >
                <a-select placeholder="请选择" v-model="item.itemType" style="width: 200px;margin-top: 12px"
                          :disabled="type === 'view'">
                  <a-select-option v-for="(item, index) in selection.itemTypes" :key="index" :value="item.code"
                  >{{ item.nameCN }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <div slot="allAmount" slot-scope="text, item, index">
              <a-form-model-item
                :prop="'bqList.' + index + '.allAmount'"
                :rules="[{ required: !item.isDeleted, message: '请输入金额' }]"
              >
                <a-input-number
                  style="margin-top: 12px;width:180px"
                  :disabled="type === 'view'"
                  v-model="item.allAmount"
                  :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="(value) => value.replace(/\元\s?|(,*)/g, '')"
                  :precision="2"
                  @change="amountChange(item,index)"
                ></a-input-number>
              </a-form-model-item>
            </div>
          </a-table>
        </a-col>
        <a-col :md="24" :sm="24" style="margin-top:10px;font-size: 18px;font-weight: bold;text-decoration: underline">
          量清单附件
        </a-col>
        <a-col :md="24" :sm="24">
          <table>
            <thead>
            <tr>
              <th colspan="4">
                <a-button :disabled="type === 'view'" icon="plus" @click="addFile">新增</a-button>
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
            <tr v-if="!file.isDeleted" v-for="(file,index) in fileList" :key="index">
              <td>
                <a-upload
                  :multiple="false"
                  :disabled="type === 'view'"
                  v-if="!file.name"
                  :before-upload="beforeUpload"
                >
                  <a-button @click="choose(index)">请选择</a-button>
                </a-upload>
                <a-button :disabled="type === 'view'" v-if="file.id" :loadding="loading" @click="delFile(index)"
                          type="danger"
                          icon="delete"></a-button>
              </td>
              <td><a :href="file.url" target="_blank">{{file.name}}</a></td>
              <td>
                <a-input v-model="file.remark" :disabled="type === 'view'"></a-input>
              </td>
              <td>{{ file.date | date }}</td>
            </tr>
            </tbody>
          </table>
        </a-col>
      </a-row>
    </a-form-model>
    <contract-bq-modal ref="bqModal" :contract="data" :data="data"></contract-bq-modal>
    <split-bq-modal ref="splitBQModal" :contract="contract"></split-bq-modal>
  </div>
</template>

<script>
    import ContractBqModal from '@/views/change/cip/components/modal/ContractBQModal'
    import { Base as BaseService } from '@/api/base'
    import { SwaggerService } from '@/api/swagger.service'
    import { ChangeService } from '@/views/change/change.service'
    import SplitBqModal from '@/views/change/cip/components/modal/SplitBQModal'

    const columns = [
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            width: 150,
        },
        {
            title: '业态成本中心',
            dataIndex: 'costCenter',
            scopedSlots: { customRender: 'costCenter' },
            width: 300,
        },
        {
            title: '清单项类别',
            dataIndex: 'itemType',
            scopedSlots: { customRender: 'itemType' },
            width: 220,
        },
        {
            title: '金额',
            dataIndex: 'allAmount',
            scopedSlots: { customRender: 'allAmount' },
            width: 200,
        }
    ]

    export default {
        name: 'CostEstimates',
        components: { ContractBqModal, SplitBqModal },
        data () {
            return {
                columns: columns,
                selection: {},
                form: this.$form.createForm(this),
                loading: false,
                maxId: 0,
                fileList: [],
                index: 0,
                tableRules: {
                    bqList: [],
                },
                contract: {
                    contractGuid: null
                }
            }
        },
        created () {
            BaseService.itemTypes('vo').then((res) => {
                this.selection.itemTypes = res.result.data
                this.$forceUpdate()
            })

        },
        watch: {
            'data.contractGID' (value) {
                if (value) {
                    ChangeService.getCostCenters(this.data.contractGID).then((res) => {
                        this.selection.centers = res.result.data
                        this.$forceUpdate()
                    })
                    this.contract.contractGuid = value
                }
            },
            'data.attachmentID' (value) {
                if (value) {
                    if (this.id !== '0') {
                        this.getFiles()
                    }
                }
            }
        },
        filters: {
            getValue (item) {
                const list = item.costCenter ? item.costCenter.split(';').map(Number) : []
                list.forEach((item, index) => {
                    if (isNaN(item)) {
                        list.splice(index, 1)
                    }
                })
                return list
            },
        },
        props: {
            data: {
                type: Object,
                default: null,
            },
            type: {
                type: String,
                default: 'view',
            },
            id: {
                type: String,
                default: '0',
            },
        },
        methods: {
            splitBq () {
                this.$refs.splitBQModal.showTable()
            },
            costCenterChange (value, option) {
                const index = option.data.key
                const _index = this.selection.centers.findIndex(item => item.id + '' === value)
                this.data.bqList[index].costCenterName = this.selection.centers[_index].costCenterName + '-' + this.selection.centers[_index].projectShortName
            },
            add (item, addData) {
                let data = SwaggerService.getForm('BalanceContractDto_BQ')
                if (addData) {
                    data = Object.assign({}, addData)
                    data.contractBQGuid = ''
                    data.contractID = ''
                } else {
                    data.allAmount = 0
                }
                data.isTemp = true
                data.id = 0
                data.isDeleted = false
                data.gid = '00000000-0000-0000-0000-000000000000'
                data.balanceContractGID = '00000000-0000-0000-0000-000000000000'
                data.vobqGuid = ''
                data.void = ''
                this.data.bqList.push(data)
                if (addData) {
                    this.countAmount()
                }
            },
            del (index) {
                const item = this.data.bqList[index]
                if (item.isTemp) {
                    this.data.bqList.splice(index, 1)
                } else {
                    item.isDeleted = true
                }
                this.countAmount()
                this.$forceUpdate()
            },
            clear () {
                const list = []
                this.data.bqList.forEach((item) => {
                    item.isDeleted = true
                    if (!item.isTemp) {
                        list.push(item)
                    }
                    this.data.bqList = list
                    this.$forceUpdate()
                })
                this.countAmount()
            },
            centerChange (value, target, item) {
                item.costCenterName = target.data.attrs.text
                console.log('target', target)
            },
            amountChange (item, index) {
                let isValid = true
                this.$refs.form.validateField([
                    'bqList.' + index + '.costCenter',
                    'bqList.' + index + '.itemType'], valid => {
                    if (valid) {
                        isValid = false
                    }
                })
                if (isValid) {
                    const value = item.allAmount
                    setTimeout(() => {
                        if (value === item.allAmount) {
                            this.countAmount()
                        }
                    }, 1000)
                }

            },
            countAmount () {
                ChangeService.bqAmount(this.data.bqList).then((res) => {
                    if (res.result.statusCode === 200) {
                        this.data.balanceAdjustAmount = res.result.data.voAmount
                        this.data.progressBalanceAmount = this.data.preBalanceAmount + this.data.balanceAdjustAmount
                        this.data.settlementAmount = this.data.progressBalanceAmount + this.data.contractNSCPreBalanceAmount
                        this.data.payableAmount = this.data.settlementAmount - this.data.paymentAmount
                    }
                })
            },
            replaceByContract () {
                this.$refs.bqModal.showTable()
            },
            setRowClassName (record, index) {
                if (record.isDeleted) {
                    return 'delete-row'
                }
                return ''
            },
            choose (index) {
                this.index = index
            },
            addFile () {
                const params = {
                    isTemp: true,
                    date: '',
                    creator: '',
                    name: '',
                    url: '',
                    remark: '',
                    id: 0,
                    masterID: this.data.attachmentID
                }
                this.fileList.push(params)
            },
            getFiles () {
                BaseService.fileList(this.data.attachmentID, this.id, 'BQ', '').then(_res => {
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
                                masterID: item.masterID
                            })
                        }
                    })
                    this.fileList = fileList
                })
            },
            delFile (index) {
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
                formData.append('masterId', this.data.attachmentID)
                formData.append('businessID', this.id === '0' ? '' : this.id)
                formData.append('businessType', 'balanceContract')
                formData.append('remark', this.fileList[this.index].remark) // 文件类型
                formData.append('subInfo1', 'BQ') // 文件名
                formData.append('subInfo2', '') // 合同id
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
                            _this.fileList[this.index].masterID = data.masterID
                            _this.data.attachmentID = data.masterID
                            _this.$message.success('上传成功')
                            _this.$emit('ok', res.url)
                            _this.visible = false
                        }
                    })
            }
        },
    }
</script>

<style lang="less" scoped>
  .ant-form .ant-form-item .ant-form-item-label.ant-col-8 {
    width: 15em;
  }

  .ant-form .ant-form-item .ant-form-item-control-wrapper.ant-col-16 {
    width: calc(100% - 15em);
  }

  /deep/ .has-error .ant-form-explain {
    white-space: nowrap;
  }

  /deep/ .ant-table-tbody > tr > td {
    padding: 8px 10px !important;
    text-align: center;
  }

  /deep/ .delete-row {
    display: none;
  }

  button {
    margin-right: 10px;
  }

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

          .ant-input {
            min-width: 60px;
          }

          /deep/ .has-error .ant-form-explain {
            white-space: nowrap;
          }
        }
      }
    }
  }
</style>
