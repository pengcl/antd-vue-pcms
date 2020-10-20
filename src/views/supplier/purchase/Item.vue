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
              <a-cascader :options="selection.cities" placeholder="请选择公司所在地" @change="cityChange"/>
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
          <!--<a-col :md="24" :sm="24">
            <table>
              <thead>
                <tr>
                  <th colspan="12">公司员工</th>
                </tr>
                <tr>
                  <th style="width: 5%">操作</th>
                  <th style="width: 5%">联系人姓名</th>
                  <th style="width: 5%">现任职位</th>
                  <th style="width: 5%">公司联系人</th>
                  <th style="width: 10%">台鉴人</th>
                  <th style="width: 10%">业务联系人</th>
                  <th style="width: 10%">办公电话</th>
                  <th style="width: 10%">传真</th>
                  <th style="width: 10%">手机</th>
                  <th style="width: 10%">电子邮箱</th>
                  <th style="width: 10%">是否在职</th>
                  <th style="width: 10%">备注</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <a-button icon="close">
                      删除
                    </a-button>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
                <tr>
                  <th colspan="7">变更信息</th>
                </tr>
                <tr>
                  <th style="width: 10%">审核状态</th>
                  <th style="width: 10%">供应商名称</th>
                  <th style="width: 10%">变更类型</th>
                  <th style="width: 14%">操作人</th>
                  <th style="width: 14%">操作时间</th>
                  <th style="width: 14%">变更备注</th>
                  <th style="width: 14%">审批时间</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
                <tr>
                  <th colspan="6">合同信息</th>
                </tr>
                <tr>
                  <th style="width: 20%">合同编号</th>
                  <th style="width: 20%">合同名称</th>
                  <th style="width: 20%">审核状态</th>
                  <th style="width: 20%">签约日期</th>
                  <th style="width: 10%">币种</th>
                  <th style="width: 10%">结算状态</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
                <tr>
                  <th colspan="4">银行信息</th>
                </tr>
                <tr>
                  <th style="width: 25%">开户银行</th>
                  <th style="width: 25%">银行账号</th>
                  <th style="width: 25%">银行地址</th>
                  <th style="width: 25%">备注</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
                <tr>
                  <th colspan="3">附件信息</th>
                </tr>
                <tr>
                  <th style="width: 30%">文档名称</th>
                  <th style="width: 20%">上传人</th>
                  <th style="width: 20%">上传日期</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </a-col>-->
          <a-col :md="24" :sm="24">
            <table>
              <thead>
                <tr>
                  <th colspan="12">
                    <a-button @click="showForm('employee')" icon="plus">
                      添加员工
                    </a-button>
                    <a-button icon="stop">
                      重置
                    </a-button>
                  </th>
                </tr>
                <tr>
                  <th colspan="12">公司员工</th>
                </tr>
                <tr>
                  <th style="width: 5%">操作</th>
                  <th style="width: 5%">联系人姓名</th>
                  <th style="width: 5%">现任职位</th>
                  <th style="width: 5%">公司联系人</th>
                  <th style="width: 10%">台鉴人</th>
                  <th style="width: 10%">业务联系人</th>
                  <th style="width: 10%">办公电话</th>
                  <th style="width: 10%">传真</th>
                  <th style="width: 10%">手机</th>
                  <th style="width: 10%">电子邮箱</th>
                  <th style="width: 10%">是否在职</th>
                  <th style="width: 10%">备注</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <a-button icon="close">
                      删除
                    </a-button>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
                <tr>
                  <th colspan="4">
                    <a-upload
                    >
                      <a-button>请选择</a-button>
                    </a-upload>
                  </th>
                </tr>
                <tr>
                  <th colspan="4">公司介绍</th>
                </tr>
                <tr>
                  <th style="width: 25%">操作</th>
                  <th style="width: 25%">公司介绍文件</th>
                  <th style="width: 25%">上传人</th>
                  <th style="width: 25%">上传日期</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <a-button type="danger" icon="delete"></a-button>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
                <tr>
                  <th colspan="4">
                    <a-button @click="showForm('bank')" icon="plus">
                      添加银行账号
                    </a-button>
                    <a-button icon="stop">
                      重置
                    </a-button>
                  </th>
                </tr>
                <tr>
                  <th colspan="4">银行账号</th>
                </tr>
                <tr>
                  <th style="width: 25%">操作</th>
                  <th style="width: 25%">开户银行</th>
                  <th style="width: 25%">银行账号</th>
                  <th style="width: 25%">银行地址</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <a-button type="danger" icon="delete"></a-button>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </a-col>
        </a-row>
      </a-form>

      <footer-tool-bar>
        <a-button-group>
          <a-button :disabled="type === 'view'" @click="handleToEdit()" type="success">
            储存
          </a-button>
        </a-button-group>
        <a-button-group disabled>
          <a-button :disabled="type === 'view'" @click="approve()" type="success">
            提请审批
          </a-button>
        </a-button-group>
        <a-button-group>
          <a-button @click="back()" type="danger">
            关闭
          </a-button>
        </a-button-group>
      </footer-tool-bar>
      <create-employee-form
        :visible="visible.employeeForm"
        :model="modal.employeeForm"
        @cancel="handleCancel"
        @ok="ok('employee')"
      />
      <create-bank-form
        :visible="visible.bankForm"
        :model="modal.bankForm"
        @cancel="handleCancel"
        @ok="ok('bank')"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { FooterToolBar } from '@/components'
  import { SwaggerService } from '@/api/swagger.service'
  import { SupplierService } from '@/views/supplier/supplier.service'
  import { formatTree } from '@/utils/util'
  import { TreeSelect } from 'ant-design-vue'
  import CreateEmployeeForm from '../modules/CreateEmployee'
  import CreateBankForm from '../modules/CreateBank'
  import { City as CitySvc, formatCities } from '@/api/city'

  const SHOW_PARENT = TreeSelect.SHOW_PARENT
  export default {
    name: 'SupplierPurchaseItem',
    components: { CreateEmployeeForm, FooterToolBar, CreateBankForm },
    data () {
      return {
        SHOW_PARENT,
        visible: {
          employeeForm: false,
          bankForm: false
        },
        modal: {
          employeeForm: null,
          bankForm: null
        },
        selection: {},
        dto: {},
        form: {
          vendor: {},
          vendorBankList: {},
          vendorEmployeeList: {}
        }
      }
    },
    created () {
      this.dto = SwaggerService.getDto('VendorChange')
      this.form.vendor = SwaggerService.getForm('VendorChangeDto')
      if (this.id !== '0') {
        SupplierService.item(this.id).then(res => {
          this.data = res.result.data
          this.form.vendor = SwaggerService.getValue(this.form.vendor, res.result.data)
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
      cityChange (value) {
        console.log(value)
      },
      showForm (target) {
        this.modal[target + 'Form'] = null
        this.visible[target + 'Form'] = true
      },
      handleEdit (record) {
        this.visible = true
        this.mdl = { ...record }
      },
      ok (target) {
        const form = this.$refs.createModal.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)
            if (values.id > 0) {
              // 修改 e.g.
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve()
                }, 1000)
              }).then(res => {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格

                this.$message.info('修改成功')
              })
            } else {
              // 新增
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve()
                }, 1000)
              }).then(res => {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格

                this.$message.info('新增成功')
              })
            }
          } else {
            this.confirmLoading = false
          }
        })
      },
      handleCancel () {
        this.visible = false

        const form = this.$refs.createModal.form
        form.resetFields() // 清理表单数据（可不做）
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
