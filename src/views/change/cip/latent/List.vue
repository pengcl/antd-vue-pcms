<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-form ref="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-item label="项目编码">
              <a-input :disabled="true" :value="cipInfo.projectCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="房产项目名称(中文)">
              <a-input :disabled="true" :value="cipInfo.projectName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="房产项目名称(英文)">
              <a-input :disabled="true" :value="cipInfo.projectEnName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="中央合同编号">
              <a-input :disabled="true" :value="cipInfo.contractNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="本地合同编号">
              <a-input :disabled="true" :value="cipInfo.localContractNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="合同名称">
              <a-input :disabled="true" :value="cipInfo.contractName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="累计潜在变更预估金额">
              {{ cipInfo.accumulateEstimatedAmount	| NumberFormat}} 元
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24" style="margin-bottom : 10px;" >
              <a-button
                type="success"
                v-if="ac('ADD')"
                @click="add"
              >新增</a-button>
          </a-col>
          <a-col :md="24" :sm="24" style="margin-bottom: 10px;margin-top: 10px">
            <s-table
              rowKey="id"
              ref="table"
              :columns="columns"
              :alert="false"
              :data="loadData"
              bordered
            >
              <span slot="action" slot-scope="text, item">
                <template>
                  <a-button
                    class="btn-success"
                    type="primary"
                    icon="file-text"
                    v-if="ac('VIEW')"
                    title="查看"
                    @click="view(item)"
                  >
                  </a-button>
                  <a-button
                    class="btn-info"
                    type="primary"
                    icon="form"
                    title="编辑"
                    v-if="ac('EDIT')"
                    :disabled="item.auditStatus.indexOf('未审核') < 0 "
                    @click="edit(item)"
                  ></a-button>
                  <a-button
                    type="danger"
                    icon="delete"
                    title="废弃"
                    :loading="loading.delCer"
                    v-if="ac('DELETE')"
                    :disabled="item.auditStatus.indexOf('未审核') < 0 "
                    @click="del(item)"
                  ></a-button>
                </template>
              </span>
              <span slot="estimatedAmount" slot-scope="text">{{text | NumberFormat}}</span>
            </s-table>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <div class="table-operator" style="margin-top:8px;">
      <a-row :gutter="48" style="margin-top:8px">
        <a-col :md="24" :sm="24">
          <a-button-group>
            <a-button @click="back()" type="danger">
              返回
            </a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import { ChangeService } from '@/views/change/change.service'
import { SwaggerService } from '@/api/swagger.service'
import { Base as BaseService, DIALOGCONFIG } from '@/api/base'
import { ac } from '@/views/user/user.service'
import { fixedList, getPosValue, nullFixedList } from '@/utils/util'
import { STable, Ellipsis } from '@/components'
import { ProjectService } from '@/views/project/project.service'

const columns = [
  {
    title: '操作',
    dataIndex: 'action',
    width: '180px',
    scopedSlots: { customRender: 'action' }
  },
  {
    title: '潜在变更编号',
    dataIndex: 'voNo',
    width: '350px',
    scopedSlots: { customRender: 'voNo' },
    sorter : true,
    ellipsis : true
  },
  {
    title: '潜在变更预估金额',
    dataIndex: 'estimatedAmount',
    width: '350',
    scopedSlots: { customRender: 'estimatedAmount' },
    sorter : true,
    ellipsis : true
  },
  {
    title: '审核状态',
    dataIndex: 'auditStatus',
    width: '180px',
    scopedSlots: { customRender: 'auditStatus' }
  }
]

export default {
  name: 'LatentList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      loading: { delCer: false },
      columns: columns,
      cipInfo: SwaggerService.getForm('QZVOBaseInfoDto'),
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        parameter.ContractGuid = this.id
        return ChangeService.getQZListByContractGuid(parameter).then(res => {
          return fixedList(res, parameter)
        })
      }
    }
  },
  created () {
    ChangeService.getQZBaseInfo(this.id).then(res =>{
      if(res.result.statusCode === 200){
        this.cipInfo = res.result.data
      }
    })
  },
  computed: {
    id () {
      return this.$route.params.id
    }
  },
  methods: {
    ac (action) {
      return ac(action, this.$route)
    },
    back () {
      this.$router.push({ path: `/change/cip/list` })
    },
    view (record) {
      this.$router.push({ path: `/change/cip/latent/item/${record.voGuid}?contractGuid=${this.id}&type=view` })
    },
    edit (record) {
      this.$router.push({ path: `/change/cip/latent/item/${record.voGuid}?contractGuid=${this.id}&type=edit` })
    },
    del (record) {
      const that = this
      this.$confirm({
        title: '删除潜在变更',
        content: '是否确定删除选中潜在变更信息?',
        onOk () {
          that.loading.delCer = true
          ChangeService.deleteQZVOAllInfo(record.voGuid)
            .then(res => {
              that.loading.delCer = false
              if (res.result.statusCode === 200) {
                that.$message.info('潜在变更删除成功')
                that.$refs.table.refresh()
              }
            })
            .catch(e => {
              that.loading.delCer = false
              console.log('潜在变更删除失败', e)
              that.$message.error('潜在变更删除失败')
            })
        },
        onCancel () {}
      })
    },
    add () {
      this.$router.push({ path: `/change/cip/latent/item/0?contractGuid=${this.id}&type=add` })
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
.ant-btn-group {
  margin-right: 8px;
}
</style>
