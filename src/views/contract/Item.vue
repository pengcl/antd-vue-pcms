<template>
  <page-header-wrapper>
    <a-card v-if="form && project" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <a-form-item label="项目编码">
                {{ project.projectCode }}
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item label="房产项目名称(中)">
                {{ project.projectName }}
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="中央合同编号">
                {{ form.contract.contractNo }}
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="合同名称">
                {{ form.contract.contractName }}
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

      <a-tabs default-active-key="1" :animated="false">
        <a-tab-pane key="1" tab="基本资料">
          <base-info :project="project" :data="form" :type="type" :id="id"/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="合同信息">
          <contract-info :data="form" :type="type" :id="id"/>
        </a-tab-pane>
        <a-tab-pane key="3" tab="预算调整">
          <budget-list :data="form" :type="type" :id="id"/>
        </a-tab-pane>
        <a-tab-pane :project="project" key="4" tab="合同量清单">
          <contract-list :data="form" :type="type" :id="id"/>
        </a-tab-pane>
        <a-tab-pane key="5" tab="付款条款">
          <pay-info :data="form" :type="type" :id="id"/>
        </a-tab-pane>
        <a-tab-pane key="6" tab="附件">
          <attachment-list :data="form" :type="type" :id="id"/>
        </a-tab-pane>
      </a-tabs>
      <a-row :gutter="48">
        <a-col :md="24" :sm="24" style="margin-bottom: 10px">
          <a-button-group>
            <a-button  @click="approve" type="success">
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
import BaseInfo from '@/views/contract/components/BaseInfo'
import ContractInfo from '@/views/contract/components/ContractInfo'
import PayInfo from '@/views/contract/components/PayInfo'
import ContractList from '@/views/contract/components/ContractList'
import BudgetList from '@/views/contract/components/BudgetList'
import AttachmentList from '@/views/contract/components/AttachmentList'
import { ContractService } from '@/views/contract/contract.service'
import { SwaggerService } from '@/api/swagger.service'
import { ProjectService } from '@/views/project/project.service'

export default {
  name: 'ContractItem',
  components: { AttachmentList, BudgetList, ContractList, PayInfo, ContractInfo, BaseInfo},
  data () {
    return {
      tabActiveKey: 1,
      loading: false,
      project: null,
      form: SwaggerService.getForm('ContractAllInfoDto')
    }
  },
  created () {
    if (this.id !== '0') {
      ContractService.item(this.id).then(res => {
        this.form = res.result.data
        this.form.master = {}
        ProjectService.view2(this.form.contract.projectID).then(res => {
          console.log(res)
          this.project = res.result.data
        })
      })
    } else {
      this.form.contract.id = 0
      this.form.contract.isDeleted = false
      this.form.master = {}
      ProjectService.view(this.ProjectGUID).then(res => {
        console.log(res)
        this.project = res.result.data
        this.form.contract.projectID = this.project.projectCode
      })
      // this.form.contract.projectID = 0;
    }
  },
  computed: {
    id () {
      return this.$route.params.id
    },
    type () {
      return this.$route.query.type
    },
    ProjectGUID () {
      return this.$route.query.ProjectGUID
    }
  },
  watch: {},
  methods: {
    approve () {
      console.log('approve')
    },
    save () {
      ContractService[this.type](this.form).then(res => {
        console.log(res)
      })
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
