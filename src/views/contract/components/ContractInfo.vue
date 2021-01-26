<template>
  <a-form-model
    ref="form"
    :model="data.contract"
    :rules="rules"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="基本币种"
          prop="baseCurrencyID"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择"
            v-model="data.contract.baseCurrencyID">
            <a-select-option v-for="(currency,index) in selection.currencies" :key="index" :value="currency.id">
              {{ currency.nameCN }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="币种"
          prop="currencyID"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择"
            v-model="data.contract.currencyID">
            <a-select-option v-for="(currency,index) in selection.currencies" :key="index" :value="currency.id">
              {{ currency.nameCN }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="汇率"
        >
          <a-input-number
            :disabled="type === 'view'"
            v-model="data.contract.currencyExchangeRate"
            :min="0"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\\s?|(,*)/g, '')"
            :precision="2"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="等值金额"
        >
          <a-input-number
            :disabled="true"
            v-model="data.contract.equivalentAmount"
            :min="0"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\\s?|(,*)/g, '')"
            :precision="2"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="原合同金额">
          <a-input-number
            :disabled="true"
            :value="data.master.contractAmount"
            :min="0"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\\s?|(,*)/g, '')"
            :precision="2"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="适用增值税率"
          prop="taxRate"
        >
          <a-input-number
            :disabled="type === 'view'"
            v-model="data.contract.taxRate"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"></a-input-number>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="不含税金额"
          prop="contractNoTaxAmount"
        >
          <a-input-number
            :disabled="true"
            v-model="data.contract.contractNoTaxAmount"
            :min="0"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\\s?|(,*)/g, '')"
            :precision="2"></a-input-number>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="税额"
          prop="contractTaxAmount"
        >
          <a-input-number
            :disabled="true"
            v-model="data.contract.contractTaxAmount"
            :min="0"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\\s?|(,*)/g, '')"
            :precision="2"></a-input-number>
        </a-form-model-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="原合同金额(大写)"
        >
          <a-input
            :disabled="true"
            placeholder="请填写原合同金额(大写)"
            :value="data.master.contractAmountText"/>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="缺陷责任期"
        >
          <a-input-number
            :disabled="type === 'view'"
            v-model="data.contract.defectLiabilitiesPeriod"
            :min="0"
            :formatter="value => `${value}年`"
            :parser="value => value.replace('年', '')"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="约定出差"
          prop="isNeedTrip"
        >
          <a-radio-group name="isNeedTrip" v-model="data.contract.isNeedTrip">
            <a-radio :value="true">
              是
            </a-radio>
            <a-radio :value="false">
              否
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="保修金/保固金/保留金比率上限"
        >
          <a-input-number
            :disabled="type === 'view'"
            v-model="data.contract.retentionPercentage"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="出差次数"
          prop="tripTimes"
          :rules="[{ type: 'number', required: data.contract.isNeedTrip, message: '请输入出差次数' },{ type: 'number', min:data.contract.isNeedTrip ? 1 : 0, message: '出差次数必须大于0' }]"
        >
          <a-input-number
            :disabled="type === 'view' || !data.contract.isNeedTrip"
            v-model="data.contract.tripTimes"
            :formatter="value => `${value}次`"
            :parser="value => value.replace('次', '')"/>
        </a-form-model-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-model-item
          label="中标通知"
        >
          <a v-for="(item,index) in data.cgZBNoticelst"
             :key="index"
             :href="item.pdfUrl"
             target="_blank"
             style="margin-right: 5px">中标通知{{index+1}}.pdf</a>
        </a-form-model-item>
      </a-col>
      <contract-info-retention :data="data" :type="type" :id="id"></contract-info-retention>
      <contract-info-retention-release :data="data" :type="type" :id="id"></contract-info-retention-release>
      <contract-info-advance-charge :data="data" :type="type" :id="id"></contract-info-advance-charge>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="工程延误赔偿">
          <a-input-number
            :disabled="type === 'view'"
            v-model="data.contract.liquidatedDamagesDailyAmount"
            :formatter="value => `${value}元/日`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\元\/日\s?|(,*)/g, '')"
            :precision="2"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="工程延误赔偿上限">
          <a-input-number
            :disabled="type === 'view'"
            v-model="data.contract.liquidatedDamagesMaxAmount"
            :min="0"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\\s?|(,*)/g, '')"
            :precision="2"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="LOA日期">
          <a-date-picker :disabled="type === 'view'" v-model="date"></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="合同批出日期">
          <a-date-picker :disabled="type === 'view'" v-model="data.contract.issueDate"></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="合同签署日期"
          prop="signDate">
          <a-date-picker style="width: 100%" :disabled="type === 'view'" v-model="data.contract.signDate"></a-date-picker>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="合同开始日期">
          <a-date-picker :disabled="type === 'view'" v-model="data.contract.contractCommencementDate"></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="合同竣工日期">
          <a-date-picker :disabled="type === 'view'" v-model="data.contract.contractCompletionDate"></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="合同工期">
          <a-input-number :disabled="type === 'view'" v-model="data.contract.contractDuration"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="竣工证书的实际开始日期">
          <a-date-picker :disabled="type === 'view'" v-model="data.contract.practicalCommencementDate"></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="竣工证书的实际竣工日期">
          <a-date-picker :disabled="type === 'view'" v-model="data.contract.practicalCompletionDate"></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="工程延误天数">
          <a-input-number
            :disabled="type === 'view'"
            v-model="data.contract.delayDay"
            :min="0"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\\s?|(,*)/g, '')"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="获甲方批准延长工期天数">
          <a-input-number
            :disabled="type === 'view'"
            v-model="data.contract.extensionOfTime"
            :min="0"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\\s?|(,*)/g, '')"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="承包人最终延误天数">
          <a-input-number
            :disabled="type === 'view'"
            v-model="data.contract.actualDelayDay"
            :min="0"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\\s?|(,*)/g, '')"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="工程延误赔偿合计">
          <a-input-number
            :disabled="type === 'view'"
            v-model="data.contract.liquidatedDamagesSum"
            :min="0"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\\s?|(,*)/g, '')"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="预计保修/保固期届满日">
          <a-date-picker :disabled="type === 'view'" v-model="data.contract.targetDLPCompletionDate"></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="保修/保固期证书的保修/保固期期完成日">
          <a-date-picker :disabled="type === 'view'" v-model="data.contract.dlpCompletionDate"></a-date-picker>
        </a-form-item>
      </a-col>
      <contract-info-bond :data="data" :type="type" :id="id"></contract-info-bond>
      <contract-info-insurance :data="data" :type="type" :id="id"></contract-info-insurance>
      <contract-info-fluctuation-clause :data="data" :type="type" :id="id"></contract-info-fluctuation-clause>
      <contract-info-payment-terms :data="data" :type="type" :id="id"></contract-info-payment-terms>
    </a-row>
  </a-form-model>
</template>

<script>
    import { Currency as CurrencyService } from '@/api/currency'
    import { Base as BaseService } from '@/api/base'
    import ContractInfoRetention from '@/views/contract/components/contractInfo/retention'
    import ContractInfoRetentionRelease from '@/views/contract/components/contractInfo/retentionRelease'
    import ContractInfoAdvanceCharge from '@/views/contract/components/contractInfo/advanceCharge'
    import ContractInfoBond from '@/views/contract/components/contractInfo/bond'
    import ContractInfoInsurance from '@/views/contract/components/contractInfo/insurance'
    import ContractInfoFluctuationClause from '@/views/contract/components/contractInfo/fluctuationClause'
    import ContractInfoPaymentTerms from '@/views/contract/components/contractInfo/paymentTerms'

    export default {
        name: 'ContractInfo',
        components: {
            ContractInfoPaymentTerms,
            ContractInfoFluctuationClause,
            ContractInfoInsurance,
            ContractInfoBond,
            ContractInfoAdvanceCharge,
            ContractInfoRetentionRelease,
            ContractInfoRetention
        },
        data () {
            return {
                date: null,
                selection: {},
                loading: false,
                rules: {
                    baseCurrencyID: [{ required: true, message: '请选择基本币种', trigger: 'change' }],
                    currencyID: [{ required: true, message: '请选择币种', trigger: 'change' }],
                    isNeedTrip: [{ required: true, message: '请选择是否需要出差', trigger: 'change' }],
                    taxRate: [{ required: true, message: '请填写适用增值税率', trigger: 'blur' }],
                    signDate: [{ required: true, message: '请选择合同签署日期', trigger: 'change' }]
                }
            }
        },
        created () {
            CurrencyService.list().then(res => {
                this.selection.currencies = res.result.data.items
                this.$forceUpdate()
            })
            BaseService.unitTypes().then(res => {
                this.selection.units = res.result.data.items
                this.$forceUpdate()
            })
        },
        props: {
            data: {
                type: Object,
                default: null
            },
            type: {
                type: String,
                default: 'view'
            },
            id: {
                type: String,
                default: '0'
            }
        },
        watch: {
            'data.contract.contractAmount' (value) {
                if (typeof value === 'number') {
                    this.data.contract.contractTaxAmount = this.data.contract.contractAmount * this.data.contract.taxRate * 0.01
                    this.data.contract.contractNoTaxAmount = this.data.contract.contractAmount - this.data.contract.contractTaxAmount
                }
            },
            'data.contract.taxRate' (value) {
                if (typeof value === 'number') {
                    this.data.contract.contractTaxAmount = this.data.contract.contractAmount * this.data.contract.taxRate * 0.01
                    this.data.contract.contractNoTaxAmount = this.data.contract.contractAmount - this.data.contract.contractTaxAmount
                }
            },
            'data.master.contractAmount' (value) {
                if (typeof value === 'number') {
                    const equivalentAmount = value * this.data.contract.currencyExchangeRate
                    this.data.contract.equivalentAmount = equivalentAmount || 0
                }
            },
            'data.contract.currencyExchangeRate' (value) {
                if (typeof value === 'number') {
                    const equivalentAmount = this.data.master.contractAmount * value
                    this.data.contract.equivalentAmount = equivalentAmount || 0
                }
            },
            'data.contract.masterContractID' () {
                const equivalentAmount = this.data.master.contractAmount * this.data.contract.currencyExchangeRate
                this.data.contract.equivalentAmount = equivalentAmount || 0
            }
        },
        methods: {
            add (target) {
                const item = {
                    id: 0,
                    isDeleted: false,
                    retentionGuid: 0,
                    contractID: this.id,
                    description: '',
                    percentage: ''
                }
                this.data[target].push(item)
            },
            del (item) {
                item.isDisabled = true
            },
            clear (target) {
                this.data[target].forEach(item => {
                    item.isDisabled = true
                })
            }
        }
    }
</script>

<style lang="less" scoped>
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
