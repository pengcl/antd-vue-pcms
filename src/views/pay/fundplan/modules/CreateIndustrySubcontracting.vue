<template>
  <a-modal
    title="引入行业分判包"
    :width="900"
    :visible="visible"
    :ok-button-props="{ props: { disabled: selectedRows.length < 1 } }"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-row :gutter="48">
        <a-col :md="24" :sm="24">可按分判包名称关键词查找</a-col>
        <a-col :md="12" :sm="24">
          <a-input v-model="queryParam.PackageTitle"
                   placeholder="请输入分判包名称关键词"></a-input>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-button type="primary" @click="search">查找</a-button>
        </a-col>
      </a-row>
      <s-table
        style="margin-top: 10px"
        ref="tenderPacakge"
        size="default"
        rowKey="tenderPackageGUID"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="false"
        :rowSelection="rowSelection"
        showPagination="auto"
        :scroll="{ y:200 }"
      >
      </s-table>
    </a-spin>
  </a-modal>
</template>

<script>
    import pick from 'lodash.pick'
    import { STable } from '@/components'
    import { fixedList, getPosValue } from '@/utils/util'
    import { FundPlanService } from '@/views/pay/fundplan/fundplan.service'
    import { ProjectService } from '@/views/project/project.service'
    import { formatList } from '@/mock/util'

    const columns = [
        {
            title: '行业分辨判包编号',
            dataIndex: 'tradePackageCode',
        },
        {
            title: '行业分辨判包名称',
            dataIndex: 'packageTitle'
        },
        {
            title: '类型',
            dataIndex: 'elementInfoNameCN',
        },
        {
            title: '预算金额',
            dataIndex: 'budgetAmount'
        },
        {
            title: '描述',
            dataIndex: 'description',
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
            },
            elementID: {
                type: Number,
                default: 0
            }
        },
        data () {
            this.columns = columns
            return {
                form: this.$form.createForm(this),
                queryParam: { IsToContract: false },
                selectedRowKeys: [],
                selectedRows: [],
                selected: [],
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    this.queryParam.elementTypeId = this.elementID
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    return FundPlanService.tenderPacakges(requestParameters).then(res => {
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
            ProjectService.tree().then(res => {
                const cities = []
                res.result.data.citys.forEach(item => {
                    const children = formatList(item.projects.items)
                    cities.push({
                        label: item.city.nameCN,
                        value: item.city.id,
                        children: children
                    })
                })
                const value = getPosValue(cities)
                this.queryParam.ProjectGUID = value.projectGUID
                this.$refs.tenderPacakge.refresh()
                this.$forceUpdate()
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
                            const index = that.selected.findIndex(item => item.tenderPackageGUID === record.tenderPackageGUID)
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
            search () {
                this.$refs.tenderPacakge.refresh(true)
            }
        }
    }
</script>

<style lang="less" scoped>

</style>