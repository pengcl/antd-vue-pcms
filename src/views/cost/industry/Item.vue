<template>
  <page-header-wrapper>
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }">
    <a-card :bordered="false">
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-model-item prop="tradePackageCode" label="分判包编号">
              <a-input :disabled="true" v-model="form.tradePackageCode"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item prop="packageDate" label="日期">
              <a-date-picker
                :disabled="type === 'view'"
                v-model="form.packageDate"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item prop="packageTitle" label="分判包描述">
              <a-input
                :disabled="type === 'view'"
                v-model="form.packageTitle"
              >
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="18" :sm="18">
            <a-form-model-item prop="costCenters" label="范围">
              <a-select
                :disabled="type !== 'add'"
                mode="multiple"
                size="default"
                placeholder="请选择"
                @change="onChange"
                v-model="centers"
                :allowClear="true"
              >
                <a-select-option v-for="option in costCenters" :key="JSON.stringify(option)" :value="option.id">
                  {{ option.costCenterName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="6">
            <a-button @click="selectAllCostCenter" v-if="type === 'add'">全选</a-button>
          </a-col>
          <!-- <a-col :md="24" :sm="24">
            <a-form-model-item prop="itemTypeId" label="分判包类型">
              <a-select
                :disabled="type !== 'add'"
                placeholder="请选择"
                v-model="form.itemTypeId"
                @change="itemTypeChange"
              >
                <a-select-option v-for="option in budgetTypeItems" :key="JSON.stringify(option)" :nameCN="option.nameCN"  :value="option.id">
                  {{ option.nameCN }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col> -->
          <a-col :md="24" :sm="24">
            <a-form-model-item prop="elementTypeId" label="科目类型">
              <a-select
                :disabled="type !== 'add'"
                placeholder="请选择"
                v-model="form.elementTypeId"
              >
                <a-select-option v-for="option in elementItems" :key="JSON.stringify(option)" :value="option.id">
                  {{ option.nameCN }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-model-item prop="budgetAmount" label="金额">
              <a-input :disabled="true" v-model="form.budgetAmount" placeholder="汇总明细项金额"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24">
          <s-table
            style="margin-top: 5px"
            ref="table2"
            size="default"
            v-if="type === 'view'"
            rowKey="id"
            bordered
            :columns="_columns"
            :data="loadData2"
            :alert="false"
            :showPagination="false"
          >
            <span slot="budgetValue" slot-scope="text">{{ text | NumberFormat }}</span>
            <template slot="contractGUID">
              <a @click="jumpToContract">{{ form.contractNo || '' }}</a>
            </template>
            <template slot="projectTenderPackageId">
              <a @click="jumpToProjectTenderPackage">{{
                form.projectTenderPackageCode || ''
              }}</a>
            </template>
          </s-table>
          </a-col>
        </a-row>
      <a-row style="margin-top:10px;">
        <a-col :md="12" :sm="24">
          <a-button type="success" style="margin-right: 20px" v-if="type==='view' && this.form.auditStatus === '未审核' && ac('ADD')" :loading="loading.startBPM" @click="startBPM" 
            :disabled="form.budgetAmount <= 0">启动审批流程</a-button>
          <a-button type="success" style="margin-right: 20px" v-if="type==='view' && (this.form.auditStatus === '已审核' ||this.form.auditStatus === '审核中') && ac('VIEW')" :loading="loading.viewBPM" @click="viewBPM" 
            >查看审批流程</a-button>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-button-group style="float: right">
            <a-button v-if="type != 'view'" :loading="loading.save" type="success" @click="handleToSave">储存</a-button>
            <a-button type="danger" style="margin-left: 5px" @click="back">关闭</a-button>
          </a-button-group>
        </a-col>
      </a-row>

    </a-card>
    </a-form-model>
  </page-header-wrapper>
</template>

<script>
  import { CostService } from '@/views/cost/cost.service'
  import { SwaggerService } from '@/api/swagger.service'
  import moment from "moment"
  import { ac } from '@/views/user/user.service'
  import { STable, Ellipsis } from '@/components'
  import { Base as BaseService, DIALOGCONFIG } from '@/api/base'

  const _columns = [
    {
      title: '业态成本中心',
      dataIndex: 'costCenterName'
    },
    {
      title: '科目名称',
      dataIndex: 'elementInfoNameCN'
    },
    {
      title: '专业',
      dataIndex: 'budgetTitle'
    },
    {
      title: '金额',
      dataIndex: 'budgetValue',
      scopedSlots: { customRender: 'budgetValue' }
    },
    {
      title: '招投标包',
      dataIndex: 'projectTenderPackageId',
      scopedSlots: { customRender: 'projectTenderPackageId' }
    },
    {
      title: '合同',
      dataIndex: 'contractGUID',
      scopedSlots: { customRender: 'contractGUID' }
    }
  ]
  export default {
    name: 'Edit',
     components: {
      STable,
      Ellipsis,
    },
    data () {
      this._columns = _columns
      return {
        centers: [],
        costCenters: [],
        budgetTypeItems: [],
        elementItems: [],
        loading : {
          save : false,
          startBPM : false,
          viewBPM : false,
        },
        disabled:false,
        form: SwaggerService.getForm('TenderPackageCreateInputDto'),
        rules: {
          packageDate: [{ required: true, message: '请选择日期', trigger: 'blur' }],
          packageTitle: [{ required: true, message: '请输入分判包描述', trigger: 'blur' }],
          costCenters: [{ required: true, message: '请选择范围', trigger: 'blur' }],
          // itemTypeId: [{ required: true, message: '请选择分判包类型', trigger: 'change' }],
          elementTypeId: [{ required: true, message: '请选择科目类型', trigger: 'change' }]
        },
        loadData2: parameter => {
          return CostService.budgetItems({ Id: this.id }).then(res => {
            if (res.result.data != null) {
              return res.result
            }
          })
        }
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
    filters: {
      getValue (form, index) {
        const values = []
        const centers = form.costCenters ? form.costCenters : []
        centers.forEach((item, idsIndex) => {
          values.push(item.costCenterId)
        })
        return values
      }
    },
    created () {
      //分判包类型
      CostService.budgetTypeItems().then(res => {
        this.budgetTypeItems = JSON.parse(JSON.stringify(res.result.data))
        this.$forceUpdate()
      })
      //科目类型
      CostService.items().then(res => {
        const result = {
          result: {
            data: []
          }
        }
        const tempCodes = ['B', 'C', 'D', 'E', 'F', 'G']
        res.result.data.forEach(item => {
          if (tempCodes.includes(item.code)) {
            const obj = {}
            obj['id'] = item.id
            obj['nameCN'] = item.nameCN
            result.result.data.push(obj)
          }
        })
        this.elementItems = JSON.parse(JSON.stringify(result.result.data))
        this.$forceUpdate()
      })

      const requestParameters = Object.assign({ Id: this.ProjectGUID })
      CostService.centers(requestParameters).then(res => {
        this.costCenters = JSON.parse(JSON.stringify(res.result.data))
        this.$forceUpdate()
      })
      if (this.type !== 'add') {
        CostService.industryItem({ Id: this.id }).then(res => {
          this.form = res.result.data
          const values = []
          const centers = this.form.costCenters ? this.form.costCenters : []
          centers.forEach((item, idsIndex) => {
            values.push(item.costCenterId)
          })
          this.form.costCenters = values
          this.centers = values
        })
      }else{
        this.form.packageDate = moment(new Date())
      }
    },
    methods: {
      ac (action) {
        return ac(action, this.$route)
      },
      onChange (value, option) {
        this.form.costCenters = []
        option.forEach(item => {
          this.form.costCenters.push(JSON.parse(item.data.key).id)
        })
      },
      handleToSave () {
        let action = 'industryCreate'
        if(this.type === 'edit'){
          action = 'industryUpdate'
        }
        this.$refs.form.validate(valid => {
          if(valid){
            this.loading.save = true
            this.form.projectGUID = this.ProjectGUID
            this.form.itemTypeId = 0 //2020-12-04 新需求，取消专业分判包类型选项
            CostService[action](this.form).then(res => {
              if (res.result.statusCode === 200) {
                const that = this
                this.loading.save = false
                this.$message.info(this.type === 'edit' ? '修改成功' : '新增成功')
                that.$router.push({ path: `/cost/industry/list`})
              }
            }).catch(() => {
              this.loading.save = false
            })
          }
        })

      },
      back () {
        this.$router.push({ path: `/cost/industry/list`})
      },
      startBPM(){
        this.loading.startBPM = true
        CostService.projectIsNoStartAuditTenderPackageBatchReg(this.ProjectGUID).then(res =>{
          this.loading.startBPM = false
          if(res.result.statusCode === 200){
            if(res.result.data){
              this.$router.push({ path: `/cost/industry/batch/${res.result.data}?ProjectGUID=${this.ProjectGUID}&type=edit&packageId=${this.form.id}` })
            }else{
              this.$router.push({ path: `/cost/industry/batch/0?ProjectGUID=${this.ProjectGUID}&type=add&packageId=${this.form.id}` })
            }
          }
        }).catch((e) =>{
          this.loading.startBPM = false
          console.log('专业分判包-点击新增审批失败',e)
        })
      },
      viewBPM(){
        this.loading.viewBPM= true
        BaseService.viewBpm(this.form.tenderPackageBatchGUID).then(res => {
          this.loading.viewBPM= false
          if(res.result.statusCode === 200){
            setTimeout(function(){
              window.open(res.result.data)
            },200)
          }
        })
      },
      itemTypeChange(value,option){
        console.log('option',option.$options,option)
        this.form.itemTypeNameCN = JSON.parse(option.key).nameCN
      },
      selectAllCostCenter(){
        const centers = []
        this.costCenters.forEach(item =>{
          centers.push(item.id)
        })
        this.centers = centers
        this.form.costCenters = this.centers
        this.$forceUpdate()
      },
      jumpToContract () {
        this.$router.push({ path: `/contract/item/${this.form.contractGUID}?type=view` })
      },
      jumpToProjectTenderPackage () {
        this.$router.push({
          path: `/cost/bid/item/${this.form.projectTenderPackageId}?ProjectGUID=${this.ProjectGUID}&type=view`
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
        &:first-child{
          th{
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
  .ant-btn-group {
    margin-right: 8px;
  }
</style>
