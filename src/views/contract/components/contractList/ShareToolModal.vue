<template>
  <a-modal
    :visible="visible"
    width="90%"
    title="分摊工具"
    @cancel="() => { $emit('cancel') }"
    @ok="() => { $emit('ok') }"
    :closable="false"
    :maskClosable="false"
    :okButtonProps="{ props: { disabled: shareList.length < 1 || disabled }}"
  >
    <a-row :gutter="48">
      <a-col :md="24" :sm="24">
        <div
          style="padding-top:5px; padding-bottom:5px;padding-left:15px;background-color:#f5f5f5;border-bottom:0;border:1px solid #ccc;margin-top: 20px">
          <a-button icon="plus" @click="add()">
            新增
          </a-button>
        </div>
        <a-form-model ref="form" :model="data" :rules="tableRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-table
            :columns="columns"
            :data-source="shareList"
            size="default"
            rowKey="_id"
            :scroll="{ x : '1000px',y : '600px' }"
            :pagination="false"
            bordered>
            <template slot="action" slot-scope="text, record,index">
              <a-button @click="del(index)" icon="close">
                删除
              </a-button>
            </template>
            <div slot="costCenter" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'tableData.' + index + '.costCenterIdlst'"
                :rules="[{ required: true, message: '请选择成本中心' }]"
              >
                <a-select
                  mode="multiple"
                  style="width: 200px;margin-top: 15px"
                  v-model="record.costCenterIdlst">
                  <a-select-option
                    :value="center.id"
                    :itemIndex="index"
                    v-for="center in centers"
                    :key="JSON.stringify(center)">
                    {{ center.costCenterName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <div slot="itemType" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'tableData.' + index + '.itemType'"
                :rules="[{ required: true, message: '请选择清单项类别' }]"
              >
                <a-select
                  placeholder="请选择"
                  style="margin-top: 15px;width: 160px"
                  v-model="record.itemType">
                  <a-select-option v-for="(item, index) in itemTypes" :key="index" :value="item.code">
                    {{ item.nameCN }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <div slot="shareType" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'tableData.' + index + '.shareType'"
                :rules="[{ required: true, message: '请选择分摊方式' }]"
              >
                <a-select placeholder="请选择" v-model="record.shareType" style="width: 200px">
                  <a-select-option
                    v-for="(item, index) in shareTypes"
                    :key="index"
                    :value="item.id"
                  >{{ item.nameCN }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <template slot="allAmount" slot-scope="text, record,index">
              <a-input-number
                v-model="record.allAmount"
                :min="0"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\\s?|(,*)/g, '')"
                :precision="2"></a-input-number>
            </template>
          </a-table>
        </a-form-model>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
    import { ContractService } from '@/views/contract/contract.service'
    import { Base as BaseService } from '@/api/base'

    const columns = [
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            width: 200
        },
        {
            title: '业态成本中心',
            dataIndex: 'costCenter',
            scopedSlots: { customRender: 'costCenter' },
            width: 200
        },
        {
            title: '清单项类别',
            dataIndex: 'itemType',
            scopedSlots: { customRender: 'itemType' },
            width: 200
        },
        {
            title: '分摊方式',
            dataIndex: 'shareType',
            scopedSlots: { customRender: 'shareType' },
            width: 200
        },
        {
            title: '总金额',
            dataIndex: 'allAmount',
            scopedSlots: { customRender: 'allAmount' },
            width: 200
        }
    ]

    const contractTypes = {
        '15': 'contract',
        '16': 'sa',
        '17': 'nsc'
    }

    export default {
        name: 'ShareToolModal',
        data () {
            return {
                disabled: false,
                loading: false,
                shareList: [],
                shareTypes: null,
                centers: null,
                itemTypes: null,
                columns: columns,
                tableRules: {
                    tableData: []
                },
            }
        },
        props: {
            visible: {
                type: Boolean,
                required: false
            },
            data: {
                type: Object,
                default: null
            }
        },
        created () {
            ContractService.centers(this.data.contract.tenderPackageItemID).then(res => {
                this.centers = res.result.data
                this.$forceUpdate()
            })
            if (this.data.contract.contractCategory) {
                const contractTypeKey = contractTypes[this.data.contract.contractCategory + '']
                if (contractTypeKey) {
                    BaseService.itemTypes(contractTypeKey).then(res => {
                        this.itemTypes = res.result.data
                        this.$forceUpdate()
                    })
                }
            }
            BaseService.shareTypes().then(res => {
                this.shareTypes = res.result.data
            })
        },
        methods: {
            add () {
                const param = {
                    isDeleted: false,
                    isTemp: true,
                    costCenter: undefined,
                    itemType: null,
                    shareType: null,
                    allAmount: null
                }
                this.shareList.push(param)
            },
            del (index) {
                this.shareList.splice(index, 1)
                this.$forceUpdate()
            },
            centerChange () {
                this.$forceUpdate()
            },
            typeChange () {
                this.$forceUpdate()
            },

        }
    }
</script>

<style scoped>

</style>