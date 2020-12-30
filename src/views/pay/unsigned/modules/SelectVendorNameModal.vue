<template>
  <a-modal
    title="请选择收款单位"
    :width="600"
    :visible="visible"
    :maskClosable="false"
    :ok-button-props="{ props: { disabled: !selected } }"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-input-search v-model="searchKey" placeholder="输入收款单位搜索"/>
    <a-table
      style="margin-top: 5px"
      ref="table"
      size="default"
      rowKey="vendorGID"
      bordered
      :columns="columns"
      :data-source="vendorTypes | filterVendors(searchKey)"
      :alert="false"
      showPagination="auto"
      :rowSelection="rowSelection"
      :scroll="{ y: 300}"
    >
    </a-table>
  </a-modal>
</template>

<script>
    import { UnSignedService } from '@/views/pay/unsigned/unsigned.service'

    const columns = [
        {
            title: '收款单位名称',
            dataIndex: 'vendorName',
            scopedSlots: { customRender: 'vendorName' }
        },
    ]
    export default {
        name: 'SelectVendorNameModal',
        data () {
            return {
                columns: columns,
                queryParam: {},
                selected: null,
                searchKey: '',
                vendorTypes: []
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
        created () {
            UnSignedService.vendorTypes().then(res => {
                this.vendorTypes = res.result.data
                this.$forceUpdate()
            })
        },
        props: {
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

        }
    }
</script>
