<template>
  <page-header-wrapper :title="type === 'view' ? '查看非同付款' : type === 'update' ? '编辑非合同付款' : '新增非合同付款'">
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
            <a-form-model-item label="申请部门" prop="sponsorDeptName">
              <a-select v-model="form.sponsorDeptName"
                        @change="onChange"
                        :disabled="type === 'view'"
                        placeholder="请选择">
                <a-select-option v-for="(item,index) in departmentList"
                                 :value="item.departmentName"
                                 :key="index">{{item.departmentName}}
                </a-select-option>
              </a-select>
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
              <a-input-number :disabled="type === 'view'"
                              v-model="form.paymentAmount"
                              :min="0"
                              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
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
          <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;text-decoration: underline">支付明细</a-col>
          <payment-info :data="form" :type="type" :id="id"></payment-info>
          <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;text-decoration: underline">预算列表</a-col>
          <budget-list :data="form" :type="type" :id="id"></budget-list>
          <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;text-decoration: underline">发票管理</a-col>
          <bill-list :masterID="form.attachmentID" :data="form" :type="type" :id="id"
                     @on-change-masterId="changeMasterId"></bill-list>
          <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;text-decoration: underline">附件管理</a-col>
          <attachment-list :masterID="form.attachmentID" :data="form" :type="type" :id="id"
                           @on-change-masterId="changeMasterId"></attachment-list>
        </a-row>
      </a-form-model>

      <a-row :gutter="48">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group>
            <a-button :disabled="type === 'view'" @click="approve()" type="success">
              启动审批流程
            </a-button>
          </a-button-group>
        </a-col>
        <a-col :md="24" :sm="24">
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
    import { Base as BaseService } from '@/api/base'
    import { SignedService } from '@/views/pay/signed/signed.service'
    import { Currency } from '@/api/currency'

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
                approveStatus: false,
                rules: {
                    sponsorDeptName: [{ required: true, message: '请选择申请部门', trigger: 'change' }],
                    paymentBusinessType: [{ required: true, message: '请选择付款类型', trigger: 'change' }],
                    requestDate: [{ required: true, message: '请选择申请日期', trigger: 'change' }],
                    expenseAccountType: [{ required: true, message: '请选择付款凭证', trigger: 'change' }],
                    paymentContent: [{ required: true, message: '请输入付款说明', trigger: 'change' }],
                    paymentMethod: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
                    paymentAmount: [{ required: true, message: '请输入申请付款金额', trigger: 'change' }],
                    paymentCurrency: [{ required: true, message: '请选择币种', trigger: 'change' }]
                }
            }
        },
        watch: {},
        created () {
            this.getData()
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
            onChange (value, option) {
                const index = option.data.key
                this.form.sponsorDeptGID = this.departmentList[index].organizationalStructureId
            },
            getData () {
                if (this.id !== '0') {
                    UnSignedService.item(this.id).then(res => {
                        this.form = res.result.data
                        BaseService.masterID(this.id).then(_res => {
                            this.form.attachmentID = _res.result.data
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
                    this.form.id = 0
                    this.form.gid = '00000000-0000-0000-0000-000000000000'
                    this.form.isDeleted = false
                    this.form.paymentCurrency = '人民币'
                    this.form.attachmentID = 0
                    this.form.detailList = []
                    this.form.billList = []
                }
            },
            changeMasterId (val) {
                this.form.attachmentID = val
                this.$forceUpdate()
            },
            approve () {
                this.approveStatus = true
                this.save()
            },
            save () {
                if (this.type === 'create') {
                    UnSignedService.create(this.form).then(res => {
                        if (res.result.data) {
                            this.$message.success('创建成功')
                            if (this.approveStatus) {
                                UnSignedService.approve(res.result.data).then(res => {
                                    if (res.result.data) {
                                        this.$message.success('已启动审批流程')
                                        window.location.href = res.result.data
                                    }
                                })
                            } else {
                                this.$router.push({
                                    path: '/pay/unsigned/list'
                                })
                            }
                        }
                    })
                } else {
                    UnSignedService.update(this.form).then(res => {
                        if (res.result.data) {
                            this.$message.success('修改成功')
                            if (this.approveStatus) {
                                UnSignedService.approve(this.id).then(res => {
                                    if (res.result.data) {
                                        this.$message.success('已启动审批流程')
                                        window.location.href = res.result.data
                                    }
                                })
                            } else {
                                this.$router.push({
                                    path: '/pay/unsigned/list'
                                })
                            }
                        }
                    })
                }
            },
            back () {
                this.$router.push({
                    path: '/pay/unsigned/list'
                })
            }
        }
    }
</script>
<style lang="less" scoped>
  .ant-btn-group {
    margin-right: 8px;
  }
</style>