<template>
  <page-header-wrapper :title="type === 'view' ? '查看非合同付款' : type === 'update' ? '编辑非合同付款' : '新增非合同付款'">
    <a-card :bordered="false" v-if="form">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-model-item label="项目名称">
              <a-input :disabled="true" v-model="form.projectName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="付款单位">
              <a-input :disabled="true" v-model="form.payerPartyName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="申请部门" prop="sponsorDeptGID">
              <a-tree-select
                :disabled="true"
                style="width: 100%"
                :tree-data="dps"
                @select="onSelect"
                :dropdown-style="{ maxHeight: '400px', overflowH: 'auto' }"
                search-placeholder="请选择"
                v-model="form.sponsorDeptGID"
                :suffixIcon="dps ? '' : '加载中...'">
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="申请人">
              <a-input :disabled="true" v-model="form.requestUserName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="付款类型" prop="paymentBusinessType">
              <a-select v-model="form.paymentBusinessType"
                        :disabled="type === 'view'"
                        placeholder="请选择">
                <a-select-option v-for="item in payTypeList"
                                 :value="item"
                                 :key="item">{{item}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="申请日期" prop="requestDate">
              <a-date-picker :disabled="type === 'view'"
                             v-model="form.requestDate"
                             style="width: 100%"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="付款说明" prop="paymentContent">
              <a-textarea :disabled="type === 'view'"
                          v-model="form.paymentContent"></a-textarea>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="付款凭证" prop="expenseAccountType">
              <a-select v-model="form.expenseAccountType"
                        :disabled="type === 'view'"
                        placeholder="请选择">
                <a-select-option v-for="item in expenseAccountTypeList"
                                 :value="item"
                                 :key="item">{{item}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="申请付款金额" prop="paymentAmount">
              <a-input-number :disabled="true"
                              v-model="form.paymentAmount"
                              :min="0"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :precision="2"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="支付方式" prop="paymentMethod">
              <a-select
                :disabled="type === 'view'"
                placeholder="请选择"
                v-model="form.paymentMethod">
                <a-select-option
                  v-for="(type,index) in paymentMethodTypes"
                  :value="type.code"
                  :key="index">{{ type.code }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="币种" prop="paymentCurrency">
              <a-select
                :disabled="type === 'view'"
                placeholder="请选择"
                v-model="form.paymentCurrency">
                <a-select-option
                  v-for="(type,index) in currencyList"
                  :value="type.nameCN"
                  :key="index">{{ type.nameCN }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item prop="elementTypeId" label="科目类型">
              <a-select
                :disabled="type === 'view'"
                placeholder="请选择"
                v-model="form.elementTypeId"
                @change="elementTypeChange"
              >
                <a-select-option v-for="(option,index) in elementItems"
                                 :key="index"
                                 :value="option.id">
                  {{ option.nameCN }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item
              label="本地付款编号"
            >
              <a-input :disabled="type === 'view'"
                       v-model="form.localPaymentCode"
                       placeholder="请输入本地付款编号"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;text-decoration: underline">支付明细</a-col>
          <payment-info :data="form" :type="type" :id="id"></payment-info>
          <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;text-decoration: underline">预算列表</a-col>
          <budget-list :data="form" :type="type" :id="id" :projectGUID="projectGUID"></budget-list>
          <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;text-decoration: underline">发票管理</a-col>
          <bill-list :masterID="form.attachmentID ? form.attachmentID : 0" :data="form" :type="type" :id="id"
                     @on-change-masterId="changeMasterId"></bill-list>
          <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;text-decoration: underline">附件管理</a-col>
          <attachment-list :masterID="form.attachmentID ? form.attachmentID : 0" :data="form" :type="type" :id="id"
                           @on-change-masterId="changeMasterId"></attachment-list>
        </a-row>
      </a-form-model>

      <a-row :gutter="48">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group v-if="type === 'view' && form.auditStatus === '未审核' && form.createMode !== 'C' && ac('EDIT')">
            <a-button @click="approve()" type="success">
              启动审批流程
            </a-button>
          </a-button-group>
          <a-button-group v-if="type === 'view' && form.auditStatus !== '未审核' && form.createMode !== 'C' && ac('VIEW')">
            <a-button @click="view" type="success">
              查看审批
            </a-button>
          </a-button-group>
          <a-button-group
            v-if="type === 'view' && form.auditStatus !== '未审核' && form.createMode === 'C' && ac('VIEW')">
            <a-button @click="viewCostBpm" type="success">
              查看审批流程
            </a-button>
          </a-button-group>
          <a-button-group
            v-if="type === 'view' && form.auditStatus === '未审核' && form.createMode === 'C' && ac('OneClickAudit')">
            <a-button @click="audit" type="success">
              审核通过
            </a-button>
          </a-button-group>
          <a-button-group
            v-if="type === 'view' && form.auditStatus === '已审核' && form.createMode === 'C' && ac('OneClickUnAudit')">
            <a-button @click="cancelAudit" type="success">
              取消审核
            </a-button>
          </a-button-group>
        </a-col>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-button-group v-if="type === 'view' && form.auditStatus === '未审核' && ac('EDIT')">
            <a-button @click="edit" type="success">
              编辑
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

    import PaymentInfo from '@/views/pay/unsigned/components/PaymentInfo'
    import BudgetList from '@/views/pay/unsigned/components/BudgetList'
    import BillList from '@/views/pay/unsigned/components/BillList'
    import AttachmentList from '@/views/pay/unsigned/components/AttachmentList'
    import { SwaggerService } from '@/api/swagger.service'
    import { UnSignedService } from './unsigned.service'
    import { Base as BaseService, DIALOGCONFIG } from '@/api/base'
    import { SignedService } from '@/views/pay/signed/signed.service'
    import { Currency } from '@/api/currency'
    import { CostService } from '@/views/cost/cost.service'
    import { ac } from '@/views/user/user.service'
    import notification from 'ant-design-vue/es/notification'
    import { ProjectRolesService } from '@/views/role/project/projectRoles.service'
    import storage from 'store'

    let deptName = ''

    function getDptName (gid, items) {
        items.forEach(item => {
            if (item.value === gid) {
                deptName = item.label
            } else {
                if (item.children && item.children.length > 0) {
                    getDptName(gid, item.children)
                }
            }
        })
        return deptName
    }

    const formatList = (items) => {
        const list = []
        items.forEach(item => {
            if (item.children && item.children.length > 0) {
                item.selectable = false
                item.children = formatList(item.children)
            } else {
                item.children = null
            }
            item.label = item.orgName
            item.value = item.orgGID
            list.push(item)
        })
        return list
    }

    export default {
        name: 'Item',
        components: { AttachmentList, BillList, BudgetList, PaymentInfo },
        data () {
            return {
                selection: {},
                loading: false,
                form: SwaggerService.getForm('PaymentOtherDto'),
                payTypeList: [],
                expenseAccountTypeList: [],
                paymentMethodTypes: [],
                currencyList: [],
                departmentList: [],
                elementItems: [],
                disabled: false,
                dialog: DIALOGCONFIG,
                dps: null,
                rules: {
                    sponsorDeptGID: [{ required: true, message: '请选择申请部门', trigger: 'change' }],
                    paymentBusinessType: [{ required: true, message: '请选择付款类型', trigger: 'change' }],
                    requestDate: [{ required: true, message: '请选择申请日期', trigger: 'change' }],
                    expenseAccountType: [{ required: true, message: '请选择付款凭证', trigger: 'change' }],
                    paymentContent: [{ required: true, message: '请输入付款说明', trigger: 'change' }],
                    paymentMethod: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
                    paymentAmount: [{ required: true, message: '请输入申请付款金额', trigger: 'change' }],
                    paymentCurrency: [{ required: true, message: '请选择币种', trigger: 'change' }],
                    elementTypeId: [{ required: true, message: '请选择科目类型', trigger: 'change' }]
                }
            }
        },
        watch: {
            'form.tradeBudgetList' (value) {
                let result = 0
                if (this.form.tradeBudgetList.length > 0) {
                    this.form.tradeBudgetList.forEach(item => {
                        result += item.useAmount
                    })
                }
                this.form.paymentAmount = result
            },
            '$route' (path) {
                this.getData()
            }
        },
        created () {
            CostService.items().then(res => {
                this.elementItems = JSON.parse(JSON.stringify(res.result.data))
            })
            this.getData()
            ProjectRolesService.dps('').then(res => {
                const dps = formatList([res.result.data])
                this.dps = dps
            })
            UnSignedService.payTypeList().then(res => {
                this.payTypeList = res.result.data
            })
            UnSignedService.expenseAccountTypeList().then(res => {
                this.expenseAccountTypeList = res.result.data
            })
            SignedService.paymentMethodTypes().then(res => {
                this.paymentMethodTypes = res.result.data
            })
            Currency.list().then(res => {
                this.currencyList = res.result.data.items
            })
            BaseService.departmentList().then(res => {
                this.departmentList = res.result.data
            })
        },
        computed: {
            id () {
                return this.$route.params.id
            },
            type () {
                return this.$route.query.type
            },
            projectGUID () {
                return this.$route.query.projectGUID
            }
        },
        methods: {
            audit () {
                UnSignedService.audit(this.id).then(res => {
                    if (res.result.data) {
                        this.$message.success('审核通过成功！')
                        this.getData()
                    }
                })
            },
            cancelAudit () {
                UnSignedService.cancelAudit(this.id).then(res => {
                    if (res.result.data) {
                        this.$message.success('取消审核成功！')
                        this.getData()
                    }
                })
            },
            ac (action) {
                return ac(action, this.$route)
            },
            onSelect (value) {
                this.form.sponsorDeptName = getDptName(value, this.dps)
            },
            elementTypeChange (value, option) {
                const index = option.data.key
                this.form.elementCode = this.elementItems[index].code
                this.form.elementName = this.elementItems[index].nameCN
                this.form.tradeBudgetList = []
                this.$forceUpdate()
            },
            getData () {
                if (this.id !== '0') {
                    UnSignedService.item(this.id).then(res => {
                        this.form = res.result.data
                        const index = this.elementItems.findIndex(item => item.nameCN === this.form.elementName)
                        if (index >= 0) {
                            this.form.elementTypeId = this.elementItems[index]['id']
                        }
                        UnSignedService.initData(this.projectGUID).then(res => {
                            const initData = res.result.data
                            this.form.projectName = initData.projectName
                        })
                    })
                } else {
                    UnSignedService.initData(this.projectGUID).then(res => {
                        const initData = res.result.data
                        this.form.projectCode = initData.projectCode
                        this.form.companyCode = initData.companyCode
                        this.form.projectName = initData.projectName
                        this.form.payerPartyName = initData.companyName
                        this.form.requestUserName = initData.requestUserName
                    })
                    const dep = storage.get('Department')
                    dep.forEach((item, index) => {
                        if (index === 0) {
                            this.form.sponsorDeptGID = item.id
                            this.form.sponsorDeptName = item.name
                        }
                    })
                    this.form.id = 0
                    this.form.gid = '00000000-0000-0000-0000-000000000000'
                    this.form.isDeleted = false
                    this.form.paymentCurrency = '人民币'
                    this.form.attachmentID = 0
                    this.form.detailList = []
                    this.form.billList = []
                    this.form.tradeBudgetList = []
                }
            },
            changeMasterId (val) {
                this.form.attachmentID = val
                this.$forceUpdate()
            },
            approve () {
                UnSignedService.approve(this.id).then(_res => {
                    if (_res.result.data) {
                        this.$message.success('已启动审批流程')
                        const tempwindow = window.open('_blank')
                        tempwindow.location = _res.result.data
                        this.$router.push({
                            path: '/pay/unsigned/list'
                        })
                    }
                })
            },
            save () {
                this.disabled = true
                this.$refs.form.validate(valid => {
                    if (valid) {
                        if (this.form.detailList.length > 0) {
                            let result = 0
                            this.form.detailList.forEach(item => {
                                if (item.paymentAmount && (item.paymentType === '一般付款' || item.paymentType === '扣款冲销')) {
                                    result += item.paymentAmount
                                } else if (item.paymentAmount && (item.paymentType === '代付代扣' || item.paymentType === '其他扣款')) {
                                    result -= Math.abs(item.paymentAmount)
                                }
                            })
                            if (result !== this.form.paymentAmount) {
                                notification.error({
                                    message: '提示',
                                    description: '本期支付金额应该等于申请付款金额！'
                                })
                                this.disabled = false
                                return false
                            }
                        }
                        UnSignedService[this.type](this.form).then(res => {
                            if (res.result.data) {
                                this.$message.success(this.type === 'create' ? '创建成功' : '修改成功')
                                if (this.type === 'create') {
                                    this.$router.push({
                                        path: `/pay/unsigned/item/${res.result.data}?type=view&projectGUID=` + this.projectGUID
                                    })
                                } else {
                                    this.$router.push({
                                        path: '/pay/unsigned/list'
                                    })
                                }
                            } else {
                                this.disabled = false
                            }
                        }).catch(() => {
                            this.disabled = false
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
                        this.disabled = false
                    }
                })
            },
            back () {
                this.$router.push({
                    path: '/pay/unsigned/list'
                })
            },
            edit () {
                this.$router.push({ path: `/pay/unsigned/item/${this.id}?type=update&projectGUID=` + this.projectGUID })
            },
            view () {
                BaseService.viewBpm(this.id).then(res => {
                    const tempwindow = window.open('_blank')
                    tempwindow.location = res.result.data
                })
            },
            viewCostBpm () {
                BaseService.viewCostBpm(this.id).then(res => {
                    const tempwindow = window.open('_blank')
                    tempwindow.location = res.result.data
                })
            },
        }
    }
</script>
<style lang="less" scoped>
  .ant-btn-group {
    margin-right: 8px;
  }
</style>