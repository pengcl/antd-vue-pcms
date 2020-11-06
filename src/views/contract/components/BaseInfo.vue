<template>
  <a-form-model
    ref="form"
    :model="data.contract"
    :rules="rules"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="12" :sm="24">
        <a-form-model-item
          required
          label="项目名称(中文)"
        >
          <a-input
            :disabled="true"
            placeholder="请选择项目名称(中文)"
            v-model="project.projectName"/>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="招投标分判包编号"
          prop="tenderPackageItemID"
        >
          <a-input
            :disabled="type === 'view'"
            placeholder="请选择招投标分判包"
            v-model="data.contract.tenderPackageItemID"/>
          <span></span>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="合同类型"
          prop="contractCategory"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择合同类型"
            v-model="data.contract.contractCategory">
            <a-select-option
              v-for="type in selection.types"
              :value="type.id"
              :key="type.id">{{ type.nameCN }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="密级"
          prop="secretLevelID"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择密级"
            v-model="data.contract.secretLevelID">
            <a-select-option
              v-for="item in selection.secrets"
              :key="item.id"
              :value="item.id">{{ item.nameCN }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="选择原合同"
          prop="masterContractID"
        >
          <a-input v-model="data.contract.masterContractID" :disabled="!data.contract.contractCategory || data.contract.contractCategory === 15 || type === 'view'" :hidden="true"/>
          <a-input
            :disabled="!data.contract.contractCategory || data.contract.contractCategory === 15 || type === 'view'"
            :value="data.master.contractName"
            @click="showSelect('master')"
            placeholder="请选择原合同"
            suffix="选择原合同"
            :read-only="true"/>
          <!--<a-select @click="showSelect('master')" :readonly="true">
            <a-select-option value="jack">
              Jack
            </a-select-option>
          </a-select>-->
          <!--<a-auto-complete
            :disabled="!data.contract.contractCategory || data.contract.contractCategory === 15 || type === 'view'"
            class="certain-category-search"
            dropdown-class-name="certain-category-search-dropdown"
            :dropdown-match-select-width="false"
            :dropdown-style="{ width: '300px' }"
            size="large"
            style="width: 100%"
            placeholder="请选择原合同"
            option-label-prop="label"
            :filter-option="filterMaster"
            v-model="data.contract.masterContractID"
            @select="select"
          >
            <template slot="dataSource">
              <a-select-option v-for="item in selection.masters" :label="item.contractNo" :key="JSON.stringify(item)" :value="item.contractGuid">
                <span>{{ item.contractNo }}</span>
                <p class="certain-search-item-count">合同编号：{{ item.contractNo }}</p>
              </a-select-option>
            </template>
            <a-input>
              <a-icon slot="suffix" type="search" class="certain-category-icon"/>
            </a-input>
          </a-auto-complete>-->
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="本地合同编号"
        >
          <a-input
            :disabled="type === 'view'"
            placeholder="请填写本地合同编号"
            v-model="data.contract.localContractNo"/>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="合同名称"
          prop="contractName"
        >
          <a-input
            :disabled="type === 'view'"
            placeholder="请填写合同名称"
            v-model="data.contract.contractName"/>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-model-item
          label="成本预算分类"
          prop="contractType"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择成本预算分类"
            v-model="data.contract.contractType">
            <a-select-option :value="1">工程</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :md="24" :sm="24">
        合同甲方：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="3">
                <a-button @click="addParty(18)" :disabled="filterParties(18).length >= 1" icon="plus">
                  新增
                </a-button>
                <a-button @click="clear(18)" :disabled="true" icon="stop">
                  重置
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 30%">操作</th>
              <th style="width: 40%">公司名</th>
              <th style="width: 40%">百分比</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!item.isDeleted" v-for="(item,index) in filterParties(18)" :key="index">
              <td>
              <!--<a-button @click="del(index)" :disabled="type === 'view'" icon="close">
                删除
              </a-button>-->
              </td>
              <td>
                <a-select
                  :disabled="true"
                  placeholder="请选择"
                  v-model="item.partyID"
                  v-decorator="['item.partyID', { rules: [{required: true, message: '请选择合同甲方'}] }]">
                  <a-select-option v-for="option in selection.companies" :key="option.id" :value="option.id">{{
                    option.nameCN
                  }}
                  </a-select-option>
                </a-select>
              </td>
              <td>
                <a-input-number
                  placeholder="请填写"
                  v-model="item.percentage"
                  :disabled="type === 'view'"
                  :min="0"
                  :max="100"
                  :formatter="value => `${value}%`"
                  :parser="value => value.replace('%', '')"></a-input-number>
              </td>
            </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        合同乙方：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="2">
                <a-button @click="addParty(19)" :disabled="type === 'view' || filterParties(19).length >= 1" icon="plus">
                  新增
                </a-button>
              <!--<a-button @click="clear(19)" :disabled="type === 'view'" icon="stop">
                重置
              </a-button>-->
              </th>
            </tr>
            <tr>
              <th style="width: 40%">操作</th>
              <th style="width: 60%">公司名</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!item.isDeleted" v-for="item in filterParties(19)" :key="item.id">
              <td>
                <a-button
                  @click="del(item.partyID || item._id)"
                  :disabled="type === 'view'"
                  icon="close">
                  删除
                </a-button>
              </td>
              <td>
                <a-select
                  :disabled="type === 'view'"
                  placeholder="请选择"
                  v-model="item.partyID"
                  @change="partyChange">
                  <a-select-option v-for="option in selection.vendors" :key="JSON.stringify(option)" :value="option.id">
                    {{ option.vendorName }}
                  </a-select-option>
                </a-select>
              </td>
            </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        合同其它方：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="2">
                <a-button @click="addParty(20)" :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
              <!--<a-button @click="clear(20)" :disabled="type === 'view'" icon="stop">
                重置
              </a-button>-->
              </th>
            </tr>
            <tr>
              <th style="width: 40%">操作</th>
              <th style="width: 60%">公司名</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!item.isDeleted" v-for="(item,index) in filterParties(20)" :key="index">
              <td>
                <a-button
                  @click="del(item.partyID || item._id)"
                  :disabled="type === 'view'"
                  icon="close">
                  删除
                </a-button>
              </td>
              <td>
                <a-select
                  :disabled="type === 'view'"
                  placeholder="请选择"
                  v-model="item.partyID"
                  @change="partyChange"
                  v-decorator="['item.partyID', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                  <a-select-option v-for="option in selection.vendors" :key="JSON.stringify(option)" :value="option.id">
                    {{ option.vendorName }}
                  </a-select-option>
                </a-select>
              </td>
            </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-model-item
          label="合同主要内容"
          prop="contractDetails"
        >
          <a-textarea
            :disabled="type === 'view'"
            rows="4"
            placeholder="请输入合同主要内容"
            v-model="data.contract.contractDetails"
            v-decorator="[
              data.contract.contractDetails,
              {rules: [{ required: false, message: '请输入合同主要内容' }]}
            ]"/>
        </a-form-model-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-model-item
          label="备注"
          prop="remarks"
        >
          <a-textarea
            :disabled="type === 'view'"
            rows="4"
            placeholder="请输入备注"
            v-model="data.contract.remarks"
            v-decorator="[
              data.contract.remarks,
              {rules: [{ required: false, message: '请输入备注' }]}
            ]"/>
        </a-form-model-item>
      </a-col>
    </a-row>
    <select-master-contract
      ref="masterContract"
      :visible="show.masterShow"
      :data="data"
      @cancel="handleCancel('master')"
      @ok="handleOk('master')"></select-master-contract>
  </a-form-model>
</template>

<script>
  import { ContractService } from '@/views/contract/contract.service'
  import { Base as BaseService } from '@/api/base'
  import SelectMasterContract from '@/components/selectMasterContract/index'

  export default {
    name: 'BaseInfo',
    components: { SelectMasterContract },
    data () {
      return {
        selection: {},
        loading: false,
        show: { masterShow: false },
        rules: {
          projectName: [
            { required: true, message: '请输入项目名称(中文)', trigger: 'blur' }
          ],
          tenderPackageItemID: [{ required: true, message: '请选择招投标分判包', trigger: 'change' }],
          contractCategory: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
          secretLevelID: [
            { required: true, message: '请选择密级', trigger: 'change' }
          ],
          masterContractID: [{ required: true, message: '请选择原合同', trigger: 'blur' }],
          contractType: [{ required: true, message: '请选择成本预算分类', trigger: 'blur' }],
          contractName: [{ required: true, message: '请填写合同名称', trigger: 'blur' }],
          contractDetails: [{ required: false, message: '', trigger: 'blur' }, {
            max: 4000,
            message: '请不要超过4000个字符',
            trigger: 'blur'
          }],
          remarks: [{ required: false, message: '', trigger: 'blur' }, {
            max: 4000,
            message: '请不要超过4000个字符',
            trigger: 'blur'
          }]
        }
      }
    },
    created () {
      ContractService.types().then(res => {
        this.selection.types = res.result.data
        this.$forceUpdate()
      })
      BaseService.secretTypes().then(res => {
        this.selection.secrets = res.result.data
        this.$forceUpdate()
      })
      ContractService.vendors().then(res => {
        this.selection.vendors = res.result.data
        this.$forceUpdate()
      })
      if (this.data.contract.contractCategory) {
        this.getMasters(this.data.contract.contractCategory)
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
      project: {
        type: Object,
        default: null
      },
      roles: {
        type: Object,
        default: null
      },
      companies: {
        type: Array,
        default: null
      }
    },
    watch: {
      'data.contract.contractCategory' (val) {
        this.getMasters(val)
      },
      'companies' (val) {
        this.selection.companies = val
        this.$forceUpdate()
      }
    },
    methods: {
      getMasters (val) {
        this.selection.masters = []
        if (val) {
          if (val === 15) {
            this.rules.masterContractID = [{ required: false, message: '请选择原合同', trigger: 'blur' }]
            this.$forceUpdate()
          }
          ContractService.masters({ ProjectId: this.data.contract.projectID, ContractCategory: val }).then(res => {
            this.selection.masters = res.result.data
            this.$forceUpdate()
          })
        }
      },
      filterParties (partyType) {
        return ContractService.filterParties(partyType, this.data.contractPartylst)
      },
      filterMaster (input, option) {
        return (
          option.componentOptions.propsData.label.indexOf(input) >= 0
        )
      },
      select (value, item) {
        this.data.master = JSON.parse(item.data.key)
      },
      partyChange (value, option) {
        option = JSON.parse(option.data.key)
        this.data.contractPartylst.forEach(item => {
          if (value === item.partyGuid) {
            item.partyID = option.id
            item.partyName = option.vendorName
          }
        })
        // item.partyID = ''
      },
      addParty (partyType) {
        const party = {
          _id: new Date().getTime(),
          contractID: this.id === '0' ? '' : this.id,
          id: 0,
          partyID: 0,
          partyName: '',
          partyGuid: '',
          partyType: partyType,
          percentage: 0,
          isTemp: true,
          isDeleted: false
        }
        this.data.contractPartylst.push(party)
      },
      clear (partyType) {
        this.data.contractPartylst.forEach((item, index) => {
          if (item.partyType === partyType) {
            if (item.isTemp) {
              this.data.contractPartylst.splice(index, 1)
            } else {
              item.isDeleted = true
            }
          }
        })
      },
      del (id) {
        this.data.contractPartylst.forEach((item, i) => {
          const _id = item.partyID || item._id
          if (_id === id) {
            if (item.isTemp) {
              this.data.contractPartylst.splice(i, 1)
            } else {
              item.isDeleted = true
            }
          }
          this.$forceUpdate()
        })
      },
      showSelect (target) {
        console.log(target)
        this.show[target + 'Show'] = true
      },
      handleOk (target) {
        this.show[target + 'Show'] = false
        this.data.master = this.$refs.masterContract.selected
        this.data.contract.masterContractID = this.data.master.contractGuid
      },
      handleCancel (target) {
        this.show[target + 'Show'] = false
        this.data.master = this.$refs.masterContract.selected
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
</style>
