<template>
  <page-header-wrapper :title="type === 'view' ? '项目详情' : id === '0' ? '新增业态成本中心' : '编辑业态成本中心'">
    <a-card :bordered="false">
      <div v-if="id !== '0'" class="table-page-search-wrapper">
        <a-form-model :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
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
      <a-tabs default-active-key="1" :animated="false">
        <a-tab-pane key="1" tab="业态指标">
          <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-row :gutter="48">
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="成本中心编码"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写成本中心编码"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写成本中心编码'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="成本中心名称"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写成本中心名称"
                    v-decorator="['name', { initialValue: '', rules: [{required: true, message: '请填写成本中心名称'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item
                  label="成本中心描述"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写成本中心描述"
                    v-decorator="['name', { initialValue: '', rules: [{required: true, message: '请填写成本中心描述'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="业态标签"
                >
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择业态标签"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '请选择业态标签'}] }]">
                    <a-select-option value="1">ant-design@alipay.com</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="产品业态属性"
                  prop="propertyTypeID"
                >
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择产品业态属性"
                    v-model="form.propertyTypeID"
                    v-decorator="['propertyTypeID', { rules: [{required: true, message: '请选择产品业态属性'}] }]">
                    <a-select-option v-for="(type,index) in selection.types" :key="index" :value="type.id">
                      {{ type.nameCN }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="二次分摊"
                >
                  <a-select
                    :disabled="type === 'view'"
                    placeholder="请选择二次分摊"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '请选择二次分摊'}] }]">
                    <a-select-option value="1">ant-design@alipay.com</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="分摊成本中心"
                >
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择分摊成本中心"
                    v-decorator="['paymentUser', { rules: [{required: false, message: '请选择分摊成本中心'}] }]">
                    <a-select-option value="1">ant-design@alipay.com</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="建筑物占地面积"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写建筑物占地面积"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写建筑物占地面积'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="容积率"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写容积率"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写容积率'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="CFA地上">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写CFA地上"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写CFA地上'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="CFA(E1)地下前勤功能空间(FOH)分摊"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写CFA(E1)地下前勤功能空间(FOH)分摊"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写CFA(E1)地下前勤功能空间(FOH)分摊'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="CFA(E2)地下后勤区(BOH)及机电间分摊(不含停车场机电间)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写CFA(E2)地下后勤区(BOH)及机电间分摊(不含停车场机电间)"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写CFA(E2)地下后勤区(BOH)及机电间分摊(不含停车场机电间)'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="CFA(E3)地下停车场分摊(含停车场机电间)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写CFA(E3)地下停车场分摊(含停车场机电间)"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写CFA(E3)地下停车场分摊(含停车场机电间)'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="总建筑面积(不含停车库)(CFA)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写总建筑面积(不含停车库)(CFA)"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写总建筑面积(不含停车库)(CFA)'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="总建筑面积(含停车库)(CFA)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写总建筑面积(含停车库)(CFA)"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写总建筑面积(含停车库)(CFA)'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="CFA Others地上"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写CFA Others地上"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写CFA Others地上'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="CFA Others地下"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写CFA Others地下"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写CFA Others地下'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="地上(计容地上面积 GFA)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写地上(计容地上面积 GFA)"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写地上(计容地上面积 GFA)'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="地下(计容地下面积 GFA)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写地下(计容地下面积 GFA)"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写地下(计容地下面积 GFA)'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item
                  label="总计容面积(GFA)"
                  style="width: 50%;padding-right: 24px;"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写总计容面积(GFA)"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写总计容面积(GFA)'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="GFA E Others 地上"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写GFA E Others 地上"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写GFA E Others 地上'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="GFA E Others 地下"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写GFA E Others 地下"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写GFA E Others 地下'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item
                  label="不计容面积"
                  style="width: 50%;padding-right: 24px;"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写不计容面积"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写不计容面积'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="地上RA(=地上计容面积 GFA)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写地上RA(=地上计容面积 GFA)"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写地上RA(=地上计容面积 GFA)'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="地下RA(=地下计容面积 GFA + 不计容地下前勤建筑面积，不含后勤区及车库)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写地下RA(=地下计容面积 GFA + 不计容地下前勤建筑面积，不含后勤区及车库)"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写地下RA(=地下计容面积 GFA + 不计容地下前勤建筑面积，不含后勤区及车库)'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="总可售/可租面积(RA)"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写总可售/可租面积(RA)"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写总可售/可租面积(RA)'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="单位/车位"
                >
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写单位/车位"
                    v-decorator="['paymentUser', { initialValue: 0, rules: [{required: false, type:'number', message: '请填写单位/车位'}] }]"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" tab="CDRD信息">
          <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-row :gutter="48">
              <a-col :md="12" :sm="24">
                <a-form-item label="类别/品牌">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写类别/品牌"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写类别/品牌'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="产品序号">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写产品序号"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写产品序号'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item label="竣工年份" style="width: 50%;padding-right: 24px;">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写竣工年份"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写竣工年份'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="精装修楼面面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写精装修楼面面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写精装修楼面面积'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="公共区域及电梯大堂精装面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写公共区域及电梯大堂精装面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写公共区域及电梯大堂精装面积'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="地上及地下公共区域(不含卫生间)精装面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写地上及地下公共区域(不含卫生间)精装面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写地上及地下公共区域(不含卫生间)精装面积'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="地上及地下后勤精装面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写地上及地下后勤精装面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写地上及地下后勤精装面积'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="地上后勤及机房面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写地上后勤及机房面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写地上后勤及机房面积'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="地下后勤及机房面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写地下后勤及机房面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写地下后勤及机房面积'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="其它地上前勤精装面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写其它地上前勤精装面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写其它地上前勤精装面积'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="其它地下前勤精装面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写其它地下前勤精装面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写其它地下前勤精装面积'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="前勤(地上)面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写前勤(地上)面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写前勤(地上)面积'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="前勤(地下)面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写前勤(地下)面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写前勤(地下)面积'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item label="总前勤面积" style="width: 50%;padding-right: 24px;">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写总前勤面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写总前勤面积'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="后勤(地上)面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写后勤(地上)面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写后勤(地上)面积'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="后勤(地下)面积">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写后勤(地下)面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写后勤(地下)面积'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item label="总后勤面积" style="width: 50%;padding-right: 24px;">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写总后勤面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写总后勤面积'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item label="公共流通空间(商业)精装修楼面面积" style="width: 50%;padding-right: 24px;">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写公共流通空间(商业)精装修楼面面积"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写公共流通空间(商业)精装修楼面面积'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="地上车位数目">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写地上车位数目"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写地上车位数目'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="地下车位数目">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写地下车位数目"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写地下车位数目'}] }]"/>
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item label="总车位数目" style="width: 50%;padding-right: 24px;">
                  <a-input
                    :disabled="type === 'view'"
                    placeholder="请填写总车位数目"
                    v-decorator="['name', { initialValue: '', rules: [{required: false, message: '请填写总车位数目'}] }]"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
      </a-tabs>
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
            <a-button :disabled="type === 'view'" @click="save" type="success">
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
  import { Base as BaseService } from '@/api/base'

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
        form: null
      }
    },
    created () {
      this.form = SwaggerService.getForm(DTO[this.type])
      CostService.item(this.id).then(res => {
        this.form = SwaggerService.getValue(this.form, res.result.data)
      })
      BaseService.centerTags().then(res => {
        this.selection.tagTree = res.result.data
        console.log(this.selection)
        this.$forceUpdate()
      })
      BaseService.centerTypes().then(res => {
        this.selection.types = res.result.data
        this.$forceUpdate()
      })
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
        this.$router.push({ path: '/project/cost/list' })
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
<style>.ant-btn-group {
  margin-right: 8px;
}
</style>
