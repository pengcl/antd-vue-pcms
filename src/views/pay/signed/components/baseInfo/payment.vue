<template>
  <div>
    <a-col :md="24" :sm="24">
      <table>
        <thead>
        <tr>
          <th colspan="7">
            <a-button icon="plus" @click="showForm(items)">
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
          <td>
            <a-select
              placeholder="请选择"
              v-decorator="['moneyType', { rules: [{required: true, message: '请选择款项类型'}] }]">
              <a-select-option v-for="type in moneyTypes" :value="type"
                               :key="type">{{type}}
              </a-select-option>
            </a-select>
          </td>
          <td>
            <a-input placeholder="请输入"
                     v-decorator="['paymentPurpose', { rules: [{required: true, message: '请输入款项用途'}] }]"></a-input>
          </td>
          <td>
            <a-input placeholder="请输入"
                     v-decorator="['paymentAmount', { rules: [{required: true, message: '请输入本期支付金额'}] }]"></a-input>
          </td>
          <td>
            <a-select
              @change="onChange"
              placeholder="请选择"
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
              v-decorator="['bankName', { rules: [{required: true, message: '请选择收款单位'}] }]">
              <a-select-option v-for="type in bankList"
                               :value="type.gid"
                               :key="type.gid">{{type.bankName}}
              </a-select-option>
            </a-select>
          </td>
          <td>
            <a-input :disabled="true"
                     v-model="bankAccounts"></a-input>
          </td>
        </tr>
        </tbody>
      </table>
    </a-col>
  </div>
</template>

<script>
    export default {
        name: 'BaseInfoPayment',
        data () {
            return {
                date: null,
                selection: {},
                loading: false
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
            add (target) {
                const item = {
                    id: 0,
                    isDeleted: false,
                    retentionGuid: 0,
                    contractID: this.id,
                    description: '',
                    percentage: ''
                }
                this.data[target].push(item)
            },
            del (item) {
                item.isDisabled = true
            },
            clear (target) {
                this.data[target].forEach(item => {
                    item.isDisabled = true
                })
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