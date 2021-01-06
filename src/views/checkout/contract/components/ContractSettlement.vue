<template>
  <a-form-model ref="form" :model="data" :rules="rules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="12" :sm="24">
        <a-form-model-item label="承建商申报金额" prop="progressRequestAmount">
          <a-input-number v-model="data.progressRequestAmount"
                          :disabled="type === 'view'"
                          :min="0"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="承建商申报日期" prop="progressSendDate">
          <a-date-picker style="width: 100%"
                         v-model="data.progressSendDate"
                         :disabled="type === 'view'"></a-date-picker>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="顾问公司/PQS初审金额" prop="approvalRequestAmount">
          <a-input-number v-model="data.approvalRequestAmount"
                          :disabled="type === 'view'"
                          :min="0"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="顾问公司/PQS初审日期" prop="approvalRequestDate">
          <a-date-picker style="width: 100%"
                         v-model="data.approvalRequestDate"
                         :disabled="type === 'view'"></a-date-picker>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="申请结算金额" prop="progressBalanceAmount">
          <a-input-number v-model="data.progressBalanceAmount"
                          :disabled="true"
                          :min="0"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="申请结算日期" prop="progressBalanceDate">
          <a-date-picker style="width: 100%"
                         v-model="data.progressBalanceDate"
                         :disabled="type === 'view'"></a-date-picker>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="结算书编号">
          <a-input v-model="data.balanceDocNo"
                   :disabled="type === 'view'"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="最后竣工日期" prop="finalCompletionDate">
          <a-date-picker style="width: 100%"
                         v-model="data.finalCompletionDate"
                         :disabled="type === 'view'"></a-date-picker>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="保修比列">
          <a-input-number v-model="data.guaranteeRatio"
                          :disabled="type === 'view'"
                          :min="0"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="保修金额">
          <a-input-number v-model="data.guaranteeAmount"
                          :disabled="type === 'view'"
                          :min="0"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="保修日期">
          <a-date-picker style="width: 100%"
                         v-model="data.guaranteeDate"
                         :disabled="type === 'view'"></a-date-picker>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="结算方式" prop="balanceType">
          <a-select v-model="data.balanceType"
                    :disabled="type === 'view'">
            <a-select-option :value="'阶段结算'">阶段结算</a-select-option>
            <a-select-option :value="'最终结算'">最终结算</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="经办人">
          <a-input v-model="data.operator"
                   :disabled="true"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="经办部门" prop="operatorDept">
          <a-tree-select
            :disabled="type === 'view'"
            style="width: 100%"
            :tree-data="dps"
            @select="onSelect"
            :dropdown-style="{ maxHeight: '400px', overflowH: 'auto' }"
            search-placeholder="请选择"
            v-model="data.operatorDept"
            :suffixIcon="dps ? '' : '加载中...'">
          </a-tree-select>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="合同金额">
          <a-input-number v-model="data.contractAmount"
                          :disabled="true"
                          :min="0"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="有效签约金额">
          <a-input-number v-model="data.contractEffectAmount"
                          :disabled="true"
                          :min="0"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="专业分包（预计）结算金额">
          <a-input-number v-model="data.contractNSCPreBalanceAmount"
                          :disabled="true"
                          :min="0"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="结算金额">
          <a-input-number v-model="data.settlementAmount"
                          :disabled="true"
                          :min="0"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="累计进度款">
          <a-input-number v-model="data.paymentAmount"
                          :disabled="true"
                          :min="0"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="应付进度余款">
          <a-input-number v-model="data.payableAmount"
                          :disabled="true"
                          :min="0"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </a-form-model-item>
      </a-col>
    </a-row>
    <a-col :md="24" :sm="24">
      <a-form-model-item label="结算调整" prop="balanceAdjustAmount">
        <a-input-number v-model="data.balanceAdjustAmount"
                        :disabled="true"
                        :min="0"
                        :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :precision="2"></a-input-number>
      </a-form-model-item>
    </a-col>
    <a-col :md="24" :sm="24">
      <a-form-model-item label="扣款是否已处理" prop="isDealWithCutPayment">
        <a-select v-model="data.isDealWithCutPayment" :disabled="type === 'view'">
          <a-select-option :value="'是'">是</a-select-option>
          <a-select-option :value="'否'">否</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-col>
    <a-col :md="24" :sm="24">
      <a-form-model-item label="申报文件">
        <a-upload name="file"
                  :disabled="type === 'view'"
                  :multiple="false"
                  :before-upload="beforeUpload">
          <a-button icon="upload" style="margin-right: 10px">上传文件</a-button>
        </a-upload>
        <a :href="file.url" v-show="file.url" target="_blank">{{file.name}}</a>
        <a-button icon="delete" type="danger" @click="remove" v-show="file.id" style="margin-left: 10px"></a-button>
        <a-modal
          title="删除申报文件"
          :maskClosable="false"
          :visible="visible"
          :confirm-loading="confirmLoading"
          @ok="handleOk"
          @cancel="handleCancel"
        >
          <p>您确定要删除文件？</p>
        </a-modal>
      </a-form-model-item>
    </a-col>
    <a-col :md="24" :sm="24">
      <a-form-model-item label="备注说明">
        <a-textarea v-model="data.remark"
                    :disabled="type === 'view'"></a-textarea>
      </a-form-model-item>
    </a-col>
  </a-form-model>
</template>

<script>
    import { Base as BaseService } from '@/api/base'
    import { ProjectRolesService } from '@/views/role/project/projectRoles.service'

    let deptName = ''

    function getDptName (gid, items) {
        items.forEach(item => {
            if (item.value === gid) {
                deptName = item.label
            } else {
                if (item.children && item.children.length > 0) {
                    getDptName(gid, item.children)
                }
            }
        })
        return deptName
    }

    const formatList = (items) => {
        const list = []
        items.forEach(item => {
            if (item.children && item.children.length > 0) {
                item.selectable = false
                item.children = formatList(item.children)
            } else {
                item.children = null
            }
            item.label = item.orgName
            item.value = item.orgGID
            list.push(item)
        })
        return list
    }

    export default {
        name: 'ContractSettlement',
        data () {
            return {
                departmentList: [],
                file: {
                    name: '',
                    id: '',
                    url: '',
                },
                visible: false,
                confirmLoading: false,
                dps: null,
                rules: {
                    progressRequestAmount: [{ required: true, message: '请输入承建商申报金额', trigger: 'change' }],
                    progressSendDate: [{ required: true, message: '请选择承建商申报日期', trigger: 'change' }],
                    approvalRequestAmount: [{ required: true, message: '请输入顾问公司/PQS初审金额', trigger: 'change' }],
                    approvalRequestDate: [{ required: true, message: '请选择顾问公司/PQS初审日期', trigger: 'change' }],
                    progressBalanceAmount: [{ required: true, message: '请输入申请结算金额', trigger: 'change' }],
                    progressBalanceDate: [{ required: true, message: '请选择申请结算日期', trigger: 'change' }],
                    finalCompletionDate: [{ required: true, message: '请选择最后竣工日期', trigger: 'change' }],
                    balanceType: [{ required: true, message: '请选择结算方式', trigger: 'change' }],
                    operatorDept: [{ required: true, message: '请选择经办部门', trigger: 'change' }],
                    balanceAdjustAmount: [{ required: true, message: '请添加造价估算列表', trigger: 'change' }],
                    isDealWithCutPayment: [{ required: true, message: '请选择扣款是否已处理', trigger: 'change' }],
                }
            }
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
        created () {
            ProjectRolesService.dps('').then(res => {
                const dps = formatList([res.result.data])
                this.dps = dps
            })
        },
        watch: {
            'data.attachmentID' (value) {
                if (value) {
                    if (this.id !== '0') {
                        this.getFiles()
                    }
                }
            }
        },
        methods: {
            onSelect (value) {
                this.data.operatorDept = getDptName(value, this.dps)
            },
            remove () {
                this.visible = true
            },
            removeFile (id) {
                BaseService.removeFile(id).then(res => {
                    if (res.result.statusCode === 200) {
                        this.visible = false
                        this.confirmLoading = false
                        this.$message.success('删除成功')
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
                formData.append('subInfo1', file.name) // 文件名
                formData.append('subInfo2', this.data.balanceCertificateGID)
                this.uploading = true
                const _this = this
                this.$http.post('/api/services/app/UploadAppservice/CommonUpload', formData, {
                    contentType: false,
                    processData: false,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                    .then((response) => {
                        if (response.result.statusCode === 200) {
                            if (_this.data.attachmentID !== response.result.data.masterID) {
                                _this.$emit('on-change-masterId', response.result.data.masterID)
                            }
                            _this.$set(this.file, 'name', response.result.data.fileName)
                            _this.$set(this.file, 'id', response.result.data.id)
                            _this.$set(this.file, 'url', response.result.data.fileUrl)
                            _this.$message.success('上传成功')
                        }

                    })
            },
            handleOk () {
                this.confirmLoading = true
                this.removeFile(this.file.id)
                this.file.name = ''
                this.file.id = ''
                this.file.url = ''
            },
            handleCancel () {
                this.visible = false
            },
            getFiles () {
                BaseService.fileList(this.data.attachmentID, this.data.balanceCertificateGID, 'balanceContract', '').then(_res => {
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
        }
    }
</script>

<style scoped>

</style>