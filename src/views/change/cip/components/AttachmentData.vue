<template>
    <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row :gutter="48">
        <a-col :md="24" :sm="24">
          <a-form-item label="保修金/保固金/保留金比率上限">
            <a-input-number 
              v-model="data.voMasterInfo.retentionPercentage" 
              :disabled="type === 'view'"
              :min="0"
              :max="100"
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
              ></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-button type="primary" :disabled="type === 'view'" @click="repleaceAll()">全部按原合同条款</a-button>
        </a-col>
        <a-col :md="24" :sm="24">
          保修金/保固金/保留金：
        </a-col>
        <a-col :md="24" :sm="24">
          <table>
            <thead>
              <tr>
                <th colspan="3">
                  <a-button @click="addRetention()" :disabled="type === 'view'" icon="plus">
                    新增
                  </a-button>
                  <a-button @click="clear('voRetentionlst')" :disabled="type === 'view'" icon="stop">
                    重置
                  </a-button>
                  <a-button @click="replaceRetentionsByContract()" :disabled="type === 'view'" icon="block">
                    按原合同条款
                  </a-button>
                </th>
              </tr>
              <tr>
                <th style="width: 30%">操作</th>
                <th style="width: 40%">描述</th>
                <th style="width: 40%">保修金/保固金/保留金比率</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!item.isDeleted" v-for="(item, index) in data.voRetentionlst" :key="index">
                <td>
                  <a-button @click="del(item,index,'voRetentionlst')" :disabled="type === 'view'" icon="close">
                    删除
                  </a-button>
                </td>
                <td>
                  <a-input v-model="item.description" :disabled="type === 'view'"></a-input>
                </td>
                <td>
                  <a-input-number 
                    v-model="item.percentage" 
                    :disabled="type === 'view'"
                    :min="0"
                    :max="100"
                    :formatter="value => `${value}%`"
                    :parser="value => value.replace('%', '')"
                    ></a-input-number>
                </td>
              </tr>
            </tbody>
          </table>
        </a-col>
        <a-col :md="24" :sm="24">
          保修金/保固金/保留金返还：
        </a-col>
        <a-col :md="24" :sm="24">
          <table>
            <thead>
              <tr>
                <th colspan="4">
                  <a-button @click="addRelease()" :disabled="type === 'view'" icon="plus">
                    新增
                  </a-button>
                  <a-button @click="clear('voRetentionReleaselst')" :disabled="type === 'view'" icon="stop">
                    重置
                  </a-button>
                  <a-button @click="replaceReleasesByContract()" :disabled="type === 'view'" icon="block">
                    按原合同条款
                  </a-button>
                </th>
              </tr>
              <tr>
                <th style="width: 20%">操作</th>
                <th style="width: 20%">描述</th>
                <th style="width: 30%">保修金/保固金/保留金返还条款</th>
                <th style="width: 30%">保修金/保固金/保留金比率</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!item.isDeleted" v-for="(item,index) in data.voRetentionReleaselst" :key="index">
                <td>
                  <a-button @click="del(item,index,'voRetentionReleaselst')" :disabled="type === 'view'" icon="close">
                    删除
                  </a-button>
                </td>
                <td>
                  <a-input :disabled="type === 'view'" v-model="item.description"></a-input>
                </td>
                <td>
                  <a-input :disabled="type === 'view'" v-model="item.releaseTerms"></a-input>
                </td>
                <td>
                  <a-input-number 
                    :disabled="type === 'view'" 
                    v-model="item.percentage" 
                    :min="0"
                    :max="100"
                    :formatter="value => `${value}%`"
                    :parser="value => value.replace('%', '')"
                    ></a-input-number>
                </td>
              </tr>
            </tbody>
          </table>
        </a-col>
        <a-col :md="24" :sm="24">
          预付款：
        </a-col>
        <a-col :md="24" :sm="24">
          <table>
            <thead>
              <tr>
                <th colspan="9">
                  <a-button :disabled="type === 'view'" icon="plus">
                    新增
                  </a-button>
                  <a-button :disabled="type === 'view'" icon="stop">
                    重置
                  </a-button>
                  <a-button :disabled="type === 'view'" icon="block">
                    按原合同条款
                  </a-button>
                </th>
              </tr>
              <tr>
                <th style="width: 10%">操作</th>
                <th style="width: 10%">描述</th>
                <th style="width: 10%">预付款条款</th>
                <th style="width: 10%">预付款回扣条款</th>
                <th style="width: 10%">百分比</th>
                <th style="width: 10%">单位</th>
                <th style="width: 10%">数量</th>
                <th style="width: 10%">单价</th>
                <th style="width: 10%">总金额</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <a-button :disabled="type === 'view'" icon="close">
                    删除
                  </a-button>
                </td>
                <td>
                  <a-input :disabled="type === 'view'"></a-input>
                </td>
                <td>
                  <a-input :disabled="type === 'view'"></a-input>
                </td>
                <td>
                  <a-input :disabled="type === 'view'"></a-input>
                </td>
                <td>
                  <a-input-number 
                    :disabled="type === 'view'"
                    :min="0"
                    :max="100"
                    :formatter="value => `${value}%`"
                    :parser="value => value.replace('%', '')"
                    ></a-input-number>
                </td>
                <td>
                  <a-select
                    placeholder="请选择"
                    v-decorator="['paymentUser', { rules: [{required: true, message: '请选择'}] }]" :disabled="type === 'view'">
                    <a-select-option value="1">包(bag)</a-select-option>
                  </a-select>
                </td>
                <td>
                  <a-input-number :disabled="type === 'view'"></a-input-number>
                </td>
                <td>
                  <a-input-number 
                    :disabled="type === 'view'"
                    :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                    :precision="2"
                    ></a-input-number>
                </td>
                <td><a-input-number 
                  :disabled="true"
                  :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\元\s?|(,*)/g, '')"
                  :precision="2"
                  ></a-input-number></td>
              </tr>
            </tbody>
          </table>
        </a-col>
        <attachment-info-bond :data="data" :type="type" :id="id" :contract="contract" ref="attachmentInfoBond"></attachment-info-bond>
        <attachment-info-insurance :data="data" :type="type" :id="id" :contract="contract" ref="attachmentInfoInsurance"></attachment-info-insurance>
        <attachment-info-fluctuation-clause :data="data" :type="type" :id="id" :contract="contract" ref="attachmentInfoFluctuationClause"></attachment-info-fluctuation-clause>
        <attachment-info-payment-terms :data="data" :type="type" :id="id" :contract="contract" ref="attachmentInfoPaymentTerms"></attachment-info-payment-terms>
        <attachment-info-material-quality-guarantee
          :data="data"
          :type="type"
          :id="id" :contract="contract" ref="attachmentInfoMaterialQualityGuarantee"></attachment-info-material-quality-guarantee>
      </a-row>
    </a-form>
    
</template>

<script>
  import { Base as BaseService , removeItem , clearItems} from '@/api/base'
  import { ChangeService } from '@/views/change/change.service'
  import AttachmentInfoBond from '@/views/change/cip/components/attachmentInfo/bond'
  import AttachmentInfoInsurance from '@/views/change/cip/components/attachmentInfo/insurance'
  import AttachmentInfoFluctuationClause from '@/views/change/cip/components/attachmentInfo/fluctuationClause'
  import AttachmentInfoPaymentTerms from '@/views/change/cip/components/attachmentInfo/paymentTerms'
  import AttachmentInfoMaterialQualityGuarantee
    from '@/views/change/cip/components/attachmentInfo/materialQualityGuarantee'

  export default {
    name: 'AttachmentData',
    components: {
      AttachmentInfoMaterialQualityGuarantee,
      AttachmentInfoPaymentTerms,
      AttachmentInfoFluctuationClause,
      AttachmentInfoInsurance,
      AttachmentInfoBond
    },
    data () {
      return {
        date: null,
        selection: {},
        loading: false
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
      contract: {
        type: Object,
        default: null
      },
      stage : {
        type : String,
        default : 'CIP'
      }
    },
    created () {
      console.log('change.AttachmentData.contract', this.contract)
      // 若为新增模式，则取合同中的保修金/保留金/保固金比率覆盖到变更主类
      if (this.type === 'add' && this.stage == 'CIP') {
        this.data.voMasterInfo.retentionPercentage = this.contract.retentionPercentage
      }
      // 加载单位
      BaseService.unitTypes().then(res => {
        this.selection.unitTypes = res.result.data
        this.$forceUpdate()
      })
    },
    methods: {
      // 增加保修金/保留金/保固金 列表行
      addRetention () {
        const item = {
          id: 0,
          isDeleted: false,
          isTemp: true,
          itemKey: '',
          void: '',
          description: '',
          percentage: 0
        }
        this.data.voRetentionlst.push(item)
      },
      /**
       * 通用删除行方法
       * @item 要删除的数据
       * @index 要删除的数据下标
       * @target 要删除行数据的对象列表
       */
      del (item, index, target) {
        removeItem(index,this.data[target])
      },
      /**
       * 通用清空行方法
       * @target 要删除行数据的对象列表
       */
      clear (target) {
        this.data[target] = clearItems(this.data[target])
        console.log(this.data[target])
      },
      // 增加保修金/保固金/保留金返还行
      addRelease () {
        const item = {
          id: 0,
          isDeleted: false,
          isTemp: true,
          itemKey: '',
          void: '',
          description: '',
          percentage: 0,
          releaseTerms: ''
        }
        this.data.voRetentionReleaselst.push(item)
      },
      // 按原合同条款覆盖保修金/保固金/保留金列表
      replaceRetentionsByContract () {
        this.clear('voRetentionlst')
        ChangeService.retentions(this.contract.contractGuid).then(item => {
          if (item.result.statusCode == 200) {
            const items = item.result.data
            items.forEach(retention => {
              const temp = {
                id: 0,
                isDeleted: false,
                isTemp: true,
                itemKey: '',
                void: '',
                description: retention.description,
                percentage: retention.percentage
              }
              this.data.voRetentionlst.push(temp)
            })
          }
        })
      },
      // 按原合同条款覆盖保修金/保固金/保留金返还列表
      replaceReleasesByContract () {
        this.clear('voRetentionReleaselst')
        ChangeService.releases(this.contract.contractGuid).then(item => {
          if (item.result.statusCode == 200) {
            const items = item.result.data
            items.forEach(release => {
              const temp = {
                id: 0,
                isDeleted: false,
                isTemp: true,
                itemKey: '',
                void: '',
                description: release.description,
                percentage: release.percentage,
                releaseTerms: release.releaseTerms
              }
              this.data.voRetentionReleaselst.push(temp)
            })
          }
        })
      },
      // 全部按原合同条款按钮点击事件监听
      repleaceAll () {
        this.replaceRetentionsByContract()
        this.replaceReleasesByContract()
        this.$refs.attachmentInfoBond.replaceByContract()
        this.$refs.attachmentInfoInsurance.replaceByContract()
        this.$refs.attachmentInfoFluctuationClause.replaceByContract()
        this.$refs.attachmentInfoPaymentTerms.replaceByContract()
        this.$refs.attachmentInfoMaterialQualityGuarantee.replaceByContract()
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
