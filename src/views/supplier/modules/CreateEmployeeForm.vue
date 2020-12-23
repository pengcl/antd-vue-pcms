<template>
  <a-modal
    title="搜索"
    :width="640"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <!--<a-form-item label="联系人姓名" hidden>
              <a-input
                v-decorator="['logGID', {rules: [{required: true, initialValue: model.logGID}]}]"/>
            </a-form-item>
            <a-form-item label="联系人姓名" hidden>
              <a-input
                v-decorator="['vendorGID', {rules: [{required: true, initialValue: model.vendorGID}]}]"/>
            </a-form-item>-->
            <a-form-item label="联系人姓名">
              <a-input
                v-decorator="['employeeName', {rules: [{required: true, min: 2,max:5, message: '请输入至少两个字符的姓名！'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="现任职位">
              <a-input v-decorator="['jobPosition', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="公司联系人">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="台鉴人">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="业务联系人">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="办公电话">
              <a-input v-decorator="['officePhone', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="传真">
              <a-input v-decorator="['fox', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="手机">
              <a-input v-decorator="['mobilePhone', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="电子邮箱">
              <a-input v-decorator="['email', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="是否在职">
              <a-input v-decorator="['isIncumbent', { initialValue: '' }]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="备注">
              <a-input v-decorator="['remarks', { initialValue: '' }]"></a-input>
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
    name: 'CreateEmployeeForm',
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
