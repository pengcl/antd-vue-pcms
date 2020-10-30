<template>
  <a-form-model
    ref="form"
    :model="data"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <a-form-model-item label="合同名称">
          <a-input v-model="payDetail.contractName" :disabled="true"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="合同编号">
          <a-input v-model="payDetail.contractNo" :disabled="true"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="合约价">
          <a-input v-model="payDetail.contractAmount" :disabled="true"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="同意更改后的合约价">
          <a-input v-model="payDetail.contractEffectAmount" :disabled="true"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="预计结算金额">
          <a-input v-model="payDetail.contractEstimateAmount" :disabled="true"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th colspan="8">已支付款项明细</th>
          </tr>
          <tr>
            <th>期数</th>
            <th>截至最后已批准银价</th>
            <th>该次施工单位申请银价</th>
            <th>该次批准银价</th>
            <th>累计共批银价</th>
            <th>共批准百分比(%)</th>
            <th>累计共支付银价</th>
            <th>共支付百分比(%)</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in payDetail.itemList" :key="index">
            <td>{{item.paymentPhase}}</td>
            <td>{{item.paymentRequestAmountTotal_Before}}</td>
            <td>{{item.progressRequestAmount}}</td>
            <td>{{item.paymentRequestAmount}}</td>
            <td>{{item.paymentRequestAmountTotal}}</td>
            <td>{{item.paymentRequestAmountTotalRatio}}</td>
            <td>{{item.paymentAmountTotal_Before}}</td>
            <td>{{item.paymentAmountTotalRatio}}</td>
          </tr>
          </tbody>
        </table>
      </a-col>
    </a-row>
  </a-form-model>
</template>

<script>
    import { SignedService } from '../signed.service'

    export default {
        name: 'PayDetail',
        data () {
            return {
                payDetail: {}
            }
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
        created () {
            if (this.type === 'create') {
                SignedService.progressByContract(this.data['contractGID'], this.data['paymentPhase']).then(res => {
                    this.payDetail = res.result.data
                })
            } else {
                SignedService.progressInfo(this.data['contractGID']).then(res => {
                    console.log(res)
                })
            }

        },
        methods: {}
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