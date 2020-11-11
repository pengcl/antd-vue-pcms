<template>
  <a-modal
    :visible="visible"
    :width="1100"
    title="新增预算分解"
    @cancel="handleCancel"
    @ok="handleOk"
  >
      <a-card :bordered="false">
        <a-form :form="form">
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
                <tr v-for="(item,index) in resolveItems" :key="index">
                  <td>
                    <a-button @click="del(index)" icon="delete" type="danger"></a-button>
                  </td>
                  <td>
                    {{item.BudgetTitle}}
                  </td>
                  <td>
                    <a-select
                      placeholder="请选择"
                      v-model="item.tradeTypeId"
                      @change="onChange"
                    >
                    <a-select-option v-for="option in elementTradeTypes" :key="index + '#&' + JSON.stringify(option)" :value="option.id">
                      {{ option.nameCN }}
                    </a-select-option>
                    </a-select>
                  </td>
                  <td v-for="(costCenterItem,index) in item.costCenterItems" :key="index">
                    <a-input-number
                      v-model="item.costCenterItems[index].amount"
                      :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                      :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                    >
                    </a-input-number>
                  </td>
                </tr>
              </tbody>
            </table>
          </a-col>
        </a-form>
      </a-card>
  </a-modal>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  import {SwaggerService} from "@/api/swagger.service";
  import {addItem, removeItem} from "@/api/base";
  import {CostService} from "@/views/cost/cost.service";

  export default {
    name: 'CostIndustryModal',
    components: {
      STable,
      Ellipsis
    },
    data () {
      return {
        visible: false,
        ProjectGUID:'',
        resolveItem: {},
        resolveItems: [],
        columnLength:3,
        elementTradeTypes:[],
        costCenterItems:[],
        costCenters:[],
        type:'',
        form: SwaggerService.getForm('TradeBudgetItemProjectCreateInputDto'),
        loadData: parameter => {
          this.form.projectGUID = this.resolveItem.ProjectGUID
          this.form.elementInfoId = this.resolveItem.elementInfoId
          this.columnLength = this.columnLength + this.resolveItem.costCenters.length
          this.addResolve()
          this.$forceUpdate()
        }
      }
    },
    created () {

    },
    computed: {
    },
    methods: {
      // 搜索
      show(record) {
        this.resolveItems = []
        this.visible = true
        this.resolveItem = record
        this.ProjectGUID = record.ProjectGUID
        this.elementTradeTypes = record.elementTradeTypes
        this.costCenters = record.costCenters
        this.loadData()
        this.$forceUpdate()
      },
      handleCancel(){
        this.visible = false
      },
      handleOk(){
        this.form.costCenterItems = []
        this.resolveItems.forEach(item =>{
          item.costCenterItems.forEach(center =>{
            this.form.costCenterItems.push(center)
          })
        })
        CostService.bidCreate(this.form).then(res => {
          if (res.result.statusCode === 200) {
            this.$message.info(this.type === 'edit' ? '修改成功' : '新增成功')
          }
          this.visible = false
        })
      },
      addResolve() {
        const centers =[]
        this.costCenters.forEach(item =>{
          const obj = {}
          obj.costCenterId = item.costCenterId
          obj.amount = 0
          centers.push(obj)
        })
        const item = {
          _id: new Date().getTime(),
          resolveItemID: this.id === '0' ? '' : this.id,
          id: '',
          BudgetTitle: this.resolveItem.BudgetTitle,
          tradeTypeId: '',
          costCenterItems: centers
        }
        addItem(item, this.resolveItems)
      },
      del (index) {
        const items = this.resolveItems
        removeItem(index, items)
      },
      onChange (value, option) {
        const optionValue = option.data.key
        const index = optionValue.split('#&')[0]
        this.resolveItems[index].costCenterItems.forEach(item =>{
          item.tradeTypeId = value
        })
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
        &:first-child{
          th{
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
</style>