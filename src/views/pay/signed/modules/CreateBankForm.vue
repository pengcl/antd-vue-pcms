<template>
  <a-modal
    title="添加银行账号"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="款项类型">
              <a-select
                placeholder="请选择"
                v-decorator="['moneyType', { rules: [{required: true, message: '请选择款项类型'}] }]">
                <a-select-option v-for="type in moneyTypes" :value="type"
                                 :key="type">{{type}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="款项用途">
              <a-input placeholder="请输入"
                       v-decorator="['paymentPurpose', { rules: [{required: true, message: '请输入款项用途'}] }]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="本期支付金额">
              <a-input placeholder="请输入"
                       v-decorator="['paymentAmount', { rules: [{required: true, message: '请输入本期支付金额'}] }]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="收款单位">
              <a-select
                @change="onChange"
                placeholder="请选择"
                v-decorator="['vendorType', { rules: [{required: true, message: '请选择收款单位'}] }]">
                <a-select-option v-for="type in vendorTypes"
                                 :value="type.vendorGID"
                                 :key="type.vendorGID">{{type.vendorName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="开户银行">
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
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="账号">
              <a-input :disabled="true"
                       v-decorator="['bankAccounts', { rules: [{required: true, message: '请选择收款单位'}] }]"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
    import pick from 'lodash.pick'
    import { SignedService } from '../signed.service'

    // 表单字段
    const fields = []

    export default {
        name: 'CreateBankForm',
        props: {
            visible: {
                type: Boolean,
                required: true
            },
            loading: {
                type: Boolean,
                default: () => false
            },
            model: {
                type: Object,
                default: () => null
            }
        },
        data () {
            return {
                form: this.$form.createForm(this),
                moneyTypes: [],
                vendorTypes: [],
                bankList: [],
            }
        },
        created () {
            // 防止表单未注册
            fields.forEach(v => this.form.getFieldDecorator(v))

            // 当 model 发生改变时，为表单设置值
            this.$watch('model', () => {
                this.model && this.form.setFieldsValue(pick(this.model, fields))
            })
            SignedService.moneyTypes().then(res => {
                this.moneyTypes = res.result.data
            })
            SignedService.vendorTypes(this.id).then(res => {
                this.vendorTypes = res.result.data
            })
        },
        methods: {
            onChange (value, option) {
                this.form.setFieldsValue({
                    bankName: '',
                    bankAccounts: ''
                })
                this.vendorTypes.forEach(item => {
                    if (item.vendorGID === value) {
                        this.bankList = item.bankList
                    }
                })
            },
            bankChange (value, option) {
                this.bankList.forEach(item => {
                    if (item.gid === value) {
                        this.form.setFieldsValue({
                            bankAccounts: item.bankAccounts
                        })
                    }
                })
            }
        }
    }
</script>
