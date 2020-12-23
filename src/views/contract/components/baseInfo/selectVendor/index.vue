<template>
  <a-modal
    title="请选择供应商"
    :width="800"
    :visible="visible"
    :maskClosable="false"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-input-search v-model="searchKey" @change="change" placeholder="按合供应商名称搜索" />
    <a-table
      style="margin-top: 5px"
      ref="table"
      size="default"
      rowKey="id"
      bordered
      :columns="columns"
      :data-source="data | filterVendors(searchKey)"
      :alert="false"
      showPagination="auto"
      :rowSelection="rowSelection"
    >
    </a-table>
  </a-modal>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  const columns = [
    {
      title: '名称',
      dataIndex: 'vendorName',
      scopedSlots: { customRender: 'vendorName' }
    },
    {
      title: '类别',
      dataIndex: 'packageName',
      scopedSlots: { customRender: 'packageName' }
    },
    {
      title: '法人',
      dataIndex: 'legalRep',
      scopedSlots: { customRender: 'legalRep' }
    },
    {
      title: '地址',
      dataIndex: 'registerAddress',
      scopedSlots: { customRender: 'registerAddress' }
    }
  ]
  export default {
    name: 'SelectVendor',
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
    props: {
      data: {
        type: Array,
        default: null
      },
      visible: {
        type: Boolean,
        required: true
      }
    },
    filters: {
      filterVendors (vendors, searchKey) {
        let result = []
        if (vendors) {
          result = vendors.filter(item => item.vendorName.indexOf(searchKey) !== -1)
        }
        return result
      }
    },
    methods: {
      change (e) {
        this.$refs.table.refresh()
      }
    }
  }
</script>
