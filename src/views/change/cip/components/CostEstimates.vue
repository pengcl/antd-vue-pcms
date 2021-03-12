<template>
  <div>
    <a-form-model ref="form" :model="data" :rules="tableRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row>
        <a-col>
          <div
            style="padding-top:5px; padding-bottom:5px;padding-left:30px;background-color:#f5f5f5;border-bottom:0;border:1px solid #ccc;margin-top: 20px">
            <a-button :disabled="type === 'view'" icon="plus" @click="add()"> 新增 </a-button>
            <a-button @click="clear()" :disabled="type === 'view'" icon="stop"> 重置 </a-button>
            <a-button :disabled="type === 'view'" icon="plus" @click="splitBq"> 分摊工具 </a-button>
            <a-button :disabled="type === 'view'" @click="replaceByContract"> 按原合同条款 </a-button>
          </div>
          <a-table
            ref="table"
            :row-key="record => record._id"
            :columns="columns"
            :data-source="this.data.vobqNewlst"
            :scroll="{  y: '300px' }"
            bordered
            :pagination="false"
            :rowClassName="setRowClassName"
          >
            <span slot="action" slot-scope="text, item, index">
              <template>
                <a-button @click="del(index)" :disabled="type === 'view'" icon="close"> 删除 </a-button>
              </template>
            </span>
            <span slot="costCenter" slot-scope="text, item, index">
              <a-form-model-item
                :prop="'vobqNewlst.' + index + '.costCenter'"
                :rules="[{ required: !item.isDeleted, message: '请选择成本中心'}]"
              >
                <a-select
                  v-model="item.costCenter"
                  style="width: 320px"
                  :disabled="type === 'view'"
                  @change="(value,target) => centerChange(value,target,item)"
                >
                  <a-select-option :value="center.id+''" v-for="center in selection.centers" :text="center.projectShortName+'-'+center.costCenterName" :key="JSON.stringify(center)">
                    {{center.projectShortName}}-{{ center.costCenterName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </span>
            <span slot="itemType" slot-scope="text, item, index">
              <a-form-model-item
                :prop="'vobqNewlst.' + index + '.itemType'"
                :rules="[{ required: !item.isDeleted, message: '请选择清单项类别' }]"
              >
                <a-select placeholder="请选择" v-model="item.itemType" style="width: 200px" :disabled="type === 'view'">
                  <a-select-option v-for="(item, index) in selection.itemTypes" :key="index" :value="item.code"
                    >{{ item.nameCN }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </span>
            <div slot="allAmount" slot-scope="text, item, index">
              <a-form-model-item
                :prop="'vobqNewlst.' + index + '.allAmount'"
                :rules="[{ required: !item.isDeleted, message: '请输入金额' }]"
              >
                <a-input-number
                  :disabled="type === 'view'"
                  v-model="item.allAmount"
                  :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="(value) => value.replace(/\元\s?|(,*)/g, '')"
                  :precision="2"
                  @change="amountChange(item,index)"
                ></a-input-number>
              </a-form-model-item>
            </div>
          </a-table>
        </a-col>
        <a-col style="font-size: 18px;font-weight: bold;text-decoration: underline;margin-top:8px;margin-bottom : -5px;">量清单附件</a-col>
        <a-col :sm="24" :md="24" >
          <attachment-list :data="data" :type="type" :id="id" :stage="stage" bqInfo="BQ"></attachment-list>
        </a-col>
      </a-row>
    </a-form-model>
    <contract-bq-modal ref="bqModal" :contract="contract" :data="data"></contract-bq-modal>
    <split-bq-modal ref="splitBQModal" :contract="contract"></split-bq-modal>
  </div>
</template>

<script>
import ContractBqModal from '@/views/change/cip/components/modal/ContractBQModal'
import { compare } from '@/utils/util'
import { Base as BaseService } from '@/api/base'
import { SwaggerService } from '@/api/swagger.service'
import { ChangeService } from '@/views/change/change.service'
import { ContractService } from '@/views/contract/contract.service'
import AttachmentList from '@/views/change/cip/components/AttachmentList'
import SplitBqModal from '@/views/change/cip/components/modal/SplitBQModal'

const columns = [
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    width: '100px',
  },
  {
    title: '业态成本中心',
    dataIndex: 'costCenter',
    scopedSlots: { customRender: 'costCenter' },
    width: '320px',
  },
  {
    title: '清单项类别',
    dataIndex: 'itemType',
    scopedSlots: { customRender: 'itemType' },
    width: '220px',
  },
  {
    title: '金额',
    dataIndex: 'allAmount',
    scopedSlots: { customRender: 'allAmount' },
    width: '160px',
  }
]


export default {
  name: 'CostEstimates',
  components: { ContractBqModal,AttachmentList , SplitBqModal },
  data() {
    return {
      columns: columns,
      selection: {},
      form: this.$form.createForm(this),
      loading: false,
      maxId : 0,
      tableRules: {
        vobqNewlst: [],
      },
    }
  },
  created() {
    BaseService.itemTypes('vo').then((res) => {
      this.selection.itemTypes = res.result.data
      this.$forceUpdate()
    })
    ChangeService.getCostCenters(this.contract.contractGuid).then((res) => {
      this.selection.centers = res.result.data
      this.$forceUpdate()
    })
  },
  filters: {
    getValue(item) {
      const list = item.costCenter ? item.costCenter.split(';').map(Number) : []
      list.forEach((item,index) =>{
        if(isNaN(item)){
          list.splice(index,1)
        }
      })
      return list
    },
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      default: 'view',
    },
    id: {
      type: String,
      default: '0',
    },
    contract: {
      type: Object,
      default: null,
    },
    project: {
      type: Object,
      default: null,
    },
    stage : {
      type : String,
      default : 'CIP'
    }
  },
  methods: {
    add( item, addData) {
      let data = SwaggerService.getForm('VOBQNewDto')
      if (addData) {
        data = Object.assign({}, addData)
        data.contractBQGuid = ''
        data.contractID = ''
      } else {
        data.allAmount = 0
        data.costCenterName = ''
      }
      data.isTemp = true
      data.id = 0
      data.isDeleted = false
      data.vobqGuid = ''
      data.void = ''
      this.data.vobqNewlst.push(data)
      if(addData){
        this.countAmount()
      }
      this.$forceUpdate()
    },
    del(index) {
      const item = this.data.vobqNewlst[index]
      if(item.isTemp){
        this.data.vobqNewlst.splice(index,1)
      }else{
        item.isDeleted = true
      }
      this.countAmount()
      this.$forceUpdate()
    },
    clear() {
      const list = []
      this.data.vobqNewlst.forEach((item) => {
        item.isDeleted = true
        if (!item.isTemp) {
          list.push(item)
        }
        this.data.vobqNewlst = list
        this.$forceUpdate()
      })
      this.countAmount()
    },
    centerChange(value, target,item) {
      item.costCenterName = target.data.attrs.text
      console.log('target',target)
    },
    amountChange(item, index) {
      let isValid = true
      this.$refs.form.validateField([
        'vobqNewlst.' + index + '.costCenter',
        'vobqNewlst.' + index + '.itemType'], valid => {
        if (valid) {
          isValid = false
        }
      })
      if (isValid) {
        const value = item.allAmount
        setTimeout(() => {
          if (value === item.allAmount) {
            this.countAmount()
          }
        }, 1500)
      }

    },
    countAmount(){
      ChangeService.bqAmount(this.data.vobqNewlst).then((item) => {
        if (item.result.statusCode === 200) {
          this.data.voMasterInfo.voTotalAmountDecrease = item.result.data.voTotalAmountDecrease
          this.data.voMasterInfo.voTotalAmountIncrease = item.result.data.voTotalAmountIncrease
          this.data.voMasterInfo.voAmount = item.result.data.voAmount
        }
        // this.$message.info('计算金额完成')
      })
    },
    replaceByContract() {
      this.$refs.bqModal.showTable()
    },
    setRowClassName(record,index){
      if(record.isDeleted){
        return "delete-row"
      }
      return ""
    },
    splitBq(){
      this.$refs.splitBQModal.showTable()
    }
  },
}
</script>

<style lang="less" scoped>
// .ant-form .ant-form-item .ant-form-item-label.ant-col-8 {
//   width: 15em;
// }

// .ant-form .ant-form-item .ant-form-item-control-wrapper.ant-col-16 {
//   width: calc(100% - 15em);
// }

/deep/ .has-error .ant-form-explain {
  white-space: nowrap;
}

/deep/ .ant-table-tbody > tr > td {
  padding: 8px 10px !important;
  text-align: center;
}

/deep/ .delete-row{
  display : none;
}

button {
  margin-right: 10px;
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

        /deep/ .ant-input {
          min-width: 150px;
        }

        /deep/ .has-error .ant-form-explain {
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
