<template>
  <a-modal
    title="引入专业分包合同"
    :width="900"
    :visible="visible"
    :ok-button-props="{ props: { disabled: selected.length < 1 } }"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <s-table
        ref="table"
        size="default"
        rowKey="contractGuid"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="false"
        :rowSelection="rowSelection"
        showPagination="auto"
      >

        <span slot="contractEffectAmount" slot-scope="text">
          {{text | NumberFormat}}
        </span>

        <span slot="prePayAmount" slot-scope="text">
          {{text | NumberFormat}}
        </span>

        <span slot="paymentAmountTotal" slot-scope="text,record">
          {{text | NumberFormat}} / {{record.paymentAmountTotalRatio + '%'}}
        </span>

      </s-table>
    </a-spin>
  </a-modal>
</template>

<script>
    import pick from 'lodash.pick'
    import { STable } from '@/components'
    import { fixedList } from '@/utils/util'
    import { SignedService } from '../signed.service'

    const columns = [
        {
            title: '合同编号',
            dataIndex: 'contractNo',
        },
        {
            title: '合同名称',
            dataIndex: 'contractName'
        },
        {
            title: '审批状态',
            dataIndex: 'auditStatus',
            width: '78px'
        },
        {
            title: '合作方',
            dataIndex: 'partyInfo'
        },
        {
            title: '有效签约金额',
            dataIndex: 'contractEffectAmount',
            scopedSlots: { customRender: 'contractEffectAmount' }
        },
        {
            title: '预计结算金额',
            dataIndex: 'prePayAmount',
            scopedSlots: { customRender: 'prePayAmount' }
        },
        {
            title: '累计支付金额',
            dataIndex: 'paymentAmountTotal',
            scopedSlots: { customRender: 'paymentAmountTotal' }
        },
    ]
    const fields = []

    export default {
        name: 'ViewContractNsc',
        components: { STable },
        props: {
            visible: {
                type: Boolean,
                required: true
            },
            loading: {
                type: Boolean,
                default: () => false
            },
            model: {
                type: Object,
                default: () => null
            },
            contractGID: {
                type: String,
                default: null
            }
        },
        data () {
            this.columns = columns
            return {
                form: this.$form.createForm(this),
                queryParam: {},
                selectedRowKeys: [],
                selectedRows: [],
                selected: [],
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    if (this.contractGID) {
                        return SignedService.NSCInfoList(this.contractGID).then(res => {
                            return fixedList(res, requestParameters)
                        })
                    }
                },
            }
        },
        created () {
            // 防止表单未注册
            fields.forEach(v => this.form.getFieldDecorator(v))

            // 当 model 发生改变时，为表单设置值
            this.$watch('model', () => {
                this.model && this.form.setFieldsValue(pick(this.model, fields))
            })
        },
        computed: {
            rowSelection () {
                const that = this
                return {
                    selectedRowKeys: this.selectedRowKeys,
                    onChange: this.onSelectChange,
                    type: 'checkbox',
                    onSelect: function (record, selected, selectRows, nativeEvent) {
                        if (selected) {
                            that.selected.push(record)
                        } else {
                            const index = that.selected.findIndex(item => item.contractGuid === record.contractGuid)
                            that.selected.splice(index, 1)
                        }
                    }
                }
            }
        },
        methods: {
            onSelectChange (selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                this.selectedRows = selectedRows
            },
        }
    }
</script>

<style lang="less" scoped>

</style>