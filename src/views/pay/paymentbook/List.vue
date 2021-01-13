<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="项目">
                <a-tree-select
                  v-model="queryParam.ProjectGUID"
                  style="width: 100%"
                  :tree-data="cities"
                  :dropdown-style="{ maxHeight: '400px', overflowH: 'auto' }"
                  search-placeholder="请选择"
                  @select="onSelect"
                  :suffixIcon="cities ? '' : '加载中...'"
                />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-button type="primary" style="margin-left: 5px" @click="show = !show">
                <a-icon type="search"></a-icon>
              </a-button>
              <a-button type="success" style="margin-left: 10px" @click="exportExcel">导出Excel</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" v-if="show" class="search-form" @keyup.enter.native="formSearch">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="合同编号">
              <a-input v-model="queryParam.ContractNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="付款单号">
              <a-input v-model="queryParam.PaymentCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="供应商名称">
              <a-input v-model="queryParam.VendorName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="申请时间">
              <a-date-picker :value="queryParam.CreationTime_From"
                             @change="CreationTime_FromChange"
                             placeholder="请选择开始时间"></a-date-picker>
              <span style="margin: 0 10px;color: #fff">至</span>
              <a-date-picker :value="queryParam.CreationTime_To"
                             @change="CreationTime_ToChange"
                             placeholder="请选择结束时间"></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button type="success" @click="search">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
            <a-button type="success" style="margin-left: 20px" @click="clear">清空</a-button>
          </a-col>
        </a-row>
      </a-form>

      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="gid"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="false"
        showPagination="auto"
        :scroll="{ x: 'calc(700px + 50%)'}"
      >
        <span slot="paymentAmount" slot-scope="text">
            {{text | NumberFormat}}
        </span>

        <span slot="requestAmount" slot-scope="text">
            {{text | NumberFormat}}
        </span>

        <span slot="creationTime" slot-scope="text">
            {{text | date}}
        </span>

        <span slot="contractNo" slot-scope="text,record">
            <a @click="handleToContractItem(record.contractGuid)">{{text}}</a>
        </span>

        <span slot="paymentCode" slot-scope="text,record">
            <a @click="handleToSignedItem(record.gid)">{{text}}</a>
        </span>

      </s-table>

    </a-card>
  </page-header-wrapper>
</template>

<script>
    import { STable } from '@/components'
    import { fixedList, getPosValue, getList } from '@/utils/util'
    import { ProjectService } from '@/views/project/project.service'
    import { formatList } from '@/mock/util'
    import storage from 'store'
    import { ac } from '@/views/user/user.service'
    import { PaymentBookService } from './paymentbook.service'

    const columns = [
        {
            title: '合同编号',
            dataIndex: 'contractNo',
            width: '110px',
            scopedSlots: { customRender: 'contractNo' },
            sorter : true
        },
        {
            title: '付款单号',
            dataIndex: 'paymentCode',
            width: '110px',
            scopedSlots: { customRender: 'paymentCode' },
            sorter : true
        },
        {
            title: '审批状态',
            dataIndex: 'auditStatus',
            width: '78px',
        },
        {
            title: '收款单位',
            dataIndex: 'vendorName',
            width: '180px',
        },
        {
            title: '申请时间',
            dataIndex: 'creationTime',
            width: '110px',
            scopedSlots: { customRender: 'creationTime' },
            sorter : true
        },
        {
            title: '付款期数',
            dataIndex: 'paymentPhase',
            width: '78px',
            align: 'center',
            sorter : true
        },
        {
            title: '申请批准金额',
            dataIndex: 'requestAmount',
            align: 'center',
            width: '180px',
            scopedSlots: { customRender: 'requestAmount' },
            sorter : true
        },
        {
            title: '本期支付金额',
            dataIndex: 'paymentAmount',
            align: 'center',
            width: '180px',
            scopedSlots: { customRender: 'paymentAmount' },
            sorter : true
        },
        {
            title: '申请人',
            dataIndex: 'creatorUser',
            width: '100px',
        },
        {
            title: '付款单位',
            dataIndex: 'nameCN',
            width: '180px',
        },
        {
            title: '支付方式',
            dataIndex: 'paymentMethod',
            align: 'center',
            width: '90px',
        },
        {
            title: '付款类型',
            dataIndex: 'paymentType',
            width: '90px',
        },
    ]

    export default {
        name: 'PaymentBook',
        components: {
            STable,
        },
        data () {
            this.columns = columns
            return {
                // create model
                cities: null,
                city: '',
                value: '',
                deleteId: '',
                projectType: '',
                show: false,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: {},
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    if (this.queryParam.ProjectCode) {
                        return PaymentBookService.items(requestParameters).then(res => {
                            return fixedList(res, requestParameters)
                        })
                    }
                },
            }
        },
        created () {
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
                this.cities = cities
                const value = getPosValue(this.cities)
                this.queryParam.ProjectCode = value.projectCode ? value.projectCode : getList(this.cities, 0).projectCode
                this.projectType = value.type ? value.type : getList(this.cities, 0).type
                this.queryParam.ProjectGUID = value.projectGUID ? value.projectGUID : getList(this.cities, 0).projectGUID
                this.$refs.table.refresh()
                this.$forceUpdate()
            })

        },
        computed: {},
        methods: {
            formSearch(){
                this.$refs.table.refresh()
            },
            CreationTime_FromChange (date, dateString) {
                this.queryParam.CreationTime_From = dateString
                this.$forceUpdate()
            },
            CreationTime_ToChange (date, dateString) {
                this.queryParam.CreationTime_To = dateString
                this.$forceUpdate()
            },
            clear () {
                this.queryParam = {
                    ProjectCode: this.queryParam.ProjectCode,
                    ProjectGUID: this.queryParam.ProjectGUID
                }
                this.$refs.table.refresh()
            },
            exportExcel () {
                const parameter = Object.assign({
                    SkipCount: 0,
                    MaxResultCount: 9999
                })
                const requestParameters = Object.assign({}, parameter, this.queryParam)
                PaymentBookService.exportPaymentBook(requestParameters).then(res => {
                    if (res.result.data) {
                        const _window = window.open('_blank')
                        _window.location = res.result.data
                    }
                })
            },
            ac (action) {
                return ac(action, this.$route)
            },
            handleToContractItem (id) {
                this.$router.push({ path: `/contract/item/${id}?type=view` })
            },
            handleToSignedItem (id) {
                this.$router.push({ path: `/pay/signed/item/${id}?type=view` })
            },
            search () {
                this.show = !this.show
                this.$refs.table.refresh(true)
            },
            onSelect (value, option) {
                storage.set('POS', option.pos)
                this.queryParam.ProjectCode = option.$options.propsData.dataRef.projectCode
                this.projectType = option.$options.propsData.dataRef.type
                if (typeof value === 'number') {
                    this.city = value
                    this.queryParam.ProjectGUID = ''
                } else {
                    this.queryParam.ProjectGUID = value
                }
                this.$refs.table.refresh()
                this.$forceUpdate()
            },
        }
    }
</script>

<style lang="less" scoped>
  .search-form {
    background-color: #1E9FF2;
    padding: 20px;
    border-radius: 0.35rem;

    /deep/ .ant-form-item-label label {
      color: #fff;
    }
  }

  /deep/ .ant-table-footer {
    padding-bottom: 0;
  }

</style>
