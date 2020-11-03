<template>
  <div>
    <a-col :md="24" :sm="24">
      质量保证：
    </a-col>
    <a-col :md="24" :sm="24">
      <table>
        <thead>
          <tr>
            <th colspan="6">
              <a-button @click="add()" :disabled="type === 'view'" icon="plus">
                新增
              </a-button>
              <a-button @click="clear()" :disabled="type === 'view'" icon="stop">
                重置
              </a-button>
            </th>
          </tr>
          <tr>
            <th style="width: 15%">操作</th>
            <th style="width: 15%">描述</th>
            <th style="width: 15%">提交质量保证书日期条款</th>
            <th style="width: 15%">提交质量保证书日期</th>
            <th style="width: 20%">材料質量保证到期條款</th>
            <th style="width: 20%">质量保证书所担保之年限</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!item.isDeleted" v-for="(item, index) in data.contractMaterialQualityGuaranteelst" :key="index">
            <td>
              <a-button @click="del(index)" :disabled="type === 'view'" icon="close">
                删除
              </a-button>
            </td>
            <td>
              <a-input :disabled="type === 'view'" v-model="item.materialName"></a-input>
            </td>
            <td>
              <a-input :disabled="type === 'view'" v-model="item.materialQualityWarrantyTerms"></a-input>
            </td>
            <td>
              <a-date-picker :disabled="type === 'view'" v-model="item.materialQualityGuaranteeSubmisisonDate"></a-date-picker>
            </td>
            <td>
              <a-input :disabled="type === 'view'" v-model="item.materialQualityWarrantyExpirationTerms"></a-input>
            </td>
            <td>
              <a-input-number :disabled="type === 'view'" v-model="item.materialQualityGuaranteeExpirationDay"></a-input-number>
            </td>
          </tr>
        </tbody>
      </table>
    </a-col>
  </div>
</template>
<script>
  import { SwaggerService } from '@/api/swagger.service'
  import { addItem, clearItems, removeItem } from '@/api/base'

  export default {
    name: 'ContractInfoFluctuationClause',
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
      }
    },
    methods: {
      add () {
        const item = SwaggerService.getForm('ContractMaterialQualityGuaranteeDto')
        item.id = 0
        item.contractID = this.id === '0' ? '' : this.id
        addItem(item, this.data.contractMaterialQualityGuaranteelst)
      },
      del (index) {
        const items = this.data.contractMaterialQualityGuaranteelst
        removeItem(index, items)
      },
      clear () {
        clearItems(this.data.contractMaterialQualityGuaranteelst)
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
