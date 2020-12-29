<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-model-item label="科目名称" prop="nameCN">
              <a-input
                :disabled="type === 'view'"
                v-model="form.nameCN"
              >
              </a-input>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :md="24" :sm="24">
            <a-form-model-item label="科目名称tradeName" prop="nameEN">
              <a-input
                :disabled="type === 'view'"
                v-model="form.nameEN"
              >
              </a-input>
            </a-form-model-item>
          </a-col> -->
          <a-col :md="24" :sm="24">
            <a-form-model-item label="描述" prop="description">
              <a-textarea
                rows="4"
                :disabled="type === 'view'"
                v-model="form.description"
              >
              </a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <a-row>
        <a-col :md="12" :sm="24">
          <a-button-group style="float: left">
            <a-button :disabled="type === 'view' || disabled" :loading="loading.save" type="success" @click="handleToSave">储存</a-button>
            <a-button type="danger" style="margin-left: 5px" @click="back">关闭</a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { CostService } from '@/views/cost/cost.service'
  import { SwaggerService } from '@/api/swagger.service'
  import {SupplierService} from "@/views/supplier/supplier.service";

  export default {
    name: 'CostTypeItem',
    data () {
      return {
        loading: {
          save: false
        },
        disabled:false,
        form: SwaggerService.getForm('ElementTradeTypeListOutputDtoListResultModel'),
        rules: {
          nameCN: [{ required: true, message: '请输入科目名称', trigger: 'blur' }],
          // nameEN: [{ required: true, message: '请输入科目名称tradeName', trigger: 'blur' }],
          description: [{ required: false, message: '请输入描述', trigger: 'change' }],
        }
      }
    },
    computed: {
      id () {
        return this.$route.params.id
      },
      type () {
        return this.$route.query.type
      },
      elementId () {
        return this.$route.query.elementId
      }
    },
    filters: {},
    created () {
      if (this.type !== 'add') {
        CostService.typeItem({ Id: this.id }).then(res => {
          this.form = res.result.data
          this.$forceUpdate()
        })
      }
    },
    methods: {
      handleToSave () {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.disabled = true
            this.loading.save = true
            const buttonType = this.type==='add' ? 'typeCreate' : 'typeUpdate'
            this.form.elementId = this.elementId
            this.form.nameEN = ''
            CostService[buttonType](this.form).then(res => {
              this.loading.save = false
              this.disabled = false
              if (res.result.statusCode === 200) {
                this.$message.info(this.type === 'edit' ? '修改成功' : '新增成功')
                this.loading.save = false
                this.back()
              }
            }).catch(() => {
              this.loading.save = false
              this.disabled = false
            })
          }
        })
      },
      back () {
        this.$router.push({ path: `/cost/type/list` })
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
        &:first-child {
          th {
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

  .ant-btn-group {
    margin-right: 8px;
  }

  .simple{
    /deep/ .ant-form-item-control-wrapper.ant-col-16{
      width: 100%!important;
    }
  }

</style>
