<template>
  <div>
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
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th colspan="25">
                    <a-button @click="add()" :disabled="type === 'view'" icon="plus">
                      新增
                    </a-button>
                    <a-button @click="clear()" :disabled="type === 'view'" icon="stop">
                      重置
                    </a-button>
                  </th>
                </tr>
                <tr>
                  <th rowspan="2">操作</th>
                  <th rowspan="2">
                    带数项目
                  </th>
                  <th style="width: 60px" rowspan="2">清单编号</th>
                  <th style="width: 60px" rowspan="2">标段</th>
                  <th style="width: 5%" rowspan="2">楼栋</th>
                  <th style="width: 5%" rowspan="2">分部</th>
                  <th style="width: 5%" rowspan="2">分项</th>
                  <th style="width: 5%" rowspan="2">预留字段0</th>
                  <th style="width: 5%" rowspan="2">预留字段1</th>
                  <th style="width: 5%" rowspan="2">清单描述</th>
                  <th style="width: 5%" rowspan="2">业态成本中心</th>
                  <th style="width: 5%" rowspan="2">清单项类别</th>
                  <th style="width: 15%" colspan="4">供应</th>
                  <th style="width: 15%" colspan="4">安装</th>
                  <th style="width: 15%" colspan="4">供应+安装</th>
                  <th style="width: 5%" rowspan="2">合计</th>
                </tr>
                <tr>
                  <th>单位</th>
                  <th>工程量</th>
                  <th>单价</th>
                  <th>小计</th>
                  <th>单位</th>
                  <th>工程量</th>
                  <th>单价</th>
                  <th>小计</th>
                  <th>单位</th>
                  <th>工程量</th>
                  <th>单价</th>
                  <th>小计</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!item.isDeleted" v-for="(item,index) in data.contractBQlst" :key="index">
                  <td>
                    <div style="width: 220px;">
                      <a-button @click="add(item.srNo)" :disabled="type === 'view'" icon="plus">
                        添加子项
                      </a-button>
                      <a-button @click="del(index)" :disabled="type === 'view'" icon="close">
                        删除
                      </a-button>
                    </div>
                  </td>
                  <td>
                    <a-icon
                      :disabled="type === 'view'"
                      @click="checkCarry(item,type === 'view',index)"
                      :type="item.isCarryData ? 'check-square' : 'border'"/>
                  </td>
                  <td>
                    <a-input style="width:100px" :disabled="true" :value="item.srNo"></a-input>
                  </td>
                  <td>
                    <a-input :disabled="type === 'view'" v-model="item.section"></a-input>
                  </td>
                  <td>
                    <a-input :disabled="type === 'view'" v-model="item.building"></a-input>
                  </td>
                  <td></td>
                  <td></td>
                  <td>
                    <a-input :disabled="type === 'view'" v-model="item.remark1"></a-input>
                  </td>
                  <td>
                    <a-input :disabled="type === 'view'" v-model="item.remark2"></a-input>
                  </td>
                  <td>
                    <a-input :disabled="type === 'view'" v-model="item.description"></a-input>
                  </td>
                  <td>
                    <a-form-model-item
                      :prop="'contractBQlst.' + index + '.costCenter'"
                      :rules="[{required: !item.isDeleted, message: '请选择成本中心' }]"
                    >
                      <a-input :hidden="true" v-model="item.costCenter"/>
                      <a-select
                        :disabled="type === 'view'"
                        :default-value="item | getValue(index)"
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
                  </td>
                  <td>
                    <a-form-model-item
                      :prop="'contractBQlst.' + index + '.itemType'"
                      :rules="[{required: !item.isDeleted, message: '请选择清单项类别' }]"
                    >
                      <a-select
                        :disabled="type === 'view'"
                        placeholder="请选择"
                        style="margin-top: 15px"
                        v-model="item.itemType"
                        v-decorator="['item.itemType', { rules: [{required: true, message: '请选择'}] }]">
                        <a-select-option v-for="(item, index) in selection.itemTypes" :key="index" :value="item.code">
                          {{ item.nameCN }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </td>
                  <td>
                    <a-select
                      :disabled="type === 'view'"
                      placeholder="请选择"
                      v-model="item.unitMaterial"
                      v-decorator="['item.unitMaterial', { rules: [{required: true, message: '请选择'}] }]">
                      <a-select-option v-for="(item, index) in selection.unitTypes" :key="index" :value="item.nameCN">
                        {{ item.nameCN }}
                      </a-select-option>
                    </a-select>
                  </td>
                  <td>
                    <a-input
                      :disabled="type === 'view'"
                      @change="valueChange(item)"
                      v-model="item.quantityMaterial"></a-input>
                  </td>
                  <td>
                    <a-input-number
                      :disabled="type === 'view'"
                      @change="valueChange(item)"
                      v-model="item.unitPriceMaterial"
                      :min="0"
                      :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                      :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                      :precision="2"></a-input-number>
                  </td>
                  <td>
                    <a-input-number
                      :disabled="true"
                      v-model="item.subAmountMaterial"
                      :min="0"
                      :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                      :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                      :precision="2"></a-input-number>
                  </td>
                  <td>
                    <a-select
                      :disabled="type === 'view'"
                      placeholder="请选择"
                      v-model="item.unitWork"
                      v-decorator="['item.unitWork', { rules: [{required: true, message: '请选择'}] }]">
                      <a-select-option v-for="(item, index) in selection.unitTypes" :key="index" :value="item.nameCN">
                        {{ item.nameCN }}
                      </a-select-option>
                    </a-select>
                  </td>
                  <td>
                    <a-input-number
                      :disabled="type === 'view'"
                      @change="valueChange(item)"
                      v-model="item.quantityWork"></a-input-number>
                  </td>
                  <td>
                    <a-input-number
                      :disabled="type === 'view'"
                      @change="valueChange(item)"
                      v-model="item.unitPriceWork"
                      :min="0"
                      :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                      :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                      :precision="2"></a-input-number>
                  </td>
                  <td>
                    <a-input-number
                      :disabled="true"
                      v-model="item.subAmountWork"
                      :min="0"
                      :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                      :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                      :precision="2"></a-input-number>
                  </td>
                  <td>
                    <a-select
                      :disabled="type === 'view'"
                      placeholder="请选择"
                      v-model="item.unitWorkMat"
                      v-decorator="['item.unitWorkMat', { rules: [{required: true, message: '请选择'}] }]">
                      <a-select-option v-for="(item, index) in selection.unitTypes" :key="index" :value="item.nameCN">
                        {{ item.nameCN }}
                      </a-select-option>
                    </a-select>
                  </td>
                  <td>
                    <a-input-number
                      :disabled="type === 'view'"
                      @change="valueChange(item)"
                      v-model="item.quantityWorkMat"></a-input-number>
                  </td>
                  <td>
                    <a-input-number
                      :disabled="type === 'view'"
                      @change="valueChange(item)"
                      v-model="item.unitPriceWorkMat"
                      :min="0"
                      :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                      :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                      :precision="2"></a-input-number>
                  </td>
                  <td>
                    <a-input-number
                      :disabled="true"
                      v-model="item.subAmountWorkMat"
                      :min="0"
                      :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                      :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                      :precision="2"></a-input-number>
                  </td>
                  <td>
                    <a-input-number
                      :disabled="true"
                      v-model="item.allAmount"
                      :min="0"
                      :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                      :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                      :precision="2"></a-input-number>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
      },
      del (index) {
        const str = this.data.contractBQlst[index].srNo
        const items = this.data.contractBQlst.filter(item => item.srNo.indexOf(str) === 0)
        items.forEach(item => {
          if (item.isTemp) {
            this.data.contractBQlst.splice(index, 1)
          } else {
            item.isDeleted = true
          }
        })
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
        this.$refs.tableForm.validate(valid => {
          if (valid) {
            if (typeof item.allAmount === 'number' && !isDisabled) {
              if (this.data.contract.contractCategory) {
                item.isCarryData = !item.isCarryData
                this.getContractAmount()
              } else {
                this.$emit('validate-field', {
                  activeKey: 1,
                  component: 'baseInfo',
                  filed: 'contractCategory'
                })
              }
            }
          }
        })
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
