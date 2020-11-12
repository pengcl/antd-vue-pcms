<template>
  <div>
    <a-form-model ref="form" :model="data" :rules="tableRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row>
        <a-col>
          <div
            style="padding-top:5px; padding-bottom:5px;padding-left:30px;background-color:#f5f5f5;border-bottom:0;border:1px solid #ccc;margin-top: 20px">
            <a-button :disabled="type === 'view'" icon="plus" @click="add()"> 新增 </a-button>
            <a-button @click="clear()" :disabled="type === 'view'" icon="stop"> 重置 </a-button>
            <a-button :disabled="type === 'view'" @click="replaceByContract"> 按原合同条款 </a-button>
            <a-button type="primary" :disabled="type === 'view'" @click="countAmount()"> 计算金额 </a-button>
          </div>
          <a-table
            ref="table"
            :row-key="record => record._id"
            :columns="columns"
            :data-source="this.data.vobQlst"
            :scroll="{ x: '1500px', y: '300px' }"
            bordered
            :pagination="false"
            :rowClassName="setRowClassName"
          >
            <span slot="action" slot-scope="text, item, index">
              <template>
                <a-button @click="add(item)" :disabled="type === 'view'" icon="plus"> 添加子项 </a-button>
                <a-button @click="del(index)" :disabled="type === 'view'" icon="close"> 删除 </a-button>
              </template>
            </span>
            <div slot="isCarryData" slot-scope="text, item, index">
              <a-icon
                @click="item.isCarryData = !item.isCarryData"
                :type="item.isCarryData ? 'check-square' : 'border'"
                :disabled="type === 'view'"
              />
            </div>
            <div slot="srNo" style="text-align:left" slot-scope="text, item, index">
              <span>{{text}}</span>
            </div>
            <div slot="section" slot-scope="text, item, index">
              <a-input v-model="item.section" :disabled="type === 'view'"></a-input>
            </div>
            <div slot="building" slot-scope="text, item, index">
              <a-input v-model="item.building" :disabled="type === 'view'"></a-input>
            </div>
            <div slot="subsection" slot-scope="text, item, index">
              <a-input v-model="item.subsection" :disabled="type === 'view'"></a-input>
            </div>
            <div slot="segmentation" slot-scope="text, item, index">
              <a-input v-model="item.segmentation" :disabled="type === 'view'"></a-input>
            </div>
            <div slot="remark1" slot-scope="text, item, index">
              <a-input v-model="item.remark1" :disabled="type === 'view'"></a-input>
            </div>
            <div slot="remark2" slot-scope="text, item, index">
              <a-input v-model="item.remark2" :disabled="type === 'view'"></a-input>
            </div>
            <div slot="description" slot-scope="text, item, index">
              <a-input v-model="item.description" :disabled="type === 'view'"></a-input>
            </div>
            <div slot="costCenter" slot-scope="text, item, index">
              <a-form-model-item
                :prop="'vobQlst.' + index + '.costCenter'"
                :rules="[{ required: !item.isDeleted, message: '请选择成本中心', type: 'string', trigger: 'change' }]"
              >
                <a-input :hidden="true" v-model="item.costCenter" />
                <a-select
                  :default-value="item | getValue(item)"
                  style="width: 200px"
                  mode="multiple"
                  :disabled="type === 'view'"
                  @change="(value) => centerChange(value, index)"
                >
                  <a-select-option :value="center.id" v-for="center in selection.centers" :key="JSON.stringify(center)">
                    {{ center.costCenterName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <div slot="itemType" slot-scope="text, item, index">
              <a-form-model-item
                :prop="'vobQlst.' + index + '.itemType'"
                :rules="[{ required: !item.isDeleted, message: '请选择清单项类别' }]"
              >
                <a-select placeholder="请选择" v-model="item.itemType" style="width: 200px" :disabled="type === 'view'">
                  <a-select-option v-for="(item, index) in selection.itemTypes" :key="index" :value="item.code"
                    >{{ item.nameCN }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <div slot="unitMaterial" slot-scope="text, item, index">
              <a-select placeholder="请选择" v-model="item.unitMaterial" :disabled="type === 'view'">
                <a-select-option v-for="(item, index) in selection.unitTypes" :key="index" :value="item.nameCN"
                  >{{ item.nameCN }}
                </a-select-option>
              </a-select>
            </div>
            <div slot="quantityMaterial" slot-scope="text, item, index">
              <a-input-number
                @change="valueChange(item)"
                v-model="item.quantityMaterial"
                :disabled="type === 'view'"
              ></a-input-number>
            </div>
            <div slot="unitPriceMaterial" slot-scope="text, item, index">
              <a-input-number
                @change="valueChange(item)"
                v-model="item.unitPriceMaterial"
                :disabled="type === 'view'"
                :formatter="(value) => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(value) => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </div>
            <div slot="subAmountMaterial" slot-scope="text, item, index">
              <a-input-number
                :disabled="true"
                v-model="item.subAmountMaterial"
                :formatter="(value) => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(value) => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </div>
            <div slot="unitWork" slot-scope="text, item, index">
              <a-select placeholder="请选择" v-model="item.unitWork" :disabled="type === 'view'">
                <a-select-option v-for="(item, index) in selection.unitTypes" :key="index" :value="item.nameCN"
                  >{{ item.nameCN }}
                </a-select-option>
              </a-select>
            </div>
            <div slot="quantityWork" slot-scope="text, item, index">
              <a-input-number
                @change="valueChange(item)"
                v-model="item.quantityWork"
                :disabled="type === 'view'"
              ></a-input-number>
            </div>
            <div slot="unitPriceWork" slot-scope="text, item, index">
              <a-input-number
                @change="valueChange(item)"
                v-model="item.unitPriceWork"
                :disabled="type === 'view'"
                :formatter="(value) => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(value) => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </div>
            <div slot="subAmountWork" slot-scope="text, item, index">
              <a-input
                :disabled="true"
                v-model="item.subAmountWork"
                :formatter="(value) => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(value) => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input>
            </div>
            <div slot="unitWorkMat" slot-scope="text, item, index">
              <a-select placeholder="请选择" v-model="item.unitWorkMat" :disabled="type === 'view'">
                <a-select-option v-for="(item, index) in selection.unitTypes" :key="index" :value="item.nameCN"
                  >{{ item.nameCN }}
                </a-select-option>
              </a-select>
            </div>
            <div slot="quantityWorkMat" slot-scope="text, item, index">
              <a-input-number
                @change="valueChange(item)"
                v-model="item.quantityWorkMat"
                :disabled="type === 'view'"
              ></a-input-number>
            </div>
            <div slot="unitPriceWorkMat" slot-scope="text, item, index">
              <a-input-number
                @change="valueChange(item)"
                v-model="item.unitPriceWorkMat"
                :disabled="type === 'view'"
                :formatter="(value) => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(value) => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </div>
            <div slot="subAmountWorkMat" slot-scope="text, item, index">
              <a-input-number
                :disabled="true"
                v-model="item.subAmountWorkMat"
                :formatter="(value) => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(value) => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
            </div>
            <div slot="allAmount" slot-scope="text, item, index">
              <a-input-number
                :disabled="true"
                v-model="item.allAmount"
                :formatter="(value) => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(value) => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
              ></a-input-number>
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
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    width: 250,
  },
  {
    title: '带数项目',
    dataIndex: 'isCarryData',
    scopedSlots: { customRender: 'isCarryData' },
    width: 80,
  },
  {
    title: '清单编号',
    dataIndex: 'srNo',
    scopedSlots: { customRender: 'srNo' },
    width: 150,
  },
  {
    title: '标段',
    dataIndex: 'section',
    scopedSlots: { customRender: 'section' },
    width: 120,
  },
  {
    title: '楼栋',
    dataIndex: 'building',
    scopedSlots: { customRender: 'building' },
    width: 120,
  },
  {
    title: '分部',
    dataIndex: 'subsection',
    scopedSlots: { customRender: 'subsection' },
    width: 120,
  },
  {
    title: '分项',
    dataIndex: 'segmentation',
    scopedSlots: { customRender: 'segmentation' },
    width: 120,
  },
  {
    title: '预留字段0',
    dataIndex: 'remark1',
    scopedSlots: { customRender: 'remark1' },
    width: 100,
  },
  {
    title: '预留字段1',
    dataIndex: 'remark2',
    scopedSlots: { customRender: 'remark2' },
    width: 100,
  },
  {
    title: '清单描述',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' },
    width: 160,
  },
  {
    title: '业态成本中心',
    dataIndex: 'costCenter',
    scopedSlots: { customRender: 'costCenter' },
    width: 220,
  },
  {
    title: '清单项类别',
    dataIndex: 'itemType',
    scopedSlots: { customRender: 'itemType' },
    width: 220,
  },
  {
    title: '供应',
    children: [
      {
        title: '单位',
        dataIndex: 'unitMaterial',
        scopedSlots: { customRender: 'unitMaterial' },
        width: 120,
      },
      {
        title: '工程量',
        dataIndex: 'quantityMaterial',
        scopedSlots: { customRender: 'quantityMaterial' },
        width: 120,
      },
      {
        title: '单价',
        dataIndex: 'unitPriceMaterial',
        scopedSlots: { customRender: 'unitPriceMaterial' },
        width: 120,
      },
      {
        title: '小计',
        dataIndex: 'subAmountMaterial',
        scopedSlots: { customRender: 'subAmountMaterial' },
        width: 160,
      },
    ],
  },
  {
    title: '安装',
    children: [
      {
        title: '单位',
        dataIndex: 'unitWork',
        scopedSlots: { customRender: 'unitWork' },
        width: 120,
      },
      {
        title: '工程量',
        dataIndex: 'quantityWork',
        scopedSlots: { customRender: 'quantityWork' },
        width: 120,
      },
      {
        title: '单价',
        dataIndex: 'unitPriceWork',
        scopedSlots: { customRender: 'unitPriceWork' },
        width: 120,
      },
      {
        title: '小计',
        dataIndex: 'subAmountWork',
        scopedSlots: { customRender: 'subAmountWork' },
        width: 160,
      },
    ],
  },
  {
    title: '供应+安装',
    children: [
      {
        title: '单位',
        dataIndex: 'unitWorkMat',
        scopedSlots: { customRender: 'unitWorkMat' },
        width: 120,
      },
      {
        title: '工程量',
        dataIndex: 'quantityWorkMat',
        scopedSlots: { customRender: 'quantityWorkMat' },
        width: 120,
      },
      {
        title: '单价',
        dataIndex: 'unitPriceWorkMat',
        scopedSlots: { customRender: 'unitPriceWorkMat' },
        width: 120,
      },
      {
        title: '小计',
        dataIndex: 'subAmountWorkMat',
        scopedSlots: { customRender: 'subAmountWorkMat' },
        width: 160,
      },
    ],
  },
  {
    title: '合计',
    dataIndex: 'allAmount',
    scopedSlots: { customRender: 'allAmount' },
    width: 160,
  },
]

function getNo(str, key, items) {
  const isRoot = str === '0' || !str
  let result
  items = items.filter((item) => !item.isDeleted)
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
    items = items.filter(
      (item) => item[key].indexOf(str) === 0 && item[key].split('.').length < str.split('.').length + 2
    )
    arr = items[0][key].split('.')
    console.log('arr',arr,items)
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
  data() {
    return {
      columns: columns,
      selection: {},
      form: this.$form.createForm(this),
      loading: false,
      maxId : 0,
      tableRules: {
        vobQlst: [],
      },
    }
  },
  created() {
    this.data.vobQlst.sort((a, b) => {
      return compare(a.srNo, b.srNo)
    })
    this.data.vobQlst.forEach((item,index) =>{
      item._id = index
    })
    this.maxId = this.data.vobQlst.length
    BaseService.itemTypes('vo').then((res) => {
      this.selection.itemTypes = res.result.data
    })
    ContractService.centers(this.project.id).then((res) => {
      this.selection.centers = res.result.data
      this.$forceUpdate()
    })
    BaseService.unitTypes().then((res) => {
      this.selection.unitTypes = res.result.data
      this.$forceUpdate()
    })
  },
  filters: {
    getValue(item) {
      const list = item.costCenter ? item.costCenter.split(';').map(Number) : []
      list.forEach((item,index) =>{
        if(isNaN(item)){
          list.splice(index,1)
        }
      })
      return list
    },
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      default: 'view',
    },
    id: {
      type: String,
      default: '0',
    },
    contract: {
      type: Object,
      default: null,
    },
    project: {
      type: Object,
      default: null,
    },
  },
  methods: {
    add( item, addData) {
      const stringNo = item ? item.srNo : undefined
      const newSrNo = getNo(stringNo, 'srNo', this.data.vobQlst)
      let data = SwaggerService.getForm('VOBQDto')
      if (addData) {
        data = Object.assign({}, addData)
        data.contractBQGuid = ''
        data.contractID = ''
      } else {
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
      data._id = this.maxId
      this.maxId++
      this.data.vobQlst.push(data)
      console.log('mydata',data)
      this.data.vobQlst.sort((a, b) => {
        return compare(a['srNo'], b['srNo'])
      })
      this.$forceUpdate()
    },
    del(index) {
      const str = this.data.vobQlst[index].srNo
      const items = this.data.vobQlst.filter(item => item.srNo.indexOf(str) === 0)
      items.forEach((item) => {
        item.isDeleted = true
      })
      this.data.vobQlst = this.data.vobQlst.filter(item => !(item.isDeleted && item.isTemp))
      this.$forceUpdate()
    },
    clear() {
      const list = []
      this.data.vobQlst.forEach((item) => {
        item.isDeleted = true
        if (!item.isTemp) {
          list.push(item)
        }
        this.data.vobQlst = list
        this.$forceUpdate()
      })
    },
    centerChange(values, index) {
      let item = this.data.vobQlst[index]
      item.costCenter = values.join(';').trim()
    },
    valueChange(item) {
      item.subAmountMaterial = item.quantityMaterial * item.unitPriceMaterial
      item.subAmountWork = item.quantityWork * item.unitPriceWork
      item.subAmountWorkMat = item.quantityWorkMat * item.unitPriceWorkMat
      item.allAmount = item.subAmountMaterial + item.subAmountWork + item.subAmountWorkMat
    },
    countAmount() {
      ChangeService.bqAmount(this.data.vobQlst).then((item) => {
        if (item.result.statusCode === 200) {
          this.data.voMasterInfo.voTotalAmountDecrease = item.result.data.voTotalAmountDecrease
          this.data.voMasterInfo.voTotalAmountIncrease = item.result.data.voTotalAmountIncrease
          this.data.voMasterInfo.voAmount = item.result.data.voAmount
        }
        this.$message.info('计算金额完成')
      })
    },
    replaceByContract() {
      this.$refs.bqModal.showTable()
    },
    setRowClassName(record,index){
      if(record.isDeleted){
        return "delete-row"
      }
      return ""
    }
  },
}
</script>

<style lang="less" scoped>
.ant-form .ant-form-item .ant-form-item-label.ant-col-8 {
  width: 15em;
}

.ant-form .ant-form-item .ant-form-item-control-wrapper.ant-col-16 {
  width: calc(100% - 15em);
}

/deep/ .has-error .ant-form-explain {
  white-space: nowrap;
}

/deep/ .ant-table-tbody > tr > td {
  padding: 5px 10px !important;
  text-align: center;
}

/deep/ .delete-row{
  display : none;
}

button {
  margin-right: 10px;
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
        white-space: nowrap;
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
        text-align: center;

        .ant-input {
          min-width: 60px;
        }

        /deep/ .has-error .ant-form-explain {
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
