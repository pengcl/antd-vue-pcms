<template>
  <div>
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
                              :disabled="type === 'view'"
                              v-model="item.paymentAmount"
                              :min="0"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :precision="2"
                              v-decorator="['item.paymentAmount', { rules: [{required: true, message: '请输入本期支付金额'}] }]"></a-input-number>
              <a-input-number placeholder="请输入"
                              v-if="item.paymentType === '代付代扣' || item.paymentType === '其他扣款'"
                              :disabled="type === 'view'"
                              v-model="item.paymentAmount"
                              :min="0"
                              :formatter="value => `-${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\-\s?|(,*)/g, '')"
                              :precision="2"
                              v-decorator="['item.paymentAmount', { rules: [{required: true, message: '请输入本期支付金额'}] }]"></a-input-number>
            </td>
            <td>
              <a-select
                @change="onChange"
                :disabled="type === 'view'"
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
                :disabled="type === 'view'"
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
          <tr>
            <td colspan="3">合计</td>
            <td colspan="4">合计金额</td>
          </tr>
          </tbody>
        </table>
      </div>
    </a-col>
  </div>
</template>

<script>
    import { UnSignedService } from '../unsigned.service'

    export default {
        name: 'PaymentInfo',
        data () {
            return {
                moneyTypes: [],
                vendorTypes: []
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
        created () {
            UnSignedService.moneyTypes().then(res => {
                this.moneyTypes = res.result.data
                this.$forceUpdate()
            })
            UnSignedService.vendorTypes().then(res => {
                this.vendorTypes = res.result.data
                this.$forceUpdate()
            })
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
            add (target) {
                const item = {
                    id: 0,
                    gid: '00000000-0000-0000-0000-000000000000',
                    isDeleted: false,
                    isTemp: true,
                    paymentType: '',
                    paymentAmount: 0,
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
                this.$forceUpdate()
            },
            moneyTypeChange (value) {
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