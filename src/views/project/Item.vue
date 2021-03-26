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
      <a-tabs v-model="activeKey" default-active-key="1" :animated="false">
        <a-tab-pane forceRender :key="1" tab="基本资料">
          <a-form-model
            ref="baseForm"
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
                      v-for="(city,index) in selection.cities"
                      :key="index"
                      :value="city.id">{{ city.nameCN }}
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
                    <a-select-option
                      v-for="currency in selection.currencies"
                      :key="currency.code"
                      :value="currency.code">
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
                    @click="showSelect('company')"
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
        <a-tab-pane forceRender :key="2" tab="项目成员" v-if="stage === 'Stages' || stage === 'Stage'">
          <a-form-model
            ref="memberForm"
            :model="form"
            :rules="rules"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-row :gutter="48">
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="项目部总监">
                  <a-select
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择项目部总监"
                    :not-found-content="null"
                    v-model="form.projectMemberList['prjhopList']"
                    @click.native="handleSelectUser('user','prjhopList')">
                    <a-select-option
                      v-for="item in filteredOptions['prjhopList']"
                      :key="item.userId"
                      :value="item.userId+':'+item.actualName">
                      {{ item.actualName }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item
                  label="项目及工程管理部负责人">
                  <a-select
                    ref="prjpcmList"
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择项目及工程管理部负责人"
                    :not-found-content="null"
                    v-model="form.projectMemberList['prjpcmList']"
                    v-decorator="['prjpcmList', { rules: [{required: true, message: '请选择项目及工程管理部负责人'}] }]"
                    @click.native="handleSelectUser('user','prjpcmList')">
                    <a-select-option
                      v-for="item in filteredOptions['prjpcmList']"
                      :key="item.userId"
                      :value="item.userId+':'+item.actualName">
                      {{ item.actualName }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="项目负责人">
                  <a-select
                    ref="prjpicList"
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择项目负责人"
                    :not-found-content="null"
                    v-model="form.projectMemberList['prjpicList']"
                    v-decorator="['prjpicList', { rules: [{required: true, message: '请选择项目负责人'}] }]"
                    @click.native="handleSelectUser('user','prjpicList')">
                    <a-select-option
                      v-for="item in filteredOptions['prjpicList']"
                      :key="item.userId"
                      :value="item.userId+':'+item.actualName">
                      {{ item.actualName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="驻工地负责人">
                  <a-select
                    ref="prjsicList"
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择驻工地负责人"
                    :not-found-content="null"
                    v-model="form.projectMemberList['prjsicList']"
                    v-decorator="['prjsicList', { rules: [{required: true, message: '请选择驻工地负责人'}] }]"
                    @click.native="handleSelectUser('user','prjsicList')">
                    <a-select-option
                      v-for="item in filteredOptions['prjsicList']"
                      :key="item.userId"
                      :value="item.userId+':'+item.actualName">
                      {{ item.actualName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="工程秘书">
                  <a-select
                    ref="prjpjsList"
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择工程秘书"
                    :not-found-content="null"
                    v-model="form.projectMemberList['prjpjsList']"
                    v-decorator="['prjpjsList', { rules: [{required: true, message: '请选择工程秘书'}] }]"
                    @click.native="handleSelectUser('user','prjpjsList')">
                    <a-select-option
                      v-for="item in filteredOptions['prjpjsList']"
                      :key="item.userId"
                      :value="item.userId+':'+item.actualName">
                      {{ item.actualName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="项目驻香港总部人员">
                  <a-select
                    ref="prjphqList"
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择项目驻香港总部人员"
                    :not-found-content="null"
                    v-model="form.projectMemberList['prjphqList']"
                    v-decorator="['prjphqList', { rules: [{required: true, message: '请选择项目驻香港总部人员'}] }]"
                    @click.native="handleSelectUser('user','prjphqList')">
                    <a-select-option
                      v-for="item in filteredOptions['prjphqList']"
                      :key="item.userId"
                      :value="item.userId+':'+item.actualName">
                      {{ item.actualName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="驻工地人员">
                  <a-select
                    ref="prjpstList"
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择驻工地人员"
                    :not-found-content="null"
                    v-model="form.projectMemberList['prjpstList']"
                    v-decorator="['prjpstList', { rules: [{required: true, message: '请选择驻工地人员'}] }]"
                    @click.native="handleSelectUser('user','prjpstList')">
                    <a-select-option
                      v-for="item in filteredOptions['prjpstList']"
                      :key="item.userId"
                      :value="item.userId+':'+item.actualName">
                      {{ item.actualName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="合约负责人">
                  <a-select
                    ref="prjcicList"
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择合约负责人"
                    :not-found-content="null"
                    v-model="form.projectMemberList['prjcicList']"
                    v-decorator="['prjcicList', { rules: [{required: true, message: '请选择合约负责人'}] }]"
                    @click.native="handleSelectUser('user','prjcicList')">
                    <a-select-option
                      v-for="item in filteredOptions['prjcicList']"
                      :key="item.userId"
                      :value="item.userId+':'+item.actualName">
                      {{ item.actualName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="合约部驻项目人员">
                  <a-select
                    ref="prjpptList"
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择合约部驻项目人员"
                    :not-found-content="null"
                    v-model="form.projectMemberList['prjpptList']"
                    v-decorator="['prjpptList', { rules: [{required: true, message: '请选择合约部驻项目人员'}] }]"
                    @click.native="handleSelectUser('user','prjpptList')">
                    <a-select-option
                      v-for="item in filteredOptions['prjpptList']"
                      :key="item.userId"
                      :value="item.userId+':'+item.actualName">
                      {{ item.actualName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="设计负责人">
                  <a-select
                    ref="prjdicList"
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择设计负责人"
                    :not-found-content="null"
                    v-model="form.projectMemberList['prjdicList']"
                    v-decorator="['prjdicList', { rules: [{required: true, message: '请选择设计负责人'}] }]"
                    @click.native="handleSelectUser('user','prjdicList')">
                    <a-select-option
                      v-for="item in filteredOptions['prjdicList']"
                      :key="item.userId"
                      :value="item.userId+':'+item.actualName">
                      {{ item.actualName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="设计部驻项目人员">
                  <a-select
                    ref="prjdptList"
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择设计部驻项目人员"
                    :not-found-content="null"
                    v-model="form.projectMemberList['prjdptList']"
                    v-decorator="['prjdptList', { rules: [{required: true, message: '请选择设计部驻项目人员'}] }]"
                    @click.native="handleSelectUser('user','prjdptList')">
                    <a-select-option
                      v-for="item in filteredOptions['prjdptList']"
                      :key="item.userId"
                      :value="item.userId+':'+item.actualName">
                      {{ item.actualName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="企业财务管理部驻项目人员">
                  <a-select
                    ref="prjdftList"
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择企业财务管理部驻项目人员"
                    :not-found-content="null"
                    v-model="form.projectMemberList['prjdftList']"
                    v-decorator="['prjdftList', { rules: [{required: true, message: '请选择企业财务管理部驻项目人员'}] }]"
                    @click.native="handleSelectUser('user','prjdftList')">
                    <a-select-option
                      v-for="item in filteredOptions['prjdftList']"
                      :key="item.userId"
                      :value="item.userId+':'+item.actualName">
                      {{ item.actualName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="项目财务管理部驻项目人员">
                  <a-select
                    ref="prjdptfList"
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择项目财务管理部驻项目人员"
                    :not-found-content="null"
                    v-model="form.projectMemberList['prjdptfList']"
                    v-decorator="['prjdptfList', { rules: [{required: true, message: '请选择项目财务管理部驻项目人员'}] }]"
                    @click.native="handleSelectUser('user','prjdptfList')">
                    <a-select-option
                      v-for="item in filteredOptions['prjdptfList']"
                      :key="item.userId"
                      :value="item.userId+':'+item.actualName">
                      {{ item.actualName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="土地储备拓展部驻项目人员">
                  <a-select
                    ref="prjpltList"
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择土地储备拓展部驻项目人员"
                    :not-found-content="null"
                    v-model="form.projectMemberList['prjpltList']"
                    v-decorator="['prjpltList', { rules: [{required: true, message: '请选择土地储备拓展部驻项目人员'}] }]"
                    @click.native="handleSelectUser('user','prjpltList')">
                    <a-select-option
                      v-for="item in filteredOptions['prjpltList']"
                      :key="item.userId"
                      :value="item.userId+':'+item.actualName">
                      {{ item.actualName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="项目审计及监察部驻项目人员">
                  <a-select
                    ref="prjpatList"
                    :disabled="type === 'view'"
                    mode="multiple"
                    placeholder="请选择项目审计及监察部驻项目人员"
                    :not-found-content="null"
                    v-model="form.projectMemberList['prjpatList']"
                    v-decorator="['prjpatList', { rules: [{required: true, message: '请选择项目审计及监察部驻项目人员'}] }]"
                    @click.native="handleSelectUser('user','prjpatList')">
                    <a-select-option
                      v-for="item in filteredOptions['prjpatList']"
                      :key="item.userId"
                      :value="item.userId+':'+item.actualName">
                      {{ item.actualName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-tab-pane>
      </a-tabs>
      <a-row :gutter="48">
        <a-col :md="24" :sm="24">
          <a-button-group v-if="type === 'view' && info.auditStatus !== '未审核' && ac('VIEW') && isCanStartBPM">
            <a-button @click="view()" type="success">
              查看审批
            </a-button>
          </a-button-group>
          <a-button-group v-if="type === 'update' && info.auditStatus === '未审核' && ac('EDIT') && isCanStartBPM">
            <a-button :loading="loading.bpm" @click="bpm" type="success">
              启动审批流程
            </a-button>
          </a-button-group>
          <a-button-group v-if="type !== 'view' && ac(type === 'create' ? 'ADD' : 'EDIT')">
            <a-button @click="save" type="success" :disabled="disabled">
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
        :maskClosable="false"
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
        :visible="show.company"
        :data="selection.companies"
        @cancel="handleCancel('company')"
        @ok="handleOk('company')"></select-company>
    </a-card>
    <project-user-modal
      ref="projectUserModal"
      :visible="show.user"
      @cancel="handleCancel('user')"
      @ok="handleOk('user')"></project-user-modal>
  </page-header-wrapper>
</template>
<script>
  import pick from 'lodash.pick'
  import { SwaggerService } from '@/api/swagger.service'
  import { ProjectService } from '@/views/project/project.service'
  import { Currency as CurrencyService } from '@/api/currency'
  import { Company as CompanyService } from '@/api/company'
  import { Base as BaseService, DIALOGCONFIG } from '@/api/base'
  import SelectCompany from '@/views/project/components/selectComany/index'
  import notification from 'ant-design-vue/es/notification'
  import { acs, ac } from '@/views/user/user.service'
  import ProjectUserModal from '@/views/project/modal/ProjectUserModal'
  import { SignedService } from '@/views/pay/signed/signed.service'

  const OPTIONS = []
  export default {
    name: 'ProjectItem',
    components: {
      SelectCompany,
      ProjectUserModal
    },
    data () {
      return {
        dialog: DIALOGCONFIG,
        selection: {},
        show: { company: false, user: false },
        userId: '',
        filteredOptions: [],
        form: {},
        info: {},
        activeKey: 1,
        loading: {
          bpm: false,
          save: false,
          view: false
        },
        disabled: false,
        isCanStartBPM: false,
        rules: {
          cityID: [{ required: true, message: '请选择城市', trigger: 'change' }],
          projectShortCode: [{ required: true, message: '请填写编码', trigger: 'blur' }],
          projStatus: [{ required: true, message: '请选择项目状态', trigger: 'change' }],
          projectShortName: [{ required: true, message: '请填写(中文)', trigger: 'blur' }],
          projectEnName: [{ required: false, message: '请填写(英文)', trigger: 'blur' }],
          currencyCode: [{ required: true, message: '请选择币种', trigger: 'change' }],
          companyCode: [{ required: true, message: '请选择项目公司', trigger: 'change' }],
          builtUpArea: [{ required: true, message: '请填写工地面积', trigger: 'blur' }],
          projectMemberList: []
        }
      }
    },
    created () {
      this.getData()
      ProjectService.types().then(res => {
        this.selection.types = res.result.data
        this.$forceUpdate()
      })
      ProjectService.newTree().then(res => {
        this.selection.cities = res.result.data.items
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
      },
      'form' (value) {
        console.log(value)
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
      }
    },
    methods: {
      ac (action) {
        return ac(action, this.$route)
      },
      getData () {
        // const stageName = this.type !== 'Project' ? this.stage : ''
        this.form = SwaggerService.getForm('Project' + (this.type === 'create' ? 'Create' : 'Edit') + 'InputDto')
        this.form.projectMemberList = {
          prjhopList: [],
          prjpicList: [],
          prjpcmList: [],
          prjsicList: [],
          prjpjsList: [],
          prjphqList: [],
          prjpstList: [],
          prjcicList: [],
          prjpptList: [],
          prjdicList: [],
          prjdptList: [],
          prjdftList: [],
          prjdptfList: [],
          prjpltList: [],
          prjpatList: []
        }
        this.form.currencyCode = 'CNY'
        if (this.id !== '0') {
          ProjectService.item(this.id).then(res => {
            console.log(res.result.data)
            const data = res.result.data
            this.info = JSON.parse(JSON.stringify(data))
            if (this.type === 'create') {
              const valueDto = SwaggerService.getForm('ProjectStageCreateInputDto')
              console.log(valueDto)
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
              value.projectMemberList = {
                prjhopList: data.projectMemberList.prjhopList,
                prjpicList: data.projectMemberList.prjpicList,
                prjpcmList: data.projectMemberList.prjpcmList,
                prjsicList: data.projectMemberList.prjsicList,
                prjpjsList: data.projectMemberList.prjpjsList,
                prjphqList: data.projectMemberList.prjphqList,
                prjpstList: data.projectMemberList.prjpstList,
                prjcicList: data.projectMemberList.prjcicList,
                prjpptList: data.projectMemberList.prjpptList,
                prjdicList: data.projectMemberList.prjdicList,
                prjdptList: data.projectMemberList.prjdptList,
                prjdftList: data.projectMemberList.prjdftList,
                prjdptfList: data.projectMemberList.prjdptfList,
                prjpltList: data.projectMemberList.prjpltList,
                prjpatList: data.projectMemberList.prjpatList
              }
              this.form = value
            } else {
              const that = this
              Object.keys(JSON.parse(JSON.stringify(data.projectMemberList))).forEach(function (key) {
                if (data.projectMemberList[key].length > 0) {
                  const userList = []
                  const userIds = []
                  data.projectMemberList[key].forEach(item => {
                    if (item) {
                      const items = item.split(':')
                      const itemObj = {
                        userId: items[0],
                        actualName: items[1]
                      }
                      userList.push(itemObj)
                      userIds.push(item)
                    }
                  })
                  that.filteredOptions[key] = JSON.parse(JSON.stringify(userList))
                  data.projectMemberList[key] = JSON.parse(JSON.stringify(userIds))
                }
              })
              this.form = data
              this.form.currencyCode = 'CNY'
            }
          })
          ProjectService.edit(this.id).then(res => {
            this.isCanStartBPM = res.result.data.isCanStartBPM
          })
        }
        this.form.cityID = this.$route.query.cityID ? parseInt(this.$route.query.cityID, 10) : ''
      },
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
      view () {
        this.loading.view = true
        BaseService.viewBpm(this.form.projectGUID).then(res => {
          this.loading.view = false
          const _window = window.open('_blank')
          _window.location = res.result.data
        })
      },
      bpm () {
        this.loading.bpm = true
        ProjectService.bpm(this.form.projectGUID).then(res => {
          this.loading.bpm = false
          const _window = window.open('_blank')
          this.getData()
          _window.location = res.result.data
          this.$router.push({ path: `/project/list` })
        })
      },
      save () {
        this.disabled = true
        this.form.parentId = this.id
        if (!this.form.projectShortName) {
          this.form.projectShortName = this.form.projectName
        }
        if (!this.form.projectShortCode) {
          this.form.projectShortCode = this.form.projectCode
        }
        let isValid = true
        const validateForms = [
          {
            activeKey: 1,
            key: 'baseForm'
          }
          // {
          //   activeKey: 2,
          //   key: 'memberForm'
          // }
        ]
        validateForms.forEach((item, index) => {
          //
          this.$refs[item.key].validate(valid => {
            this.disabled = false
            if (!valid) {
              isValid = false
              this.activeKey = item.activeKey
            }
          })
        })

        if (isValid) {
          ProjectService[this.type + this.stage](JSON.parse(JSON.stringify(this.form))).then(res => {
            if (res.result.statusCode === 200) {
              notification.success({
                message: `${this.type === 'update' ? '修改' : '添加'}成功`,
                description: `您已成功${this.type === 'update' ? '修改' : '添加'}${this.name} "${this.form.projectShortName}"`
              })
              this.$router.push('/project/list')
            } else {
              this.disabled = false
            }
          }).catch((e) => {
            this.disabled = false
            console.log('保存报错', e)
          })
        } else {
          this.disabled = false
        }
        // this.$refs.form.validate(valid => {
        //   if (valid) {
        //     // if (this.stage === 'Stages' || this.stage === 'Stage') {
        //     //   this.form.validateFields((err, values) => {
        //     //     if (!err) {
        //     //       console.log('Received values of form: ', values)
        //     //     }
        //     //   })
        //     // }
        //     ProjectService[this.type + this.stage](JSON.parse(JSON.stringify(this.form))).then(res => {
        //       if (res.result.statusCode === 200) {
        //         notification.success({
        //           message: `${this.type === 'update' ? '修改' : '添加'}成功`,
        //           description: `您已成功${this.type === 'update' ? '修改' : '添加'}${this.name} "${this.form.projectShortName}"`
        //         })
        //         this.$router.push('/project/list')
        //       } else {
        //         this.disabled = false
        //       }
        //     }).catch((e) => {
        //       this.disabled = false
        //       console.log('保存报错', e)
        //     })
        //   } else {
        //     this.disabled = false
        //   }
        // })
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
      showSelect (type) {
        this.show[type] = true
      },
      handleOk (type) {
        if (type && type === 'company') {
          this.show[type] = false
          this.form.companyCode = this.$refs.company.selected.code
          this.$forceUpdate()
        } else {
          // 选择成员列表
          this.confirmLoading = true
          const selected = this.$refs.projectUserModal.selected
          console.log('selected', selected)
          const userList = []
          const userIds = []
          if (selected.length > 0) {
            selected.forEach(item => {
              if (item) {
                userList.push(item)
                userIds.push(item.userId + ':' + item.actualName)
              }
            })
          }
          this.confirmLoading = false
          this.show[type] = false
          this.filteredOptions[this.userId] = JSON.parse(JSON.stringify(userList))
          this.form.projectMemberList[this.userId] = JSON.parse(JSON.stringify(userIds))
          this.$refs['memberForm'].validate(valid => {})

          this.$forceUpdate()
        }
      },
      handleCancel (type) {
        this.show[type] = false
      },
      handleSelectUser (type, userId) {
        this.$refs.projectUserModal.selected = []
        this.show[type] = true
        this.userId = userId
      }
    }
  }
</script>
<style>
  .ant-btn-group {
    margin-right: 8px;
  }
</style>
