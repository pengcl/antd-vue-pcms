<template>
  <div>
    <a-col :md="24" :sm="24">
      调差补偿：
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
            <th style="width: 20%">描述</th>
            <th style="width: 20%">调差上下限额条款</th>
            <th style="width: 20%">调差上下限额</th>
            <th style="width: 20%">调差时间節點</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!item.isDeleted" v-for="(item, index) in data.voFlucationClauselst" :key="index">
            <td>
              <a-button :disabled="type === 'view'" icon="close" @click="del(item,index)">
                删除
              </a-button>
            </td>
            <td>
              <a-input v-model="item.fluctuationName" :disabled="type === 'view'"></a-input>
            </td>
            <td>
              <a-input v-model="item.adjustableRangeTerm" :disabled="type === 'view'"></a-input>
            </td>
            <td>
              <a-input-number 
                v-model="item.adjustableRange" 
                :disabled="type === 'view'"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                :precision="2"
                ></a-input-number>
            </td>
            <td>
              <a-input-number v-model="item.adjustmentInterval" :prcision="0" :disabled="type === 'view'"></a-input-number>
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
    name: 'AttachmentInfoFluctuationClause',
    data () {
      return {
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
        defalut : null
      }
    },
    methods: {
      add () {
        const item = {
          id: 0,
          isDeleted: false,
          itemKey : '',
          void : '',
          fluctuationName : '',
          adjustableRangeTerm : '',
          adjustableRange : 0,
          adjustmentInterval : 0
        }
        this.data.voFlucationClauselst.push(item)
      },
      del (item,index) {
        removeItem(index,this.data.voFlucationClauselst)
      },
      clear () {
        clearItems(this.data.voFlucationClauselst)
      },
      replaceByContract(){
        this.clear()
        ChangeService.fluctuationClauseList(this.contract.contractGuid).then(item => {
          if (item.result.statusCode == 200) {
            const items = item.result.data
            items.forEach(item => {
              const temp = Object.assign({},item)
              temp.id = 0
              temp.contractID = ''
              temp.fluctuationClauseGuid = ''
              temp.isDeleted = false
              temp.isTemp = true
              temp.void = ''
              temp.itemKey = ''
              this.data.voFlucationClauselst.push(temp)
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
