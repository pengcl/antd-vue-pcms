<template>
  <div>
    <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row :gutter="48">
        <a-col :md="24" :sm="24">
          <table>
            <thead>
              <tr>
                <th colspan="4">
                  <a-button :disabled="type === 'view'" @click="add()" icon="plus">
                    添加银行账号
                  </a-button>
                  <a-button :disabled="type === 'view'" @click="clear()" icon="stop">
                    重置
                  </a-button>
                </th>
              </tr>
              <tr>
                <th colspan="4">银行账号</th>
              </tr>
              <tr>
                <th style="width: 25%">操作</th>
                <th style="width: 25%">开户银行</th>
                <th style="width: 25%">银行账号</th>
                <th style="width: 25%">银行地址</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!item.isDeleted" v-for="(item, index) in items" :key="index">
                <td>
                  <a-button @click="del(index)" type="danger" icon="delete"></a-button>
                </td>
                <td><a-input v-model="item.bankName "/></td>
                <td><a-input v-model="item.bankAccounts "/></td>
                <td><a-input v-model="item.bankAddr "/></td>
              </tr>
            </tbody>
          </table>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>

import { SwaggerService } from '@/api/swagger.service'

export default {
  name: 'BankInfo',
  components: { },
  props: {
    vendor: {
      type: Object,
      default: null
    },
    items: {
      type: Array,
      default: null
    },
    type: {
      type: String,
      default: 'view'
    },
    id: {
      type: String,
      default: '0'
    }
  },
  data () {
    return {
      visible: false,
      model: null,
      form: null
    }
  },
  methods: {
    showForm () {
      this.model = null
      this.visible = true
    },
    ok () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          this.items.push(values)
          this.visible = false
          this.confirmLoading = false
          // 重置表单数据
          form.resetFields()
          // 刷新表格
        } else {
          this.confirmLoading = false
        }
      })
    },
    add () {
      const item = SwaggerService.getForm('ChangeVendorEditDto_Bank')
      item.isDeleted = false
      item.isTemp = false
      this.items.push(item)
    },
    del (index) {
      if (this.items[index].isTemp) {
        this.items.splice(index, 1)
      } else {
        this.items[index].isDeleted = true
      }
    },
    clear () {
      const items = []
      this.items.forEach(item => {
        if (!item.isTemp) {
          item.isDeleted = true
          items.push(item)
        }
      })
      this.items = items
    },
    handleCancel () {
      this.visible = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
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
        &:first-child{
          th{
            background-color: #f5f5f5;
          }
        }
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
