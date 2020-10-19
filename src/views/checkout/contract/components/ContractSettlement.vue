<template>
  <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="12" :sm="24">
        <a-form-item label="承建商申报金额">
          <a-input-number></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="承建商申报日期">
          <a-date-picker></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="顾问公司/PQS初审金额">
          <a-input-number></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="顾问公司/PQS初审日期">
          <a-date-picker></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="申请结算金额">
          <a-input-number></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="申请结算日期">
          <a-date-picker></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="结算书编号">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="最后竣工日期">
          <a-date-picker></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="保修比列">
          <a-input-number></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="保修金额">
          <a-input-number></a-input-number>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="保修日期">
          <a-date-picker></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="结算方式">
          <a-select>
            <a-select-option value="1">阶段结算</a-select-option>
            <a-select-option value="2">最终结算</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="经办人">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="经办部门">
          <a-select>
            <a-select-option value="1">阶段结算</a-select-option>
            <a-select-option value="2">最终结算</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="合同金额">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="累计变更补协金额">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="累计进度款">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="应付进度余款">
          <a-input></a-input>
        </a-form-item>
      </a-col>
    </a-row>
    <a-col :md="12" :sm="24">
    <a-form-item label="本次结算调整">
      <a-input></a-input>
    </a-form-item>
  </a-col>
    <a-col :md="24" :sm="24">
      <a-form-item label="结算调整">
        <a-input></a-input>
      </a-form-item>
    </a-col>
    <a-col :md="24" :sm="24">
      <a-form-item label="扣款是否已处理">
        <a-select>
          <a-select-option value="1">是</a-select-option>
          <a-select-option value="2">否</a-select-option>
        </a-select>
      </a-form-item>
    </a-col>
    <a-col :md="24" :sm="24">
      <a-form-item label="申报文件">

      </a-form-item>
    </a-col>
    <a-col :md="24" :sm="24">
      <a-form-item label="备注说明">
            <a-textarea></a-textarea>
      </a-form-item>
    </a-col>
  </a-form>
</template>

<script>
    export default {
        name: 'ContractSettlement'
    }
</script>

<style scoped>

</style>