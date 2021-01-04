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
          <a-row :gutter="48" style="margin-top: 10px;margin-bottom : 10px">
            <a-col :md="12" :sm="12" >
              <a-button
                type="success"
                style="margin-left: 20px"
                v-if="ac('ADD')"
                @click="add"
              >新增</a-button
              >
            </a-col>
            <a-col :md="12" :sm="12" >
              <a-form-item label="累计潜在变更预估金额">
                1,000,000.00 元
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48" style="margin-top: 10px">
            <a-col :md="24" :sm="24" style="margin-bottom: 10px">
              <s-table
                rowKey="svGuid"
                ref="table"
                :showPagination="false"
                :columns="columns"
                :alert="false"
                :data="loadData"
                bordered
                :scroll="{ y: 300 }"
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
                      style="margin-left: 4px"
                      title="编辑"
                      v-if="ac('EDIT')"
                      :disabled="item.auditStatus.indexOf('未审核') < 0 "
                      @click="edit(item)"
                    ></a-button>
                    <a-button
                      type="danger"
                      icon="delete"
                      style="margin-left: 4px"
                      title="废弃"
                      :loading="loading.delCer"
                      v-if="ac('DELETE')"
                      :disabled="item.auditStatus.indexOf('未审核') < 0 "
                      @click="del(item)"
                    ></a-button>
                  </template>
                </span>
              </s-table>
            </a-col>
          </a-row>
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
    width: '200px',
    scopedSlots: { customRender: 'action' }
  },
  {
    title: '潜在变更编号',
    dataIndex: 'svCode',
    width: '350px',
    scopedSlots: { customRender: 'svCode' }
  },
  {
    title: '潜在变更预估金额',
    dataIndex: 'Amount',
    width: '350px',
    scopedSlots: { customRender: 'Amount' }
  },
  {
    title: '审核状态',
    dataIndex: 'auditStatus',
    width: '200px',
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
      cipInfo: SwaggerService.getForm('VOInfoForSpotVisaDto'),
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return ChangeService.getSpotVisaListByVoGuid(this.id).then(res => {
          return res.result
          // return fixedList(res, parameter)
        })
      }
    }
  },
  created () {
    ChangeService.changeItem({ guid: this.id }).then((res) => {
      this.cipInfo = Object.assign(this.cipInfo,res.result)
      ProjectService.view2(this.cipInfo.projectID).then((res1) => {
        this.cipInfo = Object.assign(this.cipInfo,res1.result.data)
        console.log('cipInfo',this.cipInfo)
      })
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
      this.$router.push({ path: `/change/cip/latent/item/${record.svGuid}?contractGuid=${this.id}&type=view` })
    },
    edit (record) {
      this.$router.push({ path: `/change/cip/latent/item/${record.svGuid}?contractGuid=${this.id}&type=edit` })
    },
    del (record) {
      const that = this
      this.$confirm({
        title: '删除现场签证',
        content: '是否确定删除选中现场签证信息?',
        onOk () {
          that.loading.delCer = true
          ChangeService.deleteSpotVisa(record.svGuid)
            .then(res => {
              that.loading.delCer = false
              if (res.result.statusCode === 200) {
                that.$message.info('现场签证删除成功')
                that.$refs.table.refresh()
              }
            })
            .catch(e => {
              that.loading.delCer = false
              console.log('现场签证删除失败', e)
              that.$message.error('现场签证删除失败')
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
