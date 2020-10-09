<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <a-form-item label="项目编码">
                HZO-HZ4
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="房产项目名称(中)">
                杭州望江新城項目 (Testing)
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="中央合同编号">
                C-HZO-HZ4-ORG-14
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="合同名称">
                20200909
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24"></a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="审批状态">
                草拟中 (1.6)
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="CIP 总金额">
                $0
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="VO 总金额">
                $0
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="VOA 总金额">
                $0
              </a-form-item>
            </a-col>
          </a-row>

          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="基本资料">
              Content of Tab Pane 1
            </a-tab-pane>
            <a-tab-pane key="2" tab="合同信息">
              Content of Tab Pane 2
            </a-tab-pane>
            <a-tab-pane key="3" tab="付款信息">
              Content of Tab Pane 3
            </a-tab-pane>
            <a-tab-pane key="4" tab="合同量清单">
              Content of Tab Pane 1
            </a-tab-pane>
            <a-tab-pane key="5" tab="预算调整">
              Content of Tab Pane 2
            </a-tab-pane>
            <a-tab-pane key="6" tab="付款条款">
              Content of Tab Pane 3
            </a-tab-pane>
            <a-tab-pane key="7" tab="指令记录">
              Content of Tab Pane 2
            </a-tab-pane>
            <a-tab-pane key="8" tab="附件">
              Content of Tab Pane 3
            </a-tab-pane>
            <a-tab-pane key="9" tab="流程">
              Content of Tab Pane 3
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
            <a-button type="danger">关闭</a-button>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </page-header-wrapper>
</template>
