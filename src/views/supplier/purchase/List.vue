<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-button type="success" @click="handleToAdd">新供应商录入</a-button>
            <a-button type="primary" style="margin-left: 5px" @click="show = !show">
              <a-icon type="search"></a-icon>
            </a-button>
          </a-col>
        </a-row>
      </a-form>

      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" v-if="show" class="search-form">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="供应商名称">
              <a-input v-model="queryParam.VendorName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="编号">
              <a-input v-model="queryParam.VendorCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="供应商分类">
              <a-tree-select
                v-model="queryParam.packageCodeList"
                style="width: 100%"
                :tree-data="types"
                tree-checkable
                :show-checked-strategy="SHOW_PARENT"
                search-placeholder="请选择供应商类别"
              />
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button @click="search()" type="success">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
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
        <template slot="action" slot-scope="text, record">
          <a-button
            class="btn-success"
            type="primary"
            icon="file-text"
            title="查看"
            @click="handleToItem(record)"></a-button>
          <a-button
            v-if="record.logGID"
            class="btn-info"
            type="primary"
            icon="form"
            style="margin-left: 4px"
            title="编辑"
            @click="handleToEdit(record)"></a-button>
        </template>
        <template slot="vendorAbbreviation" slot-scope="text">
          <div class="vendor">
            <ellipsis :length="8" tooltip>{{ text }}</ellipsis>
          </div>
        </template>
        <template slot="detail" slot-scope="text, record">
          <p>{{ record.vendorName }}</p>
          <p>
            <a-button-group v-if="record.vendorStatus">
              <span class="label-primary">{{ record.vendorStatus }}</span>
            </a-button-group>
            <a-button-group v-if="record.legalRep">
              <span class="label-orange">{{ record.legalRep }}</span>
            </a-button-group>
            <a-button-group v-if="record.registerType">
              <span class="label-orange">{{ record.registerType }}</span>
            </a-button-group>
          </p>
          <a-row>
            <a-col :span="12">
              准入时间：{{ record.date }}
            </a-col>
            <a-col :span="12">
              供应商类别：{{ record.packageName }}
            </a-col>
            <a-col :span="24">
              公司地址：{{ record.registerAddress }}
            </a-col>
          </a-row>
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import moment from 'moment'
    import { STable, Ellipsis } from '@/components'
    import { getRoleList } from '@/api/manage'
    import { fixedList, formatTree } from '@/utils/util'
    import { TreeSelect } from 'ant-design-vue'
    import { SupplierService } from '@/views/supplier/supplier.service'
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
                    title: '供应商信息',
                    colSpan: 4,
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' }
                },
                {
                    title: '供应商简称',
                    colSpan: 0,
                    dataIndex: 'vendorAbbreviation',
                    scopedSlots: { customRender: 'vendorAbbreviation' }
                },
                {
                    title: '详情',
                    dataIndex: 'id',
                    colSpan: 0,
                    scopedSlots: { customRender: 'detail' }
                },
                {
                    title: '审批状态',
                    dataIndex: 'vendorStatus',
                    colSpan: 0,
                    scopedSlots: { customRender: 'vendorStatus' }
                }
            ]

            this.columns = columns
            return {
              SHOW_PARENT,
                show: false,
                queryParam: { RegisterType: 1 },
              types: [],
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    console.log('loadData request parameters:', requestParameters)
                    return SupplierService.items(requestParameters).then(res => {
                        console.log(res)
                        return fixedList(res, requestParameters)
                    })
                },
                selectedRowKeys: [],
                selectedRows: []
            }
        },
        filters: {},
        created () {
            // getRoleList({ t: new Date() })
          SupplierService.types().then(res => {
            this.types = formatTree([res.result.data], ['title:packageName', 'value:packageCode', 'key:gid'])
            this.$forceUpdate()
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
            },
            handleAdd () {
                this.mdl = null
                this.visible = true
            },
            handleEdit (record) {
                this.visible = true
                this.mdl = { ...record }
            },
            handleOk () {
                const form = this.$refs.createModal.form
                this.confirmLoading = true
                form.validateFields((errors, values) => {
                    if (!errors) {
                        console.log('values', values)
                        if (values.id > 0) {
                            // 修改 e.g.
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve()
                                }, 1000)
                            }).then(res => {
                                this.visible = false
                                this.confirmLoading = false
                                // 重置表单数据
                                form.resetFields()
                                // 刷新表格
                                this.$refs.table.refresh()

                                this.$message.info('修改成功')
                            })
                        } else {
                            // 新增
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve()
                                }, 1000)
                            }).then(res => {
                                this.visible = false
                                this.confirmLoading = false
                                // 重置表单数据
                                form.resetFields()
                                // 刷新表格
                                this.$refs.table.refresh()

                                this.$message.info('新增成功')
                            })
                        }
                    } else {
                        this.confirmLoading = false
                    }
                })
            },
            handleCancel () {
                this.visible = false

                const form = this.$refs.createModal.form
                form.resetFields() // 清理表单数据（可不做）
            },
            handleSub (record) {
                if (record.status !== 0) {
                    this.$message.info(`${record.no} 订阅成功`)
                } else {
                    this.$message.error(`${record.no} 订阅失败，规则已关闭`)
                }
            },
            onSelectChange (selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                this.selectedRows = selectedRows
            },
            toggleAdvanced () {
                this.advanced = !this.advanced
            },
            resetSearchForm () {
                this.queryParam = {
                    date: moment(new Date())
                }
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

  .vendor{
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
  }
</style>
