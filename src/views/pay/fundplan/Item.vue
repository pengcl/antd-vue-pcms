<template>
  <page-header-wrapper :title="type === 'view' ? '查看资金计划分类' : type === 'update' ? '修改资金计划分类' : '新增资金计划'">
    <a-card :bordered="false">
      <a-form>
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <div class="table-wrapper">
              <table>
                <thead>
                <tr>
                  <th colspan="17">
                    <a-button :disabled="type === 'view'" @click="handleAddIndustry">
                      引入行业分判包
                    </a-button>
                    <a-button :disabled="type === 'view'" @click="handleViewHistoryVersion">查看历史版本（V1.0）</a-button>
                  </th>
                </tr>
                <tr>
                  <th colspan="2">项目名称</th>
                  <th>金额</th>
                  <th>已支付</th>
                  <th>计划支付</th>
                  <th>Jul-20</th>
                  <th>Aug-20</th>
                  <th>Sep-20</th>
                  <th>Oct-20</th>
                  <th>Nov-20</th>
                  <th>Dec-20</th>
                  <th>Jan-21</th>
                  <th>Feb-21</th>
                  <th>Mar-21</th>
                  <th>Apr-21</th>
                  <th>May-21</th>
                  <th>Jun-21</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>B</td>
                  <td>总设计及顾问费</td>
                  <td>小计</td>
                  <td>小计</td>
                  <td>小计</td>
                  <td>小计</td>
                  <td>小计</td>
                  <td>小计</td>
                  <td>小计</td>
                  <td>小计</td>
                  <td>小计</td>
                  <td>小计</td>
                  <td>小计</td>
                  <td>小计</td>
                  <td>小计</td>
                  <td>小计</td>
                  <td>小计</td>
                </tr>
                </tbody>
              </table>
            </div>
          </a-col>
        </a-row>
      </a-form>

      <create-industry-subcontracting
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <create-view-history-version
        ref="createViewHistoryModal"
        :visible="visible2"
        :loading="confirmLoading2"
        :model="mdl2"
        @cancel="handleCancel2"
        @ok="handleOk2"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import CreateIndustrySubcontracting from './modules/CreateIndustrySubcontracting'
    import CreateViewHistoryVersion from './modules/CreateViewHistoryVersion'


    export default {
        name: 'Item',
        components: { CreateViewHistoryVersion, CreateIndustrySubcontracting },
        data () {
            return {
                visible: false,
                confirmLoading: false,
                mdl: null,
                visible2: false,
                confirmLoading2: false,
                mdl2: null,
            }
        },
        computed: {
            id () {
                return this.$route.params.id
            },
            type () {
                return this.$route.query.type
            }
        },
        created () {

        },
        methods: {
            handleAddIndustry () {
                this.mdl = null
                this.visible = true
            },
            handleViewHistoryVersion(){
                this.mdl2 = null
                this.visible2 = true
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
            handleOk2 () {
                const form = this.$refs.createViewHistoryModal.form
                this.confirmLoading2 = true
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
                                this.visible2 = false
                                this.confirmLoading2 = false
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
                                this.visible2 = false
                                this.confirmLoading2 = false
                                // 重置表单数据
                                form.resetFields()
                                // 刷新表格
                                this.$refs.table.refresh()

                                this.$message.info('新增成功')
                            })
                        }
                    } else {
                        this.confirmLoading2 = false
                    }
                })
            },
            handleCancel2 () {
                this.visible2 = false

                const form = this.$refs.createViewHistoryModal.form
                form.resetFields() // 清理表单数据（可不做）
            },
        }
    }
</script>

<style lang="less" scoped>
  table {
    margin: 15px 0;
    width: 100%;
    border-width: 1px 1px 0 0;
    border-radius: 3px 3px 0 0;
    border-style: solid;
    border-color: #ccc;

    thead {
      tr {
        &:first-child {
          th {
            background-color: #f5f5f5;
          }
        }

        th {
          background-color: #06c;
          color: #fff;
          font-weight: normal;
          border-width: 0 0 1px 1px;
          border-style: solid;
          border-color: #ccc;

          button {
            margin-right: 10px;
          }
        }
      }
    }

    tbody {
      tr {
        td {
          padding: 0.5em 0.6em 0.4em 0.6em !important;
          border-width: 0 0 1px 1px;
          border-style: solid;
          border-color: #ccc;

          button {
            margin-right: 10px;
          }
        }
      }
    }
  }
</style>