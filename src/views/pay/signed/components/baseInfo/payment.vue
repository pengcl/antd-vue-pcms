<template>
  <div>
    <a-col :md="24" :sm="24">
      <table>
        <thead>
        <tr>
          <th colspan="7">
            <a-button icon="plus" @click="add('detailList')">
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
        <tr v-for="(item, index) in data.detailList" :key="index" v-if="!isDeleted">
          <td>
            <a-button @click="del(item)"  :disabled="type === 'view'" icon="close">
              删除
            </a-button>
          </td>
          <td>
            <a-select
              placeholder="请选择"
              v-model="item.paymentType"
              v-decorator="['item.moneyType', { rules: [{required: true, message: '请选择款项类型'}] }]">
              <a-select-option v-for="type in moneyTypes" :value="type"
                               :key="type">{{type}}
              </a-select-option>
            </a-select>
          </td>
          <td>
            <a-input placeholder="请输入"
                     v-model="item.paymentUse"
                     v-decorator="['item.paymentUse', { rules: [{required: true, message: '请输入款项用途'}] }]"></a-input>
          </td>
          <td>
            <a-input placeholder="请输入"
                     v-model="item.paymentAmount"
                     v-decorator="['item.paymentAmount', { rules: [{required: true, message: '请输入本期支付金额'}] }]"></a-input>
          </td>
          <td>
            <a-select
              @change="onChange"
              placeholder="请选择"
              v-model="item.vendorName"
              v-decorator="['vendorType', { rules: [{required: true, message: '请选择收款单位'}] }]">
              <a-select-option v-for="type in vendorTypes"
                               :value="type.vendorGID"
                               :key="type.vendorGID">{{type.vendorName}}
              </a-select-option>
            </a-select>
          </td>
          <td>
            <a-select
              :disabled="bankList.length < 1"
              @change="bankChange"
              placeholder="请选择"
              v-model="item.vendorBankName"
              v-decorator="['item.bankName', { rules: [{required: true, message: '请选择收款单位'}] }]">
              <a-select-option v-for="type in bankList"
                               :value="type.gid"
                               :key="type.gid">{{type.bankName}}
              </a-select-option>
            </a-select>
          </td>
          <td>
            <a-input :disabled="true"
                     v-model="item.vendorBankAccounts"
                     v-decorator="['item.vendorBankAccounts', { rules: [{required: true, message: '请选择收款单位'}] }]"></a-input>
          </td>
        </tr>
        </tbody>
      </table>
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
                items: []

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
            SignedService.vendorTypes(this.id).then(res => {
                this.vendorTypes = res.result.data
            })
            SignedService.moneyTypes().then(res => {
                this.moneyTypes = res.result.data
            })
        },
        methods: {
            add (target) {
                const item = {
                    id: 0,
                    isDeleted: false,
                    paymentType: '',
                    paymentAmount: 0,
                    paymentUse: '',
                    vendorGID: '',
                    vendorName: '',
                    vendorBankGID: '',
                    vendorBankName: '',
                    vendorBankAccounts: ''
                }
                this.data[target].push(item)
                this.$forceUpdate()
            },
            del (item) {
                item.isDeleted = true
            },
            clear (target) {
                this.data[target].forEach(item => {
                    item.isDisabled = true
                })
            },
            onChange (value) {
                this.bankAccounts = ''
                this.form.setFieldsValue({
                    bankName: '',
                })
                this.vendorTypes.forEach(item => {
                    if (item.vendorGID === value) {
                        this.bankList = item.bankList
                    }
                })
            },
            bankChange (value) {
                this.bankList.forEach(item => {
                    if (item.gid === value) {
                        console.log(item.bankAccounts)
                        this.bankAccounts = item.bankAccounts
                    }
                })
            },
            showForm (items) {
                const obj = {}
                items.push(obj)
                // this.model = items[items.length - 1]
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