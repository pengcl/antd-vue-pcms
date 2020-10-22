<template>
  <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-row :gutter="48">
      <a-col :md="12" :sm="24">
        <a-button type="success">按编码排序</a-button>
        <a-button type="success" style="margin-left: 5px">恢复原来排序</a-button>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-button type="success" style="float: right">导入导出</a-button>
      </a-col>
      <a-col :md="24" :sm="24">
        <table>
          <thead>
          <tr>
            <th colspan="25">
              <a-button @click="add('')" :disabled="type === 'view'" icon="plus">
                新增
              </a-button>
              <a-button @click="clear()" :disabled="type === 'view'" icon="stop">
                重置
              </a-button>
            </th>
          </tr>
          <tr>
            <th rowspan="2">操作</th>
            <th rowspan="2">
              带数项目
            </th>
            <th style="width: 5%" rowspan="2">清单编号</th>
            <th style="width: 5%" rowspan="2">标段</th>
            <th style="width: 5%" rowspan="2">楼栋</th>
            <th style="width: 5%" rowspan="2">分部</th>
            <th style="width: 5%" rowspan="2">分项</th>
            <th style="width: 5%" rowspan="2">预留字段0</th>
            <th style="width: 5%" rowspan="2">预留字段1</th>
            <th style="width: 5%" rowspan="2">清单描述</th>
            <th style="width: 5%" rowspan="2">业态成本中心</th>
            <th style="width: 5%" rowspan="2">清单项类别</th>
            <th style="width: 15%" colspan="4">供应</th>
            <th style="width: 15%" colspan="4">安装</th>
            <th style="width: 15%" colspan="4">供应+安装</th>
            <th style="width: 5%" rowspan="2">合计</th>
          </tr>
          <tr>
            <th>单位</th>
            <th>工程量</th>
            <th>单价</th>
            <th>小计</th>
            <th>单位</th>
            <th>工程量</th>
            <th>单价</th>
            <th>小计</th>
            <th>单位</th>
            <th>工程量</th>
            <th>单价</th>
            <th>小计</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in data.contractBQlst" :key="item.id">
            <td>
              <div style="width: 220px;">
                <a-button @click="add(item.srNo)" :disabled="type === 'view'" icon="plus">
                  添加子项
                </a-button>
                <a-button @click="del(index)" :disabled="type === 'view'" icon="close">
                  删除
                </a-button>
              </div>
            </td>
            <td>
              <a-icon
                @click="item.isCarryData = !item.isCarryData"
                :type="item.isCarryData ? 'check-square' : 'border'"/>
            </td>
            <td>{{ item.srNo }}</td>
            <td>{{ item.section }}</td>
            <td>{{ item.building }}</td>
            <td></td>
            <td></td>
            <td>{{ item.remark1 }}</td>
            <td>{{ item.remark2 }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.costCenter }}</td>
            <td>{{ item.itemType }}</td>
            <td>{{ item.unitMaterial }}</td>
            <td>{{ item.quantityMaterial }}</td>
            <td>{{ item.unitPriceMaterial }}</td>
            <td>{{ item.subAmountMaterial }}</td>
            <td>{{ item.unitWork }}</td>
            <td>{{ item.quantityWork }}</td>
            <td>{{ item.unitPriceWork }}</td>
            <td>{{ item.subAmountWork }}</td>
            <td>{{ item.unitWorkMat }}</td>
            <td>{{ item.quantityWorkMat }}</td>
            <td>{{ item.unitPriceWorkMat }}</td>
            <td>{{ item.subAmountWorkMat }}</td>
            <td>{{ item.allAmount }}</td>
          </tr>
          </tbody>
        </table>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>

function getNo(string) {
  string.split('.');
}

export default {
  name: 'ContractList',
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false
    };
  },
  props: {
    data: {
      type: Object,
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
  methods: {
    add(stringNo) {
      if (stringNo) {
        this.data.contractBQlst.filter(item => item.srNo.indexOf(stringNo) !== -1)
      }
    }
  }
};
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
