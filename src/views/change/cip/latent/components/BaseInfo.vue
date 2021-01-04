<template>
  <a-form-model
    ref="form"
    :model="data.voMasterInfo"
    :rules="rules"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <!-- <a-col :md="12" :sm="24" >
        <a-form-model-item label="本地指令编号">
          <a-input
            :disabled="type === 'view'"
            v-model="data.voMasterInfo.localVONo"
          ></a-input>
        </a-form-model-item>
      </a-col> -->
      <a-col :md="24" :sm="24" >
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
            <a-form-model-item label="潜在变更预估金额" prop="sourceValue">
              <a-input-number
                :disabled="type === 'view'"
                placeholder="潜在变更预估金额"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-form-model>
</template>

<script>

  import { ChangeService } from '@/views/change/change.service'
  import moment from 'moment'

  export default {
    name: 'LatentBaseInfo',
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
          reasonType: [{ validator: this.checkReasonType, trigger: 'change' ,type : 'array',required : true}],
          voName : [{ required : true, message : '请输入变更名称'}],
          // packageContractorQuotation: [{ required: true, message: '请输入承包商报价', trigger: 'change' }],
          // consultantEstimatedAmount: [{ required: true, message: '请输入顾问估算金额', trigger: 'change' }],
          sourceValue : [{required : true,message:'请输入潜在变更预估金额',trigger : 'blur'}],
        }
      }
    },
    created () {
      ChangeService.getSourceTypes().then(res =>{
        this.selection.sourceTypes = res.result.data
      })
      ChangeService.getVOTypeTree(130).then(res =>{
        if(res.result.statusCode === 200){
          this.selection.voTypes = res.result.data.voTypeTree
          // if(this.data.voMasterInfo.voTypeId){
          //   this.changeVoType(this.data.voMasterInfo.voTypeId,null,flag)
          // }
          this.$forceUpdate()
        }
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
      },
      'data' (value) {
        // 初始化reasonType值，转换为checkboxgroup认同的值
        // if (this.data.voMasterInfo.reasonTypeIDs) {
        //   this.reasonType = this.splitVal(this.data.voMasterInfo.reasonTypeIDs)
        // }
        // // 转换接收公司，抄送公司选中信息为下拉框识别的值
        // if (this.data.voPartylst) {
        //   this.data.voPartylst.forEach(item => {
        //     if (!item.isSendCopy) {
        //       this.to = item.partID
        //       this.toRate = item.percentage
        //     } else {
        //       if (this.cc.indexOf(item.partID) < 0) {
        //         this.cc.push(item.partID)
        //       }
        //     }
        //   })
        //   if(this.data.voMasterInfo.cipType){
        //     this.cipTypeChange(this.data.voMasterInfo.cipType,null,true)
        //   }
        // }
        // this.$forceUpdate()
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
