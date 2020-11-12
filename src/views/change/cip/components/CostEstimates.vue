<template>
  <div>
    <a-form-model
      ref="form"
      :model="data"
      :rules="tableRules"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }">
      <a-row :gutter="48" >
        <a-col :md="24" :sm="24" style="padding-top:5px; padding-bottom:5px;padding-left:30px;background-color:#f5f5f5;border:1px solid #ccc">
          <a-button :disabled="type === 'view'" icon="plus" @click="add()">
            新增
          </a-button>
          <a-button @click="clear()" :disabled="type === 'view'" icon="stop">
            重置
          </a-button>
          <a-button :disabled="type === 'view'" @click="replaceByContract">
            按原合同条款
          </a-button>
          <a-button type="primary" :disabled="type === 'view'" @click="countAmount()">
            计算金额
          </a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-table
            ref="table"
            :row-key="record => record.srNo" 
            :columns="columns" 
            :data-source="data.vobQlst" 
            :scroll="{ x : '1500px',y : '300px' }" 
            bordered 
            :pagination="false"
          >
            <span slot="action" class="diy-input" slot-scope="text, item, index">
              <template>
                <a-button @click="add(index,item.srNo)" :disabled="type === 'view'" icon="plus">
                  添加子项
                </a-button>
                <a-button @click="del(index)" :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </template>
            </span>
            <div class="diy-input" slot="isCarryData" slot-scope="text, item, index">
              <a-icon 
                @click="item.isCarryData = !item.isCarryData"
                :type="item.isCarryData ? 'check-square' : 'border'" :disabled="type === 'view'" />
            </div>
            <div class="diy-input" slot="section" slot-scope="text, item, index">
              <a-input 
                v-model="item.section" :disabled="type === 'view'"></a-input>
            </div>
            <div class="diy-input" slot="building" slot-scope="text, item, index">
              <a-input 
                v-model="item.building" :disabled="type === 'view'"></a-input>
            </div>
            <div class="diy-input" slot="remark1" slot-scope="text, item, index">
              <a-input 
                v-model="item.remark1" :disabled="type === 'view'"></a-input>
            </div>
            <div class="diy-input" slot="remark2" slot-scope="text, item, index">
              <a-input 
                v-mod`el="item.remark2" :disabled="type === 'view'"></a-input>
            </div>
            <div class="diy-input" slot="description" slot-scope="text, item, index">
              <a-input  
                v-model="item.description" :disabled="type === 'view'"></a-input>
            </div>
            <div class="diy-input" slot="costCenter" slot-scope="text, item, index">
              <a-form-model-item 
                :prop="'vobQlst.' + index + '.costCenter'"
                :rules="[{required: !item.isDeleted, message: '请选择成本中心',type : 'string',trigger:'change' }]"
              >
                <a-input :hidden="true" v-model="item.costCenter"/>
                <a-select
                  :default-value="item | getValue(item)"
                  style="width: 200px"
                  mode="multiple"
                  :disabled="type === 'view'"
                  @change="value => centerChange(value,index)">
                  <a-select-option
                    :value="center.id"
                    v-for="center in selection.centers"
                    :key="JSON.stringify(center)">
                    {{ center.costCenterName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <div class="diy-input" slot="itemType" slot-scope="text, item, index">
              <a-form-model-item 
                :prop="'vobQlst.' + index + '.itemType'"
                :rules="[{required: !item.isDeleted, message: '请选择清单项类别' }]"
              >
                <a-select
                  placeholder="请选择"
                  v-model="item.itemType"
                  style="width:200px"
                  :disabled="type === 'view'"
                  >
                  <a-select-option v-for="(item, index) in selection.itemTypes" :key="index" :value="item.code">{{
                    item.nameCN }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <div class="diy-input" slot="unitMaterial" slot-scope="text, item, index">
              <a-select 
                placeholder="请选择"
                v-model="item.unitMaterial"
                :disabled="type === 'view'"
                >
                <a-select-option v-for="(item, index) in selection.unitTypes" :key="index" :value="item.nameCN">{{
                  item.nameCN }}
                </a-select-option>
              </a-select>
            </div>
            <div class="diy-input" slot="quantityMaterial" slot-scope="text, item, index">
            <a-input-number  
              @change="valueChange(item)" v-model="item.quantityMaterial" :disabled="type === 'view'"></a-input-number>
            </div>
            <div class="diy-input" slot="unitPriceMaterial" slot-scope="text, item, index">
            <a-input-number  
              @change="valueChange(item)" 
              v-model="item.unitPriceMaterial" 
              :disabled="type === 'view'"
              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
              :precision="2"></a-input-number>
            </div>
            <div class="diy-input" slot="subAmountMaterial" slot-scope="text, item, index">
            <a-input-number  
              :disabled="true" 
              v-model="item.subAmountMaterial" 
              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
              :precision="2"></a-input-number>
            </div>
            <div class="diy-input" slot="unitWork" slot-scope="text, item, index">
            <a-select 
              placeholder="请选择"
              v-model="item.unitWork"
              :disabled="type === 'view'"
              >
              <a-select-option v-for="(item, index) in selection.unitTypes" :key="index" :value="item.nameCN">{{
                item.nameCN }}
              </a-select-option>
            </a-select>
            </div>
            <div class="diy-input" slot="quantityWork" slot-scope="text, item, index">
            <a-input-number  
              @change="valueChange(item)" v-model="item.quantityWork" :disabled="type === 'view'"></a-input-number>
            </div>
            <div class="diy-input" slot="unitPriceWork" slot-scope="text, item, index">
            <a-input-number 
              @change="valueChange(item)" 
              v-model="item.unitPriceWork" 
              :disabled="type === 'view'"
              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
              :precision="2"></a-input-number>
            </div>
            <div class="diy-input" slot="subAmountWork" slot-scope="text, item, index">
            <a-input  
              :disabled="true" 
              v-model="item.subAmountWork"
              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
              :precision="2"></a-input>
            </div>
            <div class="diy-input" slot="unitWorkMat" slot-scope="text, item, index">
            <a-select 
              placeholder="请选择"
              v-model="item.unitWorkMat"
              :disabled="type === 'view'"
              >
              <a-select-option v-for="(item, index) in selection.unitTypes" :key="index" :value="item.nameCN">{{
                item.nameCN }}
              </a-select-option>
            </a-select>
            </div>
            <div class="diy-input" slot="quantityWorkMat" slot-scope="text, item, index">
            <a-input-number 
              @change="valueChange(item)" v-model="item.quantityWorkMat" :disabled="type === 'view'"></a-input-number>
            </div>
            <div class="diy-input" slot="unitPriceWorkMat" slot-scope="text, item, index">
            <a-input-number  
              @change="valueChange(item)" 
              v-model="item.unitPriceWorkMat" 
              :disabled="type === 'view'"
              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
              :precision="2"></a-input-number>
            </div>
            <div class="diy-input" slot="subAmountWorkMat" slot-scope="text, item, index">
            <a-input-number 
              :disabled="true" 
              v-model="item.subAmountWorkMat"
              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
              :precision="2"></a-input-number>
            </div>
            <div class="diy-input" slot="allAmount" slot-scope="text, item, index">
            <a-input-number 
              :disabled="true" 
              v-model="item.allAmount"
              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
              :precision="2"></a-input-number>
            </div>
          </a-table>
        </a-col>
      </a-row>
    </a-form-model>
    <contract-bq-modal ref="bqModal" :contract="contract" :data="data"></contract-bq-modal>
  </div>
</template>

<script>

  import ContractBqModal from '@/views/change/cip/components/modal/ContractBQModal'
  import { compare } from '@/utils/util'
  import { Base as BaseService } from '@/api/base'
  import { SwaggerService } from '@/api/swagger.service'
  import { ChangeService } from '@/views/change/change.service'
  import { ContractService } from '@/views/contract/contract.service'

  const columns = [
    {
      title : '操作',
      dataIndex : 'action',
      scopedSlots: { customRender: 'action' },
      width : 250
    },
    {
      title: '带数项目',
      dataIndex: 'isCarryData',
      scopedSlots: { customRender: 'isCarryData' },
      width : 100
    },
    {
      title: '清单编号',
      dataIndex: 'srNo',
      scopedSlots: { customRender: 'srNo' },
      width : 100
    },
    {
      title: '标段',
      dataIndex: 'section',
      scopedSlots: { customRender: 'section' },
      width : 60
    },
    {
      title: '楼栋',
      dataIndex: 'building',
      scopedSlots: { customRender: 'building' },
      width : 60
    },
    {
      title: '预留字段0',
      dataIndex: 'remark1',
      scopedSlots: { customRender: 'remark1' },
      width : 100
    },
    {
      title: '预留字段1',
      dataIndex: 'remark2',
      scopedSlots: { customRender: 'remark2' },
      width : 100
    },
    {
      title: '清单描述',
      dataIndex: 'description',
      scopedSlots: { customRender: 'description' },
      width : 150
    },
    {
      title: '业态成本中心',
      dataIndex: 'costCenterName',
      scopedSlots: { customRender: 'costCenterName' },
      width : 250
    },
    {
      title: '清单项类别',
      dataIndex: 'signDate',
      scopedSlots: { customRender: 'signDate' },
      width : 150
    },
    {
      title: '供应',
      children: [
        {
          title: '单位',
          dataIndex : 'unitMaterial',
          scopedSlots: { customRender: 'unitMaterial' },
      	  width : 100
        },
        {
          title: '工程量',
          dataIndex: 'quantityMaterial',
          scopedSlots: { customRender: 'quantityMaterial' },
      	  width : 100
        },
        {
          title: '单价',
          dataIndex: 'unitPriceMaterial',
          scopedSlots: { customRender: 'unitPriceMaterial' },
      	  width : 100
        },
        {
          title: '小计',
          dataIndex: 'subAmountMaterial',
          scopedSlots: { customRender: 'subAmountMaterial' },
      	  width : 100
        }
      ]
    },
    {
      title: '安装',
      children: [
        {
          title: '单位',
          dataIndex: 'unitWork',
          scopedSlots: { customRender: 'unitWork' },
      	  width : 100
        },
        {
          title: '工程量',
          dataIndex: 'quantityWork',
          scopedSlots: { customRender: 'quantityWork' },
      	  width : 100
        },
        {
          title: '单价',
          dataIndex: 'unitPriceWork',
          scopedSlots: { customRender: 'unitPriceWork' },
      	  width : 100
        },
        {
          title: '小计',
          dataIndex: 'subAmountWork',
          scopedSlots: { customRender: 'subAmountWork' },
      	  width : 100
        }
      ]
    },
    {
      title: '供应+安装',
      children: [
        {
          title: '单位',
          dataIndex: 'unitWorkMat',
          scopedSlots: { customRender: 'unitWorkMat' },
      	  width : 100
        },
        {
          title: '工程量',
          dataIndex: 'quantityWorkMat',
          scopedSlots: { customRender: 'quantityWorkMat' },
      	  width : 100
        },
        {
          title: '单价',
          dataIndex: 'unitPriceWorkMat',
          scopedSlots: { customRender: 'unitPriceWorkMat' },
      	  width : 100
        },
        {
          title: '小计',
          dataIndex: 'subAmountWorkMat',
          scopedSlots: { customRender: 'subAmountWorkMat' },
      	  width : 100
        }
      ]
    },
    {
      title: '合计',
      dataIndex: 'allAmount',
      scopedSlots: { customRender: 'allAmount' },
      width : 80
    }
  ]


  function getNo (str, key, items) {
    const isRoot = str === '0' || !str
    let result
    items = items.filter(item => !item.isDeleted)
    items.sort((a, b) => {
      return compare(b[key], a[key])
    })
    if (items.length === 0) {
      return '1'
    }
    let arr
    if (isRoot) {
      arr = items[0][key].split('.')
      arr[0] = parseInt(arr[0], 10) + 1 + ''
      result = arr[0]
    } else {
      items = items.filter(item => item[key].indexOf(str) === 0 && item[key].split('.').length < str.split('.').length+2)
      arr = items[0][key].split('.')
      if (items.length === 1) {
        arr.push('0')
      }
      arr.reverse()
      arr[0] = parseInt(arr[0], 10) + 1 + ''
      result = arr.reverse().join('.')
    }
    return result
  }

  export default {
    name: 'CostEstimates',
    components: { ContractBqModal },
    data () {
      return {
        columns : columns,
        selection: {},
        form: this.$form.createForm(this),
        loading: false,
        tableRules: {
          vobQlst: []
        }
      }
    },
    created () {
      this.data.vobQlst.sort((a, b) => {
        return compare(a.srNo, b.srNo)
      })

	 console.log('costEstimates.this.contract.contractCategory',this.contract.contractCategory)
      BaseService.itemTypes('vo').then(res => {
        this.selection.itemTypes = res.result.data
      })
      ContractService.centers(this.project.id).then(res => {
        this.selection.centers = res.result.data
        this.$forceUpdate()
      })
      BaseService.unitTypes().then(res => {
        this.selection.unitTypes = res.result.data
        this.$forceUpdate()
      })
    },
    filters: {
      filterDeleted (items) {
        return items.filter(item => !item.isDeleted)
      },
      getValue (item) {
        return item.costCenter ? item.costCenter.split(';').map(Number) : []
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
      contract: {
        type: Object,
        default: null
      },
      project: {
        type: Object,
        default: null
      }
    },
    methods: {
      add (index,stringNo,addData) {
        const newSrNo = getNo(stringNo, 'srNo', this.data.vobQlst)
        let data = SwaggerService.getForm('VOBQDto')
        if(addData){
        		data = Object.assign({},addData);
        		data.contractBQGuid = ''
            data.contractID = ''
        }else{
            data.isCarryData = false
            data.quantityMaterial = 0
            data.unitPriceMaterial = 0
            data.subAmountMaterial = 0
            data.quantityWork = 0
            data.unitPriceWork = 0
            data.subAmountWork = 0
            data.quantityWorkMat = 0
            data.unitPriceWorkMat = 0
            data.subAmountWorkMat = 0
            data.allAmount = 0
        }
        data.isTemp = true
        data.srNo = newSrNo
        data.id = 0
        data.isDeleted = false
        data.vobqGuid = ''
        data.void = ''
        //增加子项时需要将数据追加到当前行下级而不是表格最后一行
        if(index != undefined){
          //获取以当前行清单编号开头的所有清单
        var appendIndex = 0
        for(var i = index; i < this.data.vobQlst.length; i++){
          var item = this.data.vobQlst[i]
          if(item.srNo.indexOf(stringNo) === 0){
            appendIndex++
          }else{
            break;
          }
        }
          //追加插入到指定位置
          this.data.vobQlst.splice(index+appendIndex,0,data)
        }else{
          this.data.vobQlst.push(data)
        }
        this.$forceUpdate()
      },
      del (index) {
        const str = this.data.vobQlst[index].srNo
        const items = this.data.vobQlst.filter(item => item.srNo.indexOf(str) === 0)
        items.forEach(item => {
          if (item.isTemp) {
            this.data.vobQlst.splice(index, 1)
          } else {
            item.isDeleted = true
          }
        })
        this.$forceUpdate()
      },
      clear () {
        const list = []
        this.data.vobQlst.forEach(item => {
          item.isDeleted = true
          if (!item.isTemp) {
            list.push(item)
          }
          this.data.vobQlst = list
          this.$forceUpdate()
        })
      },
      centerChange (values,index) {
        let item = this.data.vobQlst[index]
        item.costCenter = values.join(';').trim()
      },
      valueChange (item) {
        item.subAmountMaterial = item.quantityMaterial * item.unitPriceMaterial
        item.subAmountWork = item.quantityWork * item.unitPriceWork
        item.subAmountWorkMat = item.quantityWorkMat * item.unitPriceWorkMat
        item.allAmount = item.subAmountMaterial + item.subAmountWork + item.subAmountWorkMat
      },
      countAmount () {
        ChangeService.bqAmount(this.data.vobQlst).then(item => {
          if (item.result.statusCode === 200) {
            this.data.voMasterInfo.voTotalAmountDecrease = item.result.data.voTotalAmountDecrease
            this.data.voMasterInfo.voTotalAmountIncrease = item.result.data.voTotalAmountIncrease
            this.data.voMasterInfo.voAmount = item.result.data.voAmount
          }
          this.$message.info('计算金额完成')
        })
      },
      replaceByContract () {
        this.$refs.bqModal.showTable()
      }
    }
  }
</script>

<style lang="less" scoped>
  .ant-form .ant-form-item .ant-form-item-label.ant-col-8 {
    width: 15em
  }

  .ant-form .ant-form-item .ant-form-item-control-wrapper.ant-col-16 {
    width: calc(100% - 15em);
  }

  .diy-input{
    margin-top : -20px;
    margin-bottom : -20px;
    margin-right : -18px;
    margin-left : -13px;
  }
  .ant-input{
    min-width : 5px;
    max-width : 90%;
  }
</style>
