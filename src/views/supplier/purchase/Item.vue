<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="供应商编号">
              <a-input
                :disabled="type === 'view'"
                placeholder="请填写供应商编号"
                v-model="form.vendor.vendorCode"
                v-decorator="['form.vendor.vendorCode', { initialValue: '', rules: [{required: true, message: '请填写供应商编号'}] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="供应商名称">
              <a-input
                :disabled="type === 'view'"
                placeholder="请填写供应商名称"
                v-model="form.vendor.vendorName"
                v-decorator="['form.vendor.vendorName', { initialValue: '', rules: [{required: true, message: '请填写供应商名称'}] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="供应商简称">
              <a-input
                :disabled="type === 'view'"
                placeholder="请填写供应商简称"
                v-model="form.vendor.vendorAbbreviation"
                v-decorator="['form.vendor.vendorAbbreviation', { initialValue: '', rules: [{required: true, message: '请填写供应商简称'}] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="供应商类别">
              <a-tree-select
                v-model="form.vendor.packageCode"
                style="width: 100%"
                :tree-data="selection.types"
                tree-checkable
                :show-checked-strategy="SHOW_PARENT"
                search-placeholder="请选择供应商类别"
              />
              <!--<a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">深圳</a-select-option>
                <a-select-option value="1">广州</a-select-option>
                <a-select-option value="2">珠海</a-select-option>
              </a-select>-->
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="公司所在地">
              <a-cascader
                :options="selection.cities"
                :default-value="[form.vendor.province, form.vendor.city]"
                placeholder="请选择公司所在地"
                @change="cityChange"/>
            </a-form-item>
          </a-col>
          <!--<a-col :md="12" :sm="24">
            <a-form-item label="公司所在地(省)">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">深圳</a-select-option>
                <a-select-option value="1">广州</a-select-option>
                <a-select-option value="2">珠海</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="市">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">深圳</a-select-option>
                <a-select-option value="1">广州</a-select-option>
                <a-select-option value="2">珠海</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>-->
          <a-col :md="12" :sm="24">
            <a-form-item label="法人代表">
              <a-input
                :disabled="type === 'view'"
                placeholder="请填写法人代表"
                v-model="form.vendor.legalRep"
                v-decorator="['form.vendor.legalRep', { initialValue: '', rules: [{required: true, message: '请填写法人代表'}] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="经办部门">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">深圳</a-select-option>
                <a-select-option value="1">广州</a-select-option>
                <a-select-option value="2">珠海</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="纳税人身份">
              <a-select v-model="form.vendor.taxpayerName" placeholder="请选择">
                <a-select-option value="一般纳税人">一般纳税人</a-select-option>
                <a-select-option value="小规模纳税人">小规模纳税人</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="变更备注">
              <a-textarea
                :disabled="type === 'view'"
                placeholder="请填写变更备注"
                v-model="form.vendor.logRemark"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="公司员工">
          <company-staff :vendor="form.vendor" :items="form.vendorEmployeeList"></company-staff>
        </a-tab-pane>
        <a-tab-pane key="2" tab="变更信息">
          <change-info></change-info>
        </a-tab-pane>
        <a-tab-pane key="3" tab="合同信息">
          <contract-info></contract-info>
        </a-tab-pane>
        <a-tab-pane key="4" tab="银行信息">
          <bank-info :vendor="form.vendor" :items="form.vendorBankList"></bank-info>
        </a-tab-pane>
        <a-tab-pane key="5" tab="附件信息">
          <attachment-info></attachment-info>
        </a-tab-pane>
      </a-tabs>
      <a-modal
        v-if="dialog"
        :title="dialog.title"
        :visible="dialog.visible"
        @ok="dialog.confirm"
        @cancel="dialog.cancel"
      >
        <p>{{ dialog.content }}</p>
      </a-modal>
      <footer-tool-bar>
        <a-button-group>
          <a-button v-if="type !== 'view'" @click="save()" type="success">
            储存
          </a-button>
        </a-button-group>
        <a-button-group>
          <a-button v-if="type === 'view' && !form.vendor.logGID" @click="askUpdate()" type="success">
            供应商信息变更
          </a-button>
        </a-button-group>
        <a-button-group disabled>
          <a-button v-if="type !== 'view'" @click="approve()" type="success">
            提请审批
          </a-button>
        </a-button-group>
        <a-button-group>
          <a-button @click="back()" type="danger">
            关闭
          </a-button>
        </a-button-group>
      </footer-tool-bar>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { FooterToolBar } from '@/components'
  import CompanyStaff from '../components/CompanyStaff'
  import ChangeInfo from '../components/ChangeInfo'
  import ContractInfo from '../components/ContractInfo'
  import BankInfo from '../components/BankInfo'
  import AttachmentInfo from '../components/AttachmentInfo'
  import { SwaggerService } from '@/api/swagger.service'
  import { SupplierService } from '@/views/supplier/supplier.service'
  import { formatTree } from '@/utils/util'
  import { TreeSelect } from 'ant-design-vue'
  import { City as CitySvc, formatCities } from '@/api/city'
  import { DIALOGCONFIG } from '@/api/base'

  const DTO = {
    create: 'ChangeVendorZRInputDto',
    update: 'VendorChangeDto',
    view: ''
  }
  const SHOW_PARENT = TreeSelect.SHOW_PARENT
  export default {
    name: 'SupplierPurchaseItem',
    components: { FooterToolBar, AttachmentInfo, BankInfo, ContractInfo, ChangeInfo, CompanyStaff },
    data () {
      return {
        SHOW_PARENT,
        dialog: DIALOGCONFIG,
        selection: {},
        form: {
          vendor: {},
          vendorBankList: [],
          vendorEmployeeList: []
        }
      }
    },
    created () {
      this.dialog.show({
        content: '添加成功',
        title: '',
        confirmText: '继续添加',
        cancel: '返回上一页'
      }, (state) => {
        if (state) {

        } else {
          this.$router.push('/supplier/purchase/list')
        }
      })
      this.form.vendor = SwaggerService.getForm(DTO[this.type])
      if (this.id !== '0') {
        SupplierService[this.type + 'Entity'](this.id).then(res => {
          this.data = res.result.data
          if (this.type === 'view') {
            this.form.vendor = res.result.data
          } else {
            this.form.vendor = res.result.data.vendor
          }
          this.form.vendorEmployeeList = res.result.data.vendorEmployeeList
          this.form.vendorBankList = res.result.data.vendorBankList
        })
      }
      SupplierService.types().then(res => {
        this.selection.types = formatTree([res.result], ['title:packageName', 'value:packageCode', 'key:gid'])
        this.$forceUpdate()
      })
      CitySvc.cities().then(res => {
        this.selection.cities = formatCities(res.result.data.provinces)
        this.$forceUpdate()
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
      back () {
        this.$router.push({ path: `/supplier/purchase/list` })
      },
      cityChange (value) {
        console.log(value)
        this.form.vendor.province = value[0]
        this.form.vendor.city = value[1]
      },
      handleEdit (record) {
        this.visible = true
        this.mdl = { ...record }
      },
      askUpdate () {
        SupplierService.generate(this.id).then(res => {
          console.log(res.result.data)
          this.$router.push({ path: `/supplier/purchase/item/${res.result.data}?type=update` })
        })
      },
      save () {
        this.form.vendorEmployeeList.forEach(item => {
          item.logGID = this.form.vendor.logGID
          item.vendorGID = this.form.vendor.vendorGID
        })
        this.form.vendorBankList.forEach(item => {
          item.logGID = this.form.vendor.logGID
          item.vendorGID = this.form.vendor.vendorGID
        })
        SupplierService[this.type](this.form).then(res => {
          this.dialog.show({ title: '系统提示', content: '添加成功', confirmText: '继续添加', cancel: '返回上一页' }, (state) => {
            console.log(state)
          })
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
        th {
          background-color: #f5f5f5;
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
