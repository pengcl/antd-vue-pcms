<template>
  <a-modal
    title="请选择项目公司"
    :width="800"
    :visible="visible"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-input-search v-model="searchKey" @change="change" placeholder="按合同名称/编号进行搜索" />
    <a-table
      style="margin-top: 5px"
      ref="table"
      size="default"
      rowKey="id"
      bordered
      :columns="columns"
      :data-source="data | filterCities(searchKey)"
      :alert="false"
      showPagination="auto"
      :rowSelection="rowSelection"
    >
      <span slot="creationTime" slot-scope="text">{{ text | moment }}</span>
    </a-table>
  </a-modal>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  const columns = [
    {
      title: '公司名称',
      dataIndex: 'nameCN',
      scopedSlots: { customRender: 'nameCN' }
    },
    {
      title: '编号',
      dataIndex: 'code'
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      scopedSlots: { customRender: 'auditStatus' }
    },
    {
      title: '加入时间',
      dataIndex: 'creationTime',
      scopedSlots: { customRender: 'creationTime' }
    }
  ]
  export default {
    name: 'SelectCompany',
    components: {
      STable,
      Ellipsis
    },
    data () {
      return {
        columns: columns,
        queryParam: {},
        selected: null,
        searchKey: ''
      }
    },
    computed: {
      rowSelection () {
        const that = this
        return {
          type: 'radio',
          onSelect: function (record, selected, selectRows, nativeEvent) {
            that.selected = record
          }
        }
      }
    },
    watch: {
      'data' (value) {
        console.log(value)
      }
    },
    filters: {
      filterCities (cities, searchKey) {
        let result = []
        if (cities) {
          result = cities.filter(item => item.nameCN.indexOf(searchKey) !== -1 || item.code.indexOf(searchKey) !== -1)
        }
        return result
      }
    },
    props: {
      project: {
        type: Object,
        default: null
      },
      data: {
        type: Array,
        default: null
      },
      visible: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      change (e) {
      }
    }
  }
</script>
