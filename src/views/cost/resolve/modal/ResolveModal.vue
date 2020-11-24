<template>
  <a-modal
    :visible="visible"
    :width="1100"
    title="新增预算分解"
    @cancel="handleCancel"
    @ok="handleOk"
    :ok-button-props="{ props: { disabled: defaultSave } }"
  >
    <a-card :bordered="false">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }">
        <a-col :md="24" :sm="24">
          <table>
            <thead>
            <tr>
              <th :colspan="columnLength">
                <a-button @click="addResolve()" icon="plus" type="success">
                  新增
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 15%">操作</th>
              <th style="width: 20%">科目</th>
              <th style="width: 20%">行业类型</th>
              <th v-for="(costCenterItem,index) in costCenters" :key="index">
                {{costCenterItem.costCenterName}}
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td></td>
              <td>{{this.elementInfoNameCN}}</td>
              <td></td>
              <td v-for="(costCenterItem,index) in costCenters" :key="index">
                {{costCenterItem.amount|NumberFormat}}
              </td>
            </tr>
            <tr v-for="(item,index) in form.costCenterItems" :key="index">
              <td>
                <a-button @click="del(index)" icon="delete" type="danger"></a-button>
              </td>
              <td>

              </td>
              <td>
                <a-form-model-item
                  class="simple"
                  style="margin-top: 20px"
                  :prop="'costCenterItems.' + index + '.tradeTypeId'"
                  :rules="[{required: true, message: '请选择行业类型', trigger: 'change' }]"
                >
                  <a-select
                    placeholder="请选择"
                    v-model="form.costCenterItems[index].tradeTypeId"
                  >
                    <a-select-option
                      v-for="option in elementTradeTypes"
                      :key="option.id"
                      :value="option.id"
                    >
                      {{ option.nameCN }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </td>
              <td v-for="(costCenterItem,aIndex) in form.costCenterItems[index].centers" :key="aIndex">
                <a-form-model-item
                  class="simple"
                  style="margin-top: 20px"
                  :prop="'costCenterItems.' + index +'.centers.' + aIndex +'.amount'"
                  :rules="[
                    {validator: (rule,value,callback) => {checkTo(rule,value,callback,form.costCenterItems[index],form.costCenterItems[index].centers[aIndex].disabled)},  type : 'number', trigger: 'change',required : true },
                    {validator: (rule,value,callback) => {checkMaxTo(rule,value,callback,form.costCenterItems[index].centers[aIndex].costCenterId,form.costCenterItems[index].centers[aIndex].disabled)},  type : 'number', trigger: 'change'}
                   ]"
                >
                  <a-input-number
                    :disabled="form.costCenterItems[index].centers[aIndex].disabled"
                    v-model="form.costCenterItems[index].centers[aIndex].amount"
                    :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                  >
                  </a-input-number>
                </a-form-model-item>
              </td>
            </tr>
            </tbody>
          </table>
        </a-col>
      </a-form-model>
    </a-card>
  </a-modal>
</template>

<script>
  import {STable, Ellipsis} from '@/components'
  import {SwaggerService} from "@/api/swagger.service";
  import {addItem, removeItem} from "@/api/base";
  import {CostService} from "@/views/cost/cost.service";

  export default {
    name: 'CostIndustryModal',
    components: {
      STable,
      Ellipsis
    },
    watch: {
      // 去掉表单验证信息二次打开残留
      visible(val, newVal) {    //监听的是控制模态框显示或影藏开关的布尔值
        // 监视dialog状态（打开、关闭）
        if (val) {
          try {
            this.$refs['form'].resetFields() // 重置编辑表单
            // addForm 为ref指向的表单
          } catch (e) {
          }
        }
      }
    },
    data() {
      return {
        defaultSave: true,
        visible: false,
        elementInfoNameCN: '',
        resolveItem: {},
        columnLength: 3,
        elementTradeTypes: [],
        costCenterItems: [],
        costCenters: [],
        record: {},
        type: '',
        form: SwaggerService.getForm('TradeBudgetItemProjectCreateInputDto'),
        rules: {
          costCenterItems: []
        },
        loadData: parameter => {
          this.form.projectGUID = this.resolveItem.ProjectGUID
          this.form.elementInfoId = this.resolveItem.elementInfoId
          this.columnLength = this.columnLength + this.resolveItem.costCenters.length
          this.addResolve()
          this.$forceUpdate()
        }
      }
    },
    filters: {
    },
    props: {
      refreshParent: {
        type: Function
      }
    },
    created() {

    },
    computed: {},
    methods: {
      // 搜索
      show(record) {
        this.record = record
        this.form.costCenterItems = []
        this.visible = true
        this.resolveItem = record
        this.elementTradeTypes = record.elementTradeTypes
        const centers = []
        let isCanSave = true
        record.costCenters.forEach(item => {
          const obj = {}
          obj.costCenterId = item.costCenterId
          const costName = 'cost' + item.costCenterId
          const amount = record.gt[costName]
          if (amount && amount !== 0) {
            isCanSave = false
          }
          obj.amount = amount
          obj.costCenterName = item.costCenterName
          centers.push(obj)
        })
        this.defaultSave = isCanSave
        this.costCenters = centers
        this.elementInfoNameCN = record.elementInfoNameCN
        this.loadData()
        this.$forceUpdate()
      },
      handleCancel() {
        this.visible = false
      },
      handleOk() {
        console.log(this.form)
        this.$refs.form.validate(valid => {
          if (valid) {
            const result = []
            const resultForm = Object.assign({}, this.form)
            const costCenterItems = Object.assign([], this.form.costCenterItems)
            if (costCenterItems) {
              costCenterItems.forEach(item => {
                item.centers.forEach(centerItem => {
                  if (centerItem.amount && centerItem.amount !== 0) {
                    const obj = {}
                    obj.tradeTypeId = item.tradeTypeId
                    obj.costCenterId = centerItem.costCenterId
                    obj.amount = centerItem.amount
                    result.push(obj)
                  }
                })
              })
            }
            resultForm.costCenterItems = result
            CostService.bidBudgetCreate(resultForm).then(res => {
              if (res.result.statusCode === 200) {
                const that = this
                this.$message.info(this.type === 'edit' ? '修改成功' : '新增成功').then(() => {
                  that.refreshParent()
                  this.visible = false
                })
              }
            })
          }
        })
      },
      addResolve() {
        const centers = []
        this.costCenters.forEach(item => {
          const obj = {}
          const costName = 'cost' + item.costCenterId
          if (this.record[costName]) {
            obj.disabled = false
          } else {
            obj.disabled = true
          }
          obj.costCenterId = item.costCenterId
          obj.amount = 0
          centers.push(obj)
        })
        const item = {
          tradeTypeId: '',
          centers: centers
        }
        addItem(item, this.form.costCenterItems)
      },
      del(index) {
        const items = this.form.costCenterItems
        removeItem(index, items)
      },
      checkTo(rule, value, callback, item, isDisabled) {
        //判断是否校验金额
        if (!isDisabled) {
          let isCheck = true
          //循环判断是否当前行存在不为0的，如果有，那么其他不再验证
          if (item.centers) {
            item.centers.forEach(temp => {
              if (!temp.disabled && temp.amount > 0) {
                isCheck = false
              }
            })
          }
          if (isCheck) {
            callback(new Error('请输入金额'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      checkMaxTo(rule, value, callback, costCenterId, isDisabled) {
        // 判断是否校验金额
        if (!isDisabled) {
          let isCheck = false
          // 循环判断列总额不超过最大额度
          if (this.form.costCenterItems) {
            const lineNum = this.form.costCenterItems.length
            const result = []
            for (var i in this.costCenters) {
              const obj = {
                defaultAmount: this.costCenters[i].amount,
                costCenterId: this.costCenters[i].costCenterId
              }
              let amount = 0
              for (var j = 0; j < lineNum; j++) {
                amount = amount + this.form.costCenterItems[j].centers[i].amount
              }
              obj.amount = amount
              result.push(obj)
            }
            if (result.length > 0) {
              result.forEach(item => {
                if (item.costCenterId === costCenterId) {
                  if (item.amount > item.defaultAmount) {
                    isCheck = true
                  }
                }
              })
            }
          }
          if (isCheck) {
            callback(new Error('超出限额'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
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

  .ant-btn-group {
    margin-right: 8px;
  }

  .simple {
    /deep/ .ant-form-item-control-wrapper.ant-col-16 {
      width: 100% !important;
    }
  }
</style>