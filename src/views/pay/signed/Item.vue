<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="基本资料">
          <base-info :type="type" :id="id"></base-info>
        </a-tab-pane>
        <a-tab-pane key="2" tab="进度款支付明细表">
          <pay-detail :type="type" :id="id"></pay-detail>
        </a-tab-pane>
      </a-tabs>

      <footer-tool-bar>
        <a-button-group>
          <a-button :disabled="type === 'view'" @click="handleToEdit()" type="success">
            储存
          </a-button>
        </a-button-group>
        <a-button-group disabled>
          <a-button :disabled="type === 'view'" @click="approve()" type="success">
            提请审批
          </a-button>
        </a-button-group>
        <a-button-group>
          <a-button @click="back()" type="danger">
            关闭
          </a-button>
        </a-button-group>
      </footer-tool-bar>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import BaseInfo from '@/views/pay/signed/components/BaseInfo'
    import PayDetail from './components/PayDetail'
    import { FooterToolBar } from '@/components'
    import { SignedService } from './signed.service'

    export default {
        name: 'Item',
        components: { PayDetail, BaseInfo, FooterToolBar },
        computed: {
            id () {
                return this.$route.params.id
            },
            type () {
                return this.$route.query.type
            }
        }

    }
</script>

<style lang="less" scoped>
  .ant-btn-group {
    margin-right: 8px;
  }
</style>