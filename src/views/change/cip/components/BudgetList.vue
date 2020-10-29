<template>
  <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <a-radio-group name="radioGroup" v-model="budgetType">
          <a-radio :value="1">
            预计变更金额（<span class="redText">余额：<span>1000</span>元</span>）
          </a-radio>
          <a-radio :value="2">
            预算余额（<span class="redText">余额：<span>900</span>元</span>）
          </a-radio>
          <a-radio :value="3">
            定标盈余（<span class="redText">余额：<span>800</span>元</span>）
          </a-radio>
        </a-radio-group>
      </a-col>
      <a-col :md="24" :sm="24">
        <table v-if="budgetType==1">
          <thead>
          <tr>
            <th style="width: 20%">业态</th>
            <th style="width: 20%">科目</th>
            <th style="width: 20%" >预算变更金额</th>
            <th style="width: 20%">本次使用金额</th>
            <th style="width: 20%">差额</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          </tbody>
        </table>
        <table v-if="budgetType==2">
          <thead>
          <tr>
            <th style="width: 25%">业态</th>
            <th style="width: 25%" >定标盈余</th>
            <th style="width: 25%">本次使用金额</th>
            <th style="width: 25%">差额</th>
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
        <table v-if="budgetType==3">
          <thead>
          <tr>
            <th style="width: 20%">业态</th>
            <th style="width: 20%">科目</th>
            <th style="width: 20%" >预算余额</th>
            <th style="width: 20%">本次使用金额</th>
            <th style="width: 20%">差额</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
    export default {
        name: 'BudgetList',
        data () {
            return {
            		budgetType : 1,
                form: this.$form.createForm(this)
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
		  },
		  contract : {
		  	type : Object,
		  	default : null
		  }
		}
    }
</script>

<style lang="less" scoped>
  
  .redText {
	color : red;
	background-color : white;
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