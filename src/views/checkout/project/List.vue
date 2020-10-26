<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
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
            <a-form-item label="甲方">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合同编号">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="预算书编号">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="补协金额">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合同金额">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="顾问公司/PQS初审金额">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="承建商申报金额">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="结算金额幅度区间">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="申请结算金额">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="扣款是否已处理">
              <a-select>
                <a-select-option value="1">是</a-select-option>
                <a-select-option value="2">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="申报文件">
              <a-input></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <footer-tool-bar>
      <a-button-group>
        <a-button :disabled="type === 'view'" @click="approve()" type="success">
          启动审批流程
        </a-button>
      </a-button-group>
      <a-button-group>
        <a-button :disabled="type === 'view'" @click="save()" v-if="type !== 'view'" :loading="loading" type="success">
          储存
        </a-button>
      </a-button-group>
      <a-button-group>
        <a-button @click="back()" type="danger">
          关闭
        </a-button>
      </a-button-group>
    </footer-tool-bar>
  </page-header-wrapper>
</template>

<script>
    import { FooterToolBar } from '@/components'

    export default {
        name: 'CheckoutProjectList',
        components: { FooterToolBar },
        methods: {
            back () {
                this.$router.push({ path: '/checkout/contract/list' })
            }
        }
    }
</script>

<style lang="less" scoped>
  .ant-btn-group {
    margin-right: 8px;
  }
</style>