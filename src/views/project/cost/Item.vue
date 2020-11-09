<template>
  <page-header-wrapper :title="type === 'view' ? '项目详情' : id === '0' ? '新增业态成本中心' : '编辑业态成本中心'">
    <a-card :bordered="false">
      <div v-if="id !== '0'" class="table-page-search-wrapper">
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="成本中心编码">
                {{ form.costCenterCode }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="业态标签">
                杭州望江新城項目 (Testing)
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="成本中心名称">
                {{ form.costCenterName }}
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="产品业态属性">
                杭州望江新城項目 (Testing)
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="成本中心描述">
                {{ form.description }}
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }">
        <a-tabs v-model="activeKey" :animated="false">
          <a-tab-pane forceRender :key="1" tab="业态指标">
            <a-row :gutter="48">
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="成本中心编码"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写成本中心编码"
                    v-model="form.costCenterCode"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="成本中心名称"
                  prop="costCenterName"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写成本中心名称"
                    v-model="form.costCenterName"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-model-item
                  label="成本中心描述"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写成本中心描述"
                    v-model="form.description"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="业态标签"
                  prop="propertyTypeID"
                >
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择业态标签"
                    v-model="form.propertyTypeID">
                    <a-select-option value="1">ant-design@alipay.com</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="产品业态属性"
                  prop="developmentPurposeID"
                >
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择产品业态属性"
                    v-model="form.developmentPurposeID">
                    <a-select-option v-for="(type,index) in selection.types" :key="index" :value="type.id">
                      {{ type.nameCN }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="二次分摊",
                  prop="secCostAllocateTypeID"
                >
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择二次分摊"
                    v-model="form.secCostAllocateTypeID">
                    <a-select-option value="1">ant-design@alipay.com</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="分摊成本中心"
                >
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择分摊成本中心">
                    <a-select-option value="1">ant-design@alipay.com</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="建筑物占地面积"
                >
                  <a-input
                    :disabled="type === 'view'"
                    v-model="form.siteCoverage"
                    placeholder="请填写建筑物占地面积"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="容积率"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写容积率"
                    v-model="form.platRatio"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="CFA地上">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写CFA地上"
                    v-model="form.cfaUpperGround"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="CFA(E1)地下前勤功能空间(FOH)分摊"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写CFA(E1)地下前勤功能空间(FOH)分摊"
                    v-model="form.cfafoh"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="CFA(E2)地下后勤区(BOH)及机电间分摊(不含停车场机电间)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    v-model="form.cfaboh"
                    placeholder="请填写CFA(E2)地下后勤区(BOH)及机电间分摊(不含停车场机电间)"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="CFA(E3)地下停车场分摊(含停车场机电间)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    v-model="form.cfaCarpark"
                    placeholder="请填写CFA(E3)地下停车场分摊(含停车场机电间)"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="总建筑面积(不含停车库)(CFA)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    v-model="form.totalCFAExcludeParking"
                    placeholder="请填写总建筑面积(不含停车库)(CFA)"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="总建筑面积(含停车库)(CFA)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    v-model="form.totalCFAIncludeParking"
                    placeholder="请填写总建筑面积(含停车库)(CFA)"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="CFA Others地上"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写CFA Others地上"
                    v-model="form.cfaOtherUpperGround"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="CFA Others地下"
                >
                  <a-input
                    :disabled="type === 'view'"
                    v-model="form.cfaOtherBasement"
                    placeholder="请填写CFA Others地下"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="地上(计容地上面积 GFA)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    v-model="form.gfaUpperGround"
                    placeholder="请填写地上(计容地上面积 GFA)"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="地下(计容地下面积 GFA)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    v-model="form.gfaBasement"
                    placeholder="请填写地下(计容地下面积 GFA)"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-model-item
                  label="总计容面积(GFA)"
                  style="width: 50%;padding-right: 24px;"
                >
                  <a-input
                    :disabled="type === 'view'"
                    v-model="form.totalGFA"
                    placeholder="请填写总计容面积(GFA)"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="GFA E Others 地上"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写GFA E Others 地上"
                    v-model="form.gfaOtherUpperGround"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="GFA E Others 地下"
                >
                  <a-input
                    :disabled="type === 'view'"
                    v-model="form.gfaOtherBasement"
                    placeholder="请填写GFA E Others 地下"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-model-item
                  label="不计容面积"
                  style="width: 50%;padding-right: 24px;"
                >
                  <a-input
                    :disabled="type === 'view'"
                    v-model="form.nonAccountableGFA"
                    placeholder="请填写不计容面积"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="地上RA(=地上计容面积 GFA)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    v-model="form.raUpperGround"
                    placeholder="请填写地上RA(=地上计容面积 GFA)"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="地下RA(=地下计容面积 GFA + 不计容地下前勤建筑面积，不含后勤区及车库)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    v-model="form.raBasement"
                    placeholder="请填写地下RA(=地下计容面积 GFA + 不计容地下前勤建筑面积，不含后勤区及车库)"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="总可售/可租面积(RA)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    v-model="form.totalRA"
                    placeholder="请填写总可售/可租面积(RA)"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="单位/车位"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写单位/车位"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写单位/车位'}] }]"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane forceRender :key="2" tab="CDRD信息">
            <a-row :gutter="48">
              <a-col :md="12" :sm="24">
                <a-form-model-item label="类别/品牌">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写类别/品牌"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写类别/品牌'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="产品序号">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写产品序号"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写产品序号'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-model-item label="竣工年份" style="width: 50%;padding-right: 24px;">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写竣工年份"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写竣工年份'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="精装修楼面面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写精装修楼面面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写精装修楼面面积'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="公共区域及电梯大堂精装面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写公共区域及电梯大堂精装面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写公共区域及电梯大堂精装面积'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="地上及地下公共区域(不含卫生间)精装面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写地上及地下公共区域(不含卫生间)精装面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写地上及地下公共区域(不含卫生间)精装面积'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="地上及地下后勤精装面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写地上及地下后勤精装面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写地上及地下后勤精装面积'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="地上后勤及机房面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写地上后勤及机房面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写地上后勤及机房面积'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="地下后勤及机房面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写地下后勤及机房面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写地下后勤及机房面积'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="其它地上前勤精装面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写其它地上前勤精装面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写其它地上前勤精装面积'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="其它地下前勤精装面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写其它地下前勤精装面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写其它地下前勤精装面积'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="前勤(地上)面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写前勤(地上)面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写前勤(地上)面积'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="前勤(地下)面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写前勤(地下)面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写前勤(地下)面积'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-model-item label="总前勤面积" style="width: 50%;padding-right: 24px;">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写总前勤面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写总前勤面积'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="后勤(地上)面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写后勤(地上)面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写后勤(地上)面积'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="后勤(地下)面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写后勤(地下)面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写后勤(地下)面积'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-model-item label="总后勤面积" style="width: 50%;padding-right: 24px;">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写总后勤面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写总后勤面积'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-model-item label="公共流通空间(商业)精装修楼面面积" style="width: 50%;padding-right: 24px;">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写公共流通空间(商业)精装修楼面面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写公共流通空间(商业)精装修楼面面积'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="地上车位数目">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写地上车位数目"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写地上车位数目'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="地下车位数目">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写地下车位数目"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写地下车位数目'}] }]"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-model-item label="总车位数目" style="width: 50%;padding-right: 24px;">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写总车位数目"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写总车位数目'}] }]"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-form-model>
      <a-row :gutter="48">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group>
            <a-button @click="approve()" type="success">
              启动审批流程
            </a-button>
          </a-button-group>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-button-group>
            <a-button :loading="loading" :disabled="type === 'view'" @click="save" type="success">
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
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { SwaggerService } from '@/api/swagger.service'
import { CostService } from '@/views/project/cost/cost.service'
import { Base as BaseService, DIALOGCONFIG } from '@/api/base'

const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters']
const DTO = {
  create: 'ProjectCostCenterCreateInputDto',
  update: 'ProjectCostCenterEditInputDto'
}
export default {
  name: 'ProjectItem',
  data () {
    return {
      loading: false,
      selection: {},
      activeKey: 1,
      dialog: DIALOGCONFIG,
      form: null,
      rules: {
        costCenterName: [
          { required: true, message: '请填写成本中心名称', trigger: 'blur' }
        ],
        propertyTypeID: [{ required: true, message: '请选择业态标签', trigger: 'change' }],
        developmentPurposeID: [{ required: true, message: '请选择产品业态属性', trigger: 'change' }],
        secCostAllocateTypeID: [
          { required: true, message: '请选择二次分摊', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    BaseService.centerTags().then(res => {
      this.selection.tagTree = res.result.data
      console.log(this.selection)
      this.$forceUpdate()
    })
    BaseService.centerTypes().then(res => {
      this.selection.types = res.result.data
      this.$forceUpdate()
    })
    this.getData()
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
    getData () {
      console.log(this.id)
      if (this.id === '0') {
        this.form = SwaggerService.getForm(DTO[this.type])
      } else {
        CostService.item(this.id).then(res => {
          this.form = SwaggerService.getValue(this.form, res.result.data)
        })
      }
    },
    approve () {
      console.log('approve')
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          CostService[this.type](this.form).then(res => {
            this.loading = false
            if (res.result.statusCode === 200) {
              this.dialog.show({
                content: this.type === 'update' ? '修改成功' : '添加成功',
                title: '',
                confirmText: this.type === 'update' ? '继续修改' : '继续添加',
                cancelText: '返回上一页'
              }, (state) => {
                if (state) {
                  if (this.type === 'create') {
                    this.getData()
                  }
                } else {
                  this.$router.push({ path: '/project/cost/list' })
                }
              })
            }
          }).catch(() => {
            this.loading = false
            this.dialog.show({
              content: '创建失败，表单未填写完整',
              title: '',
              confirmText: '我知道了',
              cancelText: '返回上一页'
            }, (state) => {
              if (state) {

              } else {
              }
            })
          })
        } else {
          this.activeKey = 1
        }
      })
    },
    back () {
      console.log('back')
      this.$router.push({ path: '/project/cost/list' })
    }
  }
}
</script>
<style>.ant-btn-group {
  margin-right: 8px;
}
</style>
