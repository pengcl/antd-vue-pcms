<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <a-form-item label="项目编码">
                HZO-HZ4
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="房产项目名称(中)">
                杭州望江新城項目 (Testing)
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="中央合同编号">
                C-HZO-HZ4-ORG-14
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="合同名称">
                20200909
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24"></a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="审批状态">
                草拟中 (1.6)
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="CIP 总金额">
                $0
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="VO 总金额">
                $0
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="VOA 总金额">
                $0
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="基本资料">
          <base-info :type="type" :id="id" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="合同信息">
          <contract-info title="合同信息" value="8个任务" :bordered="true" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="预算调整">
          <budget-list title="预算调整" value="8个任务" :bordered="true" />
        </a-tab-pane>
        <a-tab-pane key="4" tab="合同量清单">
          <contract-list title="合同量清单" value="8个任务" :bordered="true" />
        </a-tab-pane>
        <a-tab-pane key="5" tab="付款条款">
          <pay-info title="付款条款" value="8个任务" :bordered="true" />
        </a-tab-pane>
        <a-tab-pane key="6" tab="附件">
          <attachment-list title="付款条款" value="8个任务" :bordered="true" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <footer-tool-bar>
      <a-button-group>
        <a-button :disabled="type === 'view'" @click="save()" v-if="type !== 'view'" :loading="loading" type="primary">
          {{ id === '0' ? '新增' : '保存' }}
        </a-button>
        <a-button :disabled="type === 'view'" @click="handleToEdit()" v-if="type === 'view'" type="primary">
          编辑
        </a-button>
      </a-button-group>
      <a-button-group disabled>
        <a-button :disabled="type === 'view'" @click="approve()" type="success">
          提请审批
        </a-button>
      </a-button-group>
      <a-button-group>
        <a-button @click="back()" type="danger">
          关闭
        </a-button>
      </a-button-group>
    </footer-tool-bar>
  </page-header-wrapper>
</template>
<script>
  import BaseInfo from '@/views/contract/components/BaseInfo'
  import ContractInfo from '@/views/contract/components/ContractInfo'
  import PayInfo from '@/views/contract/components/PayInfo'
  import ContractList from '@/views/contract/components/ContractList'
  import BudgetList from '@/views/contract/components/BudgetList'
  import AttachmentList from '@/views/contract/components/AttachmentList'
  import { FooterToolBar } from '@/components'

  const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters']
  export default {
    components: { AttachmentList, BudgetList, ContractList, PayInfo, ContractInfo, BaseInfo, FooterToolBar },
    data () {
      return {
        baseForm: this.$form.createForm(this),
        memberForm: this.$form.createForm(this),
        loading: false,
        value: '',
        dataSource: [],
        selectedItems: []
      }
    },
    created () {
    },
    computed: {
      id () {
        return this.$route.params.id
      },
      type () {
        return this.$route.query.type
      },
      filteredOptions () {
        return OPTIONS.filter(o => !this.selectedItems.includes(o))
      }
    },
    methods: {
      approve () {
        console.log('approve')
      },
      save () {
        console.log('save')
      },
      handleChange (selectedItems) {
        this.selectedItems = selectedItems
      },
      back () {
        console.log('back')
        this.$router.push({ path: `/contract/list` })
      },
      handleToEdit () {
        console.log('handleToEdit')
        this.$router.push({ path: `/contract/item/${this.id}?type=edit` })
      }
    }
  }
</script>
<style lang="less" scoped>
  .ant-btn-group {
    margin-right: 8px;
  }
</style>
