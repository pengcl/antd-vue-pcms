<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-item label="合同编号">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="合同名称">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="是否最终结算">
              <a-select>
                <a-select-option value="1">是</a-select-option>
                <a-select-option value="2">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="合作单位（结算方）">
              <a-select>
                <a-select-option value="1">甲</a-select-option>
                <a-select-option value="2">乙</a-select-option>
                <a-select-option value="3">丙</a-select-option>
                <a-select-option value="4">丁</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="抄送方">
              <a-checkbox-group>
                <a-checkbox value="1">甲</a-checkbox>
                <a-checkbox value="2">乙</a-checkbox>
                <a-checkbox value="3">丙</a-checkbox>
                <a-checkbox value="4">丁</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="竣工日期">
              <a-date-picker></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="交楼日期">
              <a-date-picker></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="保修日期">
              <a-date-picker></a-date-picker>
              <a-date-picker></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="备注">
              <a-textarea></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24" style="font-size: 18px;font-weight: bold;">
            证书内容
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="文件编号">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合作单位负责人">
              <a-input suffix="先生/小姐"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="工程名称">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="根据的合同条款">
              <a-input prefix="第" suffix="条"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="验收范围">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="验收日期">
              <a-date-picker></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="竣工证书"></a-form-item>
          </a-col>
        </a-row>
      </a-form>

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

    export default {
        name: 'CheckoutCompletedList',
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
