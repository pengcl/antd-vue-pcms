<template>
  <a-modal
    title="请选择专业分判包"
    width="90%"
    :visible="visible"
    :maskClosable="false"
    @ok="onOk"
    @cancel="onCancel"
  >
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="分期/阶段">
              <a-tree-select
                style="width: 100%"
                :tree-data="cities"
                :dropdown-style="{ maxHeight: '400px', overflowH: 'auto' }"
                search-placeholder="请选择"
                v-model="queryParam.ProjectGUID"
                @select="onSelect"
                :suffixIcon="cities ? '' : '加载中...'"
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="分判包编号">
              <a-input-search v-model="queryParam.TradePackageCode" @change="search()" placeholder="输入分判包编号"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="分判包描述">
              <a-input-search v-model="queryParam.Description" @change="search()" placeholder="输入分判包描述"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      style="margin-top: 5px"
      ref="industryTable"
      size="default"
      rowKey="id"
      bordered
      :columns="columns"
      :data="loadData"
      :alert="false"
      :scroll="{ y : 300}"
      showPagination="auto"
      :rowSelection="rowSelection"
    >
      <span slot="creationTime" slot-scope="text">{{text | moment}}</span>
    </s-table>
  </a-modal>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  import { CostService } from '@/views/cost/cost.service'
  import {fixedList, getList, getPosValue} from '@/utils/util'
  import {ProjectService} from "@/views/project/project.service";
  import {formatList} from "@/mock/util";
  import storage from "store";
  const columns = [
    {
      title: '分期/阶段',
      dataIndex: 'projectName'
    },
    {
      title: '专业分判包编号',
      dataIndex: 'tradePackageCode'
    },
    {
      title: '描述',
      dataIndex: 'packageTitle'
    },
    {
      title: '金额',
      dataIndex: 'budgetAmount'
    }
  ]
  export default {
    name: 'IndustryListModal',
    components: {
      STable,
      Ellipsis
    },
    data () {
      return {
        cities: null,
        show: false,
        columns: columns,
        queryParam: {},
        visible: false,
        selected: null,
        id: null,
        index: null,
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          this.queryParam.IsAudit = true
          console.log('parameter', parameter)
          console.log('this.queryParam', this.queryParam)
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return CostService.bidIndustryItems(requestParameters).then(res => {
            return fixedList(res, requestParameters)
          })
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    computed: {
      rowSelection () {
        const that = this
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange,
          type: 'radio',
          onSelect: function (record, selected, selectRows, nativeEvent) {
            that.selected = record
          }
        }
      }
    },
    created() {
      ProjectService.projectTree({Id: this.ProjectGUID}).then(res => {
        const cities = []
        res.result.data.citys.forEach(item => {
          const children = formatList(item.projects.items, { key: 'type', value: 'project' })
          cities.push({
            selectable: false,
            label: item.city.nameCN,
            value: item.city.id,
            children: children
          })
        })
        this.cities = cities
        const value = getPosValue(this.cities)
        this.queryParam.ProjectGUID = value.projectGUID ? value.projectGUID : getList(this.cities, 0).projectGUID
        this.$forceUpdate()
        // this.$refs.industryTable.refresh(true)
      })
    },
    props: {
      ProjectGUID: {
        type: String,
        default: null
      },
      refreshParent: {
        type: Function
      }
    },
    watch: {
      'ProjectGUID'(values){
        this.selected = null
      }
    },
    methods: {
      showModal (ProjectGUID, id, index) {
        this.visible = true
        this.ProjectGUID = ProjectGUID
        this.id = id
        this.index = index
      },
      search () {
        this.$refs.industryTable.refresh(true)
      },
      resetSearchForm () {
        this.queryParam = {
        }
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      onSelect (value, option) {
        storage.set('POS', option.pos)
        this.queryParam.ProjectGUID = option.$options.propsData.dataRef.projectGUID
        if (typeof value === 'number') {
          this.city = value
          this.queryParam.ProjectGUID = ''
        } else {
          this.queryParam.ProjectGUID = value
        }
        this.$refs.industryTable.refresh()
        this.$forceUpdate()
      },
      onOk(){
        if (this.selected) {
          this.visible = false
          this.$refs.industryTable.clearSelected()
          const that = this
          this.selected.index = this.index
          that.refreshParent(this.selected)
        } else {
          this.$message.warn('请选择专业分判包')
        }
      },
      onCancel(){
        this.visible = false
      }
    }
  }
</script>
