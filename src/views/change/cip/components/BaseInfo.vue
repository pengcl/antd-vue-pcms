<template>
  <a-form-model
    ref="form"
    :model="data.voMasterInfo"
    :rules="rules"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <a-form-model-item
          label="项目管理指令编码">
          <a-input
            :disabled="true"
            :value="data.voMasterInfo.voNo"
          ></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="项目管理指令发出日期">
          <a-input
            :disabled="true"
            :value="data.voMasterInfo.creationTime | date"
          ></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="项目管理指令最后更新日期">
          <a-input
            :disabled="true"
            :value="data.voMasterInfo.lastModificationTime | date"
          ></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24" >
        <a-form-model-item label="类型" prop="cipType" v-if="stage === 'CIP'">
          <a-select
            :disabled="type !== 'add'"
            v-model="data.voMasterInfo.cipType"
            @change="cipTypeChange"
          >
            <a-select-option
              v-for="option in selection.cipTypes"
              :key="option.id"
              :value="option.id">
              {{ option.nameCN }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24" >
        <a-form-model-item label="本地指令编号">
          <a-input
            :disabled="type === 'view'"
            v-model="data.voMasterInfo.localVONo"
          ></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24" >
        <a-form-model-item label="变更名称" prop="voName">
          <a-input
            :disabled="type === 'view'"
            v-model="data.voMasterInfo.voName"
          ></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="24" :sm="24">
        承包 / 顾问单位名称：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th>公司名：</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td >
                <a-form-model-item prop="to" label="致">
                  <a-select
                    placeholder="请选择"
                    v-model="to"
                    :disabled="type === 'view'"
                  >
                    <a-select-option
                      v-for="option in selection.contractParties"
                      :key="option.partID"
                      :value="option.partID">
                      {{ option.partName }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </td>
            </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="抄送">
          <a-select
            mode="multiple"
            placeholder="请选择"
            :disabled="type === 'view'"
            v-model="cc"
            @change="ccChange"
            option-filter-prop="children"
          >
            <a-select-option
              v-for="option in selection.sendCopyParties"
              :key="option.partID"
              :value="option.partID">
              {{ option.partName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-model-item label="变更原因详细" prop="reason">
          <a-textarea
            :disabled="type === 'view'"
            placeholder="请输入变更原因"
            v-model="data.voMasterInfo.reason"
          ></a-textarea>
        </a-form-model-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-model-item label="是否事前申请" >
          <a-radio-group
            v-model="data.voMasterInfo.isBeforeApply"
            :disabled="type === 'view'">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-col>
      <a-col :md="24" :sm="24" style="margin-bottom:15px">
        <a-form-model-item label="变更内容" prop="voContent">
          <a-textarea
            :disabled="type === 'view'"
            placeholder="请输入变更内容"
            v-model="data.voMasterInfo.voContent"
          ></a-textarea>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item label="变更类型" prop="voTypeId">
          <a-select
            placeholder="请选择"
            :disabled="type === 'view'"
            v-model="data.voMasterInfo.voTypeId"
            @change="changeVoType">
            <a-select-option :key="index" v-for="(item,index) in selection.voTypes" :value="item.id">{{item.nameCN}}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :md="24" :sm="24" style="margin-bottom:15px">
        <a-form-model-item label="此工作指令按下述理由发出" prop="reasonType">
          <a-checkbox-group
            v-model="reasonType"
            :disabled="type === 'view'"
            @change="changeReasonType">
            <a-checkbox v-for="item in selection.reasonTypes" :key="item.id" :value="item.id+''">{{item.nameCN}}</a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
      </a-col>
      <a-col :md="24" :sm="24" style="margin-bottom:15px">
        <a-form-item label="此变更对整体工期是否有影响" :required="true">
          <a-row>
            <a-col :span="6">
              <a-form-model-item prop="voHasEffect">
                <a-radio-group v-model="data.voMasterInfo.voHasEffect" @change="effecChange" :disabled="type === 'view'">
                  <a-radio :value="true">
                    有影响
                  </a-radio>
                  <a-radio :value="false">
                    无影响
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item prop="effectResult">
                <a-select
                  placeholder="请选择"
                  :disabled="type === 'view' || !data.voMasterInfo.voHasEffect"
                  style="width : 90%"
                  v-model="data.voMasterInfo.effectResult">
                  <a-select-option value="增加">增加</a-select-option>
                  <a-select-option value="减少">减少</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item prop="effectDay">
              <a-input-number
                :disabled="type === 'view' || !data.voMasterInfo.voHasEffect"
                v-model="data.voMasterInfo.effectDay"
                :formatter="value => `${value}日`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\日\s?|(,*)/g, '')"
              ></a-input-number>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="变更造价估算 (增加)">
              <a-input-number
                :disabled="true"
                v-model="data.voMasterInfo.voTotalAmountIncrease"
                :min="0"
                :span="6"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>

      </a-col>
      <a-col :md="24" :sm="24">
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="变更造价估算 (减少)">
              <a-input-number
                :disabled="true"
                v-model="data.voMasterInfo.voTotalAmountDecrease"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-row>
          <a-col :span="14">
            <a-form-model-item label="变更造价估算">
              <a-row>
                <a-col :span="10">
                  <a-input
                    :value="data.voMasterInfo.voAmount > 0 ? '增加' : '减少'"
                    :disabled="true"></a-input>
                </a-col>
                <a-col :span="14">
                  <a-input-number
                    :disabled="true"
                    :value="Math.abs(data.voMasterInfo.voAmount)"
                    :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                    :precision="2"
                  ></a-input-number>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="24" :sm="24" v-if="stage==='VO' ">
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="原CIP金额">
              <a-input-number
                :disabled="true"
                :value="data.cipAmount"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="24" :sm="24" v-if="stage==='VO' ">
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="差额">
              <a-input-number
                :disabled="true"
                :value="data.voMasterInfo.voAmount - data.cipAmount"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="人工/材料差价累计 (已审批)">
              <a-input-number
                :disabled="true"
                :value="data.voMasterInfo.fluctuationApprovedAccumulateAmount"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="人工/材料差价累计">
              <a-input-number
                :disabled="true"
                :value="data.voMasterInfo.fluctuationAccumulateAmount"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="延长顾问服务之累计费用 (已提交)">
              <a-input-number
                :disabled="true"
                :value="data.voMasterInfo.extensionConsultancyServiceSubmittedAccumulateAmount"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="延长顾问服务之累计费用 (已审批)">
              <a-input-number
                :disabled="true"
                :value="data.voMasterInfo.extensionConsultancyServiceApprovedAccumulate"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="延长顾问服务费用累计">
              <a-input-number
                :disabled="true"
                :value="data.voMasterInfo.extensionConsultancyServiceAccumulateAmount"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="估值来源" prop="sourceValue">
              <a-select
                placeholder="请选择"
                v-model="data.voMasterInfo.sourceValue"
                :disabled="type === 'view'"
              >
                <a-select-option
                  v-for="option in selection.sourceTypes"
                  :key="option.id"
                  :value="option.id">
                  {{ option.nameCN }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="承包商报价" prop="packageContractorQuotation">
              <a-input-number
                :disabled="type === 'view'"
                placeholder="请输入变更造价估算（增加）"
                v-model="data.voMasterInfo.packageContractorQuotation"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="顾问估算金额" prop="consultantEstimatedAmount">
              <a-input-number
                :disabled="type === 'view'"
                placeholder="请输入顾问估算金额"
                v-model="data.voMasterInfo.consultantEstimatedAmount"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="项目PQS估算金额" prop="estimatedAmount">
              <a-input-number
                :disabled="type === 'view'"
                placeholder="项目PQS估算金额"
                v-model="data.voMasterInfo.estimatedAmount"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="汇率" prop="currencyExchangeRate">
              <a-input-number
                :disabled="type === 'view'"
                placeholder="请输入汇率"
                :min="0"
                :precision="2"
                v-model="data.voMasterInfo.currencyExchangeRate"></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-row>
          <a-col :span="10">
            <a-form-model-item label="顾问评估日期" prop="qsAssessmentDate">
              <a-date-picker
                :disabled="type === 'view'"
                placeholder="请选择顾问评估日期"
                v-model="data.voMasterInfo.qsAssessmentDate"></a-date-picker>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-col>

      <a-col :md="24" :sm="24">
        <a-row>
          <a-col :md="10" :sm="10" v-if="this.contract.isNeedTrip">
            <a-form-model-item label="合同约定出差次数">
              <a-input-number
                :disabled="true"
                :value="contract.tripTimes"
                :formatter="value => `${value}次`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\次\s?|(,*)/g, '')"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :md="10" :sm="10"  v-if="this.contract.isNeedTrip">
            <a-form-model-item label="已出差" >
              <a-input-number
                :disabled="true"
                :value="contract.hasBeenTripTimes"
                :formatter="value => `${value}次`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\次\s?|(,*)/g, '')"></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="12" :sm="24" v-if="this.contract.isNeedTrip">
        <a-form-model-item label="本次申请出差">
          <a-radio-group
            v-model="data.voMasterInfo.isTrip"
            :disabled="type === 'view'">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-col>
    </a-row>
  </a-form-MODEL>
</template>

<script>

  import { ChangeService } from '@/views/change/change.service'
  import moment from 'moment'

  export default {
    name: 'BaseInfo',
    data () {
      return {
        to: '',
        cc: [],
        toRate: 0,
        reasonType: [],
        selection: {reasonTypes : [],voTypes : []},
        loading: false,
        rules: {
          to: [
            { validator: this.checkTo,  type : 'number',trigger : 'change',required : true }
          ],
          reason: [{ required: true, message: '请输入变更原因详细', trigger: 'change' }],
          voContent: [
            { required: true, message: '请输入变更内容', trigger: 'change' }
          ],
          voHasEffect : [ {requeired : true, message : '请选择是否影响工期',type:'boolean' }],
          effectResult : [ {requeired : false, message : '请选择增加或减少工期',type:'string' }],
          effectDay : [ { validator : this.checkEffectDay, type:'number' }],
          voTypeId: [{ required: true, message: '请选择变更类型', trigger: 'change' }],
          cipType : [{ required : true,message : '请选择类型',trigger : 'change'}],
          reasonType: [{ validator: this.checkReasonType, trigger: 'change' ,type : 'array',required : true}],
          voName : [{ required : true, message : '请输入变更名称'}],
          packageContractorQuotation: [{ required: false, message: '请输入承包商报价'}],
          consultantEstimatedAmount: [{ required: false, message: '请输入顾问估算金额' }],
          qsAssessmentDate:[{  required: false, message: '请输入顾问评估时间' }],
          estimatedAmount: [{ required:  false, message: '请输入项目PQS估算金额' }],
          sourceValue : [{required : true,message:'请选择估值来源',trigger : 'change'}],
          currencyExchangeRate: [{ required: true, message: '请输入汇率', trigger: 'change' }]
        }
      }
    },
    created () {
      ChangeService.getSourceTypes().then(res =>{
        this.selection.sourceTypes = res.result.data
      })

      ChangeService.getCIPTypes().then(res =>{
        this.selection.cipTypes = res.result.data
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
      contract: {
        type: Object,
        default: {}
      },
      stage : {
        type : String,
        default: ''
      }
    },
    watch: {
      // 监听合同信息赋值
      // 因为baseinfo为第一个tab,界面加载后默认先打开了baseinfo，因为在item.created异步加载的数据无法在本界面created中获取到数据
      // 所以使用对象监听的方式来获取item界面获取到的对象信息
      'contract.contractGuid' (value) {
        // 获取可选抄送单位
        ChangeService.sendCopyParty({contractGuid : this.contract.contractGuid}).then(item => {
          this.selection.sendCopyParties = item.result.data
          this.$forceUpdate()
        })
        const contractPartyParams = {
          contractGuid: this.contract.contractGuid,
          masterContractID: this.contract.masterContractID,
          contractCategory: this.contract.contractCategory
        }
        // 获取接收人下拉框选项值
        ChangeService.contractParty(contractPartyParams).then(item => {
          this.selection.contractParties = item.result.data
          this.$forceUpdate()
        })
        // 若为新增模式，则调用接口获取变更金额信息覆盖data.voMasterInfo中对应值
        if (this.type == 'add') {
          ChangeService.accumulateAmount(value).then(item => {
            if (item.result.statusCode == 200) {
              const accumulateAmount = item.result.data
              this.mergeAccumulateAmount(accumulateAmount)
            }
          })
        }
      },
      'data.voMasterInfo' (value) {
        // 初始化reasonType值，转换为checkboxgroup认同的值
        if (this.data.voMasterInfo.reasonTypeIDs) {
          this.reasonType = this.splitVal(this.data.voMasterInfo.reasonTypeIDs)
        }
        // 转换接收公司，抄送公司选中信息为下拉框识别的值
        if (this.data.voPartylst) {
          this.data.voPartylst.forEach(item => {
            if (!item.isSendCopy) {
              this.to = item.partID
              this.toRate = item.percentage
            } else {
              if (this.cc.indexOf(item.partID) < 0) {
                this.cc.push(item.partID)
              }
            }
          })
          if(this.data.voMasterInfo.cipType){
            this.cipTypeChange(this.data.voMasterInfo.cipType,null,true)
          }
        }
        this.$forceUpdate()
      },
      'data.voMasterInfo.sourceValue'(value){
        this.sourceValueChange(value)
      }
    },
    methods: {
      splitVal (val) {
        return val ? val.split(';') : null
      },
      // 抄送公司变更监听
      ccChange (vals) {
        var that = this
        console.log('cc',vals)
        // 整理抄送公司
        // 将抄送下拉框信息放入到voPartyLst中
        vals.forEach(item => {
          const copySendParty = getCopyPartyByID(item)
          if (copySendParty) {
            var repeatData = getPartyByID(item, true)
            if (repeatData === undefined) {
              const temp = Object.assign({}, copySendParty)
              temp.id = 0
              temp.itemKey = ''
              temp.isDeleted = false
              temp.void = ''
              // 获取抄送公司百分比，暂时写死
              temp.percentage = 0
              temp.isSendCopy = true
              temp.isTemp = true
              this.data.voPartylst.push(temp)
            } else {
              repeatData.isDeleted = false
            }
          }
        })
        // 清理vopartyLst中比cc多出的公司信息
        this.data.voPartylst.forEach((party, index) => {
          if (party.isSendCopy) {
            if (vals.indexOf(party.partID) < 0) {
              if (party.isTemp) {
                this.data.voPartylst.splice(index, 1)
              } else {
                party.isDeleted = true
              }
            }
          }
        })

        // 根据partID及抄送与否 获取修改voPartyLst对象中的对应公司信息
        function getPartyByID (partID, isSendCopy) {
          var party = that.data.voPartylst.filter(item => item.partID === partID && item.isSendCopy === isSendCopy)
          if (party.length > 0) {
            return party[0]
          }
        }

        // 根据partID 获取抄送公司列表中的公司信息
        function getCopyPartyByID (partID) {
          const party = that.selection.sendCopyParties.filter(item => item.partID === partID)
          if (party.length > 0) {
            return party[0]
          }
        }

        this.$forceUpdate()
      },
      // reasonType值变更事件监听
      // 监听的同时转换checkboxgroup选中值为保存接口所需的以;号分隔的字符串
      changeReasonType (checkedValues) {
        if(checkedValues.length > 0){
          this.data.voMasterInfo.reasonTypeIds = checkedValues.join(';')
        }
      },
      // 变更类型change监听，变更后清空reasonType值
      changeVoType (value,option,flag) {
        console.log('flag2',flag)
        if(!flag){
          this.reasonType = []
        }
        this.selection.reasonTypes = []
        const voTypeData = this.selection.voTypes.filter(item => item.id === value)
        if(voTypeData.length > 0){
          this.selection.reasonTypes = voTypeData[0].reasonTypelst
        }
        this.$forceUpdate()
      },
      // 合并接口差异金额数据
      mergeAccumulateAmount (accumulateAmount) {
        this.data.voMasterInfo = Object.assign(this.data.voMasterInfo, accumulateAmount)
        this.$forceUpdate()
      },
      // 整理承包/顾问单位公司信息(包括接收公司，抄送公司）
      getPartys () {
        const that = this
        if (this.to.length < 1) {
          this.$message.warn('请选择承包/顾问单位')
          return false
        }
        // 整理承包公司
        this.selection.contractParties.forEach(item => {
          if (item.partID === this.to) {
            const temp = Object.assign({}, item)
            temp.id = 0
            temp.itemKey = ''
            temp.isDeleted = false
            temp.void = ''
            // 获取承包/顾问单位公司百分比
            temp.percentage = this.toRate
            temp.isSendCopy = false
            let repeat = false
            this.data.voPartylst.forEach((party, index) => {
              if (!party.isSendCopy) {
                if (party.partID != this.to) {
                  if (!party.isTemp) {
                    party.isDeleted = true
                  } else {
                    this.data.voPartylst.splice(index, 1)
                  }
                } else {
                  party.isDeleted = false
                  repeat = true
                }
              }
            })
            if (!repeat) {
              this.data.voPartylst.push(temp)
            }
          }
        })

        return true
      },
      effecChange (e) {
        const value = e.target.value
        console.log(value)
        if (!value) {
          this.rules.effectResult[0].required = false
          this.data.voMasterInfo.effectResult = ''
          this.data.voMasterInfo.effectDay = '0'
        }else{
          this.rules.effectResult[0].required = true
        }
      },
      checkReasonType(rule,value,callback){
        if(this.reasonType.length < 1){
          callback(new Error('请选择工作指令发出理由'))
        }else{
          callback()
        }
      },
      checkTo(rule,value,callback){
        value = value || ''
        if(!this.to){
          callback(new Error('请选择顾问/承包单位'))
        }else{
          callback()
        }
      },
      checkEffectDay(rule,value,callback){
        if(this.data.voMasterInfo.voHasEffect && this.data.voMasterInfo.effectResult != '' && this.data.voMasterInfo.effectResult != null){
          if(value === null || value === ''){
            callback(new Error('请输入影响天数'))
          }else {
            const isAdd = this.data.voMasterInfo.effectResult === '增加'
            if(isAdd && value < 0.000000000000001){
              callback(new Error('增加的天数必须大于0'))
            }else if(!isAdd && value > -0.000000000000001){
              callback(new Error('减少的天数必须小于0'))
            }
          }
        }
        callback()
      },
      cipTypeChange(value,option,flag){
        console.log('flag',flag)
        if(!flag){
          this.data.voMasterInfo.voTypeId = null
          this.data.voMasterInfo.reasonTypeIds = ''
          this.reasonType = []
          this.selection.voTypes = []
          this.selection.reasonTypes = []
        }
        ChangeService.getVOTypeTree(value).then(res =>{
          if(res.result.statusCode === 200){
            this.selection.voTypes = res.result.data.voTypeTree
            if(this.data.voMasterInfo.voTypeId){
              this.changeVoType(this.data.voMasterInfo.voTypeId,null,flag)
            }
            this.$forceUpdate()
          }
        })
      },
      checkTrends(rule,value,callback,key){
        console.log('rules',rule)
        if(this.data.voMasterInfo.sourceValue === key && value+'' == ''){
          callback(new Error('请输入'))
        }else{
          callback()
        }
      },
      sourceValueChange(value){
        if(value === 127){
          this.rules.consultantEstimatedAmount[0].required = true
          this.rules.qsAssessmentDate[0].required = true
          this.rules.estimatedAmount[0].required = false
          this.rules.packageContractorQuotation[0].required = false
        }else if(value === 128){
          this.rules.consultantEstimatedAmount[0].required = false
          this.rules.qsAssessmentDate[0].required = false
          this.rules.estimatedAmount[0].required = false
          this.rules.packageContractorQuotation[0].required = true
        }else if(value === 132){
          this.rules.consultantEstimatedAmount[0].required = false
          this.rules.qsAssessmentDate[0].required = false
          this.rules.estimatedAmount[0].required = true
          this.rules.packageContractorQuotation[0].required = false
        }
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

  /deep/ .ant-col-sm-24,.ant-col-md-24{
    padding-bottom: 10px;
  }

</style>
