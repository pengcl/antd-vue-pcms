<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <a-form-item label="项目编码">
                HZO-HZ4
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="房产项目名称(中文)">
                珠海中心 L1
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="房产项目名称(英文)">
                Zhuhai shopping mall L1
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="中央合同编号">
                C-HZO-HZ4-ORG-14
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
            <a-form-item label="本地合同编号">
              CON0001
            </a-form-item>
          </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="合同名称">
                20200909
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="状态">
                草拟中 (1.6)
              </a-form-item>
            </a-col>
          </a-row>

          <a-tabs default-active-key="1" :animated="false">
            <a-tab-pane key="1" tab="基本资料">
              <base-info title="基本资料"></base-info>
            </a-tab-pane>
            <a-tab-pane key="2" tab="造价估算">
              <cost-estimates title="造价估算"></cost-estimates>
            </a-tab-pane>
            <a-tab-pane key="3" tab="预算调整">
              <budget-list title="预算调整"></budget-list>
            </a-tab-pane>
            <a-tab-pane key="4" tab="附加资料">
              <attachment-data title="附加资料"></attachment-data>
            </a-tab-pane>
            <a-tab-pane key="5" tab="附件">
              <attachment-list></attachment-list>
            </a-tab-pane>
            <a-tab-pane key="6" tab="流程">
            </a-tab-pane>
          </a-tabs>

        </a-form>
      </div>

      <div class="table-operator">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-button type="success">启动审批流程</a-button>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="24" :sm="24" style="margin-top: 10px">
            <a-button type="success">储存</a-button>
            <a-button type="danger">关闭</a-button>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import BaseInfo from '@/views/change/cip/components/BaseInfo'
    import CostEstimates from '@/views/change/cip/components/CostEstimates'
    import BudgetList from '@/views/change/cip/components/BudgetList'
    import AttachmentData from '@/views/change/cip/components/AttachmentData'
    import AttachmentList from '@/views/change/cip/components/AttachmentList'
    export default {
        components: { AttachmentList, AttachmentData, BudgetList, CostEstimates, BaseInfo }
    }
</script>