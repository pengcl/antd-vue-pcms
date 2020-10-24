<template>
  <page-header-wrapper :title="type === 'view' ? '项目详情' : id === '0' ? '新增项目' : '编辑项目'">
    <a-card :bordered="false">
      <div v-if="id !== '0'" class="table-page-search-wrapper">
        <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="项目编码">
                {{ form.projectCode }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="项目状态">
                {{ form.projStatus }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="房产项目名称(中文)">
                {{ form.projectName }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="房产项目名称(英文)">
                {{ form.projectEnName }}11
              </a-form-item>
            </a-col>
            <a-col v-if="data" :md="12" :sm="24">
              <a-form-item label="审批状态">
                {{ data.auditStatus }}
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="基本资料">
          <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-row :gutter="48">
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="城市"
                >
                  <!--<a-cascader
                    :options="regionalOffices"
                    :load-data="loadCities"
                    placeholder="请选择"
                    @change="onChange"
                  />-->
                  <a-select
                    placeholder="请选择城市"
                    v-model="form.cityID">
                    <a-select-option
                      v-for="city in selection.cities"
                      :key="city.city.id"
                      :value="city.city.id">{{ city.city.nameCN }}
                    </a-select-option>
                  </a-select>
                  <!--<a-select
                    :disabled="type === 'view'"
                    placeholder="请选择地区"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '请选择城市'}] }]">
                    <a-select-option value="1">ant-design@alipay.com</a-select-option>
                  </a-select>-->
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="项目名称编码"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写项目名称编码"
                    v-model="form.projectCode"
                    v-decorator="['form.projectCode', { initialValue: '', rules: [{required: true, message: '收款人名称必须核对'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="项目状态"
                >
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择项目状态"
                    v-model="form.projStatus"
                    v-decorator="['form.projStatus', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                    <a-select-option
                      v-for="state in selection.types"
                      :key="state.nameCN"
                      :value="state.nameCN">{{ state.nameCN }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="房产项目名称(中文)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写房产项目名称(中文)"
                    v-model="form.projectName"
                    v-decorator="['form.projectName', { initialValue: '', rules: [{required: true, message: '收款人名称必须核对'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="房产项目名称(英文)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写房产项目名称(英文)"
                    v-model="form.projectEnName"
                    v-decorator="['form.projectEnName', { initialValue: '', rules: [{required: true, message: '收款人名称必须核对'}] }]"/>
                </a-form-item>
              </a-col>
              <!--<a-col :md="12" :sm="24">
                <a-form-item
                  label="所属项目"
                >
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择项目"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                    <a-select-option value="1">ant-design@alipay.com</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="所属分期"
                >
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择所属分期"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                    <a-select-option value="1">ant-design@alipay.com</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>-->
              <a-col :md="24" :sm="24">
                <a-form-item
                  label="项目地址"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写项目地址"
                    v-model="form.projAddress"
                    v-decorator="['form.projAddress', { initialValue: '', rules: [{required: false, message: '收款人名称必须核对'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item
                  label="总体描述">
                  <a-textarea
                    :disabled="type === 'view'"
                    rows="4"
                    placeholder="请输入总体描述"
                    v-model="form.description"
                    v-decorator="[
                      'form.description',
                      {rules: [{ required: false, message: '请输入目标描述' }]}
                    ]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="币种"
                >
                  <!--<a-select
                    :disabled="type === 'view'"
                    placeholder="请选择币种"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '请选择币种'}] }]">
                    <a-select-option value="1">ant-design@alipay.com</a-select-option>
                  </a-select>-->
                  <a-select
                    placeholder="请选择币种"
                    v-model="form.currencyCode"
                    v-decorator="['form.currencyCode', { rules: [{required: true, message: '请选择币种'}] }]">
                    <a-select-option v-for="currency in selection.currencies" :key="currency.id" :value="currency.id">
                      {{ currency.nameCN }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="项目公司"
                >
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择项目公司"
                    v-model="form.companyCode"
                    v-decorator="['form.companyCode', { rules: [{required: false, message: '请选择项目公司'}] }]">
                    <a-select-option
                      v-for="company in selection.companies"
                      :key="company.code"
                      :value="company.code">{{ company.nameCN }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="工地面积"
                >
                  <a-input-number
                    :disabled="type === 'view'"
                    v-model="form.builtUpArea"
                    placeholder="请填写工地面积"
                    v-decorator="['form.builtUpArea', { initialValue: '', rules: [{required: false, message: '请填写工地面积'}] }]"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
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
    </a-card>
    <footer-tool-bar>
      <a-button-group>
        <a-button @click="approve()" type="success">
          启动审批流程
        </a-button>
      </a-button-group>
      <a-button-group>
        <a-button @click="save()" v-if="type !== 'view'" :loading="loading" type="success">
          储存
        </a-button>
      </a-button-group>
      <a-button-group>
        <a-button @click="back()" type="danger">
          关闭
        </a-button>
      </a-button-group>
    </footer-tool-bar>
  </page-header-wrapper>
</template>
<script>
import { FooterToolBar } from '@/components'
import { SwaggerService } from '@/api/swagger.service'
import { ProjectService } from '@/views/project/project.service'
import { City as CityService } from '@/api/city'
import { Regional as RegionalService } from '@/api/regional'
import { Currency as CurrencyService } from '@/api/currency'
import { Company as CompanyService } from '@/api/company'

const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters']
export default {
  name: 'ProjectItem',
  components: {
    FooterToolBar
  },
  data () {
    return {
      regionalOffices: [],
      loading: false,
      value: '',
      selection: {},
      dataSource: [],
      selectedItems: [],
      data: null,
      dto: {},
      form: {}
    }
  },
  created () {
    console.log('create')
    this.dto = SwaggerService.getDto('Project' + (this.type === 'create' ? 'Create' : 'Edit') + 'Input')
    this.form = SwaggerService.getForm('Project' + (this.type === 'create' ? 'Create' : 'Edit') + 'InputDto')
    if (this.id !== '0') {
      ProjectService.item(this.id).then(res => {
        this.data = res.result.data
        this.form = SwaggerService.getValue(this.form, res.result.data)
      })
    }
    this.form.cityID = this.$route.query.cityId ? parseInt(this.$route.query.cityId, 10) : ''
    ProjectService.types().then(res => {
      this.selection.types = res.result.data
    })
    ProjectService.tree().then(res => {
      this.selection.cities = res.result.data.citys
      this.$forceUpdate()
    })
    CurrencyService.list().then(res => {
      this.selection.currencies = res.result.data.items
    })
  },
  watch: {
    'form.cityID' (value) {
      CompanyService.list(value).then(res => {
        this.selection.companies = res.result.data
        this.$forceUpdate()
      })
    }
  },
  computed: {
    id () {
      return this.$route.params.id
    },
    type () {
      return this.$route.query.type
    },
    filteredOptions () {
      return OPTIONS.filter(o => !this.selectedItems.includes(o))
    }
  },
  methods: {
    approve () {
      console.log('approve')
    },
    save () {
      ProjectService[this.type](this.form).then(res => {
        console.log(res)
      })
    },
    handleChange (selectedItems) {
      this.selectedItems = selectedItems
    },
    loadCities (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      CityService.list(targetOption.value).then(res => {
        targetOption.loading = false
        const items = []
        res.result.data.items.forEach(item => {
          items.push({
            value: item.id,
            label: item.nameCN
          })
        })
        targetOption.children = items
        this.regionalOffices = [...this.regionalOffices]
      })
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
      console.log('back')
      this.$router.push({ path: `/project/list` })
    },
    handleToEdit () {
      console.log('handleToEdit')
      this.$router.push({ path: `/project/item/${this.id}?type=edit` })
    }
  }
}
</script>
<style>
.ant-btn-group {
  margin-right: 8px;
}
</style>
