<template>
  <a-modal
    title="请选择付款单"
    :width="600"
    :visible="visible"
    :maskClosable="false"
    :ok-button-props="{ props: { disabled: !selected } }"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-table
      style="margin-top: 5px"
      ref="table"
      size="default"
      rowKey="gid"
      bordered
      :columns="columns"
      :data-source="paymentList"
      :alert="false"
      showPagination="auto"
      :rowSelection="rowSelection"
      :scroll="{ y: 300}"
    >

      <span slot="paymentAmount" slot-scope="text">
        {{text | NumberFormat}}
      </span>
    </a-table>
  </a-modal>
</template>

<script>
    import { SignedService } from '@/views/pay/signed/signed.service'

    const columns = [
        {
            title: '付款单号',
            dataIndex: 'paymentCode',
            scopedSlots: { customRender: 'paymentCode' }
        },
        {
            title: '付款金额',
            dataIndex: 'paymentAmount',
            scopedSlots: { customRender: 'paymentAmount' }
        },
    ]
    export default {
        name: 'SelectPaymentModal',
        data () {
            return {
                columns: columns,
                queryParam: {},
                selected: null,
                searchKey: '',
                paymentList: []
            }
        },
        props: {
            contractGID: {
                type: String,
                default: '0'
            },
            visible: {
                type: Boolean,
                required: true
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
        watch: {},
        created () {
            SignedService.briefList(this.contractGID).then(res => {
                this.paymentList = res.result.data
            })
        },
        methods: {}
    }
</script>
