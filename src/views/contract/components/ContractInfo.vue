<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="12" :sm="24">
        <a-form-item
          label="基本币种"
        >
          <a-select
            placeholder="请选择"
            v-model="data.contract.baseCurrencyID"
            v-decorator="['data.contract.baseCurrencyID', { rules: [{required: true, message: '请选择'}] }]">
            <a-select-option v-for="currency in selection.currencies" :key="currency.id" :value="currency.id">
              {{ currency.nameCN }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="币种"
        >
          <a-select
            placeholder="请选择"
            v-model="data.contract.currencyID"
            v-decorator="['data.contract.currencyID', { rules: [{required: true, message: '请选择'}] }]">
            <a-select-option v-for="currency in selection.currencies" :key="currency.id" :value="currency.id">
              {{ currency.nameCN }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="汇率"
        >
          <a-input-number v-model="data.contract.currencyExchangeRate" :min="0"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="等值金额"
        >
          <a-input-number v-model="data.contract.equivalentAmount" :min="0"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="原合同金额"
        >
          <a-input-number :disabled="true" :min="0">{{ data.master.contractAmount }}</a-input-number>
          元
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="适用增值税率"
        >
          <a-input-number v-model="data.contract.taxRate" :min="0"></a-input-number>
          %
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="原合同金额(大写)"
        >
          <a-input
            :disabled="true"
            placeholder="请填写原合同金额(大写)"
            :value="data.master.contractAmountText"
            v-decorator="['data.master.contractAmountText', { initialValue: '', rules: [{required: true, message: '收款人名称必须核对'}] }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="缺陷责任期"
        >
          <a-input-number v-model="data.contract.defectLiabilitiesPeriod" :min="0"></a-input-number>
          年
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="是否需出差"
        >
          <a-select
            placeholder="请选择"
            v-model="data.contract.isNeedTrip"
            v-decorator="['data.contract.isNeedTrip', { rules: [{required: true, message: '请选择'}] }]">
            <a-select-option value="true">是</a-select-option>
            <a-select-option value="false">否</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="保修金/保固金/保留金比率上限"
        >
          <a-input-number v-model="data.contract.retentionPercentage" :min="0"></a-input-number>
          %
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="出差次数"
        >
          <a-input-number v-model="data.contract.tripTimes" :min="0"></a-input-number>
          次
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        保修金/保固金/保留金：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="3">
                <a-button @click="add('contractRetentionlst')" :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
                <a-button @click="clear('contractRetentionlst')" :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 30%">操作</th>
              <th style="width: 40%">描述</th>
              <th style="width: 40%">保修金/保固金/保留金比率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data.contractRetentionlst" :key="index">
              <td>
                <a-button @click="del(item)" :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </td>
              <td>
                <a-input v-model="item.description"></a-input>
              </td>
              <td>
                <a-input-number v-model="item.percentage" :min="0"></a-input-number>
              </td>
            </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        保修金/保固金/保留金返还：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="4">
                <a-button @click="add('contractRetentionReleaselst')" :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
                <a-button @click="clear('contractRetentionReleaselst')" :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 20%">操作</th>
              <th style="width: 20%">描述</th>
              <th style="width: 30%">保修金/保固金/保留金返还条款</th>
              <th style="width: 30%">保修金/保固金/保留金比率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in data.contractRetentionReleaselst" :key="index">
              <td>
                <a-button @click="del(item)" :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </td>
              <td>
                <a-input :disabled="type === 'view'" v-model="item.description"></a-input>
              </td>
              <td>
                <a-input :disabled="type === 'view'" v-model="item.releaseTerms"></a-input>
              </td>
              <td>
                <a-input-number :disabled="type === 'view'" v-model="item.percentage" :min="0"></a-input-number>
              </td>
            </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        预付款：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="10">
                <a-button :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
                <a-button :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 10%">操作</th>
              <th style="width: 10%">描述</th>
              <th style="width: 10%">预付款条款</th>
              <th style="width: 10%">预付款回扣条款</th>
              <th style="width: 10%">百分比</th>
              <th style="width: 10%">有预付款履约保函</th>
              <th style="width: 10%">单位</th>
              <th style="width: 10%">数量</th>
              <th style="width: 10%">单价</th>
              <th style="width: 10%">总金额</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a-button :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </td>
              <td>
                <a-input></a-input>
              </td>
              <td>
                <a-input></a-input>
              </td>
              <td>
                <a-input></a-input>
              </td>
              <td>
                <a-input-number></a-input-number>
              </td>
              <td>
                否
              </td>
              <td>
                <a-select
                  placeholder="请选择"
                  v-decorator="['paymentUser', { rules: [{required: true, message: '请选择'}] }]">
                  <a-select-option value="1">包(bag)</a-select-option>
                </a-select>
              </td>
              <td>
                <a-input-number></a-input-number>
              </td>
              <td>
                <a-input-number></a-input-number>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="预付款总额">
          <a-input-number :min="0"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="工程延误赔偿">
          <a-input-number v-model="data.contract.liquidatedDamagesDailyAmount" :min="0"></a-input-number>
          元 / 日
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="工程延误赔偿上限">
          <a-input-number v-model="data.contract.liquidatedDamagesMaxAmount" :min="0"></a-input-number>
          元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="LOA日期">
          <a-date-picker v-model="data.contract.loaSignDate"></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="合同批出日期">
          <a-date-picker v-model="data.contract.issueDate"></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="合同签署日期">
          <a-date-picker v-model="data.contract.signDate"></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="合同开始日期">
          <a-date-picker v-model="data.contract.contractCommencementDate"></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="合同竣工日期">
          <a-date-picker v-model="data.contract.contractCompletionDate"></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="合同工期">
          <a-input-number v-model="data.contract.contractDuration"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="竣工证书的实际开始日期">
          <a-date-picker v-model="data.contract.practicalCommencementDate"></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="竣工证书的实际竣工日期">
          <a-date-picker v-model="data.contract.practicalCompletionDate"></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="工程延误天数">
          <a-input-number v-model="data.contract.delayDay"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="获甲方批准延长工期天数">
          <a-input-number v-model="data.contract.extensionOfTime"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="承包人最终延误天数">
          <a-input-number v-model="data.contract.actualDelayDay"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="工程延误赔偿合计">
          <a-input-number v-model="data.contract.liquidatedDamagesSum"></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="预计保修/保固期届满日">
          <a-date-picker v-model="data.contract.targetDLPCompletionDate"></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="保修/保固期证书的保修/保固期期完成日">
          <a-date-picker v-model="data.contract.dlpCompletionDate"></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        履约保函：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="14">
                <a-button :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
                <a-button :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 5%">操作</th>
              <th style="width: 5%">单位</th>
              <th style="width: 5%">数量</th>
              <th style="width: 5%">单价</th>
              <th style="width: 5%">履约保函金额</th>
              <th style="width: 5%">履约保函金额条款</th>
              <th style="width: 5%">描述</th>
              <th style="width: 5%">履约保函提供状态</th>
              <th style="width: 10%">履约保函提交限期</th>
              <th style="width: 10%">履约保函提交限期条款</th>
              <th style="width: 10%">履约保函届满日期</th>
              <th style="width: 10%">履约保函延长届满日期</th>
              <th style="width: 10%">履约保函届满日期条款</th>
              <th style="width: 10%">延长履约保函提供状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data.contractBondlst" :key="index">
              <td>
                <a-button :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </td>
              <td>
                <a-select
                  placeholder="请选择"
                  v-model="item.bondUnit"
                  v-decorator="['item.bondUnit', { rules: [{required: true, message: '请选择'}] }]">
                  <a-select-option v-for="(item, index) in selection.units" :key="index" :value="item.id">{{ item.nameCN }}</a-select-option>
                </a-select>
              </td>
              <td>
                <a-input-number v-model="item.bondQty" :min="0"></a-input-number>
              </td>
              <td>
                <a-input-number v-model="item.bondUnitPrice"></a-input-number>
              </td>
              <td>
                <a-input-number v-model="item.bondAmount"></a-input-number>
              </td>
              <td>
                <a-input v-model="item.bondAmountTerms"></a-input>
              </td>
              <td>
                <a-input v-model="item.description"></a-input>
              </td>
              <td>
                <a-select
                  placeholder="请选择"
                  v-model="item.bondStatus"
                  v-decorator="['paymentUser', { rules: [{required: true, message: '请选择'}] }]">
                  <a-select-option value="1">已提交</a-select-option>
                  <a-select-option value="0">未提交</a-select-option>
                </a-select>
              </td>
              <td>
                <a-input-number v-model="item.bondGracePeriod"></a-input-number>
              </td>
              <td>
                <a-input v-model="item.bondGracePeriodTerms"></a-input>
              </td>
              <td>
                <a-date-picker v-model="item.bondExpirationDate"></a-date-picker>
              </td>
              <td>
                <a-date-picker v-model="item.bondExtendedExpirationDate"></a-date-picker>
              </td>
              <td>
                <a-input v-model="item.bondExpirationDateTerms"></a-input>
              </td>
              <td>
                <a-select
                  placeholder="请选择"
                  v-model="item.bondExtensionStatus"
                  v-decorator="['paymentUser', { rules: [{required: true, message: '请选择'}] }]">
                  <a-select-option value="1">已审批</a-select-option>
                  <a-select-option value="0">已拒绝</a-select-option>
                </a-select>
              </td>
            </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="履约保函总额">
          <a-input-number></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        保险：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="8">
                <a-button :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
                <a-button :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 10%">操作</th>
              <th style="width: 10%">保险金额</th>
              <th style="width: 10%">保险类型</th>
              <th style="width: 10%">保险条款</th>
              <th style="width: 10%">保险信函状态</th>
              <th style="width: 10%">保险到期日</th>
              <th style="width: 20%">延长工程综合保险有效日期</th>
              <th style="width: 20%">保险延期状况</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data.contractInsuarancelst" :key="index">
              <td>
                <a-button :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </td>
              <td>
                <a-input-number v-model="item.insuranceAmount"></a-input-number>
              </td>
              <td>
                <a-select
                  placeholder="请选择"
                  v-model="item.insuranceType"
                  v-decorator="['item.insuranceType', { rules: [{required: true, message: '请选择'}] }]">
                  <a-select-option value="1">承建商工程全险</a-select-option>
                  <a-select-option value="2">第三者保险</a-select-option>
                </a-select>
              </td>
              <!-- todo:保险类别 -->
              <td>
                <a-input v-model="item.insuranceTerms"></a-input>
              </td>
              <td>
                <a-select
                  placeholder="请选择"
                  v-model="item.insuranceStatus"
                  v-decorator="['paymentUser', { rules: [{required: true, message: '请选择'}] }]">
                  <a-select-option value="1">已提交</a-select-option>
                  <a-select-option value="0">未提交</a-select-option>
                </a-select>
              </td>
              <td>
                <a-date-picker v-model="item.insuranceExpirationDate"></a-date-picker>
              </td>
              <td>
                <a-date-picker v-model="item.insuranceExtendedExpirationDate"></a-date-picker>
              </td>
              <td>
                <a-select
                  placeholder="请选择"
                  v-model="item.insuranceExtensionStatus"
                  v-decorator="['paymentUser', { rules: [{required: true, message: '请选择'}] }]">
                  <a-select-option value="1">已提交</a-select-option>
                  <a-select-option value="0">未提交</a-select-option>
                </a-select>
              </td>
            </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        质量保证：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="6">
                <a-button :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
                <a-button :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 15%">操作</th>
              <th style="width: 15%">描述</th>
              <th style="width: 15%">提交质量保证书日期条款</th>
              <th style="width: 15%">提交质量保证书日期</th>
              <th style="width: 20%">材料質量保证到期條款</th>
              <th style="width: 20%">质量保证书所担保之年限</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data.contractFluctuationClauselst" :key="index">
              <td>
                <a-button :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </td>
              <td>
                <a-input v-model="item.fluctuationName"></a-input>
              </td>
              <td>
                <a-input></a-input>
                <!-- todo: 提交质量保证书日期条款 -->
              </td>
              <td>
                <a-date-picker></a-date-picker>
              </td>
              <td>
                <a-input></a-input>
              </td>
              <td>
                <a-input-number></a-input-number>
              </td>
            </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        调差补偿：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="5">
                <a-button :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
                <a-button :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 20%">操作</th>
              <th style="width: 20%">描述</th>
              <th style="width: 20%">调差上下限额条款</th>
              <th style="width: 20%">调差上下限额</th>
              <th style="width: 20%">调差时间節點</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data.contractPaymentTermslst" :key="index">
              <td>
                <a-button :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </td>
              <td>
                <a-input></a-input>
              </td>
              <td>
                <a-input></a-input>
              </td>
              <td>
                <a-input-number></a-input-number>
              </td>
              <td>
                <a-input-number></a-input-number>
              </td>
            </tr>
          </tbody>
        </table>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import { Currency as CurrencyService } from '@/api/currency'
import { Base as BaseService } from '@/api/base'

export default {
  name: 'ContractInfo',
  data () {
    return {
      selection: {},
      loading: false
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
