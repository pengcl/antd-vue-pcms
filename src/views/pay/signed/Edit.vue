<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-tabs default-active-key="1" :animated="false">
        <a-tab-pane key="1" tab="基本资料">
          <base-info :bordered="true"></base-info>
        </a-tab-pane>
        <a-tab-pane key="2" tab="进度款支付明细表">
          <pay-detail :bordered="true"></pay-detail>
        </a-tab-pane>
      </a-tabs>

      <a-row :gutter="48">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group>
            <a-button  @click="approve()" type="success">
              启动审批流程
            </a-button>
          </a-button-group>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-button-group>
            <a-button :disabled="type === 'view'" @click="save" type="success">
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

    export default {
        name: 'Edit',
        components: { PayDetail, BaseInfo}
    }
</script>

<style lang="less" scoped>
  .ant-btn-group {
    margin-right: 8px;
  }
</style>