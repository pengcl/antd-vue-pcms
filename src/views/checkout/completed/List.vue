<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form-model ref="form"
                    :model="form"
                    :rules="rules"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-model-item label="合同编号">
              <a-input :disabled="true" v-model="form.contractNo"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="合同名称">
              <a-input :disabled="true" v-model="form.contractName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="是否最终结算">
              <a-radio-group v-model="form.isLastBalance"
                             :disabled="type === 'view'">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="合作单位（结算方）">
              <a-select :disabled="type === 'view'"
                        v-model="form.payeePartyGID">
                <a-select-option v-for="(item,index) in partyList"
                                 :value="item.partyGuid"
                                 placeholder="请选择合作单位（结算方）"
                                 @change="partyChange"
                                 :key="index">{{item.partyName}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="抄送方" prop="ccParty">
              <a-select :disabled="type === 'view'"
                        mode="multiple"
                        v-model="form.ccParty"
                        placeholder="请选择抄送方"
                        @change="ccPartyChange">
                <a-select-option v-for="(item,index) in partyList"
                                 :value="item.partyGuid"
                                 :key="index">{{item.partyName}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="竣工日期">
              <a-date-picker style="width: 100%"
                             v-model="form.completionDate"
                             :disabled="type === 'view'"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="交楼日期">
              <a-date-picker style="width: 100%"
                             v-model="form.deliveryDate"
                             :disabled="type === 'view'"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="保修日期起">
              <a-date-picker style="width: 50%"
                             v-model="form.warrantyBeginDate"
                             :disabled="type === 'view'"></a-date-picker>
              <a-date-picker style="width: 50%"
                             v-model="form.warrantyEndDate"
                             :disabled="type === 'view'"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="备注">
              <a-textarea v-model="form.remark" :disabled="type === 'view'"></a-textarea>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;text-decoration: underline">
            证书内容
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="文件编号">
              <a-input v-model="form.file_Num" :disabled="true"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="合作单位负责人">
              <a-input-group compact>
                <a-input :disabled="type === 'view'"
                         style="width: 79%"
                         v-model="form.file_PayeeDirector"></a-input>
                <a-select :disabled="type === 'view'"
                          v-model="form.file_PayeeDirectorTitle">
                  <a-select-option :value="'先生'">先生</a-select-option>
                  <a-select-option :value="'小姐'">小姐</a-select-option>
                </a-select>
              </a-input-group>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="工程名称">
              <a-input v-model="form.file_GCProjectName" :disabled="type === 'view'"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="根据的合同条款">
              <a-input prefix="第"
                       suffix="条"
                       v-model="form.file_ContractTermsNum"
                       :disabled="type === 'view'"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="验收范围">
              <a-input v-model="form.file_AcceptanceScope" :disabled="type === 'view'"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="验收日期">
              <a-date-picker style="width: 100%"
                             v-model="form.file_AcceptanceDate"
                             :disabled="type === 'view'"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item label="竣工证书"></a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>

      <a-row :gutter="48">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group>
            <a-button @click="approve" type="success">
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
    import { CheckoutService } from '../checkout.service'

    export default {
        name: 'CheckoutCompletedList',
        data () {
            return {
                form: SwaggerService.getForm('BalanceCertificateDto'),
                partyList: [],
                rules: {
                    ccParty: [{ required: true, message: '请选择抄送方', trigger: 'change' }]
                }
            }
        },
        computed: {
            id () {
                return this.$route.params.id
            },
            type () {
                return this.$route.query.type
            },
            contractGID () {
                return this.$route.query.contractGID
            }
        },
        created () {
            this.getData()
            CheckoutService.partyList(this.contractGID).then(res => {
                this.partyList = res.result.data
            })
        },
        methods: {
            partyChange (value) {
                const index = this.partyList.findIndex(item => item.partyGuid === value)
                this.form.payeePartyName = this.partyList[index].partyName
            },
            ccPartyChange (value) {
                let list = []
                if (value.length > 0) {
                    this.form.ccPartyGIDs = value.join(',')
                    value.forEach(item => {
                        this.partyList.forEach(v => {
                            if (v.partyGuid === item) {
                                list.push(v.partyName)
                            }
                        })
                    })
                    this.form.ccPartyNames = list.join(',')
                    console.log(this.form.ccPartyGIDs, this.form.ccPartyNames)
                }
            },
            getData () {
                if (this.type === 'create') {
                    CheckoutService.createInitData(this.contractGID).then(res => {
                        this.form = res.result.data
                        this.form.file_PayeeDirectorTitle = '先生'
                    })
                } else {

                }
            },
            back () {
                this.$router.push({ path: '/checkout/contract/list' })
            },
            save () {

            },
            approve () {

            }
        },

    }
</script>

<style lang="less" scoped>
  .ant-btn-group {
    margin-right: 8px;
  }
</style>
