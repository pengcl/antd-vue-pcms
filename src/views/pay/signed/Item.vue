<template>
  <page-header-wrapper :title="type === 'view' ? '查看合同付款' : type === 'update' ? '编辑合同付款' : '新增合同付款'">
    <a-card :bordered="false">
      <a-tabs v-model="activeKey" :animated="false">
        <a-tab-pane :key="1" tab="基本资料">
          <base-info ref="baseInfo" :data="form" :type="type" :id="id"></base-info>
        </a-tab-pane>
        <a-tab-pane :key="2" tab="进度款支付明细表">
          <pay-detail :data="form" :type="type" :id="id"></pay-detail>
        </a-tab-pane>
      </a-tabs>

      <a-row :gutter="48">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group v-if="type === 'view' && form.auditStatus === '未审核' && form.createMode !== 'C' && ac('EDIT')">
            <a-button @click="approve" type="success">
              启动审批流程
            </a-button>
          </a-button-group>
          <a-button-group v-if="type === 'view' && form.auditStatus !== '未审核' && form.createMode !== 'C' && ac('VIEW')">
            <a-button @click="view" type="success">
              查看审批
            </a-button>
          </a-button-group>
          <a-button-group
            v-if="type === 'view' && form.auditStatus !== '未审核' && form.createMode === 'C' && ac('VIEW')">
            <a-button @click="viewCostBpm" type="success">
              查看审批流程
            </a-button>
          </a-button-group>
          <a-button-group
            v-if="type === 'view' && form.auditStatus === '未审核' && form.createMode === 'C' && ac('OneClickAudit')">
            <a-button @click="audit" type="success">
              审核通过
            </a-button>
          </a-button-group>
          <a-button-group
            v-if="type === 'view' && form.auditStatus === '已审核' && form.createMode === 'C' && ac('OneClickUnAudit')">
            <a-button @click="cancelAudit" type="success">
              取消审核
            </a-button>
          </a-button-group>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-button-group v-if="type === 'view' && form.auditStatus === '未审核' && ac('EDIT')">
            <a-button @click="edit" type="success">
              编辑
            </a-button>
          </a-button-group>
          <a-button-group v-if="type !== 'view' && ac(type === 'create' ? 'ADD' : 'EDIT')">
            <a-button @click="save" type="success" :disabled="disabled">
              储存
            </a-button>
          </a-button-group>
          <a-button-group>
            <a-button @click="back" type="danger">
              关闭
            </a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import BaseInfo from '@/views/pay/signed/components/BaseInfo'
    import PayDetail from './components/PayDetail'
    import { SwaggerService } from '@/api/swagger.service'
    import { SignedService } from './signed.service'
    import { Base as BaseService } from '@/api/base'
    import { ac } from '@/views/user/user.service'

    export default {
        name: 'Item',
        components: { PayDetail, BaseInfo },
        data () {
            return {
                baseInfo: null,
                disabled: false,
                activeKey: 1,
                form: SwaggerService.getForm('PaymentViewDto')
            }
        },
        computed: {
            id () {
                return this.$route.params.id
            },
            type () {
                return this.$route.query.type
            },
            tab () {
                return this.$route.query.tab
            }
        },
        created () {
            this.getData()
            if (this.tab) {
                this.activeKey = Number(this.tab)
            }
        },
        watch: {
            '$route' (path) {
                this.getData()
            },
        },
        methods: {
            audit () {
                SignedService.audit(this.id).then(res => {
                    if (res.result.data) {
                        this.$message.success('审核通过成功！')
                        this.getData()
                    }
                })
            },
            cancelAudit () {
                SignedService.cancelAudit(this.id).then(res => {
                    if (res.result.data) {
                        this.$message.success('取消审核成功！')
                        this.getData()
                    }
                })
            },
            getData () {
                if (this.type === 'view') {
                    SignedService.viewInfo(this.id).then(res => {
                        this.form = res.result.data
                    })
                } else if (this.type === 'update') {
                    SignedService.updateInfo(this.id).then(res => {
                        this.form = res.result.data
                    })
                } else {
                    SignedService.getCreateData(this.id).then(res => {
                        this.form = res.result.data
                        this.form.attachmentID = 0
                        this.form.id = 0
                        this.form.gid = '00000000-0000-0000-0000-000000000000'
                        this.form.isDeleted = false
                        this.form.isAudit = false
                        this.form.auditStatus = ''
                        this.form.auditTime = ''
                        this.form.contractMasterInfo.detailList = []
                        this.form.contractNSCInfoList = []
                        this.form.billList = []
                    })
                }
            },
            ac (action) {
                return ac(action, this.$route)
            },
            save () {
                this.disabled = true
                this.$refs.baseInfo.$refs.form.validate(vaild => {
                    if (vaild) {
                        if (this.type === 'create') {
                            this.form.contractMasterInfo.id = 0
                            this.form.contractMasterInfo.gid = '00000000-0000-0000-0000-000000000000'
                            this.form.contractMasterInfo.contractType = '主合同'
                            this.form.contractMasterInfo.mainContractGID = this.id
                            this.form.contractMasterInfo.secondaryContractGID = this.id

                            if (this.form.contractNSCInfoList.length > 0) {
                                this.form.contractNSCInfoList.forEach(item => {
                                    item.id = 0
                                    item.gid = '00000000-0000-0000-0000-000000000000'
                                    item.contractType = '分合同'
                                    item.mainContractGID = this.id
                                    item.secondaryContractGID = item.contractGID
                                })
                            }

                            SignedService.create(this.form).then(res => {
                                if (res.result.data) {
                                    this.$message.success('创建成功')
                                    this.$router.push({
                                        path: `/pay/signed/item/${res.result.data}?type=view`
                                    })
                                } else {
                                    this.disabled = false
                                }
                            })
                        } else {
                            if (this.form.billList.length > 0) {
                                this.form.billList.forEach(item => {
                                    item.paymentGID = this.id
                                })
                            }
                            SignedService.update(this.form).then(res => {
                                if (res.result.data) {
                                    this.$message.success('修改成功')
                                    this.$router.push({
                                        path: '/pay/signed/list'
                                    })
                                } else {
                                    this.disabled = false
                                }
                            })
                        }
                    } else {
                        this.disabled = false
                    }
                })

            },
            back () {
                this.$router.push({
                    path: '/pay/signed/list'
                })
            },
            approve () {
                SignedService.approve(this.id).then(_res => {
                    if (_res.result.data) {
                        this.$message.success('已启动审批流程')
                        const tempwindow = window.open('_blank')
                        tempwindow.location = _res.result.data
                        this.$router.push({
                            path: '/pay/signed/list'
                        })
                    }
                })
            },
            view () {
                BaseService.viewBpm(this.id).then(res => {
                    const tempwindow = window.open('_blank')
                    tempwindow.location = res.result.data
                })
            },
            viewCostBpm () {
                BaseService.viewCostBpm(this.id).then(res => {
                    const tempwindow = window.open('_blank')
                    tempwindow.location = res.result.data
                })
            },
            edit () {
                this.$router.push({ path: `/pay/signed/item/${this.id}?type=update` })
            },
        }

    }
</script>

<style lang="less" scoped>
  .ant-btn-group {
    margin-right: 8px;
  }
</style>