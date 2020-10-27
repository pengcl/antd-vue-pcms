<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="12" :sm="24">
        <a-form-item
          label="项目名称(中文)"
        >
          <a-input
            :disabled="true"
            placeholder="请选择项目名称(中文)"
            v-model="project.projectName"
            v-decorator="[data.contract.projectID, { rules: [{required: true, message: '请选择项目名称(中文)'}] }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="招投标分判包编号"
        >
          <a-input
            :disabled="type === 'view'"
            placeholder="请选择地区"
            v-model="data.contract.tenderPackageItemID"
            v-decorator="[data.contract.tenderPackageItemID, { rules: [{required: true, message: '请选择城市'}] }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="合同类型"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择合同类型"
            v-model="data.contract.contractCategory"
            v-decorator="[data.contract.contractCategory, { rules: [{required: true, message: '请选择合同类型'}] }]">
            <a-select-option
              v-for="type in selection.types"
              :value="type.id"
              :key="type.id">{{ type.nameCN }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="密级"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择密级"
            v-model="data.contract.secretLevelID"
            v-decorator="['data.contract.secretLevelID', { rules: [{required: true, message: '请选择密级'}] }]">
            <a-select-option
              v-for="item in selection.secrets"
              :key="item.id"
              :value="item.id">{{ item.nameCN }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="选择原合同"
        >
          <a-auto-complete
            :disabled="!data.contract.contractCategory || data.contract.contractCategory === 15"
            class="certain-category-search"
            dropdown-class-name="certain-category-search-dropdown"
            :dropdown-match-select-width="false"
            :dropdown-style="{ width: '300px' }"
            size="large"
            style="width: 100%"
            placeholder="请选择原合同"
            option-label-prop="value"
            :filter-option="filterMaster"
            @select="select"
          >
            <template slot="dataSource">
              <a-select-option v-for="item in selection.masters" :key="JSON.stringify(item)" :value="item.contractName">
                <span>{{ item.contractName }}</span>
                <p class="certain-search-item-count">合同编号：{{ item.contractNo }}</p>
              </a-select-option>
            </template>
            <a-input>
              <a-icon slot="suffix" type="search" class="certain-category-icon"/>
            </a-input>
          </a-auto-complete>
          <!--<a-select
            :disabled="type === 'view'"
            placeholder="请选择合同类型"
            v-model="data.contract.masterContractID"
            @change="change()"
            v-decorator="[data.contract.masterContractID, { rules: [{required: true, message: '请选择合同类型'}] }]">
            <a-select-option
              v-for="item in selection.masters"
              :value="item.contractGuid"
              :key="item.contractGuid">{{ item.contractName }}
            </a-select-option>
          </a-select>-->
          <!--<a-select
            :disabled="type === 'view'"
            placeholder="请选择原合同"
            v-model="data.orgContractGuid"
            v-decorator="[data.orgContractGuid, { rules: [{required: true, message: '请选择原合同'}] }]">
            <a-select-option
              v-for="item in selection.masters"
              :key="item[data.contract.contractGuid]"
              :value="item[data.contract.contractGuid]">{{ item[data.contract.contractGuid] }}
            </a-select-option>
          </a-select>-->
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="本地合同编号"
        >
          <a-input
            :disabled="type === 'view'"
            placeholder="请填写本地合同编号"
            v-model="data.contract.localContractNo"
            v-decorator="[data.contract.localContractNo, { initialValue: '', rules: [{required: true, message: '请填写本地合同编号'}] }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="合同名称"
        >
          <a-input
            :disabled="type === 'view'"
            placeholder="请填写合同名称"
            v-model="data.contract.contractName"
            v-decorator="[data.contract.contractName, { initialValue: '', rules: [{required: true, message: '请填写合同名称'}] }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="成本预算分类"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择成本预算分类"
            v-model="data.contract.contractType"
            v-decorator="[data.contract.contractType, { rules: [{required: true, message: '请选择成本预算分类'}] }]">
            <a-select-option value="1">工程</a-select-option>
          </a-select>
        </a-form-item>
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
                    option.nameCN }}
                  </a-select-option>
                </a-select>
              </td>
              <td>
                <a-input-number placeholder="请填写" v-model="item.percentage" :disabled="type === 'view'"></a-input-number>
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
                <a-button @click="addParty(19)" :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
                <a-button @click="clear(19)" :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
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
                  @click="del(item.partyID)"
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
                <a-button @click="clear(20)" :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
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
                  @click="del(item.partyID)"
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
        <a-form-item
          label="合同主要内容">
          <a-textarea
            :disabled="type === 'view'"
            rows="4"
            placeholder="请输入合同主要内容"
            v-model="data.contract.contractDetails"
            v-decorator="[
              data.contract.contractDetails,
              {rules: [{ required: false, message: '请输入合同主要内容' }]}
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="备注">
          <a-textarea
            :disabled="type === 'view'"
            rows="4"
            placeholder="请输入备注"
            v-model="data.contract.remarks"
            v-decorator="[
              data.contract.remarks,
              {rules: [{ required: false, message: '请输入备注' }]}
            ]"/>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
  import { ContractService } from '@/views/contract/contract.service'
  import { Base as BaseService } from '@/api/base'
  import { Company as CompanyService } from '@/api/company'

  export default {
    name: 'BaseInfo',
    data () {
      return {
        selection: {},
        loading: false
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
        console.log(res)
        this.selection.vendors = res.result.data
        this.$forceUpdate()
      })
      const companies = this.filterParties(18)
      CompanyService.item(this.project.companyCode).then(res => {
        const company = res.result.data
        this.selection.companies = [company]
        if (companies.length < 1) {
          const party = {
            contractID: this.id,
            id: 0,
            partyID: company.id,
            partyName: company.nameCN,
            partyGuid: '',
            partyType: 18,
            percentage: 0
          }
          this.data.contractPartylst.push(party)
        }
        this.$forceUpdate()
      })
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
      }
    },
    watch: {
      'data.contract.contractCategory' (val) {
        this.selection.masters = []
        ContractService.masters({ ProjectId: this.data.contract.projectID, ContractCategory: val }).then(res => {
          this.selection.masters = res.result.data
          this.$forceUpdate()
        })
      }
    },
    methods: {
      filterParties (partyType) {
        const items = []
        if (this.data.contractPartylst.forEach) {
          this.data.contractPartylst.forEach(item => {
            if (item.partyType === partyType) {
              items.push(item)
            }
          })
        }
        return items
      },
      filterMaster (input, option) {
        console.log(option.componentOptions.propsData)
        return (
          option.componentOptions.propsData.value.indexOf(input.toUpperCase()) >= 0
        )
      },
      select (value, item) {
        this.data.master = JSON.parse(item.data.key)
        this.data.contract.masterContractID = this.data.master.contractGuid
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
          contractID: this.id,
          id: 0,
          partyID: 0,
          partyName: '',
          partyGuid: 0,
          partyType: partyType,
          percentage: 0
        }
        this.data.contractPartylst.push(party)
      },
      clear (partyType) {
        this.data.contractPartylst.forEach(item => {
          if (item.partyType === partyType) {
            item.isDeleted = true
          }
        })
      },
      del (id) {
        this.data.contractPartylst.forEach((item, i) => {
          if (item.partyID === id) {
            console.log(item)
            item.isDeleted = true
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
