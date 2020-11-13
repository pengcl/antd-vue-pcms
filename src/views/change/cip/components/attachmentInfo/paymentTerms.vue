<template>
  <div>
    <a-col :md="24" :sm="24">
      <a-form-item label="保修金/保固金/保留金条款类型">
        <a-select 
          v-model="data.voMasterInfo.retentionAndTermsType"
          :disabled="type === 'view'"
          >
          <a-select-option v-for="option in selection.retentionTypes" :key="option.id" :value="option.id">{{
            option.nameCN }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-col>
    <a-col :md="24" :sm="24">
      付款条款：
    </a-col>
    <a-col :md="24" :sm="24">
      <table>
        <thead>
          <tr>
            <th colspan="5">
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
            <th style="width: 20%">操作</th>
            <th style="width: 40%">描述</th>
            <th style="width: 40%">百分比</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!item.isDeleted" v-for="(item, index) in data.voPaymentTermslst" :key="index">
            <td>
              <a-button :disabled="type === 'view'" icon="close" @click="del(item,index)">
                删除
              </a-button>
            </td>
            <td>
              <a-input v-model="item.description" :disabled="type === 'view'"></a-input>
            </td>
            <td>
              <a-input-number 
                v-model="item.percentage" 
                :disabled="type === 'view'"
                :min="0"
                :max="100"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"
                ></a-input-number>
            </td>
          </tr>
        </tbody>
      </table>
    </a-col>
  </div>
</template>
<script>
  import { Base as BaseService , removeItem , clearItems} from '@/api/base'
  import { ChangeService } from '@/views/change/change.service'
  export default {
    name: 'AttachmentInfoPaymentTerms',
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
        default : null
      }
    },
    created (){
      BaseService.retentionTypes().then(res => {
        this.selection.retentionTypes = res.result.data
        this.$forceUpdate()
      })

      if(this.data.voPaymentTermslst == null){
        this.data.voPaymentTermslst = []
      }
    },
    methods: {
      add () {
        const item = {
          id: 0,
          isDeleted: false,
          itemKey : '',
          void : '',
          description: '',
          percentage: 0
        }
        this.data.voPaymentTermslst.push(item)
      },
      del (item,index) {
        removeItem(index,this.data.voPaymentTermslst)
      },
      clear () {
        clearItems(this.data.voPaymentTermslst)
      },
      replaceByContract(){
        this.clear()
        ChangeService.paymentTermsList(this.contract.contractGuid).then(item => {
          if (item.result.statusCode == 200) {
            const items = item.result.data
            items.forEach(item => {
              const temp = Object.assign({},item)
              temp.id = 0
              temp.contractID = ''
              temp.paymentTermsGuid = ''
              temp.isDeleted = false
              temp.isTemp = true
              temp.void = ''
              temp.itemKey = ''
              this.data.voPaymentTermslst.push(temp)
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
        }
      }
    }
  }
</style>
