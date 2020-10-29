<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-tabs default-active-key="1" :animated="false">
        <a-tab-pane key="1" tab="基本资料">
          <base-info :data="form" :type="type" :id="id"></base-info>
        </a-tab-pane>
        <a-tab-pane key="2" tab="进度款支付明细表">
          <pay-detail :type="type" :id="id"></pay-detail>
        </a-tab-pane>
      </a-tabs>

      <a-row :gutter="48">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group>
            <a-button :disabled="type === 'view'" @click="approve()" type="success">
              启动审批流程
            </a-button>
          </a-button-group>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-button-group>
            <a-button :disabled="type === 'view'" @click="handleToEdit()" type="success">
              储存
            </a-button>
          </a-button-group>
          <a-button-group>
            <a-button @click="back()" type="danger">
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

    export default {
        name: 'Item',
        components: { PayDetail, BaseInfo },
        data () {
            return {
                baseInfo: null,
                form: SwaggerService.getForm('ContractAllInfoDto')
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
                    this.form.contractMasterInfo.detailList = []
                })
            }

        }

    }
</script>

<style lang="less" scoped>
  .ant-btn-group {
    margin-right: 8px;
  }
</style>