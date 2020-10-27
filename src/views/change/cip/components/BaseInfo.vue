<template>
  <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <a-form-item label="项目管理指令编码">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="项目管理指令发出日期">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="项目管理指令最后更新日期">
          <a-input></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        承包 / 顾问单位名称：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th>致：</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              <a-select
                placeholder="请选择"
                v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                <a-select-option value="1">广州永沛房地产开发有限公司</a-select-option>
              </a-select>
            </td>
          </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th>抄送：</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              <a-select
                placeholder="请选择"
                v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                <a-select-option value="1">广州永沛房地产开发有限公司</a-select-option>
              </a-select>
            </td>
          </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="变更原因详细">
          <a-textarea></a-textarea>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="变更内容">
          <a-textarea></a-textarea>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="变更类型">
          <a-select
            placeholder="请选择"
            v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
            <a-select-option value="1">现场管理</a-select-option>
            <a-select-option value="2">设计变更</a-select-option>
            <a-select-option value="3">暂转固</a-select-option>
            <a-select-option value="4">其他变更</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="此工作指令按下述理由发出">
          <a-checkbox-group>
            <a-checkbox>设计要求</a-checkbox>
            <a-checkbox>法规要求</a-checkbox>
            <a-checkbox>暂定款使用</a-checkbox>
            <a-checkbox>选择項目使用</a-checkbox>
            <a-checkbox>暂定料价及单价调整</a-checkbox>
            <a-checkbox>暂定数量调整</a-checkbox>
            <a-checkbox>紧急工程(安全)</a-checkbox>
            <a-checkbox>指定承判商(NSC)</a-checkbox>
            <a-checkbox>人工/材料差价</a-checkbox>
            <a-checkbox>延长顾问服务期之费用</a-checkbox>
            <a-checkbox>索偿</a-checkbox>
            <a-checkbox>其他</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="此变更对整体工期是否有影响">
          <a-row>
            <a-col :span="8">
              <a-select
                placeholder="请选择"
                v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                <a-select-option value="1">有影响</a-select-option>
                <a-select-option value="1">无影响</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="8">
              <a-select
                placeholder="请选择"
                v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
                <a-select-option value="1">增加</a-select-option>
                <a-select-option value="1">减少</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="8">
              <a-input-number></a-input-number> 日
            </a-col>
          </a-row>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="变更造价估算 (增加)">
          <a-input-number></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="变更造价估算 (减少)">
          <a-input-number></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="变更造价估算">
          <a-row>
            <a-col :span="2">
              <a-input value="增加" :disabled="true"></a-input>
            </a-col>
            <a-col :span="16">
              <a-input-number></a-input-number> 元
            </a-col>
          </a-row>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="人工/材料差价累计 (已提交)">
            <a-input-number></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="人工/材料差价累计 (已审批)">
          <a-input-number></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="人工/材料差价累计">
          <a-input-number></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="延长顾问服务之累计费用 (已提交)">
          <a-input-number></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="延长顾问服务之累计费用 (已审批)">
          <a-input-number></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="延长顾问服务费用累计">
          <a-input-number></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="承包商报价">
          <a-input-number></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
      <a-form-item label="顾问估算金额">
        <a-input-number></a-input-number> 元
      </a-form-item>
    </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="汇率">
          <a-input-number></a-input-number> 元
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item label="顾问评估日期">
          <a-date-picker></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="合同约定出差次数">
          <a-input-number></a-input-number> 次
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="已出差">
          <a-input-number></a-input-number> 次
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="本次申请出差">
          <a-radio-group>
            <a-radio value="1">是</a-radio>
            <a-radio value="2">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
    export default {
        name: 'BaseInfo',
        data () {
            return {
                form: this.$form.createForm(this),
                loading: false
            }
        },
    }
</script>

<style lang="less" scoped>
  table {
    margin: 15px 0;
    width: 100%;
    border-width: 1px 1px 0 0;
    border-radius: 3px 3px 0 0;
    border-style: solid;
    border-color: #ccc;

    thead {
      tr {
        th {
          background-color: #06c;
          color: #fff;
          font-weight: normal;
          border-width: 0 0 1px 1px;
          border-style: solid;
          border-color: #ccc;

          button {
            margin-right: 10px;
          }
        }
      }
    }

    tbody {
      tr {
        td {
          padding: 0.5em 0.6em 0.4em 0.6em !important;
          border-width: 0 0 1px 1px;
          border-style: solid;
          border-color: #ccc;

          button {
            margin-right: 10px;
          }
        }
      }
    }
  }
</style>