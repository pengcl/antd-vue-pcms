<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-item label="项目编码">
              HZO-HZ4
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="房产项目名称(中文)">
              珠海中心 L1
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="房产项目名称(英文)">
              Zhuhai shopping mall L1
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="中央合同编号">
              C-HZO-HZ4-ORG-14
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="本地合同编号">
              CON0001
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="合同名称">
              20200909
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="指令编号">

            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="签证原因及签证内容">
              <a-textarea></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
              <tr>
                <th colspan="3">
                  上传附件
                  <a-upload
                  >
                    <a-button>请选择</a-button>
                  </a-upload>
                </th>
              </tr>
              <tr>
                <th style="width: 20%">操作</th>
                <th style="width: 30%">附件</th>
                <th style="width: 30%">附件页数</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>
                  <a-button type="danger" icon="delete"></a-button>
                </td>
                <td></td>
                <td></td>
              </tr>
              </tbody>
            </table>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="申请编号">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="申请人">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="申请日期">
              <a-date-picker></a-date-picker>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <a-row :gutter="48">
      <a-col :md="24" :sm="24" style="margin-bottom: 10px">
        <a-button-group>
          <a-button :disabled="type === 'view'" @click="approve()" type="success">
            启动审批流程
          </a-button>
        </a-button-group>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-button-group>
          <a-button :disabled="type === 'view'" @click="handleToEdit()" type="success">
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
  </page-header-wrapper>
</template>

<script>


    export default {
        name: 'Certificate',
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
  .ant-btn-group {
    margin-right: 8px;
  }
</style>