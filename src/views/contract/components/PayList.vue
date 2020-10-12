<template>
  <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="12" :sm="24">
        <a-form-item label="付款方法">
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择"
            v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
            <a-select-option value="1">现金</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="合同付款期限">
          <a-input-number></a-input-number> 天
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="每月请款截止日期">
          <a-input-number></a-input-number> 日
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="收款单位名称">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="收款银行名称">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="收款银行账号">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="收款银行地址">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="备注">
          <a-textarea></a-textarea>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
    export default {
        name: 'PayList',
        data () {
            return {
                form: this.$form.createForm(this),
                loading: false
            }
        },
    }
</script>

<style scoped>

</style>