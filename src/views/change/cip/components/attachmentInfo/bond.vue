<template>
  <div>
    <a-col :md="24" :sm="24">
      履约保函：
    </a-col>
    <a-col :md="24" :sm="24">
      <div style="overflow-x: auto">
        <table style="min-width: 100%;width: auto">
          <thead>
            <tr>
              <th colspan="14">
                <a-button :disabled="type === 'view'" icon="plus" @click="add">
                  新增
                </a-button>
                <a-button :disabled="type === 'view'" icon="stop" @click="clear">
                  重置
                </a-button>
                <a-button @click="replaceByContract()" :disabled="type === 'view'" icon="block">
                  按原合同条款
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 5%">操作</th>
              <th style="width: 10%">单位</th>
              <th style="width: 5%">数量</th>
              <th style="width: 5%">单价</th>
              <th style="width: 5%">履约保函金额</th>
              <th style="width: 5%">履约保函金额条款</th>
              <th style="width: 5%">描述</th>
              <th style="width: 5%">履约保函提供状态</th>
              <th style="width: 10%">履约保函提交限期</th>
              <th style="width: 10%">履约保函提交限期条款</th>
              <th style="width: 10%">履约保函届满日期</th>
              <th style="width: 10%">履约保函延长届满日期</th>
              <th style="width: 10%">履约保函届满日期条款</th>
              <th style="width: 10%">延长履约保函提供状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!item.isDeleted" v-for="(item, index) in data.voBondlst" :key="index">
              <td>
                <a-button :disabled="type === 'view'" icon="close" @click="del(item,index)">
                  删除
                </a-button>
              </td>
              <td>
                <a-select
                  placeholder="请选择"
                  v-model="item.bondUnit"
                  :disabled="type === 'view'"
                  v-decorator="['item.bondUnit', { rules: [{required: true, message: '请选择'}] }]">
                  <a-select-option v-for="(item, index) in selection.unitTypes" :key="index" :value="item.id">{{ item.nameCN }}
                  </a-select-option>
                </a-select>
              </td>
              <td>
                <a-input-number v-model="item.bondQty" :min="0" @change="valueChange(item)" :disabled="type === 'view'"></a-input-number>
              </td>
              <td>
                <a-input-number 
                  v-model="item.bondUnitPrice" 
                  @change="valueChange(item)" 
                  :disabled="type === 'view'"
                  :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                  :precision="2"
                  ></a-input-number>
              </td>
              <td>
                <a-input-number 
                  v-model="item.bondAmount" 
                  :disabled="true" 
                  :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                  :precision="2"
                  ></a-input-number>
              </td>
              <td>
                <a-input v-model="item.bondAmountTerms" :disabled="type === 'view'"></a-input>
              </td>
              <td>
                <a-input v-model="item.description" :disabled="type === 'view'"></a-input>
              </td>
              <td>
                <a-select
                  placeholder="请选择"
                  v-model="item.bondStatus"
                  v-decorator="['item.bondStatus', { rules: [{required: true, message: '请选择'}] }]" :disabled="type === 'view'">
                  <a-select-option :value="1">已提交</a-select-option>
                  <a-select-option :value="0">未提交</a-select-option>
                </a-select>
              </td>
              <td>
                <a-input-number v-model="item.bondGracePeriod" :disabled="type === 'view'"></a-input-number>
              </td>
              <td>
                <a-input v-model="item.bondGracePeriodTerms" :disabled="type === 'view'"></a-input>
              </td>
              <td>
                <a-date-picker v-model="item.bondExpirationDate" :disabled="type === 'view'"></a-date-picker>
              </td>
              <td>
                <a-date-picker v-model="item.bondExtendedExpirationDate" :disabled="type === 'view'"></a-date-picker>
              </td>
              <td>
                <a-input v-model="item.bondExpirationDateTerms" :disabled="type === 'view'"></a-input>
              </td>
              <td>
                <a-select
                  placeholder="请选择"
                  v-model="item.bondExtensionStatus"
                  :disabled="type === 'view'"
                  v-decorator="['item.bondExtensionStatus', { rules: [{required: true, message: '请选择'}] }]">
                  <a-select-option :value="1">已审批</a-select-option>
                  <a-select-option :value="0">已拒绝</a-select-option>
                </a-select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </a-col>
  </div>
</template>
<script>
  import { Base as BaseService , removeItem , clearItems} from '@/api/base'
  import { ChangeService } from '@/views/change/change.service'
  export default {
    name: 'AttachmentInfoBond',
    data () {
      return {
        selection: {},
        loading: false
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
      contract : {
        type : Object,
        defalut : null
      }
    },
    created () {
      BaseService.unitTypes().then(res => {
        this.selection.unitTypes = res.result.data
        this.$forceUpdate()
      })
    },
    methods: {
      add () {
        const item = {
          id: 0,
          isDeleted: false,
          itemKey: '',
          void: '',
          description: '',
          bondAmountTerms: '',
          bondUnit: '',
          bondQty: 0.00,
          bondUnitPrice: 0.00,
          bondAmount: 0.00,
          bondStatus: 0,
          bondGracePeriodTerms: '',
          bondGracePeriod: 0,
          bondExpirationDateTerms: '',
          bondExpirationDate: '',
          bondExtendedExpirationDate: '',
          bondExtensionStatus: 0
        }
        this.data.voBondlst.push(item)
      },
      del (item,index) {
        removeItem(index,this.data.voBondlst)
      },
      clear () {
        clearItems(this.data.voBondlst)
      },
      replaceByContract(){
        this.clear()
        ChangeService.bondList(this.contract.contractGuid).then(item => {
          if (item.result.statusCode == 200) {
            const items = item.result.data
            items.forEach(item => {
              const temp = Object.assign({},item)
              temp.id = 0
              temp.isDeleted = false
              temp.isTemp = true
              temp.void = ''
              temp.itemKey = ''
              this.data.voBondlst.push(temp)
            })
          }
        })
      },
      valueChange (item){
        item.bondAmount = item.bondUnitPrice * item.bondQty
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
          input {
            width: 60px;
          }

          .ant-select {
            width: 120px;
          }
          .ant-calendar-picker {
            width: 120px;
          }
        }
          
      }
    }
  }
</style>
