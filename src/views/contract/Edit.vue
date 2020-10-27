<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="基本资料">
          <base-info :type="type" :id="id"/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="合同信息">
          <contract-info title="合同信息" value="8个任务" :bordered="true"/>
        </a-tab-pane>
        <a-tab-pane key="3" tab="预算调整">
          <budget-list title="预算调整" value="8个任务" :bordered="true"/>
        </a-tab-pane>
        <a-tab-pane key="4" tab="合同量清单">
          <contract-list title="合同量清单" value="8个任务" :bordered="true"/>
        </a-tab-pane>
        <a-tab-pane key="5" tab="付款条款">
          <pay-info title="付款条款" value="8个任务" :bordered="true"/>
        </a-tab-pane>
        <a-tab-pane key="6" tab="附件">
          <attachment-list title="付款条款" value="8个任务" :bordered="true"/>
        </a-tab-pane>
      </a-tabs>

      <a-row :gutter="48">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group>
            <a-button @click="approve()" type="success">
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
    import BaseInfo from '@/views/contract/components/BaseInfo'
    import ContractInfo from '@/views/contract/components/ContractInfo'
    import PayInfo from '@/views/contract/components/PayInfo'
    import ContractList from '@/views/contract/components/ContractList'
    import BudgetList from '@/views/contract/components/BudgetList'
    import AttachmentList from '@/views/contract/components/AttachmentList'

    export default {
        name: 'ContractEdit',
        components: { AttachmentList, BudgetList, ContractList, PayInfo, ContractInfo, BaseInfo},
        data () {
            return {}
        },
        computed: {
            id () {
                return this.$route.params.id
            },
            type () {
                return this.$route.query.type
            }
        },
    }
</script>

<style lang="less" scoped>
  .ant-btn-group {
    margin-right: 8px;
  }
</style>