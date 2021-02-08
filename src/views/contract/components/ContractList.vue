<template>
  <div style="margin-bottom:15px">
    <a-form-model
      ref="form"
      :model="data.contract"
      :rules="rules"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }">
      <a-row :gutter="24">
        <a-col :md="12" :sm="24">
          <a-form-model-item
            label="合同金额"
            prop="contractAmount"
          >
            <a-input-number
              :disabled="true"
              placeholder="请生成合同金额"
              v-model="data.contract.contractAmount"
              :min="0"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\\s?|(,*)/g, '')"
              :precision="2"/>
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-model-item
            label="有效合同金额"
            prop="contractEffectAmount"
          >
            <a-input-number
              :disabled="true"
              placeholder="请生成有效合同金额"
              v-model="data.contract.contractEffectAmount"
              :min="0"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\\s?|(,*)/g, '')"
              :precision="2"/>
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-model-item
            label="合同内暂定款金额"
            prop="contractPSAmount"
          >
            <a-input-number
              :disabled="true"
              placeholder="请生成合同内暂定款金额"
              v-model="data.contract.contractPSAmount"
              :min="0"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\\s?|(,*)/g, '')"
              :precision="2"/>
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-model-item
            label="合同内可选择项目金额"
            prop="contractOPTAmount"
          >
            <a-input-number
              :disabled="true"
              placeholder="合同内可选择项目金额"
              v-model="data.contract.contractOPTAmount"
              :min="0"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\\s?|(,*)/g, '')"
              :precision="2"/>
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-model-item
            label="专业分包合同金额"
            prop="contractPCPreAmount"
          >
            <a-input-number
              :disabled="true"
              placeholder="专业分包合同金额"
              v-model="data.contract.contractPCPreAmount"
              :min="0"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\\s?|(,*)/g, '')"
              :precision="2"/>
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-model-item
            label="甲供材金额"
            prop="contractDSAmount"
          >
            <a-input-number
              :disabled="true"
              placeholder="甲供材金额"
              v-model="data.contract.contractDSAmount"
              :min="0"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\\s?|(,*)/g, '')"
              :precision="2"/>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <a-form-model
      ref="tableForm"
      :model="data"
      :rules="tableRules"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }">
      <a-row :gutter="48">
        <a-col :md="12" :sm="24">
        </a-col>
        <a-col :md="12" :sm="24">
          <a-button type="success" style="float: right">导入导出</a-button>
        </a-col>
        <a-col :md="24" :sm="24">
          <div
            style="padding-top:5px; padding-bottom:5px;padding-left:15px;background-color:#f5f5f5;border-bottom:0;border:1px solid #ccc;margin-top: 20px">
            <a-button :disabled="type === 'view'" icon="plus" @click="add()">
              新增
            </a-button>
            <a-button :disabled="type === 'view'" style="margin-left: 15px" @click="showShareTool">分摊工具</a-button>
            <a-button :disabled="type === 'view'" icon="stop" @click="clear()" style="margin-left: 15px">重置</a-button>
            <!--<a-button
              :loading="loading"
              :disabled="type === 'view'"
              style="margin-left: 15px"
              type="primary"
              @click="getContractAmount()">
              计算金额
            </a-button>-->
          </div>
          <a-table
            :columns="columns"
            :data-source="data.contractBQNewlst | filterDeleted"
            size="default"
            rowKey="_id"
            :scroll="{ x : '1000px',y : '600px' }"
            :pagination="false"
            bordered>
            <template slot="action" slot-scope="text, record,index">
              <a-button @click="del(index)" :disabled="type === 'view'" icon="close">
                删除
              </a-button>
            </template>
            <template slot="costCenter" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'contractBQNewlst.' + index + '.costCenter'"
                :rules="[{required: !record.isDeleted, message: '请选择成本中心' }]"
              >
                <a-input :disabled="type === 'view'" :hidden="true" v-model="record.costCenter"/>
                <a-select
                  :disabled="type === 'view'"
                  :default-value="record | getValue(index)"
                  style="width: 200px;margin-top: 15px"
                  @change="centerChange">
                  <a-select-option
                    :value="index + ';' + center.id + ';' + center.costCenterName"
                    :itemIndex="index"
                    v-for="center in selection.centers"
                    :key="JSON.stringify(center)">
                    {{ center.costCenterName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </template>

            <template slot="itemType" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'contractBQNewlst.' + index + '.itemType'"
                :rules="[{required: !record.isDeleted, message: '请选择清单项类别' }]"
              >
                <a-select
                  :disabled="type === 'view'"
                  placeholder="请选择"
                  style="margin-top: 15px;width: 160px"
                  @change="typeChange"
                  v-model="record.itemType">
                  <a-select-option v-for="(item, index) in selection.itemTypes" :key="index" :value="item.code">
                    {{ item.nameCN }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </template>
            <template slot="allAmount" slot-scope="text, record,index">
              <a-input-number
                v-model="record.allAmount"
                :min="0"
                @change="valueChange(record,index)"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\\s?|(,*)/g, '')"
                :precision="2"></a-input-number>
            </template>
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
              <td>{{ file.date | moment }}</td>
            </tr>
            </tbody>
          </table>
        </a-col>
      </a-row>
    </a-form-model>
    <share-tool-modal ref="shareTool"
                      :contract="data"
                      :type="type"></share-tool-modal>
  </div>
</template>

<script>
    import { Base as BaseService, removeItem, clearItems } from '@/api/base'
    import { SwaggerService } from '@/api/swagger.service'
    import { ContractService } from '@/views/contract/contract.service'
    import ShareToolModal from './contractList/ShareToolModal'
    import { digitUppercase } from '@/utils/util'

    const columns = [
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            width: 200
        },
        {
            title: '业态成本中心',
            dataIndex: 'costCenter',
            scopedSlots: { customRender: 'costCenter' },
            width: 200
        },
        {
            title: '清单项类别',
            dataIndex: 'itemType',
            scopedSlots: { customRender: 'itemType' },
            width: 200
        },
        {
            title: '金额',
            dataIndex: 'allAmount',
            scopedSlots: { customRender: 'allAmount' },
            width: 200
        }
    ]
    const contractTypes = {
        '15': 'contract',
        '16': 'sa',
        '17': 'nsc'
    }

    export default {
        name: 'ContractList',
        components: { ShareToolModal },
        data () {
            return {
                selection: {},
                form: this.$form.createForm(this),
                loading: false,
                columns: columns,
                fileList: [],
                index: 0,
                rules: {
                    contractAmount: [{ required: true, message: '请选择带数项生成合同金额', trigger: 'change' }],
                    contractEffectAmount: [{ required: true, message: '请选择带数项生成合同有效金额', trigger: 'change' }],
                    contractDSAmount: [{ required: true, message: '请选择带数项生成甲供材金额', trigger: 'change' }],
                    contractOPTAmount: [{ required: true, message: '请选择带数项生成合同内可选择项目金额', trigger: 'change' }],
                    contractPCPreAmount: [{ required: true, message: '请选择带数项生成专业分包合同金额', trigger: 'change' }],
                    contractPSAmount: [{ required: true, message: '请选择带数项请生成合同内暂定款金额', trigger: 'change' }]
                },
                tableRules: {
                    contractBQNewlst: []
                }
            }
        },
        created () {
            if (this.id !== '0') {
                BaseService.masterID(this.data.contract.contractGuid).then(res => {
                    this.data.fileMasterId = res.result.data
                    this.getFiles()
                })
            }
            this.data.contractBQNewlst.forEach((item, index) => {
                item._id = index
            })
            if (this.data.contract.contractCategory) {
                const contractTypeKey = contractTypes[this.data.contract.contractCategory + '']
                if (contractTypeKey) {
                    BaseService.itemTypes(contractTypeKey).then(res => {
                        this.selection.itemTypes = res.result.data
                        this.$forceUpdate()
                    })
                }
            }
            this.data.contract.contractYear = new Date().getFullYear()
            ContractService.centers(this.data.contract.tenderPackageItemID).then(res => {
                this.selection.centers = res.result.data
                this.$forceUpdate()
            })
            BaseService.unitTypes().then(res => {
                this.selection.unitTypes = res.result.data
                this.$forceUpdate()
            })
        },
        watch: {
            'data.contract.contractCategory' (value) {
                // 获取主合同需要通过合同类别参数
                const contractTypeKey = contractTypes[value + '']
                if (contractTypeKey) {
                    BaseService.itemTypes(contractTypeKey).then(res => {
                        this.selection.itemTypes = res.result.data
                        this.$forceUpdate()
                    })
                }
            },
            'data.contract.tenderPackageItemID' (value) {
                ContractService.centers(value).then(res => {
                    this.selection.centers = res.result.data
                    this.$forceUpdate()
                })
            }
        },
        filters: {
            filterDeleted (items) {
                return items.filter(item => !item.isDeleted)
            },
            getValue (item, index) {
                const values = []
                const ids = item.costCenter ? item.costCenter.split(';') : []
                const names = item.costCenterName ? item.costCenterName.split(';') : []
                ids.forEach((id, idsIndex) => {
                    const value = index + ';' + id + ';' + names[idsIndex]
                    values.push(value)
                })
                return values
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
            project: {
                type: Object,
                default: null
            },
            activeKey: {
                type: null,
                default: 4
            }
        },
        methods: {
            clear () {
                const list = []
                this.data.contractBQNewlst.forEach((item) => {
                    item.isDeleted = true
                    if (!item.isTemp) {
                        list.push(item)
                    }
                    this.data.contractBQNewlst = list
                    this.$forceUpdate()
                })
            },
            showShareTool () {
                this.$refs.shareTool.showTable()
            },
            add (addData) {
                let data = SwaggerService.getForm('ContractBQDto')
                if (addData) {
                    data = Object.assign({}, addData)
                    data.contractBQGuid = ''
                    data.contractID = ''
                } else {
                    data.allAmount = 0
                }
                data.id = 0
                data.isDeleted = false
                data.isTemp = true
                data.contractID = this.id === '0' ? '' : this.id
                this.data.contractBQNewlst.push(data)
                if (addData) {
                    this.getContractAmount()
                }
            },
            del (index) {
                const items = this.data.contractBQNewlst
                removeItem(index, items)
                this.getContractAmount()
                this.$forceUpdate()
            },
            getContractAmount () {
                if (this.data.contract.contractCategory && this.data.contract.tenderPackageItemID) {
                    let isValid = true
                    this.data.contractBQNewlst.forEach((item, index) => {
                        this.$refs.tableForm.validateField([
                            'contractBQNewlst.' + index + '.costCenter',
                            'contractBQNewlst.' + index + '.itemType'], valid => {
                            if (valid) {
                                isValid = false
                            }
                        })
                    })
                    if (isValid) {
                        this.loading = true
                        ContractService.amount(this.data.contract.contractCategory, this.data.contractBQNewlst).then(res => {
                            this.loading = false
                            const data = res.result.data
                            this.data.contract.contractAmount = data.contractAmount
                            this.data.master.contractAmount = this.data.contract.contractAmount
                            this.data.contract.equivalentAmount = this.data.master.contractAmount * this.data.contract.currencyExchangeRate
                            this.data.master.contractAmountText = digitUppercase(this.data.master.contractAmount)
                            this.data.contract.contractEffectAmount = data.contractEffectAmount
                            this.data.contract.contractAmountText = data.contractAmountText
                            this.data.contract.contractDSAmount = data.contractDSAmount
                            this.data.contract.contractOPTAmount = data.contractOPTAmount
                            this.data.contract.contractPCPreAmount = data.contractPCPreAmount
                            this.data.contract.contractPSAmount = data.contractPSAmount
                            this.data.contract.contractTaxAmount = this.data.contract.contractAmount * this.data.contract.taxRate * 0.01
                            this.data.contract.contractNoTaxAmount = this.data.contract.contractAmount - this.data.contract.contractTaxAmount
                        })
                    }
                }
            },
            typeChange () {
                this.getContractAmount()
            },
            centerChange (value) {
                const arr = value.split(';')
                const item = this.data.contractBQNewlst[arr[0]]
                item.costCenter = arr[1]
                item.costCenterName = arr[2]
                this.getContractAmount()
            },
            valueChange (item, index) {
                if (!this.data.contract.contractCategory) {
                    item.allAmount = 0
                    this.$emit('validate-field', {
                        activeKey: 1,
                        component: 'baseInfo',
                        filed: 'contractCategory'
                    })
                } else if (!this.data.contract.tenderPackageItemID) {
                    item.allAmount = 0
                    this.$emit('validate-field', {
                        activeKey: 1,
                        component: 'baseInfo',
                        filed: 'tenderPackageItemID'
                    })
                } else {
                    let isValid = true
                    this.$refs.tableForm.validateField([
                        'contractBQNewlst.' + index + '.costCenter',
                        'contractBQNewlst.' + index + '.itemType'], valid => {
                        if (valid) {
                            if (item.allAmount !== 0) {
                                alert(valid)
                            }
                            item.allAmount = 0
                            isValid = false
                        }
                    })
                    if (isValid) {
                        const value = item.allAmount
                        setTimeout(() => {
                            if (value === item.allAmount) {
                                this.getContractAmount()
                            }
                        }, 1500)
                    }
                }
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
                    masterID: this.data.fileMasterId
                }
                this.fileList.push(params)
            },
            getFiles () {
                BaseService.fileList(this.data.fileMasterId, this.data.contract.contractGuid, 'BQ', '').then(_res => {
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
                formData.append('masterId', this.data.fileMasterId)
                formData.append('businessID', this.id === '0' ? '' : this.id)
                formData.append('businessType', 'Contract')
                formData.append('remark', this.fileList[this.index].remark) // 文件类型
                formData.append('subInfo1', 'BQ')
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
                            _this.fileList[this.index].masterID = data.masterID
                            _this.data.fileMasterId = data.masterID
                            _this.$message.success('上传成功')
                            _this.$emit('ok', res.url)
                        }
                    })
            }
        }
    }
</script>

<style lang="less" scoped>
  .ant-form .ant-form-item .ant-form-item-label.ant-col-8 {
    width: 15em
  }

  .ant-form .ant-form-item .ant-form-item-control-wrapper.ant-col-16 {
    width: calc(100% - 15em);
  }

  /deep/ .has-error .ant-form-explain {
    white-space: nowrap;
  }

  /deep/ .ant-table-tbody > tr > td {
    padding: 0px 16px !important;
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

          .ant-input {
            min-width: 60px;
          }

          button {
            margin-right: 10px;
          }

          /deep/ .has-error .ant-form-explain {
            white-space: nowrap;
          }
        }
      }
    }
  }
</style>
