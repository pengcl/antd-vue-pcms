<template>
  <div>
    <a-col :md="24" :sm="24">
      <table>
        <thead>
        <tr>
          <th colspan="6">
            <a-button icon="plus" @click="add">
              新增
            </a-button>
          </th>
        </tr>
        <tr>
          <th>操作</th>
          <th>业态成本中心</th>
          <th>科目</th>
          <th>行业名称</th>
          <th>预算金额</th>
          <th>本次使用金额</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="!item.isDeleted" v-for="(item,index) in data.tradeBudgetList" :key="index">
          <td>
            <a-button @click="del(index)" :disabled="type === 'view'" icon="close">
              删除
            </a-button>
          </td>
          <td>{{item.costCenterName}}</td>
          <td>{{item.elementNameCN}}</td>
          <td>{{item.tradeBudgetName}}</td>
          <td>{{item.amount | NumberFormat}}</td>
          <td>
            <a-input-number :disabled="type === 'view'"
                            v-model="item.useAmount"
                            :min="0"
                            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :precision="2"></a-input-number>
          </td>
        </tr>
        </tbody>
      </table>

      <unsigned-industry-modal ref="industryModal"
                               @on-change-industry="industryChange"></unsigned-industry-modal>
    </a-col>
  </div>
</template>

<script>
    import UnsignedIndustryModal from '@/views/pay/unsigned/modules/IndustryModal'

    export default {
        name: 'BudgetList',
        components: { UnsignedIndustryModal },
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
            projectGUID: {
                type: String,
                default: null
            }
        },
        methods: {
            add () {
                if (this.data.elementTypeId) {
                    this.$refs.industryModal.show({
                        projectGUID: this.projectGUID,
                        elementTypeId: this.data.elementTypeId
                    })
                }
            },
            del (index) {
                if (this.data.tradeBudgetList[index].isTemp) {
                    this.data.tradeBudgetList.splice(index, 1)
                } else {
                    this.data.tradeBudgetList[index].isDeleted = true
                }
                this.$forceUpdate()
            },
            industryChange (option) {
                option.forEach(item => {
                    const params = {
                        id: 0,
                        isTemp:true,
                        gid: '00000000-0000-0000-0000-000000000000',
                        isDeleted: false,
                        paymentOtherGID: '00000000-0000-0000-0000-000000000000',
                        projectGUID: item.projectGUID,
                        tradeBudgetId: item.id,
                        elementCode: item.elementCode,
                        elementNameCN: item.elementNameCN,
                        costCenterCode: item.costCenterCode,
                        costCenterName: item.costCenterName,
                        tradeBudgetName: item.tradeBudgetName ? item.tradeBudgetName : 'General Trade',
                        amount: item.budgetValue,
                        useAmount: 0
                    }
                    this.data.tradeBudgetList.push(params)
                })
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