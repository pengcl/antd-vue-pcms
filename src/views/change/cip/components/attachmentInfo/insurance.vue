<template>
  <div>
    <a-col :md="24" :sm="24">
      保险：
    </a-col>
    <a-col :md="24" :sm="24">
      <table>
        <thead>
          <tr>
            <th colspan="8">
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
            <th style="width: 10%">操作</th>
            <th style="width: 10%">保险金额</th>
            <th style="width: 10%">保险类型</th>
            <th style="width: 10%">保险条款</th>
            <th style="width: 10%">保险信函状态</th>
            <th style="width: 10%">保险到期日</th>
            <th style="width: 20%">延长工程综合保险有效日期</th>
            <th style="width: 20%">保险延期状况</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!item.isDeleted" v-for="(item, index) in data.voInsurancelst" :key="index">
            <td>
              <a-button :disabled="type === 'view'" icon="close" @click="del(item,index)">
                删除
              </a-button>
            </td>
            <td>
              <a-input-number 
                v-model="item.insuranceAmount" 
                :disabled="type === 'view'"
                :formatter="value => `${value}元`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
                ></a-input-number>
            </td>
            <td>
              <a-select
                placeholder="请选择"
                v-model="item.insuranceType"
                :disabled="type === 'view'"
                v-decorator="['item.insuranceType', { rules: [{required: true, message: '请选择'}] }]">
                <a-select-option :value="1">承建商工程全险</a-select-option>
                <a-select-option :value="2">第三者保险</a-select-option>
              </a-select>
            </td>
            <!-- todo:保险类别 -->
            <td>
              <a-input v-model="item.insuranceTerms" :disabled="type === 'view'"></a-input>
            </td>
            <td>
              <a-select
                placeholder="请选择"
                v-model="item.insuranceStatus"
                :disabled="type === 'view'"
                v-decorator="['item.insuranceStatus', { rules: [{required: true, message: '请选择'}] }]">
                <a-select-option :value="1">已提交</a-select-option>
                <a-select-option :value="0">未提交</a-select-option>
              </a-select>
            </td>
            <td>
              <a-date-picker :format="dateFormat" v-model="item.insuranceExpirationDate" :disabled="type === 'view'"></a-date-picker>
            </td>
            <td>
              <a-date-picker :format="dateFormat" v-model="item.insuranceExtendedExpirationDate" :disabled="type === 'view'"></a-date-picker>
            </td>
            <td>
              <a-select
                placeholder="请选择"
                v-model="item.insuranceExtensionStatus"
                :disabled="type === 'view'"
                v-decorator="['item.insuranceExtensionStatus', { rules: [{required: true, message: '请选择'}] }]">
                <a-select-option :value="1">已提交</a-select-option>
                <a-select-option :value="0">未提交</a-select-option>
              </a-select>
            </td>
          </tr>
        </tbody>
      </table>
    </a-col>
  </div>
</template>
<script>
  import { Base as BaseService , removeItem , clearItems , dateFormat} from '@/api/base'
  import { ChangeService } from '@/views/change/change.service'
  export default {
    name: 'AttachmentInfoInsurance',
    data () {
      return {
        dateFormat:dateFormat,
        date: null,
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
        default : null
      }
    },
    methods: {
      add () {
        const item = {
          id: 0,
          isDeleted: false,
          itemKey : '',
          void : '',
          insuranceAmount : 0

        }
        this.data.voInsurancelst.push(item)
      },
      del (item,index) {
        removeItem(index,this.data.voInsurancelst)
      },
      clear () {
        clearItems(this.data.voInsurancelst)
      },
      replaceByContract(){
        this.clear()
        ChangeService.insuaranceList(this.contract.contractGuid).then(item => {
          if (item.result.statusCode == 200) {
            const items = item.result.data
            items.forEach(item => {
              const temp = Object.assign({},item)
              temp.id = 0
              temp.contractID = ''
              temp.insuaranceGuid = ''
              temp.isDeleted = false
              temp.isTemp = true
              temp.void = ''
              temp.itemKey = ''
              this.data.voInsurancelst.push(temp)
            })
          }
        })
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
            width: 130px;
          }
        }
      }
    }
  }
</style>
