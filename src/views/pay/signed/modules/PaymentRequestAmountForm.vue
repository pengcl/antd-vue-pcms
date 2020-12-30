<template>
  <a-modal
    title="填写申请批准金额"
    :width="90%"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="loading"
    :ok-button-props="{ props: { disabled: requestAmountTotal < 0 || permission === 'view'} }"
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
        :scroll="{ x: 'calc(700px + 50%)',y:300 }"
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
                          :disabled="permission === 'view'"
                          @change="e => onChange(e,record,'requestAmount')"
                          :max="record.amountPayable"
                          :min="record.businessAmount < 0 ? record.businessAmount : 0"
                          :style="{color: (record.amountPayable > 0 && record.requestAmount > record.amountPayable) || (record.businessType === 'CIP' && record.amountPayable > 0 && record.requestAmountTotal+record.requestAmount > record.businessAmount*0.3) ? 'red' : ''}"
                          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :precision="2"></a-input-number>
        </span>

        <span slot="remark" slot-scope="text">
          <a-input v-model="text" :disabled="permission === 'view'"></a-input>
        </span>

        <span slot="footer">
          <a-row :gutter="48">
            <a-col :md="4" :sm="24">
              <a-button type="success" @click="importAmount" :disabled="permission === 'view'">引入</a-button>
            </a-col>
            <a-col :md="16" :sm="24" style="text-align: right"><b>申请批准金额：</b></a-col>
            <a-col :md="4" :sm="24" :style="{color : requestAmountTotal < 0 ? 'red' : '' }">{{requestAmountTotal | NumberFormat}}</a-col>
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
            dataIndex: 'businessBCode',
            width: '100px'
        },
        {
            title: '名称',
            dataIndex: 'businessName',
            width: '250px'
        },
        {
            title: '状态',
            dataIndex: 'businessType',
            align: 'center',
            width: '78px'
        },
        {
            title: '金额（A）',
            dataIndex: 'businessAmount',
            align: 'center',
            scopedSlots: { customRender: 'businessAmount' },
            width: '180px',
        },
        {
            title: '已申请批准金额（B）',
            dataIndex: 'requestAmountTotal',
            align: 'center',
            scopedSlots: { customRender: 'requestAmountTotal' },
            width: '180px',
        },
        {
            title: '当前可支付金额（C）',
            dataIndex: 'amountPayable',
            align: 'center',
            scopedSlots: { customRender: 'amountPayable' },
            width: '180px',
        },
        {
            title: '申请批准金额（D）',
            dataIndex: 'requestAmount',
            scopedSlots: { customRender: 'requestAmount' },
            width: '180px',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            scopedSlots: { customRender: 'remark' },
            width: '200px'
        }
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
                default: false
            },
            model: {
                type: Array,
                default: null
            },
            type: {
                type: String,
                default: null
            },
            permission: {
                type: String,
                default: null
            },
            contractGID: {
                type: String,
                default: null
            },
            paymentGID: {
                type: String,
                default: null
            },
            paymentRequestAmount: {
                type: Number,
                default: 0
            }
        },
        data () {
            this.columns = columns
            return {
                form: this.$form.createForm(this),
                queryParam: {},
                requestList: null,
                requestAmountTotal: 0,
                originData: null,
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    if (this.contractGID) {
                        if (this.permission !== 'view') {
                            if (!this.originData) {
                                return SignedService.requestList(this.contractGID, this.paymentGID, false).then(res => {
                                    res.result.data.forEach(item => {
                                        if (item.businessAmount < 0) {
                                            item.amountPayable = 0
                                        }
                                    })
                                    this.originData = res
                                    this.requestList = res.result.data
                                    return fixedList(res, requestParameters)
                                })
                            } else {
                                return new Promise((resolve, reject) => {
                                    return resolve(fixedList(this.originData, requestParameters))
                                })
                            }
                        } else {
                            return SignedService.requestListForView(this.contractGID, this.paymentGID).then(res => {
                                return fixedList(res, requestParameters)
                            })
                        }

                    }

                },
            }
        },
        watch: {
            'paymentRequestAmount' (value) {
                if (value) {
                    if (this.permission === 'view') {
                        this.requestAmountTotal = value
                    }
                }
            }
        },
        created () {
            // 防止表单未注册
            fields.forEach(v => this.form.getFieldDecorator(v))

            // 当 model 发生改变时，为表单设置值
            this.$watch('model', (value) => {
                console.log(value)
                this.model && this.form.setFieldsValue(pick(this.model, fields))
            })
            if (this.permission === 'view') {
                this.requestAmountTotal = this.paymentRequestAmount
            }
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
            },
            importAmount () {
                SignedService.requestList(this.contractGID, this.paymentGID, true).then(res => {
                    res.result.data.forEach(item => {
                        if (item.businessAmount < 0) {
                            item.amountPayable = 0
                        }
                        this.originData.result.data.push(item)
                    })
                })
                this.requestList = this.originData.result.data
                this.$refs.table.refresh()
            }

        }
    }
</script>

<style lang="less" scoped>

</style>