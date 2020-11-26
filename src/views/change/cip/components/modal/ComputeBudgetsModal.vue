<template>
  <a-modal
    :visible="visible"
    :width="900"
    title="预算调整确认"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div>
	    <a-form  :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-radio-group v-model="useStore" button-style="solid" @change="useStoreChange">
              <a-radio v-for="item in selection.storeTypes" :key="item.id" :value="item.id">
                {{ item.nameCN }}（<span class="redText">余额：<span>1000</span>元</span>）
              </a-radio>
            </a-radio-group>
          </a-col>
          <a-col :md="24" :sm="24">
            <s-table 
              v-if="useStore === 108"
              :row-key="record => record.itemkey" 
              :columns="columns" 
              :showPagination="false"
              :data="loadData"
              bordered 
              ref="table" >
                <template slot="alterPlan" slot-scope="text,record">
                  <input-number  :value="record.alterPlan" :disabled="true"></input-number>
                </template>
                <template slot="voUseAmount" slot-scope="text,record">
                  <input-number  v-model="record.voUseAmount" @change="value => changeVoUseAmount(value,record)"></input-number>
                </template>
                <template slot="balanceAmount" slot-scope="text">
                  <span v-if="text >= 0">0</span>
                  <label v-if="text < 0" style="color:red">(预算不足)</label>
                </template>
            </s-table>
            <s-table 
              v-if="useStore === 109"
              :row-key="record => record.id" 
              :columns="surplusColumns" 
              :showPagination="false"
              :data="surplusLoadData"
              bordered 
              ref="surplusTable" >
                <template slot="alterPlan" slot-scope="text,record">
                  <input-number  :value="record.alterPlan" :disabled="true"></input-number>
                </template>
                <template slot="voUseAmount" slot-scope="text,record">
                  <input-number  v-model="record.voUseAmount" @change="value => changeVoUseAmount(value,record)"></input-number>
                </template>
                <template slot="balanceAmount" slot-scope="text">
                  <span v-if="text >= 0">0</span>
                  <label v-if="text < 0" style="color:red">(预算不足)</label>
                </template>
            </s-table>
            <s-table 
              v-if="useStore === 110"
              :row-key="record => record.id" 
              :columns="generalTradeColumns" 
              :showPagination="false"
              :data="generalTradeLoadData"
              bordered 
              ref="generalTradeTable" >
                <template slot="alterPlan" slot-scope="text,record">
                  <input-number  :value="record.alterPlan" :disabled="true"></input-number>
                </template>
                <template slot="voUseAmount" slot-scope="text,record">
                  <input-number  v-model="record.voUseAmount" @change="value => changeVoUseAmount(value,record)"></input-number>
                </template>
                <template slot="balanceAmount" slot-scope="text">
                  <span v-if="text >= 0">0</span>
                  <label v-if="text < 0" style="color:red">(预算不足)</label>
                </template>
            </s-table>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import { STable, Ellipsis } from '@/components'
  import { ChangeService } from '@/views/change/change.service'
  import { fixedList } from '@/utils/util'

  const columns = [
    {
      title: '业态',
      dataIndex: 'costCenterName',
      customRender : (value,row,index) =>{
        const obj = {
          children : value,
          attrs : {
            rowSpan : this.rowSpans['cost'+row.costCenterId] || 1
          }
        }
      }
    },
    {
      title: '科目',
      dataIndex: 'elementName'
    },
    {
      title: '变更预留金额',
      dataIndex: 'alterPlan',
      scopedSlots: { customRender: 'alterPlan' }
    },
    {
      title: '本次使用金额',
      dataIndex: 'voUseAmount',
      scopedSlots: { customRender: 'voUseAmount' }
    },
    {
      title: '差额',
      dataIndex: 'balanceAmount',
      scopedSlots: { customRender: 'balanceAmount' }
    }
  ]
  
  const surplusColumns = [
    {
      title: '业态',
      dataIndex: 'costCenterName'
    },
    {
      title: '定标盈余',
      dataIndex: 'alterPlan',
      scopedSlots: { customRender: 'alterPlan' }
    },
    {
      title: '本次使用金额',
      dataIndex: 'voUseAmount',
      scopedSlots: { customRender: 'voUseAmount' }
    },
    {
      title: '差额',
      dataIndex: 'balanceAmount',
      scopedSlots: { customRender: 'balanceAmount' }
    }
  ]

  const generalTradeColumns = [
    {
      title: '业态',
      dataIndex: 'costCenterName'
    },
    {
      title: '科目',
      dataIndex: 'elementName'
    },
    {
      title: '预算余额',
      dataIndex: 'alterPlan',
      scopedSlots: { customRender: 'alterPlan' }
    },
    {
      title: '本次使用金额',
      dataIndex: 'voUseAmount',
      scopedSlots: { customRender: 'voUseAmount' }
    },
    {
      title: '差额',
      dataIndex: 'balanceAmount',
      scopedSlots: { customRender: 'balanceAmount' }
    }
  ]

  export default {
    name: 'ComputeBudgetsModal',
    components: {
        STable,
        Ellipsis
    },
    data () {
      this.columns = columns
      this.surplusColumns = surplusColumns
      this.generalTradeColumns = generalTradeColumns
      return {
        // create model
        show: false,
        visible: false,
        confirmLoading: false,
        rowSpans : {},
        selection : {},
        // 高级搜索 展开/关闭
        advanced: false,
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          this.rowSpans = {}
          // 108 预算变更； 109 ： 定标余额； 110: 预算余额
          if(this.useStore === 108 ){
            return ChangeService.getVoBudgetPreSplit({VOGuid : this.voGuid, VOType : this.voType,useStore : this.useStore})
              .then(res => {
                if(res.result.data.length > 0){
                  res.result.data.sort((a,b) =>{
                    return a.costCenterId === b.costCenterId ? 0 : a.costCenterId > b.costCenterId ? 1 : -1
                  })
                }
                res.result.data.forEach(item =>{
                  if(this.rowSpans['cost'+item.costCenterId]){
                    this.rowSpans['cost'+item.costCenterId]++
                  }else{
                    this.rowSpans['cost'+item.costCenterId] = 1
                  }
                })
                console.log('results',res.result)
                return res.result
              }).catch((e) =>{
                this.$message.error('获取预算变更金额列表错误')
                return new Promise((resolve, reject) => {
                  resolve({ data : [] })
                })
              })
          }else{
            return new Promise((resolve, reject) => {
              resolve({ data : [] })
            })
          }
        },
        surplusLoadData :  parameter => {
          // 108 预算变更； 109 ： 定标余额； 110: 预算余额
          if(this.useStore === 109 ){
            return new Promise((resolve, reject) => {
              resolve({ data : [] })
            })
          }else{
            return new Promise((resolve, reject) => {
              resolve({ data : [] })
            })
          }
        },
        generalTradeLoadData : parameter => {
          // 108 预算变更； 109 ： 定标余额； 110: 预算余额
          if(this.useStore === 110 ){
            return new Promise((resolve, reject) => {
              resolve({ data : [] })
            })
          }else{
            return new Promise((resolve, reject) => {
              resolve({ data : [] })
            })
          }
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    props: {
      voGuid: {
        type: String,
        default: ''
      },
      voType: {
        type : String,
        default : '',
      },
      useStore: {
        type : Number,
        default : 0
      }
    },
    computed: {
    	
    },
    created () {
      ChangeService.storeTypes().then(res => {
        this.selection.storeTypes = res.result.data
      })
    },
    mounted(){
    	
    },
    methods: {
      showModal () {
        this.visible = true
      },
      handleCancel(){
      	this.visible = false
      },
      loadData(){
      	return ChangeService.bqList(this.contract.contractGuid).then(res => {
        	  console.log('myData',res)
          this.tableData = res.result.data
        })
      },
      handleOk(){
      	this.visible = false
      },
      useStoreChange(value){
        if(value == 108){
          this.$refs.table.refresh()
        }else if(value == 109){
          this.$refs.surplusTable.refresh()
        }else if(value == 110){
          this.$refs.generalTradeTable.refresh()
        }
      },
      changeVoUseAmount(value,record){
        const balanceAmount = record.alterPlan - voUseAmount
        record.balanceAmount = balanceAmount
      }
    }
  }
</script>

<style lang="less" scoped>
  .search-form {
    background-color: #1E9FF2;
    padding: 20px;
    border-radius: 0.35rem;

    /deep/ .ant-form-item-label label {
      color: #fff;
    }
  }

  /deep/ .ant-table-footer {
    padding-bottom: 0;
  }

</style>
