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
            <th style="width: 15%">操作</th>
            <th style="width: 15%">描述</th>
            <th style="width: 15%">提交质量保证书日期条款</th>
            <th style="width: 15%">提交质量保证书日期</th>
            <th style="width: 20%">材料質量保证到期條款</th>
            <th style="width: 20%">质量保证书所担保之年限</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!item.isDeleted" v-for="(item, index) in data.voMaterialQualityGuaranteelst" :key="index">
            <td>
              <a-button :disabled="type === 'view'" icon="close" @click="del(item)">
                删除
              </a-button>
            </td>
            <td>
              <a-input v-model="item.materialName" :disabled="type === 'view'"></a-input>
            </td>
            <td>
              <a-input v-model="item.materialQualityWarrantyTerms" :disabled="type === 'view'"></a-input>
            <!-- todo: 提交质量保证书日期条款 -->
            </td>
            <td>
              <a-date-picker v-model="item.materialQualityGuaranteeSubmissionDate" :disabled="type === 'view'"></a-date-picker>
            </td>
            <td>
              <a-input v-model="item.materialQualityWarrantyExpirationTerms" :disabled="type === 'view'"></a-input>
            </td>
            <td>
              <a-input-number 
                v-model="item.materialQualityGuaranteeExpirationDay" 
                :disabled="type === 'view'"
                :min="0"
                ></a-input-number>
            </td>
          </tr>
        </tbody>
      </table>
    </a-col>
  </div>
</template>
<script>
  import { ChangeService } from '@/views/change/change.service'
  export default {
    name: 'AttachmentInfoMaterialQualityGuarantee',
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
          materialName: '',
          materialQualityWarrantyTerms : '',
          materialQualityGuaranteeSubmissionDate : '',
          materialQualityWarrantyExpirationTerms : '',
          materialQualityGuaranteeExpirationDay : 0
        }
        this.data.voMaterialQualityGuaranteelst.push(item)
      },
      del (item,index) {
        if(item.isTemp){
          this.data.voMaterialQualityGuaranteelst.splice(index,1)
        }else{
          item.isDeleted = true
        }
      },
      clear () {
        this.data.voMaterialQualityGuaranteelst.forEach((item,index) => {
          if(item.isTemp){
            this.data.voMaterialQualityGuaranteelst.splice(index,1)
          }else{
            item.isDeleted = true
          }
        })
      },
      replaceByContract(){
        this.clear()
        ChangeService.materialQualityGuaranteeList(this.contract.contractGuid).then(item => {
          if (item.result.statusCode == 200) {
            const items = item.result.data
            items.forEach(item => {
              const temp = Object.assign({},item)
              temp.id = 0
              temp.contractID = ''
              temp.mqGuaranteeGuid = ''
              temp.isDeleted = false
              temp.isTemp = true
              temp.void = ''
              temp.itemKey = ''
              this.data.voMaterialQualityGuaranteelst.push(temp)
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
