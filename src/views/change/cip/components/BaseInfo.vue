<template>
  <a-form v-if="data" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <a-form-item label="项目管理指令编码">
          <a-input
           :disabled="true"
           placeholder="请输入项目管理指令编码"
            :value="data.voMasterInfo.voNo"
          ></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="项目管理指令发出日期">
          <a-input
           :disabled="true"
           :value="data.voMasterInfo.creationTime"
          ></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="项目管理指令最后更新日期">
          <a-input
           :disabled="true"
           :value="data.voMasterInfo.lastModificationTime"
           ></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        承包 / 顾问单位名称：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th>致：</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
            	   <a-select
                placeholder="请选择"
               >
                  <a-select-option v-for="option in selection.contractParties" :key="option.partID" :value="option.partID">
                    {{option.partName }}
                  </a-select-option>
               </a-select>
            </td>
          </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th>抄送：</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              <a-select
				mode="multiple"
                placeholder="请选择"
              >
                 <a-select-option v-for="option in selection.sendCopyParties" :key="option.partID" :value="option.partID">
                    {{option.partName }}
                  </a-select-option>
              </a-select>
            </td>
          </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="变更原因详细">
          <a-textarea
           :disabled="type === 'view'"
           placeholder="请输入变更原因"
            v-model="data.voMasterInfo.reason"
          ></a-textarea>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="变更内容">
          <a-textarea
           :disabled="type === 'view'"
           placeholder="请输入变更内容"
           v-model="data.voMasterInfo.voContent"
           ></a-textarea>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="变更类型">
          <a-select
            placeholder="请选择"
            v-model="data.voMasterInfo.voType"
            v-decorator="['paymentUser', { rules: [{required: true, message: '请选择变更类型'}] }]">
            <a-select-option value="现场管理">现场管理</a-select-option>
            <a-select-option value="设计变更">设计变更</a-select-option>
            <a-select-option value="暂转固">暂转固</a-select-option>
            <a-select-option value="其他变更">其他变更</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="此工作指令按下述理由发出">
        	  
          <a-checkbox-group :value="splitVal(data.voMasterInfo.reasonType)" v-if="data.voMasterInfo.voType==='现场管理'">
            <a-checkbox value="紧急工程(安全)">紧急工程(安全)</a-checkbox>
            <a-checkbox value="索偿">索偿</a-checkbox>
            <a-checkbox value="其他">其他</a-checkbox>
          </a-checkbox-group>
          
          <a-checkbox-group :value="splitVal(data.voMasterInfo.reasonType)" v-if="data.voMasterInfo.voType==='设计变更'">
            <a-checkbox value="设计要求">设计要求</a-checkbox>
            <a-checkbox value="其他">其他</a-checkbox>
          </a-checkbox-group>
          
          <a-checkbox-group :value="splitVal(data.voMasterInfo.reasonType)"  v-if="data.voMasterInfo.voType==='其他变更'">
            <a-checkbox value="法规要求">法规要求</a-checkbox>
            <a-checkbox value="人工/材料差价">人工/材料差价</a-checkbox>
            <a-checkbox value="延长顾问服务期之费用">延长顾问服务期之费用</a-checkbox>
            <a-checkbox value="其他">其他</a-checkbox>
          </a-checkbox-group>
          
          <a-checkbox-group :value="splitVal(data.voMasterInfo.reasonType)" v-if="data.voMasterInfo.voType==='暂转固'">
            <a-checkbox value="定款使用">暂定款使用</a-checkbox>
            <a-checkbox value="选择項目使用">选择項目使用</a-checkbox>
            <a-checkbox value="暂定料价及单价调整">暂定料价及单价调整</a-checkbox>
            <a-checkbox value="暂定数量调整">暂定数量调整</a-checkbox>
            <a-checkbox value="指定承判商(NSC)">指定承判商(NSC)</a-checkbox>
            <a-checkbox value="其他">其他</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="此变更对整体工期是否有影响">
          <a-row>
            <a-col :span="8">
              <a-select
                placeholder="请选择"
                v-model="data.voMasterInfo.voHasEffect">
                <a-select-option value="有影响">有影响</a-select-option>
                <a-select-option value="无影响">无影响</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="8">
              <a-select
                placeholder="请选择"
                v-model="data.voMasterInfo.effectResult">
                <a-select-option value="增加">增加</a-select-option>
                <a-select-option value="减少">减少</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="8">
              <a-input-number
                v-model="data.voMasterInfo.effectDay"
              ></a-input-number> 日
            </a-col>
          </a-row>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="变更造价估算 (增加)">
          <a-input-number
           :disabled="true"
            v-model="data.voMasterInfo.voTotalAmountIncrease"
           ></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="变更造价估算 (减少)">
          <a-input-number
           :disabled="true"
            v-model="data.voMasterInfo.voTotalAmountDecrease"
           ></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="变更造价估算">
          <a-row>
            <a-col :span="2">
              <a-input :value="data.voMasterInfo.voTotalAmountIncrease+data.voMasterInfo.voTotalAmountDecrease > 0 ? '增加' : '减少'" :disabled="true"></a-input>
            </a-col>
            <a-col :span="16">
              <a-input-number
              :disabled="true"
              :value="Math.abs(data.voMasterInfo.voTotalAmountIncrease+data.voMasterInfo.voTotalAmountDecrease)"
              ></a-input-number> 元
            </a-col>
          </a-row>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="人工/材料差价累计 (已提交)">
            <a-input-number
           :disabled="true"
           v-if="selection.accumulateAmount"
           :value ="selection.accumulateAmount.fluctuationSubmittedAccumulateAmountIncrease"
            ></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="人工/材料差价累计 (已审批)">
          <a-input-number
           :disabled="true"
           v-if="selection.accumulateAmount"
           :value ="selection.accumulateAmount.fluctuationSubmittedAccumulateAmountDecrease"
            ></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="人工/材料差价累计">
          <a-input-number
          	:disabled="true"
           	v-if="selection.accumulateAmount"
          	:value="selection.accumulateAmount.fluctuationSubmittedAccumulateAmount" 
          ></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="延长顾问服务之累计费用 (已提交)">
          <a-input-number
           :disabled="true"
           v-if="selection.accumulateAmount"
           :value ="selection.accumulateAmount.extensionConsultancyServiceSubmittedAccumulateAmountIncrease"
           ></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="延长顾问服务之累计费用 (已审批)">
          <a-input-number
           v-if="selection.accumulateAmount"
           :disabled="true"
           :value ="selection.accumulateAmount.extensionConsultancyServiceSubmittedAccumulateAmountDecrease"
           ></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="延长顾问服务费用累计">
          <a-input-number
           v-if="selection.accumulateAmount"
           :disabled="true"
           :value ="selection.accumulateAmount.extensionConsultancyServiceSubmittedAccumulateAmount"
           ></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="承包商报价">
          <a-input-number
           :disabled="type === 'view'"
           :precision="2"
           placeholder="请输入变更造价估算（增加）"
            v-model="data.voMasterInfo.packageContractorQuotation"
          ></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
      <a-form-item label="顾问估算金额">
        <a-input-number
           :disabled="type === 'view'"
           :precision="2"
           placeholder="请输入顾问估算金额"
            v-model="data.voMasterInfo.consultantEstimatedAmount"></a-input-number> 元
      </a-form-item>
    </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="汇率">
          <a-input-number
           :disabled="type === 'view'"
           :precision="2"
           placeholder="请输入汇率"
            v-model="data.voMasterInfo.currencyExchangeRate"></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="顾问评估日期">
          <a-date-picker
           :disabled="type === 'view'"
           placeholder="请选择顾问评估日期"
            v-model="data.voMasterInfo.qsAssessmentDate"></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="合同约定出差次数">
          <a-input-number
          :disabled="true"
          :value="contract.tripTimes"></a-input-number> 次
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="已出差">
          <a-input-number
          :disabled="true"
          :value="contract.hasBeenTripTimes"></a-input-number> 次
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="本次申请出差">
          <a-radio-group :default-value="data.voMasterInfo.isTrip ? 1 : 2">
            <a-radio value="1">是</a-radio>
            <a-radio value="2">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
	
  import { ChangeService } from '@/views/change/change.service'
  import { Base as BaseService } from '@/api/base'
  export default {
    name: 'BaseInfo',
    data () {
      return {
        selection: {},
        loading: false
      }
    },
    created () {
    		
    		ChangeService.sendCopyParty({}).then(item=>{
    			this.selection.sendCopyParties = item.result.data
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
      },
      contract : {
      	type : Object,
      	default : {}
      }
    },
    watch: {
    		'contract.contractGuid'(value){
    			const contractPartyParams = { contractGuid : this.contract.contractGuid , masterContractID : this.contract.masterContractID, contractCategory : this.contract.contractCategory }
	    		ChangeService.contractParty(contractPartyParams).then(item=>{
	    			this.selection.contractParties = item.result.data
	    			this.$forceUpdate()
	    		})
	    		
	    		ChangeService.accumulateAmount(value).then(item=>{
	    			if(item.result.statusCode == 200){
	    				this.selection.accumulateAmount = item.result.data
	    				this.$forceUpdate()
	    			}else{
	    				this.selection.accumulateAmount = {}
	    			}
	    		})
    		}
    },
    methods: {
      partyChange (value, item) {
        // item.partyID = ''
      },
      splitVal (val){
      	return val ? val.split(';') : null;
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