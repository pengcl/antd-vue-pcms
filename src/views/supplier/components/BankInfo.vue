<template>
  <div>
    <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row :gutter="48">
        <a-col :md="24" :sm="24">
          <table>
            <thead>
              <tr>
                <th colspan="4">
                  <a-button :disabled="type === 'view'" @click="add()" icon="plus">
                    添加银行账号
                  </a-button>
                  <!--<a-button :disabled="type === 'view'" @click="clear()" icon="stop">
                    重置
                  </a-button>-->
                </th>
              </tr>
              <tr>
                <th colspan="4">银行账号</th>
              </tr>
              <tr>
                <th style="width: 25%">操作</th>
                <th style="width: 25%">开户银行</th>
                <th style="width: 25%">银行账号</th>
                <th style="width: 25%">银行地址</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!item.isDeleted" v-for="(item, index) in items" :key="index">
                <td>
                  <a-button @click="del(index)" type="danger" icon="delete"></a-button>
                </td>
                <td><a-input v-model="item.bankName "/></td>
                <td><a-input v-model="item.bankAccounts "/></td>
                <td><a-input v-model="item.bankAddr "/></td>
              </tr>
            </tbody>
          </table>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>

import { SwaggerService } from '@/api/swagger.service'
import { addItem, clearItems, removeItem } from '@/api/base'

export default {
  name: 'BankInfo',
  components: { },
  props: {
    vendor: {
      type: Object,
      default: null
    },
    items: {
      type: Array,
      default: null
    },
    type: {
      type: String,
      default: 'view'
    },
    id: {
      type: String,
      default: '0'
    }
  },
  data () {
    return {
      visible: false,
      model: null,
      form: null
    }
  },
  methods: {
    add () {
      const item = SwaggerService.getForm('ChangeVendorEditDto_Bank')
      item.id = 0
      item.gid = '00000000-0000-0000-0000-000000000000'
      addItem(item, this.items)
    },
    del (index) {
      removeItem(index, this.items)
    },
    clear () {
      clearItems(this.items)
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
            white-space: nowrap;
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
