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
              {{project.projectName}}
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="财年">
              <a-select
                placeholder="请选择"
                @change="onChange"
                v-decorator="['title', { rules: [{required: true, message: '请选择财年'}] }]">
                <a-select-option v-for="(item,index) in currentFiscalYear"
                                 :value="item.title"
                                 :key="index">{{item.title}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="财年" style="display: none">
              <a-input :disabled="true"
                       v-decorator="['year', { rules: [{required: true, message: '请输入项目名称'}] }]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="财年" style="display: none">
              <a-input :disabled="true"
                       v-decorator="['projectCode', { rules: [{required: true, message: '请输入项目名称'}] }]"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
    import pick from 'lodash.pick'
    import { FundPlanService } from '@/views/pay/fundplan/fundplan.service'

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
            },
            project: {
                type: Object,
                default: () => null
            }
        },
        data () {
            return {
                form: this.$form.createForm(this),
                projectName: '',
                projectCode: '',
                currentFiscalYear: []
            }
        },
        created () {
            // 防止表单未注册

            fields.forEach(v => this.form.getFieldDecorator(v))

            // 当 model 发生改变时，为表单设置值
            this.$watch('model', () => {
                this.model && this.form.setFieldsValue(pick(this.model, fields))
            })
            FundPlanService.currentFiscalYear().then(res => {
                if (res.result.data) {
                    this.currentFiscalYear = res.result.data
                }
            })
        },
        methods: {
            onChange (value, option) {
                const index = option.data.key
                this.form.setFieldsValue({
                    projectCode: this.project.projectCode,
                    title: value,
                    year: this.currentFiscalYear[index].year
                })
            }
        }
    }
</script>

<style lang="less" scoped>

</style>