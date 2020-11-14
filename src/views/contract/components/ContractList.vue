<template>
  <div style="margin-bottom:15px">
    <a-form-model
      ref="form"
      :model="data.contract"
      :rules="rules"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }">
      <a-row :gutter="24">
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="合同金额"
            prop="contractAmount"
          >
            <a-input-number
              :disabled="true"
              placeholder="请生成合同金额"
              v-model="data.contract.contractAmount"
              :min="0"
              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
              :precision="2"/>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="有效合同金额"
            prop="contractEffectAmount"
          >
            <a-input-number
              :disabled="true"
              placeholder="请生成有效合同金额"
              v-model="data.contract.contractEffectAmount"
              :min="0"
              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
              :precision="2"/>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="合同内暂定款金额"
            prop="contractPSAmount"
          >
            <a-input-number
              :disabled="true"
              placeholder="请生成合同内暂定款金额"
              v-model="data.contract.contractPSAmount"
              :min="0"
              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
              :precision="2"/>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="合同内可选择项目金额"
            prop="contractOPTAmount"
          >
            <a-input-number
              :disabled="true"
              placeholder="合同内可选择项目金额"
              v-model="data.contract.contractOPTAmount"
              :min="0"
              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
              :precision="2"/>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="专业分包合同金额"
            prop="contractPCPreAmount"
          >
            <a-input-number
              :disabled="true"
              placeholder="专业分包合同金额"
              v-model="data.contract.contractPCPreAmount"
              :min="0"
              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
              :precision="2"/>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="甲供材金额"
            prop="contractDSAmount"
          >
            <a-input-number
              :disabled="true"
              placeholder="甲供材金额"
              v-model="data.contract.contractDSAmount"
              :min="0"
              :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\元\s?|(,*)/g, '')"
              :precision="2"/>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <a-form-model
      ref="tableForm"
      :model="data"
      :rules="tableRules"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }">
      <a-row :gutter="48">
        <a-col :md="12" :sm="24">
          <a-button type="success">按编码排序</a-button>
          <a-button type="success" style="margin-left: 5px">恢复原来排序</a-button>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-button type="success" style="float: right">导入导出</a-button>
        </a-col>
        <a-col :md="24" :sm="24">
          <div
            style="padding-top:5px; padding-bottom:5px;padding-left:30px;background-color:#f5f5f5;border-bottom:0;border:1px solid #ccc;margin-top: 20px">
            <a-button :disabled="type === 'view'" icon="plus" @click="add()">
              新增
            </a-button>
          </div>
          <a-table
            :columns="columns"
            :data-source="data.contractBQlst | filterDeleted"
            size="default"
            rowKey="srNo"
            :scroll="{ x : '1500px',y : '300px' }"
            bordered>
            <template slot="action" slot-scope="text, record">
              <a-button @click="add(record.srNo)" :disabled="type === 'view'" icon="plus">
                添加子项
              </a-button>
              <a-button @click="del(record)" :disabled="type === 'view'" icon="close">
                删除
              </a-button>
            </template>
            <template slot="isCarryData" slot-scope="text, record, index">
              <a-icon
                :disabled="type === 'view'"
                @click="checkCarry(record,type === 'view',index)"
                :type="record.isCarryData ? 'check-square' : 'border'"/>
            </template>
            <template slot="srNo" slot-scope="text, record">
              <a-input style="width:100%" :disabled="true" :value="record.srNo"></a-input>
            </template>
            <template slot="section" slot-scope="text, record">
              <a-input style="width:100%" :value="record.section"></a-input>
            </template>
            <template slot="building" slot-scope="text, record">
              <a-input style="width:100%" :value="record.building"></a-input>
            </template>
            <template slot="subsection" slot-scope="text, record">
              <a-input style="width:100%" :value="record.subsection"></a-input>
            </template>
            <template slot="segmentation" slot-scope="text, record">
              <a-input style="width:100%" :value="record.segmentation"></a-input>
            </template>
            <template slot="segmentation" slot-scope="text, record">
              <a-input style="width:100%" :value="record.segmentation"></a-input>
            </template>
            <template slot="remark1" slot-scope="text, record">
              <a-input style="width:100%" :value="record.remark1"></a-input>
            </template>
            <template slot="remark2" slot-scope="text, record">
              <a-input style="width:100%" :value="record.remark2"></a-input>
            </template>
            <template slot="description" slot-scope="text, record">
              <a-input style="width:100%" :value="record.description"></a-input>
            </template>
            <template slot="costCenter" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'contractBQlst.' + index + '.costCenter'"
                :rules="[{required: !record.isDeleted, message: '请选择成本中心' }]"
              >
                <a-input :hidden="true" v-model="record.costCenter"/>
                <a-select
                  :disabled="type === 'view'"
                  :default-value="record | getValue(index)"
                  style="width: 200px;margin-top: 15px"
                  mode="multiple"
                  @change="centerChange">
                  <a-select-option
                    :value="index + ';' + center.id + ';' + center.costCenterName"
                    :itemIndex="index"
                    v-for="center in selection.centers"
                    :key="JSON.stringify(center)">
                    {{ center.costCenterName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </template>

            <template slot="itemType" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'contractBQlst.' + index + '.itemType'"
                :rules="[{required: !record.isDeleted, message: '请选择清单项类别' }]"
              >
                <a-select
                  :disabled="type === 'view'"
                  placeholder="请选择"
                  style="margin-top: 15px;width: 160px"
                  v-model="record.itemType">
                  <a-select-option v-for="(item, index) in selection.itemTypes" :key="index" :value="item.code">
                    {{ item.nameCN }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </template>

            <template slot="unitMaterial" slot-scope="text, record">
              <a-select
                :disabled="type === 'view'"
                placeholder="请选择"
                v-model="record.unitMaterial">
                <a-select-option v-for="(item, index) in selection.unitTypes" :key="index" :value="item.nameCN">
                  {{ item.nameCN }}
                </a-select-option>
              </a-select>
            </template>

            <template slot="quantityMaterial" slot-scope="text, record">
              <a-input
                :disabled="type === 'view'"
                @change="valueChange(record)"
                v-model="record.quantityMaterial"></a-input>
            </template>

            <template slot="unitPriceMaterial" slot-scope="text, record">
              <a-input-number
                :disabled="type === 'view'"
                @change="valueChange(record)"
                v-model="record.unitPriceMaterial"
                :min="0"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"></a-input-number>
            </template>

            <template slot="subAmountMaterial" slot-scope="text, record">
              <a-input-number
                :disabled="true"
                v-model="record.subAmountMaterial"
                :min="0"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"></a-input-number>
            </template>

            <template slot="unitWork" slot-scope="text, record">
              <a-select
                :disabled="type === 'view'"
                placeholder="请选择"
                v-model="record.unitWork">
                <a-select-option v-for="(item, index) in selection.unitTypes" :key="index" :value="item.nameCN">
                  {{ item.nameCN }}
                </a-select-option>
              </a-select>
            </template>

            <template slot="quantityWork" slot-scope="text, record">
              <a-input-number
                :disabled="type === 'view'"
                @change="valueChange(record)"
                v-model="record.quantityWork"></a-input-number>
            </template>

            <template slot="unitPriceWork" slot-scope="text, record">
              <a-input-number
                :disabled="type === 'view'"
                @change="valueChange(record)"
                v-model="record.unitPriceWork"
                :min="0"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"></a-input-number>
            </template>

            <template slot="subAmountWork" slot-scope="text, record">
              <a-input-number
                :disabled="true"
                v-model="record.subAmountWork"
                :min="0"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"></a-input-number>
            </template>

            <template slot="unitWork" slot-scope="text, record">
              <a-select
                :disabled="type === 'view'"
                placeholder="请选择"
                v-model="record.unitWork">
                <a-select-option v-for="(item, index) in selection.unitTypes" :key="index" :value="item.nameCN">
                  {{ item.nameCN }}
                </a-select-option>
              </a-select>
            </template>
            <template slot="quantityWork" slot-scope="text, record">
              <a-input-number
                :disabled="type === 'view'"
                @change="valueChange(record)"
                v-model="record.quantityWork"></a-input-number>
            </template>
            <template slot="unitPriceWork" slot-scope="text, record">
              <a-input-number
                :disabled="type === 'view'"
                @change="valueChange(record)"
                v-model="record.unitPriceWork"
                :min="0"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"></a-input-number>
            </template>
            <template slot="subAmountWork" slot-scope="text, record">
              <a-input-number
                :disabled="true"
                v-model="record.subAmountWork"
                :min="0"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"></a-input-number>
            </template>
            <template slot="unitWorkMat" slot-scope="text, record">
              <a-select
                :disabled="type === 'view'"
                placeholder="请选择"
                v-model="record.unitWorkMat">
                <a-select-option v-for="(item, index) in selection.unitTypes" :key="index" :value="item.nameCN">
                  {{ item.nameCN }}
                </a-select-option>
              </a-select>
            </template>
            <template slot="quantityWorkMat" slot-scope="text, record">
              <a-input-number
                :disabled="type === 'view'"
                @change="valueChange(record)"
                v-model="record.quantityWorkMat"></a-input-number>
            </template>
            <template slot="unitPriceWorkMat" slot-scope="text, record">
              <a-input-number
                :disabled="type === 'view'"
                @change="valueChange(record)"
                v-model="record.unitPriceWorkMat"
                :min="0"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"></a-input-number>
            </template>
            <template slot="subAmountWorkMat" slot-scope="text, record">
              <a-input-number
                :disabled="true"
                v-model="record.subAmountWorkMat"
                :min="0"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"></a-input-number>
            </template>
            <template slot="allAmount" slot-scope="text, record">
              <a-input-number
                :disabled="true"
                v-model="record.allAmount"
                :min="0"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"></a-input-number>
            </template>
          </a-table>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
  import { compare } from '@/utils/util'
  import { Base as BaseService } from '@/api/base'
  import { SwaggerService } from '@/api/swagger.service'
  import { ContractService } from '@/views/contract/contract.service'

  const columns = [
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' },
      width: 250
    },
    {
      title: '带数项目',
      dataIndex: 'isCarryData',
      scopedSlots: { customRender: 'isCarryData' },
      width: 160
    },
    {
      title: '清单编号',
      dataIndex: 'srNo',
      scopedSlots: { customRender: 'srNo' },
      width: 160
    },
    {
      title: '标段',
      dataIndex: 'section',
      scopedSlots: { customRender: 'section' },
      width: 160
    },
    {
      title: '楼栋',
      dataIndex: 'building',
      scopedSlots: { customRender: 'building' },
      width: 160
    },
    {
      title: '预留字段0',
      dataIndex: 'remark1',
      scopedSlots: { customRender: 'remark1' },
      width: 160
    },
    {
      title: '预留字段1',
      dataIndex: 'remark2',
      scopedSlots: { customRender: 'remark2' },
      width: 160
    },
    {
      title: '清单描述',
      dataIndex: 'description',
      scopedSlots: { customRender: 'description' },
      width: 160
    },
    {
      title: '业态成本中心',
      dataIndex: 'costCenter',
      scopedSlots: { customRender: 'costCenter' },
      width: 250
    },
    {
      title: '清单项类别',
      dataIndex: 'itemType',
      scopedSlots: { customRender: 'itemType' },
      width: 210
    },
    {
      title: '供应',
      children: [
        {
          title: '单位',
          dataIndex: 'unitMaterial',
          scopedSlots: { customRender: 'unitMaterial' },
          width: 160
        },
        {
          title: '工程量',
          dataIndex: 'quantityMaterial',
          scopedSlots: { customRender: 'quantityMaterial' },
          width: 160
        },
        {
          title: '单价',
          dataIndex: 'unitPriceMaterial',
          scopedSlots: { customRender: 'unitPriceMaterial' },
          width: 160
        },
        {
          title: '小计',
          dataIndex: 'subAmountMaterial',
          scopedSlots: { customRender: 'subAmountMaterial' },
          width: 160
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
          width: 160
        },
        {
          title: '工程量',
          dataIndex: 'quantityWork',
          scopedSlots: { customRender: 'quantityWork' },
          width: 160
        },
        {
          title: '单价',
          dataIndex: 'unitPriceWork',
          scopedSlots: { customRender: 'unitPriceWork' },
          width: 160
        },
        {
          title: '小计',
          dataIndex: 'subAmountWork',
          scopedSlots: { customRender: 'subAmountWork' },
          width: 160
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
          width: 160
        },
        {
          title: '工程量',
          dataIndex: 'quantityWorkMat',
          scopedSlots: { customRender: 'quantityWorkMat' },
          width: 160
        },
        {
          title: '单价',
          dataIndex: 'unitPriceWorkMat',
          scopedSlots: { customRender: 'unitPriceWorkMat' },
          width: 160
        },
        {
          title: '小计',
          dataIndex: 'subAmountWorkMat',
          scopedSlots: { customRender: 'subAmountWorkMat' },
          width: 160
        }
      ]
    },
    {
      title: '合计',
      dataIndex: 'allAmount',
      scopedSlots: { customRender: 'allAmount' },
      width: 160
    }
  ]
  const contractTypes = {
    '15': 'contract',
    '16': 'sa',
    '17': 'nsc'
  }

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
      items = items.filter(item => item[key].indexOf(str) === 0)
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
    name: 'ContractList',
    data () {
      return {
        selection: {},
        form: this.$form.createForm(this),
        loading: false,
        columns: columns,
        rules: {
          contractAmount: [{ required: true, message: '请选择带数项生成合同金额', trigger: 'change' }],
          contractEffectAmount: [{ required: true, message: '请选择带数项生成合同有效金额', trigger: 'change' }],
          contractDSAmount: [{ required: true, message: '请选择带数项生成甲供材金额', trigger: 'change' }],
          contractOPTAmount: [{ required: true, message: '请选择带数项生成合同内可选择项目金额', trigger: 'change' }],
          contractPCPreAmount: [{ required: true, message: '请选择带数项生成专业分包合同金额', trigger: 'change' }],
          contractPSAmount: [{ required: true, message: '请选择带数项请生成合同内暂定款金额', trigger: 'change' }]
        },
        tableRules: {
          contractBQlst: []
        }
      }
    },
    created () {
      this.data.contractBQlst.forEach((item, index) => {
        item._id = index
      })
      this.data.contractBQlst.sort((a, b) => {
        return compare(a.srNo, b.srNo)
      })
      if (this.data.contract.contractCategory) {
        const contractTypeKey = contractTypes[this.data.contract.contractCategory + '']
        if (contractTypeKey) {
          BaseService.itemTypes(contractTypeKey).then(res => {
            this.selection.itemTypes = res.result.data
            this.$forceUpdate()
          })
        }
      }
      this.data.contract.contractYear = new Date().getFullYear()
      ContractService.centers(this.project.id).then(res => {
        this.selection.centers = res.result.data
        this.$forceUpdate()
      })
      BaseService.unitTypes().then(res => {
        this.selection.unitTypes = res.result.data
        this.$forceUpdate()
      })
    },
    watch: {
      'data.contract.contractCategory' (value) {
        // 获取主合同需要通过合同类别参数
        const contractTypeKey = contractTypes[value + '']
        if (contractTypeKey) {
          BaseService.itemTypes(contractTypeKey).then(res => {
            this.selection.itemTypes = res.result.data
            this.$forceUpdate()
          })
        }
      }
    },
    filters: {
      filterDeleted (items) {
        return items.filter(item => !item.isDeleted)
      },
      getValue (item, index) {
        const values = []
        const ids = item.costCenter ? item.costCenter.split(';') : []
        const names = item.costCenterName ? item.costCenterName.split(';') : []
        ids.forEach((id, idsIndex) => {
          const value = index + ';' + id + ';' + names[idsIndex]
          values.push(value)
        })
        return values
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
      project: {
        type: Object,
        default: null
      },
      activeKey: {
        type: null,
        default: 4
      }
    },
    methods: {
      add (stringNo) {
        const newSrNo = getNo(stringNo, 'srNo', this.data.contractBQlst)
        const data = SwaggerService.getForm('ContractBQDto')
        data.id = 0
        data.isDeleted = false
        data.isTemp = true
        data.contractID = this.id === '0' ? '' : this.id
        data.srNo = newSrNo
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
        this.data.contractBQlst.push(data)
        this.data.contractBQlst.sort((a, b) => {
          return compare(a.srNo, b.srNo)
        })
      },
      del (record) {
        const str = record.srNo
        const items = this.data.contractBQlst.filter(item => item.srNo.indexOf(str) === 0)
        items.forEach((item) => {
          item.isDeleted = true
        })
        this.data.contractBQlst = this.data.contractBQlst.filter(item => !(item.isDeleted && item.isTemp))
        this.$forceUpdate()
      },
      clear () {
        const list = []
        this.data.contractBQlst.forEach(item => {
          item.isDeleted = true
          if (!item.isTemp) {
            list.push(item)
          }
          this.$forceUpdate()
        })
      },
      getContractAmount () {
        let items = JSON.parse(JSON.stringify(this.data.contractBQlst))
        items = items.filter(item => item.isCarryData)
        if (items.length > 0) {
          ContractService.amount(this.data.contract.contractCategory, this.data.contractBQlst).then(res => {
            const data = res.result.data
            this.data.contract.contractAmount = data.contractAmount
            this.data.contract.contractEffectAmount = data.contractEffectAmount
            this.data.contract.contractAmountText = data.contractAmountText
            this.data.contract.contractDSAmount = data.contractDSAmount
            this.data.contract.contractOPTAmount = data.contractOPTAmount
            this.data.contract.contractPCPreAmount = data.contractPCPreAmount
            this.data.contract.contractPSAmount = data.contractPSAmount
          })
        }
      },
      checkCarry (item, isDisabled, index) {
        if (!this.data.contract.contractCategory) {
          this.$emit('validate-field', {
            activeKey: 1,
            component: 'baseInfo',
            filed: 'contractCategory'
          })
        } else {
          let isValid = true
          this.$refs.tableForm.validateField([
            'contractBQlst.' + index + '.costCenter',
            'contractBQlst.' + index + '.itemType'], valid => {
            if (valid) {
              alert(valid)
              isValid = false
            }
          })
          if (isValid) {
            item.isCarryData = !item.isCarryData
            this.getContractAmount()
          }
        }
      },
      centerChange (values) {
        let ids = ''
        let names = ''
        let item
        values.forEach(value => {
          const arr = value.split(';')
          item = this.data.contractBQlst[arr[0]]
          const id = arr[1]
          const name = arr[2]
          if (ids) {
            ids = ids + ';' + id
          } else {
            ids = id
          }
          if (names) {
            names = names + ';' + name
          } else {
            names = name
          }
        })
        item.costCenter = ids
        item.costCenterName = names
      },
      valueChange (item) {
        item.subAmountMaterial = item.quantityMaterial * item.unitPriceMaterial
        item.subAmountWork = item.quantityWork * item.unitPriceWork
        item.subAmountWorkMat = item.quantityWorkMat * item.unitPriceWorkMat
        item.allAmount = item.subAmountMaterial + item.subAmountWork + item.subAmountWorkMat

        if (item.isCarryData) {
          if (typeof item.allAmount === 'number') {
            this.getContractAmount()
          }
        }
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

  /deep/ .has-error .ant-form-explain {
    white-space: nowrap;
  }

  /deep/ .ant-table-tbody > tr > td {
    padding: 0px 16px !important;
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
          text-align: center;

          .ant-input {
            min-width: 60px;
          }

          button {
            margin-right: 10px;
          }

          /deep/ .has-error .ant-form-explain {
            white-space: nowrap;
          }
        }
      }
    }
  }
</style>
