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
            <a-form-item label="开户银行">
              <a-input
                v-decorator="['bankName', {rules: [{required: true, message: '请输入开户银行！'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="银行账号">
              <a-input v-decorator="['bankAccounts', {rules: [{required: true, message: '请输入银行账号！'}]}]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="银行地址">
              <a-input v-decorator="['bankAddr', {rules: [{required: true, message: '请输入银行地址！'}]}]"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'

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
        form: this.$form.createForm(this)
      }
    },
    created () {
      console.log('custom modal created')

      // 防止表单未注册
      fields.forEach(v => this.form.getFieldDecorator(v))

      // 当 model 发生改变时，为表单设置值
      this.$watch('model', () => {
        this.model && this.form.setFieldsValue(pick(this.model, fields))
      })
    }
  }
</script>
