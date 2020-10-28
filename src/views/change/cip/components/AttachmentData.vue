<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <a-form-item label="保修金/保固金/保留金比率上限">
          <a-input-number></a-input-number>
          %
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-button type="primary" :disabled="type === 'view'" @click="repleaceAll()">全部按原合同条款</a-button>
      </a-col>
      <a-col :md="24" :sm="24">
        保修金/保固金/保留金：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th colspan="3">
              <a-button @click="addRetention()" :disabled="type === 'view'" icon="plus">
                新增
              </a-button>
              <a-button @click="clear('voRetentionlst')" :disabled="type === 'view'" icon="stop">
                重置
              </a-button>
              <a-button @click="replaceRetentionsByContract()" :disabled="type === 'view'" icon="block">
                按原合同条款
              </a-button>
            </th>
          </tr>
          <tr>
            <th style="width: 30%">操作</th>
            <th style="width: 40%">描述</th>
            <th style="width: 40%">保修金/保固金/保留金比率</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="!item.isDeleted" v-for="(item, index) in data.voRetentionlst" :key="index">
            <td>
              <a-button @click="del(item,index,'voRetentionlst')" :disabled="type === 'view'" icon="close">
                删除
              </a-button>
            </td>
            <td>
              <a-input v-model="item.description"></a-input>
            </td>
            <td>
              <a-input-number v-model="item.percentage" :min="0"></a-input-number>
            </td>
          </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        保修金/保固金/保留金返还：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th colspan="4">
              <a-button @click="addRelease()" :disabled="type === 'view'" icon="plus">
                新增
              </a-button>
              <a-button @click="clear('voRetentionReleaselst')" :disabled="type === 'view'" icon="stop">
                重置
              </a-button>
              <a-button  @click="replaceReleasesByContract()":disabled="type === 'view'" icon="block">
                按原合同条款
              </a-button>
            </th>
          </tr>
          <tr>
            <th style="width: 20%">操作</th>
            <th style="width: 20%">描述</th>
            <th style="width: 30%">保修金/保固金/保留金返还条款</th>
            <th style="width: 30%">保修金/保固金/保留金比率</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="!item.isDeleted" v-for="(item,index) in data.voRetentionReleaselst" :key="index">
            <td>
              <a-button @click="del(item,index,'voRetentionReleaselst')" :disabled="type === 'view'" icon="close">
                删除
              </a-button>
            </td>
            <td>
              <a-input :disabled="type === 'view'" v-model="item.description"></a-input>
            </td>
            <td>
              <a-input :disabled="type === 'view'" v-model="item.releaseTerms"></a-input>
            </td>
            <td>
              <a-input-number :disabled="type === 'view'" v-model="item.percentage" :min="0"></a-input-number>
            </td>
          </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        预付款：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th colspan="9">
              <a-button :disabled="type === 'view'" icon="plus">
                新增
              </a-button>
              <a-button :disabled="type === 'view'" icon="stop">
                重置
              </a-button>
              <a-button :disabled="type === 'view'" icon="block">
                按原合同条款
              </a-button>
            </th>
          </tr>
          <tr>
            <th style="width: 10%">操作</th>
            <th style="width: 10%">描述</th>
            <th style="width: 10%">预付款条款</th>
            <th style="width: 10%">预付款回扣条款</th>
            <th style="width: 10%">百分比</th>
            <th style="width: 10%">单位</th>
            <th style="width: 10%">数量</th>
            <th style="width: 10%">单价</th>
            <th style="width: 10%">总金额</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              <a-button :disabled="type === 'view'" icon="close">
                删除
              </a-button>
            </td>
            <td>
              <a-input></a-input>
            </td>
            <td>
              <a-input></a-input>
            </td>
            <td>
              <a-input></a-input>
            </td>
            <td>
              <a-input-number></a-input-number>
            </td>
            <td>
              <a-select
                placeholder="请选择"
                v-decorator="['paymentUser', { rules: [{required: true, message: '请选择'}] }]">
                <a-select-option value="1">包(bag)</a-select-option>
              </a-select>
            </td>
            <td>
              <a-input-number></a-input-number>
            </td>
            <td>
              <a-input-number></a-input-number>
            </td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </a-col>
    </a-row>
  </a-form>


</template>

<script>

	
  import { compare } from '@/utils/util'
  import { Base as BaseService } from '@/api/base'
  import { SwaggerService } from '@/api/swagger.service'
  import { ChangeService } from '@/views/change/change.service'
  import { ContractService } from '@/views/contract/contract.service'
    export default {
        name: 'AttachmentData',
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
	    created () {
	      BaseService.unitTypes().then(res => {
	        this.selection.unitTypes = res.result.data
	        this.$forceUpdate()
	      })
	    },
		methods: {
		  addRetention () {
		    const item = {
		      id: 0,
		      isDeleted: false,
		      isTemp : true,
		      itemKey : '',
		      void : '',
		      description: '',
		      percentage: ''
		    }
		    this.data.voRetentionlst.push(item)
		  },
		  del (item,index,target) {
		  	console.log('item',item,index,target)
		    item.isDeleted = true
		    if(item.isTemp){
		    		this.data[target].splice(index,1)
		    }
		    console.log(this.data[target])
		    this.$forceUpdate()
		  },
		  clear (target) {
		  	const list = []
		    this.data[target].forEach(item => {
		      item.isDeleted = true
		      if(!item.isTemp){
		      	list.push(item)
		      }
		    })
		    this.data[target] = list
		    this.$forceUpdate()
		  },
		  addRelease () {
	        const item = {
	          id: 0,
	          isDeleted: false,
	          isTemp : true,
	          itemKey : '',
		      void : '',
	          description: '',
	          percentage: '',
	          releaseTerms : ''
	        }
	        this.data.voRetentionReleaselst.push(item)
	      },
	      replaceRetentionsByContract(){
	      	this.clear('voRetentionlst')
	      	ChangeService.retentions(this.contract.contractGuid).then(item=>{
	      		if(item.result.statusCode == 200){
	      			const items = item.result.data
	      			items.forEach(retention => {
	      				const temp = {
				          id: 0,
				          isDeleted: false,
				          isTemp : true,
				          itemKey : '',
					      void : '',
				          description: retention.description,
				          percentage: retention.percentage
				        }
				        this.data.voRetentionlst.push(temp)
	      			})
	      		}
	      	})
	      },
	      replaceReleasesByContract(){
	      	this.clear('voRetentionReleaselst')
	      	ChangeService.releases(this.contract.contractGuid).then(item=>{
	      		if(item.result.statusCode == 200){
	      			const items = item.result.data
	      			items.forEach(release => {
	      				const temp = {
				          id: 0,
				          isDeleted: false,
				          isTemp : true,
				          itemKey : '',
					      void : '',
				          description: release.description,
				          percentage: release.percentage,
				          releaseTerms : release.releaseTerms
				        }
				        this.data.voRetentionReleaselst.push(temp)
	      			})
	      		}
	      	})
	      },
	      repleaceAll(){
	      	this.replaceRetentionsByContract()
	      	this.replaceReleasesByContract()
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