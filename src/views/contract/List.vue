<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="项目">
                <a-cascader
                  :options="cities"
                  placeholder="请选择"
                  @change="onChange"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button :disabled="!queryParam.ProjectGUID" type="success" @click="handleToAdd">新增合同</a-button>
        <a-button type="primary" style="margin-left: 5px" @click="show = !show">
          <a-icon type="search"></a-icon>
        </a-button>
      </div>

      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" v-if="show" class="search-form">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="合同编号">
              <a-input v-model="queryParam.ContractNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="合同名称">
              <a-input v-model="queryParam.ContractName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="供应商名称">
              <a-input v-model="queryParam.VendorName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="提交状态">
              <a-select
                placeholder="请选择"
                v-model="queryParam.AuditStatus"
                v-decorator="[queryParam.AuditStatus, { rules: [{required: true, message: '请选择'}] }]">
                <a-select-option value="1">草拟中</a-select-option>
                <a-select-option value="2">已审批</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-button type="success" @click="search()">搜索</a-button>
            <a-button type="danger" style="margin-left: 20px" @click="show = false">取消</a-button>
          </a-col>
        </a-row>
      </a-form>

      <s-table
        style="margin-top: 5px"
        ref="table"
        size="default"
        rowKey="contractGuid"
        bordered
        :columns="columns"
        :data="loadData"
        :alert="false"
        showPagination="auto"
      >
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a-button
              class="btn-success"
              type="primary"
              icon="file-text"
              title="查看"
              @click="handleToItem(record)"></a-button>
            <a-button
              class="btn-info"
              type="primary"
              icon="form"
              style="margin-left: 4px"
              title="编辑"
              @click="handleToEdit(record)"></a-button>
            <a-button
              type="primary"
              class="btn-info"
              icon="file-done"
              style="margin-left: 4px"
              title="审批记录"></a-button>
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import { STable, Ellipsis } from '@/components'
    import { getRoleList } from '@/api/manage'

    import { ContractService } from '@/views/contract/contract.service'
    import { fixedList } from '@/utils/util'
    import { ProjectService } from '@/views/project/project.service'
    import { formatList } from '../../mock/util'

    const columns = [
        {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' }
        },
        {
            title: '合同编号',
            dataIndex: 'contractNo'
        },
        {
            title: '合同名称',
            dataIndex: 'contractName',
            scopedSlots: { customRender: 'contractName' }
        },
        {
            title: '合同金额',
            dataIndex: 'contractAmount',
            scopedSlots: { customRender: 'contractAmount' }
        },
        {
            title: '签约日期',
            dataIndex: 'signDate',
            scopedSlots: { customRender: 'signDate' }
        },
        {
            title: '审批状态',
            dataIndex: 'auditStatus',
            scopedSlots: { customRender: 'auditStatus' }
        },
        {
            title: '建立日期',
            dataIndex: 'creationTime'
        },
        {
            title: '建立者',
            dataIndex: 'creatorUser',
            scopedSlots: { customRender: 'creatorUser' }
        },
    ]

    export default {
        name: 'ContractList',
        components: {
            STable,
            Ellipsis
        },
        data () {
            this.columns = columns
            return {
                // create model
                cities: [],
                show: false,
                // 查询参数
                queryParam: {},
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    console.log('loadData request parameters:', requestParameters)
                    return ContractService.items(requestParameters).then(res => {
                        return fixedList(res, requestParameters)
                    })
                }
            }
        },
        created () {
            getRoleList({ t: new Date() })
            ProjectService.tree().then(res => {
                const cities = []
                res.result.data.citys.forEach(item => {
                    const children = formatList(item.projects.items)
                    console.log(children)
                    cities.push({
                        label: item.city.nameCN,
                        value: item.city.id,
                        children: children
                    })
                })
                this.cities = cities
                this.$forceUpdate()
            })
        },
        methods: {
            handleToItem (record) {
                this.$router.push({ path: `/contract/item/${record.contractGuid}?type=view` })
            },
            handleToEdit (record) {
                this.$router.push({ path: `/contract/item/${record.contractGuid}?type=update` })
            },
            handleToAdd () {
                this.$router.push({ path: `/contract/item/0?type=create` })
            },
            search () {
                console.log('search')
                this.show = !this.show
                this.$refs.table.refresh(true)
            },
            onChange (value) {
                if (value.length >= 2) {
                    this.queryParam.ProjectGUID = value[value.length - 1]
                    this.$refs.table.refresh(true)
                } else {
                    this.queryParam.ProjectGUID = ''
                    this.$refs.table.refresh(true)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
  .search-form {
    background-color: #1E9FF2;
    padding: 20px;
    border-radius: 0.35rem;

    /deep/ .ant-form-item-label label {
      color: #fff;
    }
  }

</style>
