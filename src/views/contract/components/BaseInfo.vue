<template>
  <a-form :form="form">
    <a-row :gutter="48">
      <a-col :md="12" :sm="24">
        <a-form-item
          label="项目名称(中文)"
        >
          <a-input
            :disabled="type === 'view'"
            placeholder="请填写项目名称(中文)"
            v-decorator="['name', { initialValue: '', rules: [{required: true, message: '请填写项目名称(中文)'}] }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="招投标分判包编号"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择地区"
            v-decorator="['paymentUser', { rules: [{required: true, message: '请选择城市'}] }]">
            <a-select-option value="1">ant-design@alipay.com</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="合同类型"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择地区"
            v-decorator="['paymentUser', { rules: [{required: true, message: '请选择城市'}] }]">
            <a-select-option value="1">ant-design@alipay.com</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="密级"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择项目状态"
            v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
            <a-select-option value="1">ant-design@alipay.com</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="选择原合同"
        >
          <a-select
            :disabled="type === 'view'"
            placeholder="请选择项目状态"
            v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
            <a-select-option value="1">ant-design@alipay.com</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="本地合同编号"
        >
          <a-input
            :disabled="type === 'view'"
            placeholder="请填写房产项目名称(英文)"
            v-decorator="['name', { initialValue: '', rules: [{required: true, message: '收款人名称必须核对'}] }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item
          label="合同名称"
        >
          <a-input
            :disabled="type === 'view'"
            placeholder="请填写房产项目名称(英文)"
            v-decorator="['name', { initialValue: '', rules: [{required: true, message: '收款人名称必须核对'}] }]"/>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        合同甲方：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="3">
                <a-button :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
                <a-button :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 30%">操作</th>
              <th style="width: 40%">公司名</th>
              <th style="width: 40%">百分比</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a-button :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </td>
              <td>广州永沛房地产开发有限公司</td>
              <td>100</td>
            </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        合同乙方：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="3">
                <a-button :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
                <a-button :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 30%">操作</th>
              <th style="width: 40%">公司名</th>
              <th style="width: 40%">百分比</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a-button :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </td>
              <td>广州永沛房地产开发有限公司</td>
              <td>100</td>
            </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        合同其它方：
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
            <tr>
              <th colspan="3">
                <a-button :disabled="type === 'view'" icon="plus">
                  新增
                </a-button>
                <a-button :disabled="type === 'view'" icon="stop">
                  重置
                </a-button>
              </th>
            </tr>
            <tr>
              <th style="width: 30%">操作</th>
              <th style="width: 40%">公司名</th>
              <th style="width: 40%">百分比</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a-button :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </td>
              <td>广州永沛房地产开发有限公司</td>
              <td>100</td>
            </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="合同主要内容">
          <a-textarea
            :disabled="type === 'view'"
            rows="4"
            placeholder="请输入合同主要内容"
            v-decorator="[
              'description',
              {rules: [{ required: false, message: '请输入合同主要内容' }]}
            ]"/>
        </a-form-item>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-form-item
          label="备注">
          <a-textarea
            :disabled="type === 'view'"
            rows="4"
            placeholder="请输入备注"
            v-decorator="[
              'description',
              {rules: [{ required: false, message: '请输入备注' }]}
            ]"/>
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
    props: {
      type: {
        type: String,
        default: 'view'
      },
      id: {
        type: String,
        default: '0'
      }
    }
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
          background-color: #f5f5f5;
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
