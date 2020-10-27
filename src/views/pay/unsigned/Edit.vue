<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item
              label="项目名称"
            >
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              label="付款单位">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              label="申请部门">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              label="申请人">
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              label="付款类型">
              <a-select>
                <a-select-option value="1">一般付款</a-select-option>
                <a-select-option value="2">代付</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              label="申请日期"
            >
              <a-date-picker></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item
              label="付款说明"
            >
              <a-textarea></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              label="付款凭证"
            >
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              label="付款申请金额"
            >
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">支付明细</a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
              <tr>
                <th colspan="7">
                  <a-button icon="plus">
                    新增
                  </a-button>
                  <a-button icon="save">
                    保存
                  </a-button>
                  <a-button icon="delete">
                    删除
                  </a-button>
                </th>
              </tr>
              <tr>
                <th>款项类型</th>
                <th>款项用途</th>
                <th>申请金额</th>
                <th>本期支付金额</th>
                <th>收款单位</th>
                <th>开户银行</th>
                <th>账号</th>
              </tr>
              </thead>
              <tbody>
              <tr>
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
          <a-col :md="24" :sm="24">预算列表</a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
              <tr>
                <th colspan="5">
                  <a-button icon="plus">
                    新增
                  </a-button>
                  <a-button icon="save">
                    保存
                  </a-button>
                  <a-button icon="delete">
                    删除
                  </a-button>
                </th>
              </tr>
              <tr>
                <th style="width: 20%">科目</th>
                <th style="width: 20%">业态成本中心</th>
                <th style="width: 20%">行业名称</th>
                <th style="width: 20%">预算金额</th>
                <th style="width: 20%">本次使用金额</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              </tbody>
            </table>
          </a-col>
          <a-col :md="24" :sm="24">发票管理</a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
              <tr>
                <th colspan="8">
                  <a-button icon="plus">
                    新增
                  </a-button>
                  <a-button icon="save">
                    保存
                  </a-button>
                  <a-button icon="delete">
                    删除
                  </a-button>
                </th>
              </tr>
              <tr>
                <th>票据类型</th>
                <th>编号</th>
                <th>发票金额</th>
                <th>税率</th>
                <th>不含税金额</th>
                <th>发票日期</th>
                <th>发票附件</th>
                <th>备注</th>
              </tr>
              </thead>
              <tbody>
              <tr>
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
          <a-col :md="24" :sm="24">附件管理</a-col>
          <a-col :md="24" :sm="24">
            <table>
              <thead>
              <tr>
                <th colspan="4">
                  <a-upload>
                    <a-button icon="plus">
                      上传
                    </a-button>
                  </a-upload>
                </th>
              </tr>
              <tr>
                <th style="width: 25%">文件名称</th>
                <th style="width: 25%">文件数量</th>
                <th style="width: 25%">上传时间</th>
                <th style="width: 25%">上传人</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td></td>
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
            <a-button @click="back" type="danger">
              关闭
            </a-button>
          </a-button-group>
        </a-col>
      </a-row><a-row :gutter="48">
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