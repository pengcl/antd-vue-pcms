<template>
  <div>
    <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row :gutter="48">
        <a-col :md="24" :sm="24">
          <table>
            <thead>
              <tr>
                <th colspan="12">
                  <a-button @click="showForm()" icon="plus">
                    添加员工
                  </a-button>
                  <a-button @click="clear()" icon="stop">
                    重置
                  </a-button>
                </th>
              </tr>
              <tr>
                <th colspan="12">公司员工</th>
              </tr>
              <tr>
                <th style="width: 5%">操作</th>
                <th style="width: 5%">联系人姓名</th>
                <th style="width: 5%">现任职位</th>
                <th style="width: 5%">公司联系人</th>
                <th style="width: 10%">台鉴人</th>
                <th style="width: 10%">业务联系人</th>
                <th style="width: 10%">办公电话</th>
                <th style="width: 10%">传真</th>
                <th style="width: 10%">手机</th>
                <th style="width: 10%">电子邮箱</th>
                <th style="width: 10%">是否在职</th>
                <th style="width: 10%">备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="item.id">
                <td>
                  <a-button @click="del(index)" icon="close">
                    删除
                  </a-button>
                </td>
                <td>{{ item.employeeName }}</td>
                <td>{{ item.jobPosition }}</td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{ item.officePhone }}</td>
                <td>{{ item.fox }}</td>
                <td>{{ item.mobilePhone }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.isIncumbent }}</td>
                <td>{{ item.remarks }}</td>
              </tr>
            </tbody>
          </table>
        </a-col>
      </a-row>
    </a-form>
    <create-employee-form
      ref="createModal"
      :visible="visible"
      :model="model"
      @cancel="handleCancel"
      @ok="ok('employee')">
    </create-employee-form>
  </div>
</template>

<script>

import CreateEmployeeForm from '@/views/supplier/modules/CreateEmployeeForm'

export default {
  name: 'CompanyStaff',
  components: { CreateEmployeeForm },
  props: {
    items: {
      type: Array,
      default: null
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
          console.log(values)
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
    del (index) {
      this.items.splice(index, 1)
    },
    clear () {
      this.items = []
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
