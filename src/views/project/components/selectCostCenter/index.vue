<template>
  <a-modal
    title="请选择分摊成本中心"
    :width="800"
    :maskClosable="false"
    :visible="visible"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <!--<a-input-search v-model="searchKey" @change="change" placeholder="按合供应商名称搜索" />-->
    <s-table
      style="margin-top: 5px"
      ref="table"
      size="default"
      rowKey="id"
      bordered
      :columns="columns"
      :data="loadData"
      :alert="false"
      showPagination="auto"
      :rowSelection="rowSelection"
    >
    </s-table>
  </a-modal>
</template>

<script>
    import { STable } from '@/components'
    import { CostService } from '@/views/project/cost/cost.service'
    import { fixedList } from '@/utils/util'

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
        name: 'SelectCostCenter',
        components: {
            STable,
        },
        data () {
            this.columns = columns
            return {
                queryParam: {},
                selected: null,
                searchKey: '',
                loadData: parameter => {
                    this.queryParam.ProjectGUID = this.projectGUID
                    if (this.queryParam.ProjectGUID) {
                        const requestParameters = Object.assign({}, parameter, this.queryParam)
                        return CostService.list(requestParameters).then(res => {
                            return fixedList(res, requestParameters)
                        })
                    }
                }
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
            },
            projectGUID: {
                type: String,
                default: null
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
