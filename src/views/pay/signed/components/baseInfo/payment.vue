<template>
  <div>
    <a-col :md="24" :sm="24" style="font-size: 16px;font-weight: bold;text-decoration: underline">付款信息</a-col>
    <a-col :md="24" :sm="24">
      <div class="table-wrapper">
        <table>
          <thead>
          <tr>
            <th colspan="7">
              <a-button icon="plus" @click="add('detailList')" :disabled="type === 'view'">
                新增
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
          <tr v-if="!item.isDeleted" v-for="(item, index) in data.detailList" :key="index">
            <td>
              <a-button @click="del(index)" :disabled="type === 'view'" icon="close">
                删除
              </a-button>
            </td>
            <td>
              <a-select
                :disabled="type === 'view'"
                placeholder="请选择"
                @change="moneyTypeChange"
                v-model="item.paymentType"
                v-decorator="['item.moneyType', { rules: [{required: true, message: '请选择款项类型'}] }]">
                <a-select-option v-for="type in moneyTypes" :value="type"
                                 :key="type">{{type}}
                </a-select-option>
              </a-select>
            </td>
            <td>
              <a-input placeholder="请输入"
                       :disabled="type === 'view'"
                       v-model="item.paymentUse"
                       v-decorator="['item.paymentUse', { rules: [{required: true, message: '请输入款项用途'}] }]"></a-input>
            </td>
            <td>
              <a-input-number placeholder="请输入"
                              v-if="item.paymentType === '一般付款' || item.paymentType === '扣款冲销'"
                              @change="paymentAmountChange"
                              :disabled="type === 'view'"
                              v-model="item.paymentAmount"
                              :min="0"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :precision="2"
                              v-decorator="['item.paymentAmount', { rules: [{required: true, message: '请输入本期支付金额'}] }]"></a-input-number>
              <a-input-number placeholder="请输入"
                              v-if="item.paymentType === '代付代扣' || item.paymentType === '其他扣款'"
                              @change="paymentAmountChange"
                              :disabled="type === 'view'"
                              v-model="item.paymentAmount"
                              :formatter="value => `-${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\-\s?|(,*)/g, '')"
                              :precision="2"
                              v-decorator="['item.paymentAmount', { rules: [{required: true, message: '请输入本期支付金额'}] }]"></a-input-number>
            </td>
            <td>
              <a-select
                @change="onChange"
                :disabled="type === 'view' || item.paymentType === '代付代扣' || item.paymentType === '其他扣款'"
                placeholder="请选择"
                v-model="item.vendorGID">
                <a-select-option v-for="type in vendorTypes"
                                 :value="type.vendorGID"
                                 :key="index">{{type.vendorName}}
                </a-select-option>
              </a-select>
            </td>
            <td>
              <a-select
                @change="bankChange"
                placeholder="请选择"
                :disabled="type === 'view' || item.paymentType === '代付代扣' || item.paymentType === '其他扣款'"
                v-model="item.vendorBankGID">
                <a-select-option v-for="type in getBankList(item.vendorGID,vendorTypes)"
                                 :value="type.gid"
                                 :key="index">{{type.bankName}}
                </a-select-option>
              </a-select>
            </td>
            <td>
              <a-input :disabled="true"
                       v-model="item.vendorBankAccounts"></a-input>
            </td>
          </tr>
          <tr v-if="data.detailList.length > 0">
            <td colspan="3" style="text-align: right">本期支付金额：</td>
            <td colspan="4">{{paymentAmountTotal | NumberFormat}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </a-col>
  </div>
</template>

<script>
    import { SignedService } from '@/views/pay/signed/signed.service'

    export default {
        name: 'BaseInfoPayment',
        data () {
            return {
                date: null,
                selection: {},
                loading: false,
                vendorTypes: [],
                moneyTypes: [],
                bankList: [],
                bankAccounts: '',
                items: [],
                paymentAmountTotal: 0
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
            index: {
                type: Number,
                default: 0
            }
        },
        watch: {
            'data' (value) {
                this.getVendor(this.type === 'create' ? this.data['contractGID'] : this.data['secondaryContractGID'] ? this.data['secondaryContractGID'] : this.data['contractGID'])
            },
            'data.detailList' (value) {
                if (value && value.length > 0) {
                    let paymentAmountTotal = 0
                    this.data.detailList.forEach(item => {
                        if (item.paymentAmount) {
                            item.paymentAmount = Math.abs(item.paymentAmount)
                            if (item.paymentAmount && (item.paymentType === '一般付款' || item.paymentType === '扣款冲销')) {
                                paymentAmountTotal += item.paymentAmount
                            } else if (item.paymentAmount && (item.paymentType === '代付代扣' || item.paymentType === '其他扣款')) {
                                paymentAmountTotal -= item.paymentAmount
                            }
                        }
                    })
                    this.paymentAmountTotal = paymentAmountTotal
                }
            }
        },
        created () {
            SignedService.moneyTypes().then(res => {
                this.moneyTypes = res.result.data
                this.$forceUpdate()
            })
            if (this.data['contractGID'] || this.data['secondaryContractGID']) {
                SignedService.vendorTypes(this.type === 'create' ? this.data['contractGID'] : this.data['secondaryContractGID'] ? this.data['secondaryContractGID'] : this.data['contractGID']).then(res => {
                    this.vendorTypes = res.result.data
                    this.$forceUpdate()
                })
            }
            if (this.data.detailList && this.data.detailList.length > 0) {
                let paymentAmountTotal = 0
                this.data.detailList.forEach(item => {
                    if (item.paymentAmount) {
                        item.paymentAmount = Math.abs(item.paymentAmount)
                        if (item.paymentAmount && (item.paymentType === '一般付款' || item.paymentType === '扣款冲销')) {
                            paymentAmountTotal += item.paymentAmount
                        } else if (item.paymentAmount && (item.paymentType === '代付代扣' || item.paymentType === '其他扣款')) {
                            paymentAmountTotal -= item.paymentAmount
                        }
                    }
                })
                this.paymentAmountTotal = paymentAmountTotal
            }
        },
        methods: {
            getBankList (vendorGID, vendorTypes) {
                let bankList
                vendorTypes.forEach(item => {
                    if (item.vendorGID === vendorGID) {
                        bankList = item.bankList
                    }
                })
                return bankList
            },
            getVendor (id) {
                SignedService.vendorTypes(id).then(res => {
                    this.vendorTypes = res.result.data
                    this.$forceUpdate()
                })
            },
            add (target) {
                const item = {
                    id: 0,
                    isDeleted: false,
                    isTemp: true,
                    paymentType: '',
                    paymentAmount: '',
                    paymentUse: '',
                    vendorGID: '',
                    vendorName: '',
                    vendorBankGID: '',
                    vendorBankName: '',
                    vendorBankAccounts: ''
                }
                if (this.data[target]) {
                    this.data[target].push(item)
                } else {
                    this.data[target] = [item]
                }
                this.$forceUpdate()
            },
            del (index) {
                if (this.data.detailList[index].isTemp) {
                    this.data.detailList.splice(index, 1)
                } else {
                    this.data.detailList[index].isDeleted = true
                }
                this.$emit('on-change-paymentAmount', { detailList: this.data.detailList, index: this.index })
                this.$forceUpdate()
            },
            clear (target) {
                this.data[target].forEach(item => {
                    item.isDisabled = true
                })
            },
            moneyTypeChange (value) {
                this.$forceUpdate()
            },
            paymentAmountChange (value) {
                this.$emit('on-change-paymentAmount', { detailList: this.data.detailList, index: this.index })
                let paymentAmountTotal = 0
                this.data.detailList.forEach(item => {
                    if (item.paymentAmount) {
                        item.paymentAmount = Math.abs(item.paymentAmount)
                        if (item.paymentAmount && (item.paymentType === '一般付款' || item.paymentType === '扣款冲销')) {
                            paymentAmountTotal += item.paymentAmount
                        } else if (item.paymentAmount && (item.paymentType === '代付代扣' || item.paymentType === '其他扣款')) {
                            paymentAmountTotal -= item.paymentAmount
                        }
                    }
                })
                this.paymentAmountTotal = paymentAmountTotal
                this.$forceUpdate()
            },
            onChange (value, option) {
                const index = option.data.key
                this.data.detailList[index].vendorBankGID = ''
                this.data.detailList[index].vendorBankAccounts = ''
                const i = this.vendorTypes.findIndex(item => item.vendorGID === value)
                this.data.detailList[index].vendorName = this.vendorTypes[i].vendorName
                this.$forceUpdate()
            },
            bankChange (value, option) {
                const index = option.data.key
                this.vendorTypes.forEach(item => {
                    if (item.vendorGID === this.data.detailList[index].vendorGID) {
                        const bankList = item.bankList
                        bankList.forEach(v => {
                            if (v.gid === value) {
                                this.data.detailList[index].vendorBankName = v.bankName
                                this.data.detailList[index].vendorBankAccounts = v.bankAccounts
                            }
                        })
                    }
                })
                this.$forceUpdate()
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