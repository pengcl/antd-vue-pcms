<template>
  <a-form-model
    ref="form"
    :model="data"
    :rules="rules"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <a-form-model-item
          label="项目编号及名称"
        >
          <a-input :disabled="true"
                   v-model="data.projectCode + ' ' + data.projectName"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-model-item
          label="合同编号及名称">
          <a-input :disabled="true"
                   v-model="data.contractNo + ' ' + data.contractName"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="合同承包单位">
          <a-input :disabled="true"
                   v-model="data.venderName"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="收到请款单日期"
          prop="paymentReceiveDate">
          <a-date-picker :disabled="type === 'view'"
                         v-model="data.paymentReceiveDate"
                         style="width: 100%"
                         @change="receiveDateChange"></a-date-picker>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="付款每月截止日期">
          <a-input :disabled="true"
                   v-model="data.paymentCutOffDate"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="合同付款期限">
          <a-input-number :disabled="true"
                          v-model="data.paymentDeadlineDay" style="width: 100%"></a-input-number>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="合同到期付款日期"
        >
          <a-date-picker :disabled="true" v-model="data.paymentDeadline" style="width: 100%"></a-date-picker>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="付款期数"
        >
          <a-input-number :disabled="true"
                          v-model="data.paymentPhase" style="width: 100%"></a-input-number>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="申请批准金额"
          prop="paymentRequestAmount"
        >
          <a-input-number :disabled="type === 'view'"
                          v-model="data.paymentRequestAmount"
                          :min="0"
                          :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                          :precision="2"></a-input-number>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="本期支付金额"
          prop="paymentAmount"
        >
          <a-input-number :disabled="type === 'view'"
                          v-model="data.paymentAmount"
                          :min="0"
                          :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                          :precision="2"></a-input-number>
        </a-form-model-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-model-item
          label="付款凭证"
          prop="expenseAccountType"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择"
            v-model="data.expenseAccountType">
            <a-select-option
              v-for="type in certificateTypes"
              :value="type"
              :key="type">{{ type }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-model-item
          label="付款说明"
          prop="paymentContent"
        >
          <a-textarea :disabled="type === 'view'" v-model="data.paymentContent"></a-textarea>
        </a-form-model-item>
      </a-col>
      <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;text-decoration: underline">支付明细</a-col>
      <a-col :md="24" :sm="24">
        <table>
          <tbody>
          <tr>
            <td rowspan="4" style="text-align: center">原合同</td>
            <td>合同金额</td>
            <td>
              <a-input-number :disabled="true"
                              v-model="data.contractMasterInfo.contractAmount"
                              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                              :precision="2"></a-input-number>
            </td>
            <td>预计结算金额</td>
            <td>
              <a-input-number :disabled="true"
                              v-model="data.contractMasterInfo.contractEstimateAmount"
                              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                              :precision="2"></a-input-number>
            </td>
            <td>累计支付金额</td>
            <td>
              <a-input
                :disabled="true"
                v-model="data.contractMasterInfo.paymentAmountTotal + '/' + data.contractMasterInfo.paymentAmountTotalRatio + '%'"></a-input>
            </td>
          </tr>
          <tr>
            <td>承包单位送单时间</td>
            <td>
              <a-date-picker :disabled="type === 'view'"
                             v-model="data.contractMasterInfo.progressSendDate"
                             style="width: 100%"
                             v-decorator="['progressSendDate', { rules: [{required: true, message: '请选择承包单位送单时间'}] }]"></a-date-picker>
            </td>
            <td>单位承包上报金额</td>
            <td>
              <a-input-number :disabled="type === 'view'"
                              v-model="data.contractMasterInfo.progressRequestAmount"
                              :min="0"
                              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                              :precision="2"
                              v-decorator="['progressRequestAmount', { rules: [{required: true, message: '请输入单位承包上报金额'}] }]"></a-input-number>
            </td>
            <td>现场确认时间</td>
            <td>
              <a-date-picker :disabled="type === 'view'"
                             v-model="data.contractMasterInfo.progressConfirmDate"
                             style="width: 100%"
                             v-decorator="['progressConfirmDate', { rules: [{required: true, message: '请选择现场确认时间'}] }]"></a-date-picker>
            </td>
          </tr>
          <tr>
            <td>顾问公司出估值时间</td>
            <td>
              <a-date-picker :disabled="type === 'view'"
                             v-model="data.contractMasterInfo.progressValuationDate"
                             style="width: 100%"
                             v-decorator="['progressValuationDate', { rules: [{required: true, message: '请选择顾问公司出估值时间'}] }]"></a-date-picker>
            </td>
            <td>申请批准日期</td>
            <td>
              <a-date-picker :disabled="type === 'view'"
                             v-model="data.contractMasterInfo.progressApproveDate"
                             style="width: 100%"
                             v-decorator="['progressApproveDate', { rules: [{required: true, message: '请选择申请批准日期'}] }]"></a-date-picker>
            </td>
            <td>申请批准金额</td>
            <td>
              <a-input-number :disabled="type === 'view'"
                              v-model="data.contractMasterInfo.paymentRequestAmount"
                              :min="0"
                              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                              :precision="2"
                              v-decorator="['paymentRequestAmount', { rules: [{required: true, message: '请输入申请批准金额'}] }]"></a-input-number>
            </td>
          </tr>
          <tr>
            <td>付款类型</td>
            <td colspan="5">
              <a-select
                :disabled="type === 'view'"
                placeholder="请选择"
                v-model="data.contractMasterInfo.paymentBusinessType"
                v-decorator="['paymentBusinessType', { rules: [{required: true, message: '请选择付款类型'}] }]">
                <a-select-option
                  v-for="type in paymentTypes"
                  :value="type"
                  :key="type">{{ type }}
                </a-select-option>
              </a-select>
            </td>
          </tr>
          </tbody>
        </table>
      </a-col>
      <base-info-payment :data="data.contractMasterInfo" :type="type" :id="id"></base-info-payment>
      <base-info-attachment :master-id="data.masterID"
                            :data="data.contractMasterInfo"
                            :type="type"
                            :id="id"
                            @on-change-masterId="changeMasterId"></base-info-attachment>
      <div v-for="(item,index) in data.contractNSCInfoList" :key="index">
        <a-col :md="24" :sm="24">
          <table>
            <tbody>
            <tr>
              <td rowspan="5" style="text-align: center">专业分包合同</td>
              <td>合同编号</td>
              <td>
                <a-input :disabled="true" v-model="item.contractNo"></a-input>
              </td>
              <td>合同名称</td>
              <td colspan="3">
                <a-input :disabled="true" v-model="item.contractName"></a-input>
              </td>
            </tr>
            <tr>
              <td>合同金额</td>
              <td>
                <a-input-number :disabled="true"
                                v-model="item.contractAmount"
                                :min="0"
                                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                                :precision="2"></a-input-number>
              </td>
              <td>预计结算金额</td>
              <td>
                <a-input-number :disabled="true"
                                v-model="item.contractEstimateAmount"
                                :min="0"
                                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                                :precision="2"></a-input-number>
              </td>
              <td>累计支付金额</td>
              <td>
                <a-input
                  :disabled="true"
                  v-model="item.paymentAmountTotal + '/' + item.paymentAmountTotalRatio + '%'"></a-input>
              </td>
            </tr>
            <tr>
              <td>承包单位送单时间</td>
              <td>
                <a-date-picker :disabled="type === 'view'" v-model="item.progressSendDate"
                               style="width: 100%"></a-date-picker>
              </td>
              <td>单位承包上报金额</td>
              <td>
                <a-input-number :disabled="type === 'view'"
                                v-model="item.progressRequestAmount"
                                :min="0"
                                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                                :precision="2"></a-input-number>
              </td>
              <td>现场确认时间</td>
              <td>
                <a-date-picker :disabled="type === 'view'" v-model="item.progressConfirmDate"
                               style="width: 100%"></a-date-picker>
              </td>
            </tr>
            <tr>
              <td>顾问公司出估值时间</td>
              <td>
                <a-date-picker :disabled="type === 'view'" v-model="item.progressValuationDate"
                               style="width: 100%"></a-date-picker>
              </td>
              <td>申请批准日期</td>
              <td>
                <a-date-picker :disabled="type === 'view'" v-model="item.progressApproveDate"
                               style="width: 100%"></a-date-picker>
              </td>
              <td>申请批准金额</td>
              <td>
                <a-input-number :disabled="type === 'view'"
                                v-model="item.paymentRequestAmount"
                                :min="0"
                                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                                :precision="2"></a-input-number>
              </td>
            </tr>
            <tr>
              <td>付款类型</td>
              <td colspan="5">
                <a-select
                  :disabled="type === 'view'"
                  placeholder="请选择"
                  v-model="item.paymentBusinessType"
                  v-decorator="['paymentTypes', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                  <a-select-option
                    v-for="type in paymentTypes"
                    :value="type"
                    :key="type">{{ type }}
                  </a-select-option>
                </a-select>
              </td>
            </tr>
            </tbody>
          </table>
        </a-col>
        <base-info-payment :data="item" :type="type" :id="id"></base-info-payment>
        <base-info-attachment :master-id="data.masterID"
                              :data="item" :type="type"
                              :id="id"
                              @on-change-masterId="changeMasterId"></base-info-attachment>
      </div>
      <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;text-decoration: underline">发票信息</a-col>
      <a-col :md="24" :sm="24">
        <div class="table-wrapper">
          <table>
            <thead>
            <tr>
              <th colspan="9">
                <a-button icon="plus" @click="add('billList')" :disabled="type === 'view'">
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
            <tr v-if="!item.isDeleted" v-for="(item,index) in data.billList" :key="index">
              <td>
                <a-upload name="file"
                          :disabled="type === 'view'"
                          :multiple="false"
                          v-if="item.billType"
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
                    v-for="type in billTypeList"
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
                                :min="0"
                                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                                :precision="2"></a-input-number>
              </td>
              <td>
                <a-input-number :disabled="type === 'view'"
                                v-model="item.taxRate"
                                :min="0"
                                :max="100"
                                :formatter="value => `${value}%`"
                                :parser="value => value.replace('%', '')"></a-input-number>
              </td>
              <td>
                <a-input-number :disabled="type === 'view'"
                                v-model="item.noTaxAmount"
                                :min="0"
                                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
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
  </a-form-model>
</template>

<script>


    import { SignedService } from '../signed.service'
    import CreateBankForm from '@/views/pay/signed/modules/CreateBankForm'
    import BaseInfoPayment from '@/views/pay/signed/components/baseInfo/payment'
    import BaseInfoAttachment from '@/views/pay/signed/components/baseInfo/attachment'
    import { Base as BaseService } from '@/api/base'

    export default {
        name: 'BaseInfo',
        components: { BaseInfoAttachment, BaseInfoPayment, CreateBankForm },
        data () {
            return {
                selection: {},
                loading: false,
                paymentTypes: [],
                certificateTypes: [],
                billTypeList: [],
                visible: false,
                model: null,
                form: this.$form.createForm(this),
                index: 0,
                billType: '',
                rules: {
                    paymentReceiveDate: [{ required: true, message: '请选择收到请款单日期', trigger: 'change' }],
                    paymentRequestAmount: [{ required: true, message: '请输入申请批准金额', trigger: 'change' }],
                    paymentAmount: [{ required: true, message: '请输入本期支付金额', trigger: 'change' }],
                    expenseAccountType: [{ required: true, message: '请选择付款凭证', trigger: 'change' }],
                    paymentContent: [{ required: true, message: '请输入付款说明', trigger: 'change' }],
                }
            }
        },
        watch: {
            /*'data.masterID' (value) {
                console.log(value)
            }*/
        },
        created () {
            SignedService.paymentTypes().then(res => {
                    this.paymentTypes = res.result.data
                }
            )
            SignedService.certificateTypes().then(res => {
                this.certificateTypes = res.result.data
            })
            SignedService.billList().then(res => {
                this.billTypeList = res.result.data
            })
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
        methods: {
            receiveDateChange (date, dateString) {
                var receiveDate = new Date(dateString)
                var startDate = new Date(receiveDate.getFullYear(), receiveDate.getMonth(), receiveDate.getDate())
                var intValue = 0
                var endDate = null
                intValue = startDate.getTime()
                intValue += this.data.paymentDeadlineDay * (24 * 3600 * 1000)
                endDate = new Date(intValue)
                this.data.paymentDeadline = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate()
            },
            changeMasterId (val) {
                this.data.masterID = val
                this.$forceUpdate()
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
            add (target) {
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
            clear () {
                this.items = []
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
