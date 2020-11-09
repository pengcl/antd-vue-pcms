<template>
  <a-modal
    title="新增年度资金计划"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }">
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <a-form-item label="项目名称">
                项目-分期/阶段
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="财年">
                  <a-select>
                    <a-select-option value="1">2020-2021财年</a-select-option>
                    <a-select-option value="2">2021-2022财年</a-select-option>
                  </a-select>
              </a-form-item>
            </a-col>
          </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
    import pick from 'lodash.pick'

    const fields = []
    export default {
        name: 'CreateAnnualFundingPlan',
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
            }
        },
        created () {
            // 防止表单未注册
            fields.forEach(v => this.form.getFieldDecorator(v))

            // 当 model 发生改变时，为表单设置值
            this.$watch('model', () => {
                this.model && this.form.setFieldsValue(pick(this.model, fields))
            })
        },
        methods: {

        }
    }
</script>

<style lang="less" scoped>

</style>