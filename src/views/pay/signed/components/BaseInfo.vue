<template>
  <a-form-model
    ref="form"
    :model="data"
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
          label="收到请款单日期">
          <a-date-picker v-model="data.paymentReceiveDate" style="width: 100%"></a-date-picker>
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
          <a-date-picker v-model="data.paymentDeadline" style="width: 100%"></a-date-picker>
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
        >
          <a-input v-model="data.paymentRequestAmount"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="本期支付金额"
        >
          <a-input v-model="data.paymentAmount"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-model-item
          label="付款凭证"
        >
          <a-select
            placeholder="请选择"
            v-model="data.expenseAccountType"
            v-decorator="['data.expenseAccountType', { rules: [{required: true, message: '请选择付款凭证'}] }]">
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
        >
          <a-textarea v-model="data.paymentContent"></a-textarea>
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
              <a-input :disabled="true" v-model="data.contractMasterInfo.contractAmount"></a-input>
            </td>
            <td>预计结算金额</td>
            <td>
              <a-input :disabled="true" v-model="data.contractMasterInfo.contractEstimateAmount"></a-input>
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
              <a-date-picker v-model="data.contractMasterInfo.progressSendDate" style="width: 100%"></a-date-picker>
            </td>
            <td>单位承包上报金额</td>
            <td>
              <a-input v-model="data.contractMasterInfo.progressRequestAmount"></a-input>
            </td>
            <td>现场确认时间</td>
            <td>
              <a-date-picker v-model="data.contractMasterInfo.progressConfirmDate" style="width: 100%"></a-date-picker>
            </td>
          </tr>
          <tr>
            <td>顾问公司出估值时间</td>
            <td>
              <a-date-picker v-model="data.contractMasterInfo.progressValuationDate"
                             style="width: 100%"></a-date-picker>
            </td>
            <td>申请批准日期</td>
            <td>
              <a-date-picker v-model="data.contractMasterInfo.progressApproveDate" style="width: 100%"></a-date-picker>
            </td>
            <td>申请批准金额</td>
            <td>
              <a-input v-model="data.contractMasterInfo.paymentRequestAmount"></a-input>
            </td>
          </tr>
          <tr>
            <td>付款类型</td>
            <td colspan="5">
              <a-select
                placeholder="请选择"
                v-model="data.contractMasterInfo.paymentBusinessType"
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
      <base-info-payment :data="data.contractMasterInfo" :type="type" :id="id"></base-info-payment>
      <base-info-attachment :data="data.contractMasterInfo" :type="type" :id="id"></base-info-attachment>
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
                <a-input :disabled="true" v-model="item.contractAmount"></a-input>
              </td>
              <td>预计结算金额</td>
              <td>
                <a-input :disabled="true" v-model="item.contractEstimateAmount"></a-input>
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
                <a-date-picker v-model="item.progressSendDate" style="width: 100%"></a-date-picker>
              </td>
              <td>单位承包上报金额</td>
              <td>
                <a-input v-model="item.progressRequestAmount"></a-input>
              </td>
              <td>现场确认时间</td>
              <td>
                <a-date-picker v-model="item.progressConfirmDate" style="width: 100%"></a-date-picker>
              </td>
            </tr>
            <tr>
              <td>顾问公司出估值时间</td>
              <td>
                <a-date-picker v-model="item.progressValuationDate" style="width: 100%"></a-date-picker>
              </td>
              <td>申请批准日期</td>
              <td>
                <a-date-picker v-model="item.progressApproveDate" style="width: 100%"></a-date-picker>
              </td>
              <td>申请批准金额</td>
              <td>
                <a-input v-model="item.paymentRequestAmount"></a-input>
              </td>
            </tr>
            <tr>
              <td>付款类型</td>
              <td colspan="5">
                <a-select
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
      </div>
      <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;text-decoration: underline">发票信息</a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th colspan="9">
              <a-button icon="plus" @click="add('billList')">
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
              <a-upload>
                <a-button>请选择</a-button>
              </a-upload>
              <a-button @click="del(index)" :disabled="type === 'view'" icon="close">
                删除
              </a-button>
            </td>
            <td>
              <a-select
                placeholder="请选择"
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
              <a-input v-model="item.billAmount"></a-input>
            </td>
            <td>
              <a-input v-model="item.taxRate"></a-input>
            </td>
            <td>
              <a-input v-model="item.noTaxAmount"></a-input>
            </td>
            <td>
              <a-date-picker v-model="item.billDate"></a-date-picker>
            </td>
            <td>

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
      </a-col>
    </a-row>
    <create-bank-form
      ref="createModal"
      :visible="visible"
      :model="model"
      @cancel="handleCancel"
      @ok="ok()">
    </create-bank-form>
  </a-form-model>
</template>

<script>


    import { SignedService } from '../signed.service'
    import CreateBankForm from '@/views/pay/signed/modules/CreateBankForm'
    import BaseInfoPayment from '@/views/pay/signed/components/baseInfo/payment'
    import BaseInfoAttachment from '@/views/pay/signed/components/baseInfo/attachment'

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
            }
        },
        created () {
            /*SignedService.getCreateData(this.id).then(res => {
                this.data = res.result.data
            })*/
            SignedService.paymentTypes().then(res => {
                    this.paymentTypes = res.result.data
                }
            )
            SignedService.certificateTypes().then(res => {
                this.certificateTypes = res.result.data
            })
        },
        watch: {
            'data' (value) {
                this.getBillList(this.data['contractGID'], this.data['gid'])
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
        methods: {
            getBillList (contractGID, gid) {
                SignedService.billList(contractGID, gid).then(res => {
                    this.billTypeList = res.result.data
                })
            },
            add (target) {
                const item = {
                    id: 0,
                    isDeleted: false,
                    isTemp: true,
                    billType: '',
                    billNum: '',
                    billAmount: '',
                    taxRate: '',
                    noTaxAmount: '',
                    billDate: '',
                    billFileID: '',
                    billFileUrl: '',
                    remark: ''
                }
                if (this.data[target]) {
                    this.data[target].push(item)
                } else {
                    this.data[target] = [item]
                }
            },
            del (index) {
                if (this.data.billList[index].isTemp) {
                    this.data.billList.splice(index, 1)
                } else {
                    this.data.billList[index].isDeleted = true
                }
            },
            ok () {
                const form = this.$refs.createModal.form
                this.confirmLoading = true
                form.validateFields((errors, values) => {
                    if (!errors) {
                        this.items.push(values)
                        console.log(this.items)
                        this.visible = false
                        this.confirmLoading = false
                        // 重置表单数据
                        form.resetFields()
                        // 刷新表格
                    } else {
                        this.confirmLoading = false
                    }
                })
            },
            clear () {
                this.items = []
            },
            handleCancel () {
                this.visible = false
                const form = this.$refs.createModal.form
                form.resetFields() // 清理表单数据（可不做）
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
