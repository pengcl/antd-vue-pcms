<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="供应商编号">
                <a-input></a-input>
              </a-form-item>
            </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="供应商名称">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="供应商简称">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="供应商类别">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">深圳</a-select-option>
                <a-select-option value="1">广州</a-select-option>
                <a-select-option value="2">珠海</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="公司所在地(省)">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">深圳</a-select-option>
                <a-select-option value="1">广州</a-select-option>
                <a-select-option value="2">珠海</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="市">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">深圳</a-select-option>
                <a-select-option value="1">广州</a-select-option>
                <a-select-option value="2">珠海</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="法人代表">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="经办部门">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">深圳</a-select-option>
                <a-select-option value="1">广州</a-select-option>
                <a-select-option value="2">珠海</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="纳税人身份">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">深圳</a-select-option>
                <a-select-option value="1">广州</a-select-option>
                <a-select-option value="2">珠海</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="变更备注">
              <a-textarea></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
              <tr>
                <th colspan="12">
                  <a-button icon="plus">
                    添加员工
                  </a-button>
                  <a-button icon="stop">
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
              <tr>
                <td>
                  <a-button icon="close">
                    删除
                  </a-button>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              </tbody>
            </table>
          </a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
              <tr>
                <th colspan="4">
                  <a-upload
                  >
                    <a-button>请选择</a-button>
                  </a-upload>
                </th>
              </tr>
              <tr>
                <th colspan="4">公司介绍</th>
              </tr>
              <tr>
                <th style="width: 25%">操作</th>
                <th style="width: 25%">公司介绍文件</th>
                <th style="width: 25%">上传人</th>
                <th style="width: 25%">上传日期</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>
                  <a-button type="danger" icon="delete"></a-button>
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              </tbody>
            </table>
          </a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
              <tr>
                <th colspan="4">
                  <a-button icon="plus">
                    添加银行账号
                  </a-button>
                  <a-button icon="stop">
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
              <tr>
                <td>
                  <a-button type="danger" icon="delete"></a-button>
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              </tbody>
            </table>
          </a-col>
        </a-row>
      </a-form>

      <a-row :gutter="48">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group>
            <a-button @click="approve()" type="success">
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
            <a-button @click="back" type="danger">
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
        name: 'Edit',
        data () {
            return {}
        },
        computed: {
            id () {
                return this.$route.params.id
            },
            type () {
                return this.$route.query.type
            }
        },
    }
</script>

<style lang="less" scoped>
  .ant-btn-group {
    margin-right: 8px;
  }
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