<template>
  <a-modal
    :visible="visible"
    :width="900"
    title="请选择合同清单"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div>
	    <a-table :row-key="record => record.id" :columns="columns" :data-source="tableData" :scroll="{ x : ' calc(1200px + 50%)' }" :rowSelection="rowSelection" bordered ref="table" :pagination="false">
	    		<label slot="isCarryData" slot-scope="text">{{ text ? '是' : '否' }}</label>
          <div slot="itemType" slot-scope="text, item, index">
            <a-select :value="item.itemType" style="width: 200px" :disabled="true">
              <a-select-option v-for="(item, index) in selection.itemTypes" :key="index" :value="item.code"
                >{{ item.nameCN }}
              </a-select-option>
            </a-select>
          </div>
	    </a-table>
    </div>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import { STable, Ellipsis } from '@/components'
  import { ChangeService } from '@/views/change/change.service'
  import { fixedList } from '@/utils/util'
  import { Base as BaseService } from '@/api/base'

  const columns = [
    {
      title: '带数项目',
      dataIndex: 'isCarryData',
      scopedSlots: { customRender: 'isCarryData' },
      width : 50
    },
    {
      title: '标段',
      dataIndex: 'section',
      width : 50
    },
    {
      title: '楼栋',
      dataIndex: 'building',
      width : 50
    },
    {
      title: '预留字段0',
      dataIndex: 'remark1',
      width : 50
    },
    {
      title: '预留字段1',
      dataIndex: 'remark2',
      width : 50
    },
    {
      title: '清单描述',
      dataIndex: 'description',
      width : 150
    },
    {
      title: '业态成本中心',
      dataIndex: 'costCenterName',
      width : 250
    },
    {
      title: '清单项类别',
      dataIndex: 'itemType',
      scopedSlots: { customRender: 'itemType' },
      width : 220
    },
    {
      title: '供应',
      children: [
        {
          title: '单位',
          dataIndex : 'unitMaterial',
      	  width : 100
        },
        {
          title: '工程量',
          dataIndex: 'quantityMaterial',
      	  width : 100
        },
        {
          title: '单价',
          dataIndex: 'unitPriceMaterial',
      	  width : 100
        },
        {
          title: '小计',
          dataIndex: 'subAmountMaterial',
      	  width : 100
        }
      ]
    },
    {
      title: '安装',
      children: [
        {
          title: '单位',
          dataIndex: 'unitWork',
      	  width : 100
        },
        {
          title: '工程量',
          dataIndex: 'quantityWork',
      	  width : 100
        },
        {
          title: '单价',
          dataIndex: 'unitPriceWork',
      	  width : 100
        },
        {
          title: '小计',
          dataIndex: 'subAmountWork',
      	  width : 100
        }
      ]
    },
    {
      title: '供应+安装',
      children: [
        {
          title: '单位',
          dataIndex: 'unitWorkMat',
      	  width : 100
        },
        {
          title: '工程量',
          dataIndex: 'quantityWorkMat',
      	  width : 100
        },
        {
          title: '单价',
          dataIndex: 'unitPriceWorkMat',
      	  width : 100
        },
        {
          title: '小计',
          dataIndex: 'subAmountWorkMat',
      	  width : 100
        }
      ]
    },
    {
      title: '合计',
      dataIndex: 'allAmount',
      width : 80
    }

  ]

  export default {
    name: 'ContractBQModal',
    components: {
        STable,
        Ellipsis
    },
    data () {
      this.columns = columns
      return {
        // create model
        tableData: [],
        show: false,
        visible: false,
        confirmLoading: false,
        selection : {},
        mdl: null,
        // 高级搜索 展开/关闭
        advanced: false,
        // 加载数据方法 必须为 Promise 对象
        /*loadData: parameter => {
          return ChangeService.bqList(this.contract.contractGuid)
            .then(res => {
            	  console.log('contractBqmodal.datas',res)
              return res.result.data
            })
        },*/
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    props: {
      contract: {
        type: Object,
        default: null
      },
      data: {
        type: Object,
        default: null
      }
    },
    computed: {
    		//列表行选中事件监听
        rowSelection () {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: this.onSelectChange,
                type : 'checkbox'
            }
        }
    },
    created () {
       BaseService.itemTypes('vo').then((res) => {
        this.selection.itemTypes = res.result.data
      })
    },
    mounted(){
    		this.loadData();
    },
    methods: {
      showTable () {
        this.visible = true
      },
      handleCancel(){
      	this.visible = false
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      loadData(){
      	return ChangeService.bqList(this.contract.contractGuid).then(res => {
        	  console.log('myData',res)
          this.tableData = res.result.data
        })
      },
      handleOk(){
      	if(this.selectedRows.length < 1){
      		this.$message.warn(请选择合同造价数据);
      	}else{
      		this.selectedRows.forEach(item => {
      			this.$parent.add(undefined,item)
      		})
      		this.visible = false
      	}
      }
    }
  }
</script>

<style lang="less" scoped>
  .search-form {
    background-color: #1E9FF2;
    padding: 20px;
    border-radius: 0.35rem;

    /deep/ .ant-form-item-label label {
      color: #fff;
    }
  }

  /deep/ .ant-table-footer {
    padding-bottom: 0;
  }

</style>
