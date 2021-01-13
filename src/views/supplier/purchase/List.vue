<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-button v-if="ac('ADD')" type="success" @click="handleToAdd">新供应商录入</a-button>
            <a-button type="primary" style="margin-left: 5px" @click="show = !show">
              <a-icon type="search"></a-icon>
            </a-button>
          </a-col>
        </a-row>
      </a-form>

      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" v-if="show" class="search-form"
              @keyup.enter.native="formSearch">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="供应商名称">
              <a-input v-model="queryParam.VendorName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="供应商编号">
              <a-input v-model="queryParam.VendorCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="供应商类别">
              <a-select
                placeholder="请选择"
                v-model="queryParam.RegisterType">
                <a-select-option :value="0">采购类</a-select-option>
                <a-select-option :value="1">其它类</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="纳税人身份">
              <a-select
                placeholder="请选择"
                v-model="queryParam.TaxpayerName">
                <a-select-option :value="0">一般纳税人</a-select-option>
                <a-select-option :value="1">小规模纳税人</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="状态">
              <a-select
                placeholder="请选择"
                v-model="queryParam.VendorStatus">
                <a-select-option :value="0">已准入</a-select-option>
                <a-select-option :value="1">未准入</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button @click="search()" type="success">搜索</a-button>
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
        showPagination="auto">
        <template slot="vendorName" , slot-scope="text, record">
          <p>{{ text }}</p>
          <p>
            <a-button-group v-if="record.vendorStatus">
              <span class="label-primary">{{ record.vendorStatus }}</span>
            </a-button-group>
            <a-button-group v-if="record.legalRep">
              <span class="label-orange">{{ record.taxpayerName }}</span>
            </a-button-group>
          </p>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-button
            v-if="ac('VIEW')"
            class="btn-success"
            type="primary"
            icon="file-text"
            title="查看"
            @click="handleToItem(record)"></a-button>
          <a-button
            v-if="ac('EDIT')"
            :disabled="!record.logGID"
            class="btn-info"
            type="primary"
            icon="form"
            style="margin-left: 4px"
            title="编辑"
            @click="handleToEdit(record)"></a-button>
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import { STable, Ellipsis } from '@/components'
    import { fixedList, formatTree } from '@/utils/util'
    import { TreeSelect } from 'ant-design-vue'
    import { SupplierService } from '@/views/supplier/supplier.service'
    import { acs, ac } from '@/views/user/user.service'

    const SHOW_PARENT = TreeSelect.SHOW_PARENT
    export default {
        name: 'SupplierPurchaseList',
        components: {
            STable,
            Ellipsis
        },
        data () {
            const columns = [
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' }
                },
                {
                    title: '供应商信息',
                    dataIndex: 'vendorName',
                    scopedSlots: { customRender: 'vendorName' }
                },
                {
                    title: '供应商类别',
                    dataIndex: 'packageName',
                    scopedSlots: { customRender: 'packageName' }
                },
                {
                    title: '供应商地址',
                    dataIndex: 'registerAddress',
                    scopedSlots: { customRender: 'registerAddress' }
                },
                {
                    title: '法人',
                    dataIndex: 'legalRep',
                    scopedSlots: { customRender: 'legalRep' }
                },
                {
                    title: '准入时间',
                    dataIndex: 'zrDate',
                    scopedSlots: { customRender: 'zrDate' },
                    sorter : true
                }
            ]

            this.columns = columns
            return {
                SHOW_PARENT,
                show: false,
                queryParam: { RegisterType: 0 },
                types: [],
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    return SupplierService.items(requestParameters).then(res => {
                        return fixedList(res, requestParameters)
                    })
                },
                selectedRowKeys: [],
                selectedRows: []
            }
        },
        created () {
            SupplierService.types().then(res => {
                this.types = formatTree([res.result.data], ['title:packageName', 'value:packageCode', 'key:gid'])
                this.$forceUpdate()
            })
        },
        methods: {
            formSearch () {
                this.$refs.table.refresh()
            },
            clear () {
                this.queryParam = { RegisterType: 0 }
                this.$refs.table.refresh()
            },
            ac (action) {
                return ac(action, this.$route)
            },
            search () {
                this.$refs.table.refresh()
            },
            handleToItem (record) {
                console.log(record)
                this.$router.push({ path: `/supplier/purchase/item/${record.gid}?type=view` })
            },
            handleToEdit (record) {
                console.log(record)
                this.$router.push({ path: `/supplier/purchase/item/${record.logGID}?type=update` })
            },
            handleToAdd () {
                this.$router.push({ path: `/supplier/purchase/item/0?type=create` })
            }
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

  .ant-btn-group {
    margin-right: 8px;
  }

  .label {
    padding: 8px 15px;
    background-color: #f8cbad;
    line-height: 20px;
    border-radius: 5px;
  }

  .label-primary {
    border-color: #3A44E1;
    color: #FFF;
    background-color: #666EE8;
    padding: 8px 15px;
    line-height: 20px;
    border-radius: 5px;
  }

  .label-orange {
    background-color: #FF9149;
    border-color: #FF7216;
    color: #FFF;
    padding: 8px 15px;
    line-height: 20px;
    border-radius: 5px;
  }

  .vendor {
    background-color: #778fc5;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    margin: 0 auto;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
</style>
