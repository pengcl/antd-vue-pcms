<template>
  <div>
    <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row :gutter="48">
        <a-col :md="24" :sm="24">
          <a-form-item
            label="项目编号及名称"
          >
            <a-input :disabled="true" :value="baseInfo.projectCode + ' ' + baseInfo.projectName"></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            label="合同编号及名称">
            <a-input :disabled="true" :value="baseInfo.contractCode + ' ' + baseInfo.contractName"></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            label="合同承包单位">
            <a-input :disabled="true" :value="baseInfo.venderName"></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            label="收到请款单日期">
            <a-date-picker></a-date-picker>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            label="付款每月截止日期">
            <a-input :disabled="true" :value="baseInfo.paymentCutOffDate"></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            label="合同付款期限">
            <a-input-number :disabled="true" :value="baseInfo.paymentDeadlineDay"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            label="合同到期付款日期"
          >
            <a-date-picker></a-date-picker>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            label="付款期数"
          >
            <a-input-number :disabled="true" :value="baseInfo.paymentPhase"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            label="申请批准金额"
          >
            <a-input></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            label="本期支付金额"
          >
            <a-input></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            label="付款凭证"
          >
            <a-select
              placeholder="请选择"
              v-decorator="['paymentUser', { rules: [{required: true, message: '请选择付款凭证'}] }]">
              <a-select-option v-for="type in certificateTypes" :value="type"
                               :key="type">{{type}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            label="付款说明"
          >
            <a-textarea></a-textarea>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;">支付明细</a-col>
        <a-col :md="24" :sm="24" style="font-size: 16px;font-weight: bold;text-indent: 1em">原合同</a-col>
        <a-col :md="24" :sm="24">
          <table>
            <tbody>
            <tr>
              <td rowspan="4" style="text-align: center">原合同</td>
              <td>合同金额</td>
              <td>
                <a-input :disabled="true" :value="baseInfo.contractMasterInfo.contractAmount"></a-input>
              </td>
              <td>预计结算金额</td>
              <td>
                <a-input :disabled="true" :value="baseInfo.contractMasterInfo.contractEstimateAmount"></a-input>
              </td>
              <td>累计支付金额</td>
              <td>
                <a-input :disabled="true"
                         :value="baseInfo.contractMasterInfo.paymentAmountTotal + '/' + baseInfo.contractMasterInfo.paymentAmountTotalRatio + '%'"></a-input>
              </td>
            </tr>
            <tr>
              <td>承包单位送单时间</td>
              <td>
                <a-input></a-input>
              </td>
              <td>单位承包上报金额</td>
              <td>
                <a-input></a-input>
              </td>
              <td>现场确认时间</td>
              <td>
                <a-input></a-input>
              </td>
            </tr>
            <tr>
              <td>顾问公司出估值时间</td>
              <td>
                <a-input></a-input>
              </td>
              <td>申请批准日期</td>
              <td>
                <a-input></a-input>
              </td>
              <td>申请批准金额</td>
              <td>
                <a-input></a-input>
              </td>
            </tr>
            <tr>
              <td>付款类型</td>
              <td colspan="5">
                <a-select
                  placeholder="请选择"
                  v-decorator="['paymentTypes', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                  <a-select-option v-for="type in paymentTypes" :value="type"
                                   :key="type">{{type}}
                  </a-select-option>
                </a-select>
              </td>
            </tr>
            </tbody>
          </table>
        </a-col>
        <a-col :md="24" :sm="24">
          <table>
            <thead>
            <tr>
              <th colspan="7">
                <a-button icon="plus" @click="showForm">
                  新增
                </a-button>
                <a-button>
                  附件上传
                </a-button>
                <a-button>
                  发票管理
                </a-button>
              </th>
            </tr>
            <tr>
              <th>操作</th>
              <th>款项类型</th>
              <th>款项用途</th>
              <th>本期支付金额</th>
              <th>收款单位</th>
              <th>开户银行</th>
              <th>账号</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in items" :key="item.id">
              <td>
                <a-button @click="del(index)" icon="close">
                  删除
                </a-button>
              </td>
              <td>{{item.moneyType}}</td>
              <td>{{item.paymentPurpose}}</td>
              <td>{{item.paymentAmount}}</td>
              <td>{{getVendorName(item.vendorType)}}</td>
              <td>{{getBankName(item.vendorType,item.bankName)}}</td>
              <td>{{item.bankAccounts}}</td>
            </tr>
            </tbody>
          </table>
        </a-col>
        <a-col :md="24" :sm="24">
          <table>
            <thead>
            <tr>
              <th colspan="6">
                <a-button icon="plus">
                  附件上传
                </a-button>
                <a-button icon="delete">
                  删除文件
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 10%">文件名称</th>
              <th style="width: 10%">预付款</th>
              <th style="width: 20%">进度款</th>
              <th style="width: 20%">保修金</th>
              <th style="width: 20%">结算尾款</th>
              <th style="width: 20%">其他</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            </tbody>
          </table>
        </a-col>
        <a-col :md="24" :sm="24">
          <table>
            <thead>
            <tr>
              <th colspan="8">
                <a-button icon="plus">
                  新增发票
                </a-button>
                <a-button icon="delete">
                  删除发票
                </a-button>
                <a-button icon="scan">
                  扫描上传
                </a-button>
              </th>
            </tr>
            <tr>
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
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td colspan="2">合计</td>
              <td colspan="6"></td>
            </tr>
            <tr>
              <td colspan="2">累计发票金额</td>
              <td colspan="6"></td>
            </tr>
            <tr>
              <td colspan="2">累计票款差额</td>
              <td colspan="6"></td>
            </tr>
            </tbody>
          </table>
        </a-col>
        <a-col :md="24" :sm="24" style="font-size: 16px;font-weight: bold;text-indent: 1em">专业分包合同</a-col>
        <a-col :md="24" :sm="24">
          <table>
            <tbody>
            <tr>
              <td rowspan="4" style="text-align: center">专业分包合同</td>
              <td>合同金额</td>
              <td>
                <a-input></a-input>
              </td>
              <td>预计结算金额</td>
              <td>
                <a-input></a-input>
              </td>
              <td>累计支付金额</td>
              <td>
                <a-input></a-input>
              </td>
            </tr>
            <tr>
              <td>承包单位送单时间</td>
              <td>
                <a-input></a-input>
              </td>
              <td>单位承包上报金额</td>
              <td>
                <a-input></a-input>
              </td>
              <td>现场确认时间</td>
              <td>
                <a-input></a-input>
              </td>
            </tr>
            <tr>
              <td>顾问公司出估值时间</td>
              <td>
                <a-input></a-input>
              </td>
              <td>申请批准日期</td>
              <td>
                <a-input></a-input>
              </td>
              <td>申请批准金额</td>
              <td>
                <a-input></a-input>
              </td>
            </tr>
            <tr>
              <td>付款类型</td>
              <td colspan="5">
                <a-select
                  placeholder="请选择"
                  v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                  <a-select-option value="1">广州永沛房地产开发有限公司</a-select-option>
                </a-select>
              </td>
            </tr>
            </tbody>
          </table>
        </a-col>
        <a-col :md="24" :sm="24">
          <table>
            <thead>
            <tr>
              <th colspan="6">
                <a-button icon="plus">
                  新增
                </a-button>
                <a-button icon="save">
                  保存
                </a-button>
                <a-button icon="delete">
                  删除
                </a-button>
                <a-button>
                  附件上传
                </a-button>
                <a-button>
                  发票管理
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 10%">款项类型</th>
              <th style="width: 10%">款项用途</th>
              <th style="width: 20%">本期支付金额</th>
              <th style="width: 20%">收款单位</th>
              <th style="width: 20%">开户银行</th>
              <th style="width: 20%">账号</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            </tbody>
          </table>
        </a-col>
      </a-row>
    </a-form>
    <create-bank-form
      ref="createModal"
      :visible="visible"
      :model="model"
      @cancel="handleCancel"
      @ok="ok()">
    </create-bank-form>
  </div>
</template>

<script>


    import { SignedService } from '../signed.service'
    import CreateBankForm from '@/views/pay/signed/modules/CreateBankForm'

    export default {
        name: 'BaseInfo',
        components: { CreateBankForm },
        data () {
            return {
                selection: {},
                loading: false,
                baseInfo: {},
                paymentTypes: [],
                certificateTypes: [],
                visible: false,
                model: null,
                form: null,
                items: [],
                vendorTypes: []
            }
        },
        created () {
            SignedService.getCreateData(this.id).then(res => {
                this.baseInfo = res.result.data
            })
            SignedService.paymentTypes().then(res => {
                    this.paymentTypes = res.result.data
                }
            )
            SignedService.certificateTypes().then(res => {
                this.certificateTypes = res.result.data
            })
            SignedService.vendorTypes(this.id).then(res => {
                this.vendorTypes = res.result.data
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
        watch: {},
        methods: {
            getVendorName (id) {
                let vendorName = ''
                this.vendorTypes.forEach(item => {
                    if (item.vendorGID === id) {
                        vendorName = item.vendorName
                    }
                })
                return vendorName
            },
            getBankName (id, gid) {
                let bankName = ''
                this.vendorTypes.forEach(item => {
                    if (item.vendorGID === id) {
                        item.bankList.forEach(v => {
                            if (v.gid === gid) {
                                bankName = v.bankName
                            }
                        })
                    }
                })
                return bankName
            },
            showForm () {
                this.model = {}
                this.visible = true
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
            del (index) {
                this.items.splice(index, 1)
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
        th {
          background-color: #f5f5f5;
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
