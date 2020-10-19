<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
              <a-form-item label="合同编号">
                <a-input></a-input>
              </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合同名称">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="结算方">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="抄送方">
              <a-input></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="合同结算">
            <contract-settlement></contract-settlement>
        </a-tab-pane>
        <a-tab-pane key="2" tab="造价估算">
            <cost-estimates></cost-estimates>
        </a-tab-pane>
        <a-tab-pane key="3" tab="预算调整">
            <budget-list></budget-list>
        </a-tab-pane>
        <a-tab-pane key="4" tab="附件">
            <attachment-list></attachment-list>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import ContractSettlement from '@/views/checkout/contract/components/ContractSettlement'
    import CostEstimates from '@/views/checkout/contract/components/CostEstimates'
    import BudgetList from '@/views/checkout/contract/components/BudgetList'
    import AttachmentList from '@/views/checkout/contract/components/AttachmentList'
    export default {
        name: 'Edit',
        components: { AttachmentList, BudgetList, CostEstimates, ContractSettlement }
    }
</script>

<style scoped>

</style>