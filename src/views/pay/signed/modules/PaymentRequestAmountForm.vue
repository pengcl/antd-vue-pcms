<template>
  <a-modal
    title="填写申请批准金额"
    :width="900"
    :visible="visible"
    :confirmLoading="loading"
    :ok-button-props="{ props: { disabled: !requestAmountTotal || requestAmountTotal < 0 } }"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <s-table
        ref="table"
        size="default"
        rowKey="businessGuid"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="false"
        showPagination="auto"
      >
        <span slot="businessAmount" slot-scope="text">
          {{text | NumberFormat}}
        </span>

        <span slot="amountPayable" slot-scope="text">
          {{text | NumberFormat}}
        </span>

        <span slot="requestAmountTotal" slot-scope="text,record">
          {{text | NumberFormat}} / {{record.requestAmountTotalRatio + '%'}}
        </span>

        <span slot="requestAmount" slot-scope="text,record">
          <a-input-number :value="text"
                          :disabled="record.amountPayable < 0"
                          @change="e => onChange(e,record,'requestAmount')"
                          :max="record.amountPayable"
                          :style="{color: (record.amountPayable > 0 && record.requestAmount > record.amountPayable) || (record.businessType === 'CIP' && record.amountPayable > 0 && record.requestAmountTotal+record.requestAmount > record.businessAmount*0.3) ? 'red' : ''}"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </span>

        <span slot="footer">
          <a-row :gutter="48">
            <a-col :md="20" :sm="24" style="text-align: right"><b>申请批准金额：</b></a-col>
            <a-col :md="4" :sm="24" :style="{color : requestAmountTotal <= 0 ? 'red' : '' }">{{requestAmountTotal | NumberFormat}}</a-col>
          </a-row>
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
            title: '编号',
            dataIndex: 'businessCode',
        },
        {
            title: '名称',
            dataIndex: 'businessName'
        },
        {
            title: '状态',
            dataIndex: 'businessType',
            width: '78px'
        },
        {
            title: '金额（A）',
            dataIndex: 'businessAmount',
            scopedSlots: { customRender: 'businessAmount' }
        },
        {
            title: '已申请批准金额（B）',
            dataIndex: 'requestAmountTotal',
            scopedSlots: { customRender: 'requestAmountTotal' }
        },
        {
            title: '当前可支付金额（C）',
            dataIndex: 'amountPayable',
            scopedSlots: { customRender: 'amountPayable' }
        },
        {
            title: '申请批准金额（D）',
            dataIndex: 'requestAmount',
            scopedSlots: { customRender: 'requestAmount' }
        },
    ]
    const fields = []

    export default {
        name: 'PaymentRequestAmountForm',
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
            type: {
                type: String,
                default: null
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
                requestList: null,
                requestAmountTotal: 0,
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    return SignedService.requestList(this.contractGID).then(res => {
                        res.result.data.forEach(item => {
                            if (item.amountPayable < 0) {
                                item.requestAmount = item.amountPayable
                            }
                        })
                        this.requestList = res.result.data
                        return fixedList(res, requestParameters)
                    })
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
        computed: {},
        methods: {
            onChange (value, record, key) {
                record[key] = value
                let result = 0
                this.requestList.forEach(item => {
                    result += item.requestAmount
                })
                this.requestAmountTotal = result
            }
        }
    }
</script>

<style lang="less" scoped>

</style>