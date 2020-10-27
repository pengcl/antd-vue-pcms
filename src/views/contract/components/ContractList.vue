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
                <a-button @click="add()" :disabled="type === 'view'" icon="plus">
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
              <th style="width: 60px" rowspan="2">清单编号</th>
              <th style="width: 60px" rowspan="2">标段</th>
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
            <tr v-if="!item.isDeleted" v-for="(item,index) in data.contractBQlst" :key="item.id">
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
              <td><a-input :disabled="true" :value="item.srNo"></a-input></td>
              <td><a-input v-model="item.section"></a-input></td>
              <td><a-input v-model="item.building"></a-input></td>
              <td></td>
              <td></td>
              <td><a-input v-model="item.remark1"></a-input></td>
              <td><a-input v-model="item.remark2"></a-input></td>
              <td><a-input v-model="item.description"></a-input></td>
              <td><!--{{ item.costCenter }}-->
                <a-select :default-value="item | getValue(index)" style="width: 200px" mode="multiple" @change="centerChange">
                  <a-select-option :value="index + ':' + center.id + ':' + center.costCenterName" :itemIndex="index" v-for="center in selection.centers" :key="JSON.stringify(center)">
                    {{ center.costCenterName }}
                  </a-select-option>
                </a-select>
              </td>
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
  import { compare } from '@/utils/util'
  import { SwaggerService } from '@/api/swagger.service'
  import { ContractService } from '@/views/contract/contract.service'

  function getNo (str, key, items) {
    if (items.length === 0) {
      return '1'
    }
    const isRoot = str === '0' || !str
    const filterItems = !isRoot ? items.filter(item => item[key].indexOf(str) === 0).sort((a, b) => b[key] - a[key]) : items
    filterItems.sort((a, b) => {
      return compare(b[key], a[key])
    })
    const arr = !isRoot ? filterItems[0][key].split('.').reverse() : filterItems[0][key].split('.')
    arr[0] = parseInt(arr[0], 10) + 1 + ''
    const result = !isRoot ? arr.reverse().join('.') : arr[0]
    return isNaN(result) ? '1' : result
  }

  export default {
    name: 'ContractList',
    data () {
      return {
        selection: {},
        form: this.$form.createForm(this),
        loading: false
      }
    },
    created () {
      ContractService.centers(this.project.id).then(res => {
        console.log(res)
        this.selection.centers = res.result.data
        this.$forceUpdate()
      })
    },
    filters: {
      filterDeleted (items) {
        return items.filter(item => !item.isDeleted)
      },
      getValue (item, index) {
        console.log(item)
        const values = []
        const ids = item.costCenter.split(':')
        const names = item.costCenterName.split(':')
        ids.forEach((id, idsIndex) => {
          const value = index + ':' + id + ':' + names[idsIndex]
          values.push(value)
        })
        console.log(values)
        return values
      }
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
      },
      project: {
        type: Object,
        default: null
      }
    },
    methods: {
      add (stringNo) {
        const newSrNo = getNo(stringNo, 'srNo', this.data.contractBQlst)
        const data = SwaggerService.getForm('ContractBQInputDto')
        data.contractID = this.data.contract.id
        data.srNo = newSrNo
        this.data.contractBQlst.push(data)
      },
      del (index) {
        this.data.contractBQlst[index].isDeleted = true
      },
      clear () {
        this.data.contractBQlst.forEach(item => {
          item.isDeleted = true
        })
      },
      centerChange (values) {
        let ids = ''
        let names = ''
        let item
        values.forEach(value => {
          const arr = value.split(':')
          item = this.data.contractBQlst[arr[0]]
          const id = arr[1]
          const name = arr[2]
          if (ids) {
            ids = ids + ':' + id
          } else {
            ids = id
          }
          if (names) {
            names = names + ':' + name
          } else {
            names = name
          }
        })
        item.costCenter = ids
        item.costCenterName = names
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
</style>
