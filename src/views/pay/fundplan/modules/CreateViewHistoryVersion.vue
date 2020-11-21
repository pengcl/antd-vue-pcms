<template>
  <a-modal
    title="查看历史版本"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    :ok-button-props="{ props: { disabled: selectedRows.length < 1 } }"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <s-table
        style="margin-top: 10px"
        ref="table"
        size="default"
        rowKey="gid"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="false"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="lastModificationTime" slot-scope="text">
          {{text | date}}
        </span>
      </s-table>
    </a-spin>
  </a-modal>
</template>

<script>
    import pick from 'lodash.pick'
    import { STable } from '@/components'
    import { fixedList } from '@/utils/util'
    import { FundPlanService } from '@/views/pay/fundplan/fundplan.service'

    const columns = [
        {
            title: '财年',
            dataIndex: 'title'
        },
        {
            title: '版本号',
            dataIndex: 'version'
        },
        {
            title: '编制日期',
            dataIndex: 'lastModificationTime',
            scopedSlots: { customRender: 'lastModificationTime' }
        },
        {
            title: '编制人',
            dataIndex: 'lastModifierUser',
        },
    ]
    const fields = []

    export default {
        name: 'CreateViewHistoryVersion',
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
            projectCode: {
                type: String,
                default: null
            },
            year: {
                type: String,
                default: null
            },
        },
        data () {
            this.columns = columns
            return {
                form: this.$form.createForm(this),
                queryParam: {},
                selectedRowKeys: [],
                selectedRows: [],
                selected: null,
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    return FundPlanService.versionList(this.projectCode, this.year ? this.year : 0).then(res => {
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