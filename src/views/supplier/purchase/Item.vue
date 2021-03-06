<template>
  <page-header-wrapper>
    <a-card v-if="form" :bordered="false">
      <a-form-model
        ref="form"
        :model="form.vendor"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-model-item label="供应商名称" prop="vendorName">
              <a-input
                :disabled="type === 'view'"
                placeholder="请填写供应商名称"
                @blur="checkName(form.vendor.vendorName)"
                v-model="form.vendor.vendorName">
                <span
                  v-if="id === '0' && duplicated"
                  :class="'tips-error'"
                  slot="suffix">供应商名称重复，请重新填写</span>
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="供应商编号" prop="vendorCode">
              <a-input
                :disabled="true"
                placeholder="请填写供应商编号"
                v-model="form.vendor.vendorCode"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="供应商简称" prop="vendorAbbreviation">
              <a-input
                :disabled="type === 'view'"
                placeholder="请填写供应商简称"
                v-model="form.vendor.vendorAbbreviation"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="供应商类别" prop="packageCodeList">
              <a-tree-select
                :disabled="type === 'view'"
                v-model="form.vendor.packageCodeList"
                style="width: 100%"
                :tree-data="selection.types"
                tree-checkable
                :show-checked-strategy="SHOW_PARENT"
                search-placeholder="请选择供应商类别"
              />
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="公司所在地" prop="cityID">
              <a-cascader
                :disabled="type === 'view'"
                :options="selection.cities"
                :key="form.vendor.city"
                v-model="form.vendor.cityID"
                :default-value="[form.vendor.province,form.vendor.city]"
                placeholder="请选择公司所在地"
                @change="cityChange"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="供应商注册地址" prop="registerAddress">
              <a-input
                :disabled="type === 'view'"
                placeholder="供应商注册地址"
                v-model="form.vendor.registerAddress"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="法人代表" prop="legalRep">
              <a-input
                :disabled="type === 'view'"
                placeholder="请填写法人代表"
                v-model="form.vendor.legalRep"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="经办部门">
              <a-select v-model="form.vendor.organizationalStructureId" :disabled="type === 'view'" placeholder="请选择" default-value="0">
                <a-select-option
                  v-for="item in selection.departments"
                  :key="item.organizationalStructureId"
                  :value="item.organizationalStructureId">{{ item.departmentName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="纳税人身份" prop="taxpayerName">
              <a-select :disabled="type === 'view'" v-model="form.vendor.taxpayerName" placeholder="请选择纳税人身份">
                <a-select-option value="一般纳税人">一般纳税人</a-select-option>
                <a-select-option value="小规模纳税人">小规模纳税人</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="变更备注" prop="logRemark">
              <a-textarea
                :disabled="type === 'view' || type === 'create' || form.vendor.vendorStatus === '未准入'"
                placeholder="请填写变更备注"
                v-model="form.vendor.logRemark"></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>

      <a-tabs default-active-key="1" :animated="false">
        <a-tab-pane key="1" tab="公司员工">
          <company-staff
            ref="staff"
            :vendor="form"
            :items="form.vendorEmployeeList"
            :type="type"
            :id="id"></company-staff>
        </a-tab-pane>
        <a-tab-pane v-if="type === 'view'" key="2" tab="变更信息">
          <change-info
            :type="type"
            :id="id"
            :items="form.vendorChangeLogList"></change-info>
        </a-tab-pane>
        <a-tab-pane v-if="type === 'view'" key="3" tab="合同信息">
          <contract-info :type="type" :id="id" :items="form.vendorContractList"></contract-info>
        </a-tab-pane>
        <a-tab-pane key="4" tab="银行信息">
          <bank-info ref="bank" :vendor="form.vendor" :items="form.vendorBankList" :type="type" :id="id"></bank-info>
        </a-tab-pane>
        <a-tab-pane key="5" tab="附件信息">
          <attachment-info :data="form" :type="type" :id="id"></attachment-info>
        </a-tab-pane>
      </a-tabs>
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
      <a-row :gutter="48" style="margin-top: 15px;">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group v-if="type === 'view' && !form.vendor.logGID && ac('EDIT')">
            <a-button @click="askUpdate()" type="success">
              供应商信息变更
            </a-button>
          </a-button-group>
          <a-button-group v-if="ac('EDIT')">
            <a-button @click="bpm()" type="success">
              启动审批流程
            </a-button>
          </a-button-group>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-button-group v-if="type === 'view' && form.vendor.vendorStatus !== '未准入'">
            <a-button type="success">
              查看审批
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
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import CompanyStaff from '../components/CompanyStaff'
  import ChangeInfo from '../components/ChangeInfo'
  import ContractInfo from '../components/ContractInfo'
  import BankInfo from '../components/BankInfo'
  import AttachmentInfo from '../components/AttachmentInfo'
  import { SupplierService } from '@/views/supplier/supplier.service'
  import { formatTree } from '@/utils/util'
  import { TreeSelect } from 'ant-design-vue'
  import { City as CitySvc, formatCities } from '@/api/city'
  import { DIALOGCONFIG, Base as BaseService } from '@/api/base'
  import { ac } from '@/views/user/user.service'

  const SHOW_PARENT = TreeSelect.SHOW_PARENT
  export default {
    name: 'SupplierPurchaseItem',
    components: { AttachmentInfo, BankInfo, ContractInfo, ChangeInfo, CompanyStaff },
    data () {
      return {
        SHOW_PARENT,
        dialog: DIALOGCONFIG,
        selection: {},
        checkText: '',
        duplicated: false,
        form: {
          vendor: {},
          vendorEmployeeList: [],
          vendorBankList: []
        },
        disabled:false,
        rules: {
          vendorCode: [{ required: false, message: '请填写供应商编号', trigger: 'blur' }],
          vendorName: [{ required: true, message: '请填写供应商名称', trigger: 'change' }],
          vendorAbbreviation: [{ required: true, message: '请填写供应商别名', trigger: 'change' }],
          packageCodeList: [{ required: true, message: '请选择供应商类别', trigger: 'change' }],
          cityID: [{ required: true, message: '请选择公司所在地', trigger: 'blur' }],
          legalRep: [{ required: true, message: '请填写法人代表', trigger: 'blur' }],
          taxpayerName: [{ required: true, message: '请选择纳税人身份', trigger: 'change' }],
          logRemark: [{ required: this.type === 'update', message: '请填写变更备注', trigger: 'blur' }]
        }
      }
    },
    created () {
      if (this.id !== '0') {
        SupplierService[this.type + 'Entity'](this.id).then(res => {
          this.data = res.result.data
          this.form = res.result.data
          this.form.vendor.registerType = 0
          this.$forceUpdate()
        })
      } else {
        this.form.vendor.registerType = 0
      }
      SupplierService.types().then(res => {
        this.selection.types = formatTree([res.result.data], ['title:packageName', 'value:packageCode', 'key:gid'])
        this.$forceUpdate()
      })
      CitySvc.cities().then(res => {
        this.selection.cities = formatCities(res.result.data.provinces)
        this.$forceUpdate()
      })
      BaseService.departmentList().then(res => {
        console.log(res)
        res.result.data.sort((a, b) => {
          return a.sort - b.sort
        })
        this.selection.departments = res.result.data
      })
    },
    computed: {
      id () {
        return this.$route.params.id
      },
      type () {
        return this.$route.query.type
      }
    },
    methods: {
      ac (action) {
        return ac(action, this.$route)
      },
      checkName (name) {
        if (this.id === '0') {
          SupplierService.check(name).then(res => {
            this.duplicated = res.result.data
          })
        }
      },
      back () {
        this.$router.push({ path: `/supplier/purchase/list` })
      },
      cityChange (value) {
        this.form.vendor.province = value[0]
        this.form.vendor.city = value[1]
      },
      handleEdit (record) {
        this.visible = true
        this.mdl = { ...record }
      },
      askUpdate () {
        SupplierService.generate(this.id).then(res => {
          this.$router.push({ path: `/supplier/purchase/item/${res.result.data}?type=update` })
        })
      },
      save () {
        this.disabled = true
        this.form.vendorEmployeeList.forEach(item => {
          item.logGID = this.form.vendor.logGID
          item.vendorGID = this.form.vendor.vendorGID
        })
        this.form.vendorBankList.forEach(item => {
          item.logGID = this.form.vendor.logGID
          item.vendorGID = this.form.vendor.vendorGID
        })

        this.$refs.form.validate(valid => {
          if (valid) {
            SupplierService[this.type](this.form).then(res => {
              if (res.result.statusCode === 200) {
                this.$message.success('保存成功')
                this.$router.push({ path: `/supplier/purchase/list` })
              }else {
                this.disabled = false
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .ant-btn-group {
    margin-right: 8px;
  }

  table {
    margin: 15px 0;
    width: 100%;
    border-width: 1px 1px 0 0;
    border-radius: 3px 3px 0 0;
    border-style: solid;
    border-color: #ccc;

    thead {
      tr {
        &:first-child {
          th {
            background-color: #f5f5f5;
            white-space: nowrap;
          }
        }

        th {
          background-color: #06c;
          color: #fff;
          font-weight: normal;
          border-width: 0 0 1px 1px;
          border-style: solid;
          border-color: #ccc;

          button {
            margin-right: 10px;
          }
        }
      }
    }

    tbody {
      tr {
        td {
          padding: 0.5em 0.6em 0.4em 0.6em !important;
          border-width: 0 0 1px 1px;
          border-style: solid;
          border-color: #ccc;

          button {
            margin-right: 10px;
          }
        }
      }
    }
  }
</style>
