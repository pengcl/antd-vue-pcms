<template>
  <page-header-wrapper :title="type === 'view' ? '项目详情' : id === '0' ? '新增项目' : '编辑项目'">
    <a-card :bordered="false">
      <div v-if="id !== '0'" class="table-page-search-wrapper">
        <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="项目编码">
                HZO-HZ4
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="项目状态">
                杭州望江新城項目 (Testing)
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="房产项目名称(中文)">
                杭州望江新城項目 (Testing)
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="房产项目名称(英文)">
                杭州望江新城項目 (Testing)
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="审批状态">
                草拟中 (1.6)
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="基本资料">
          <a-form :form="baseForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-row :gutter="48">
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="地区"
                >
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择地区"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '请选择地区'}] }]">
                    <a-select-option value="1">ant-design@alipay.com</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="城市"
                >
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择地区"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '请选择城市'}] }]">
                    <a-select-option value="1">ant-design@alipay.com</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="项目名称编码"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写项目名称编码"
                    v-decorator="['name', { initialValue: '', rules: [{required: true, message: '收款人名称必须核对'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="项目状态"
                >
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择项目状态"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                    <a-select-option value="1">ant-design@alipay.com</a-select-option>
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
                    v-decorator="['name', { initialValue: '', rules: [{required: true, message: '收款人名称必须核对'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="房产项目名称(英文)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写房产项目名称(英文)"
                    v-decorator="['name', { initialValue: '', rules: [{required: true, message: '收款人名称必须核对'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
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
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item
                  label="项目地址"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写项目地址"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '收款人名称必须核对'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item
                  label="总体描述">
                  <a-textarea
                    :disabled="type === 'view'"
                    rows="4"
                    placeholder="请输入总体描述"
                    v-decorator="[
                      'description',
                      {rules: [{ required: false, message: '请输入目标描述' }]}
                    ]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="币种"
                >
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择币种"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '请选择币种'}] }]">
                    <a-select-option value="1">ant-design@alipay.com</a-select-option>
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
                    v-decorator="['paymentUser', { rules: [{required: false, message: '请选择项目公司'}] }]">
                    <a-select-option value="1">ant-design@alipay.com</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="工地面积"
                >
                  <a-input-number
                    :disabled="type === 'view'"
                    v-decorator="['area', { initialValue: '', rules: [{required: false, message: '请填写工地面积'}] }]"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" tab="项目成员">
          <a-form :form="memberForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
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
          {{ id === '0' ? '新增' : '储存' }}
        </a-button>
        <a-button @click="handleToEdit()" v-if="type === 'view'" type="primary">
          编辑
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

  const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters']
  export default {
    name: 'ProjectItem',
    components: {
      FooterToolBar
    },
    data () {
      return {
        baseForm: this.$form.createForm(this),
        memberForm: this.$form.createForm(this),
        loading: false,
        value: '',
        dataSource: [],
        selectedItems: []
      }
    },
    created () {
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
        console.log('save')
      },
      handleChange (selectedItems) {
        this.selectedItems = selectedItems
      },
      back () {
        console.log('back')
        this.$router.push({ path: `/project/list` })
      },
      handleToEdit () {
        console.log('handleToEdit')
        this.$router.push({ path: `/project/item/${this.id}?type=edit` })
      },
      nextStep () {
        const { form: { validateFields } } = this
        // 先校验，通过表单校验后，才进入下一步
        validateFields((err, values) => {
          if (!err) {
            this.$emit('nextStep')
          }
        })
      }
    }
  }
</script>
<style>
  .ant-btn-group {
    margin-right: 8px;
  }
</style>
