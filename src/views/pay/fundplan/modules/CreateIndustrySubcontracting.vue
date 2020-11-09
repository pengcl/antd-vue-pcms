<template>
  <a-modal
    title="引入行业分判包"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-row :gutter="48">
        <a-col :md="24" :sm="24">可按分判包名称关键词查找</a-col>
        <a-col :md="12" :sm="24">
          <a-input></a-input>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-button type="primary">查找</a-button>
        </a-col>
      </a-row>
      <s-table
        style="margin-top: 10px"
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
      </s-table>
    </a-spin>
  </a-modal>
</template>

<script>
    import pick from 'lodash.pick'
    import { STable } from '@/components'
    import { UnSignedService } from '@/views/pay/unsigned/unsigned.service'
    import { fixedList } from '@/utils/util'

    const columns = [
        {
            title: '行业分辨判包编号',
            dataIndex: 'action',
        },
        {
            title: '行业分辨判包名称',
            dataIndex: 'paymentOtherCode'
        },
        {
            title: '类型',
            dataIndex: 'paymentAmount',
        },
        {
            title: '预算金额',
            dataIndex: 'requestDate'
        },
        {
            title: '描述',
            dataIndex: 'requestUserName',
        },
    ]
    const fields = []

    export default {
        name: 'CreateIndustrySubcontracting',
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
            }
        },
        data () {
            this.columns = columns
            return {
                form: this.$form.createForm(this),
                queryParam: {},
                selectedRowKeys: [],
                selectedRows: [],
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    return UnSignedService.items(requestParameters).then(res => {
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
        computed: {
            rowSelection () {
                return {
                    selectedRowKeys: this.selectedRowKeys,
                    onChange: this.onSelectChange
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