<template>
  <page-header-wrapper :title="type === 'view' ? '查看' : (type === 'create' ? '添加' : '编辑') + name">
    <a-card :bordered="false">
      <div v-if="id !== '0' && info" class="table-page-search-wrapper">
        <a-form
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="项目编码">
                {{ info.mainProjectCode }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="项目状态">
                {{ info.projStatus }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="房产项目名称(中文)">
                {{ info.mainProjectName }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="房产项目名称(英文)">
                {{ info.projectEnName }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="审批状态">
                {{ info.auditStatus }}
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-tabs default-active-key="1" :animated="false">
        <a-tab-pane key="1" tab="基本资料">
          <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }">
            <a-row :gutter="48">
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="城市"
                  prop="cityID"
                >
                  <a-select
                    placeholder="请选择城市"
                    :disabled="true"
                    v-model="form.cityID">
                    <a-select-option
                      v-for="city in selection.cities"
                      :key="city.city.id"
                      :value="city.city.id">{{ city.city.nameCN }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  :label="name + '编码'"
                  prop="projectShortCode"
                >
                  <a-input
                    :disabled="type === 'view'"
                    :placeholder="'请填写' + name + '编码'"
                    v-model="form.projectShortCode"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  :label="name + '状态'"
                  prop="projStatus"
                >
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择"
                    v-model="form.projStatus">
                    <a-select-option
                      v-for="state in selection.types"
                      :key="state.nameCN"
                      :value="state.nameCN">{{ state.nameCN }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  :label="'房产' + name + '名称(中文)'"
                  prop="projectShortName"
                >
                  <a-input
                    :disabled="type === 'view'"
                    :placeholder="'请填写房产' + name + '(中文)'"
                    v-model="form.projectShortName"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  :label="'房产' + name + '名称(英文)'"
                  prop="projectEnName"
                >
                  <a-input
                    :disabled="type === 'view'"
                    :placeholder="'请填写房产' + name + '名称(英文)'"
                    v-model="form.projectEnName"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-model-item
                  :label="name + '地址'"
                  prop="projAddress"
                >
                  <a-input
                    :disabled="type === 'view'"
                    :placeholder="'请填写' + name + '地址'"
                    v-model="form.projAddress"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-model-item
                  label="总体描述"
                  prop="description"
                >
                  <a-textarea
                    :disabled="type === 'view'"
                    rows="4"
                    placeholder="请输入总体描述"
                    v-model="form.description"
                    v-decorator="[
                      'form.description',
                      {rules: [{ required: false, message: '请输入目标描述' }]}
                    ]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="币种"
                  prop="currencyCode"
                >
                  <a-select
                    :disabled="type === 'view' || stage !== 'Project'"
                    placeholder="请选择币种"
                    v-model="form.currencyCode">
                    <a-select-option v-for="currency in selection.currencies" :key="currency.code" :value="currency.code">
                      {{ currency.nameCN }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="项目公司"
                  prop="companyCode"
                >
                  <a-input v-model="form.companyCode" :disabled="type === 'view'" :hidden="true"/>
                  <a-input
                    :disabled="type === 'view'"
                    @click="showSelect()"
                    placeholder="请选择项目公司"
                    :value="getName(form.companyCode)"
                    :read-only="true"/>
                  <!--<a-select
                    :disabled="type === 'view' || stage !== 'Project'"
                    placeholder="请选择项目公司"
                    v-model="form.companyCode">
                    <a-select-option
                      v-for="company in selection.companies"
                      :key="company.code"
                      :value="company.code">{{ company.nameCN }}
                    </a-select-option>
                  </a-select>-->
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="工地面积"
                  prop="builtUpArea"
                >
                  <a-input-number
                    :disabled="type === 'view'"
                    v-model="form.builtUpArea"
                    :min="0"
                    :formatter="value => `${value}平方`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\平方\s?|(,*)/g, '')"
                    :precision="2"
                    placeholder="请填写工地面积"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="2" tab="项目成员">
          <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-row :gutter="48">
              <a-col :md="12" :sm="24">
                <a-form-item label="项目部总监">
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择项目部总监"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '请选择项目部总监'}] }]"
                    @change="handleChange">
                    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="项目及工程管理部负责人">
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择项目及工程管理部负责人"
                    v-decorator="['paymentUser', { rules: [{required: false, message: '请选择项目及工程管理部负责人'}] }]"
                    @change="handleChange">
                    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="项目负责人">
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择项目负责人"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '请选择项目负责人'}] }]"
                    @change="handleChange">
                    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="驻工地负责人">
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择驻工地负责人"
                    v-decorator="['paymentUser', { rules: [{required: false, message: '请选择驻工地负责人'}] }]"
                    @change="handleChange">
                    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="工程秘书">
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择工程秘书"
                    v-decorator="['paymentUser', { rules: [{required: false, message: '请选择工程秘书'}] }]"
                    @change="handleChange">
                    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="项目驻香港总部人员">
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择项目驻香港总部人员"
                    v-decorator="['paymentUser', { rules: [{required: false, message: '请选择项目驻香港总部人员'}] }]"
                    @change="handleChange">
                    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="驻工地人员">
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择驻工地人员"
                    v-decorator="['paymentUser', { rules: [{required: false, message: '请选择驻工地人员'}] }]"
                    @change="handleChange">
                    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="合约负责人">
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择合约负责人"
                    v-decorator="['paymentUser', { rules: [{required: false, message: '请选择合约负责人'}] }]"
                    @change="handleChange">
                    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="合约部驻项目人员">
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择合约部驻项目人员"
                    v-decorator="['paymentUser', { rules: [{required: false, message: '合约部驻项目人员'}] }]"
                    @change="handleChange">
                    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="设计负责人">
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择设计负责人"
                    v-decorator="['paymentUser', { rules: [{required: false, message: '请选择设计负责人'}] }]"
                    @change="handleChange">
                    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="设计部驻项目人员">
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择设计部驻项目人员"
                    v-decorator="['paymentUser', { rules: [{required: false, message: '请选择设计部驻项目人员'}] }]"
                    @change="handleChange">
                    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="企业财务管理部驻项目人员">
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择企业财务管理部驻项目人员"
                    v-decorator="['paymentUser', { rules: [{required: false, message: '请选择企业财务管理部驻项目人员'}] }]"
                    @change="handleChange">
                    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="项目财务管理部驻项目人员">
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择项目财务管理部驻项目人员"
                    v-decorator="['paymentUser', { rules: [{required: false, message: '请选择项目财务管理部驻项目人员'}] }]"
                    @change="handleChange">
                    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="土地储备拓展部驻项目人员">
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择土地储备拓展部驻项目人员"
                    v-decorator="['paymentUser', { rules: [{required: false, message: '请选择土地储备拓展部驻项目人员'}] }]"
                    @change="handleChange">
                    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="项目审计及监察部驻项目人员">
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择项目审计及监察部驻项目人员"
                    v-decorator="['paymentUser', { rules: [{required: false, message: '请选择项目审计及监察部驻项目人员'}] }]"
                    @change="handleChange">
                    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
      </a-tabs>
      <a-row :gutter="48">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group v-if="type === 'update'">
            <a-button @click="approve()" type="success">
              启动审批流程
            </a-button>
          </a-button-group>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-button-group v-if="type === 'view' && info.auditStatus !== '未审核'">
            <a-button @click="approve()" type="success">
              查看审批
            </a-button>
          </a-button-group>
          <a-button-group v-if="type !== 'view'">
            <a-button @click="save" type="success">
              储存
            </a-button>
          </a-button-group>
          <a-button-group>
            <a-button @click="back" type="danger">
              关闭
            </a-button>
          </a-button-group>
        </a-col>
      </a-row>
      <a-modal
        v-if="dialog"
        :title="dialog.title"
        :visible="dialog.visible"
        :okText="dialog.confirmText"
        :cancelText="dialog.cancelText"
        @ok="dialog.confirm"
        @cancel="dialog.cancel"
      >
        <p>{{ dialog.content }}</p>
      </a-modal>

      <select-company
        ref="company"
        :visible="show"
        :data="selection.companies"
        @cancel="handleCancel('company')"
        @ok="handleOk('company')"></select-company>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { SwaggerService } from '@/api/swagger.service'
import { ProjectService } from '@/views/project/project.service'
import { Currency as CurrencyService } from '@/api/currency'
import { Company as CompanyService } from '@/api/company'
import { DIALOGCONFIG } from '@/api/base'
import SelectCompany from '@/views/project/components/selectComany/index'
import notification from 'ant-design-vue/es/notification'

const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters']
export default {
  name: 'ProjectItem',
  components: { SelectCompany },
  data () {
    return {
      dialog: DIALOGCONFIG,
      selection: {},
      show: false,
      selectedItems: [],
      form: {},
      info: {},
      rules: {
        cityID: [{ required: true, message: '请选择城市', trigger: 'change' }],
        projectShortCode: [{ required: true, message: '请填写编码', trigger: 'blur' }],
        projStatus: [{ required: true, message: '请选择项目状态', trigger: 'change' }],
        projectShortName: [{ required: true, message: '请填写(中文)', trigger: 'blur' }],
        projectEnName: [{ required: false, message: '请填写(英文)', trigger: 'blur' }],
        currencyCode: [{ required: true, message: '请选择币种', trigger: 'change' }],
        companyCode: [{ required: true, message: '请选择项目公司', trigger: 'change' }],
        builtUpArea: [{ required: true, message: '请填写工地面积', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.form = SwaggerService.getForm('Project' + (this.type === 'create' ? 'Create' : 'Edit') + 'InputDto')
    this.form.currencyCode = 'CNY'
    if (this.id !== '0') {
      ProjectService.item(this.id).then(res => {
        const data = res.result.data
        this.info = JSON.parse(JSON.stringify(data))
        if (this.type === 'create') {
          const valueDto = SwaggerService.getForm('ProjectStageCreateInputDto')
          const value = SwaggerService.getValue(valueDto, data)
          value.projectShortCode = ''
          value.projectShortName = ''
          value.projectEnName = ''
          value.projStatus = ''
          value.companyCode = ''
          value.builtUpArea = ''
          value.projAddress = ''
          value.description = ''
          value.parentCode = data.projectCode
          value.parentId = this.id
          value.currencyCode = data.currencyCode ? data.currencyCode : 'CNY'
          this.form = value
        } else {
          this.form = data
          this.form.currencyCode = 'CNY'
        }
      })
    }
    this.form.cityID = this.$route.query.cityID ? parseInt(this.$route.query.cityID, 10) : ''
    ProjectService.types().then(res => {
      this.selection.types = res.result.data
      this.$forceUpdate()
    })
    ProjectService.tree().then(res => {
      this.selection.cities = res.result.data.citys
      this.$forceUpdate()
    })
    CurrencyService.list().then(res => {
      this.selection.currencies = res.result.data.items
      this.$forceUpdate()
    })
  },
  watch: {
    'form.cityID' (value) {
      if (value) {
        CompanyService.list(value).then(res => {
          this.selection.companies = res.result.data
          this.$forceUpdate()
        })
      }
    }
  },
  computed: {
    id () {
      return this.$route.params.id
    },
    type () {
      return this.$route.query.type
    },
    name () {
      const stage = this.$route.query.stage
      const name = stage === 'Project' ? '项目' : (stage === 'Stages' ? '分期' : '阶段')
      return name
    },
    stage () {
      return this.$route.query.stage
    },
    filteredOptions () {
      return OPTIONS.filter(o => !this.selectedItems.includes(o))
    }
  },
  methods: {
    getName (code) {
      let name = ''
      if (code && this.selection.companies) {
        this.selection.companies.forEach(item => {
          if (item.code === code) {
            name = item.nameCN
          }
        })
      }
      return name
    },
    approve () {
      console.log('approve')
    },
    save () {
      if (!this.form.projectShortName) {
        this.form.projectShortName = this.form.projectName
      }
      if (!this.form.projectShortCode) {
        this.form.projectShortCode = this.form.projectCode
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          ProjectService[this.type + this.stage](this.form).then(res => {
            if (res.result.statusCode === 200) {
              notification.success({
                message: `${this.type === 'update' ? '修改' : '添加'}成功`,
                description: `您已成功${this.type === 'update' ? '修改' : '添加'}${this.name} "${this.form.projectShortName}"`
              })
              this.$router.push('/project/list')
            }
          })
        }
      })
    },
    handleChange (selectedItems) {
      this.selectedItems = selectedItems
    },
    onChange (value, items) {
      if (items) {
        const city = items[1]
        if (city) {
          this.form.cityID = city.value
        }
      } else {
        this.form.cityID = ''
      }
    },
    back () {
      this.$router.push({ path: `/project/list` })
    },
    handleToEdit () {
      this.$router.push({ path: `/project/item/${this.id}?type=edit` })
    },
    showSelect () {
      this.show = true
    },
    handleOk () {
      this.show = false
      this.form.companyCode = this.$refs.company.selected.code
      this.$forceUpdate()
    },
    handleCancel () {
      this.show = false
    }
  }
}
</script>
<style>
.ant-btn-group {
  margin-right: 8px;
}
</style>
