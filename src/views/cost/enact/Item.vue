<template>
  <page-header-wrapper :property="{}">
    <a-card :bordered="false">

      <a-row>
        <a-col :md="24" :sm="24">
          <a-button
            v-for="(item,index) in treeLevel"
            :key="index"
            :type="item.type"
            shape="circle"
            @click="changeLevel(item.index)"
            style="margin-left: 5px"
          >
            {{index+1}}
          </a-button>
          <a-table
            v-if="datas && datas.length"
            style="margin-top: 5px"
            ref="table"
            size="default"
            rowKey="elementInfoId"
            bordered
            :columns="columns"
            :data-source="datas"
            :alert="false"
            :pagination="false"
            :scroll="{ x: columnsWidth, y: 500 }"
            :defaultExpandAllRows="true"
          >
            <span :slot="'cost' + item.costCenterId" v-for="item in ars" :key="'cost' + item.costCenterId"
                  slot-scope="text, record">
              <a-input-number
                :disabled="type === 'view' || auditStatus === '审核中'"
                v-if="record.childs.length == 0"
                v-model="record['cost' + item.costCenterId]"
                @blur="e => checkChange(e, record, item.costCenterId)"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\\s?|(,*)/g, '')"
                :precision="2"
              />
              <template v-else>
                {{ record['cost' + item.costCenterId]| NumberFormat }}
              </template>
            </span>
          </a-table>
        </a-col>
      </a-row>
      <a-row style="margin-top: 10px">
        <a-col :md="12" :sm="24">
          <a-button v-if="auditStatus === '未审核' || auditStatus === '已审核'" type="primary" style="margin-right: 20px" @click="runAudit">启动审批流程
          </a-button>
          <a-button v-if="auditStatus === '审核中' || auditStatus === '已审核'" type="success" style="margin-right: 20px" @click="viewAudit">查看审批流程
          </a-button>
          <a-button :disabled="type === 'view' || disabled" :loading="loading.save" @click="handleToSave('save')" type="success">储存
          </a-button>
          <a-button @click="back" style="margin-left: 5px" type="danger">关闭</a-button>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-button-group style="float: right">
            <a-button style="margin-right: 10px" type="success">导入导出</a-button>
            <a-button type="success">审批记录</a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import {CostService} from '@/views/cost/cost.service'
  import {ContractService} from '@/views/contract/contract.service'
  import {SwaggerService} from '@/api/swagger.service'
  import {Ellipsis, STable} from '@/components'

  const defaultColumns = [
    {
      title: '科目代码',
      width: 200,
      fixed: 'left',
      dataIndex: 'elementInfoCode',
      key: 'elementInfoCode'
    },
    {
      title: '科目名称',
      width: 300,
      fixed: 'left',
      dataIndex: 'elementInfoNameCN',
      key: 'elementInfoNameCN'
    }
  ]

  const columns = defaultColumns

  export default {
    name: 'Table',
    components: {
      STable,
      Ellipsis
    },
    data() {
      this.columns = columns
      return {
        visible: false,
        treeLevel: [],
        datas: [],
        ars: [],
        isUpdate: false,
        confirmLoading: false,
        mdl: null,
        columnsWidth: 400,
        loading: {
          save: false
        },
        disabled:false,
        startBPMUrl: '',
        viewBPMUrl: '',
        auditStatus: '',
        active: '',
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const _columns = JSON.parse(JSON.stringify(defaultColumns))
          const requestParameters = {
            MaxResultCount: 1000,
            ProjectGUID: this.ProjectGUID,
            ElementTypeId: this.id
          }
          return CostService.subjectViewItems(requestParameters).then(res => {
            this.ars = res.result.data
            this.columnsWidth = 500 + this.ars.length * 200
            if (this.columnsWidth < 1560) {
              this.columnsWidth = 1560
            }
            let index = 0
            this.ars.forEach(item => {
              ++index
              const obj = {}
              obj.title = item.costCenterName
              obj.dataIndex = 'cost' + item.costCenterId
              obj.scopedSlots = {customRender: 'cost' + item.costCenterId}
              if (index !== this.ars.length) {
                obj.width = (this.columnsWidth - 500) / this.ars.length
              }
              _columns.push(obj)
            })
            this.columns = _columns
            this.$forceUpdate()
            const rows = res.result.data[0].elementItem.childs
            forEachRow(rows, res.result.data)
            const result = []
            const obj = insertFirstRow(res.result.data[0].elementItem, res.result.data)
            obj['childs'] = rows
            obj['children'] = rows
            result.push(obj)
            //获取树级数量
            this.levelData(result)
            this.datas = result
          })

          function forEachItem(datas, elementId) {
            let result = null
            for (var i in datas) {
              const data = datas[i]
              if (data.elementInfoId === elementId) {
                result = data
                break
              }
              if (data.childs && data.childs.length > 0) {
                result = forEachItem(data.childs, elementId)
                if (result != null) {
                  break
                }
              }
            }
            return result
          }

          function forEachRow(datas, columnDatas) {
            for (var i in datas) {
              var data = datas[i]
              data['costCenters'] = []
              columnDatas.forEach(item => {
                if (item.elementItem) {
                  var costName = 'cost' + item.costCenterId
                  if (item.elementItem) {
                    const center = {}
                    center['costCenterId'] = item.costCenterId
                    center['elementInfoId'] = data.elementInfoId
                    var costColumn = forEachItem([item.elementItem], data.elementInfoId)
                    if (costColumn != null) {
                      data[costName] = costColumn.amount !== null ? costColumn.amount : 0
                      center['amount'] = costColumn.amount !== null ? costColumn.amount : 0
                    }
                    data['costCenters'].push(center)
                  }
                }
              })
              if (data.childs && data.childs.length > 0) {
                forEachRow(data.childs, columnDatas)
                data.children = data.childs
              }
            }
          }

          function insertFirstRow(data, columnDatas) {
            data['costCenters'] = []
            columnDatas.forEach(item => {
              var costName = 'cost' + item.costCenterId
              if (item.elementItem) {
                var costColumn = forEachItem([item.elementItem], data.elementInfoId)
                if (costColumn != null) {
                  data[costName] = costColumn.amount !== null ? costColumn.amount : 0
                }
              }
            })
            return data
          }
        }
      }
    },
    filters: {},
    created() {
      this.loadData()
      const parameter = { ProjectGUID: this.ProjectGUID , ElementTypeId: this.id }
      CostService.budgetPlanAuditInfo(parameter).then(res => {
        if (res.result.statusCode === 200) {
          this.startBPMUrl = res.result.data.startOrViewBPMUrl
          this.auditStatus = res.result.data.auditStatus
        }
      })
    },
    computed: {
      id() {
        return this.$route.params.id
      },
      type() {
        return this.$route.query.type
      },
      ProjectGUID() {
        return this.$route.query.ProjectGUID
      }
    },
    methods: {
      back() {
        this.$router.push({path: `/cost/enact/list`})
      },
      handleToSave(type) {
        this.disabled = true
        const result = {}
        const items = []
        // 组装保存数据
        result['ProjectGUID'] = this.ProjectGUID
        result['budgetBaseTypeId'] = 83
        result['elementTypeId'] = this.id
        getResults(this.datas)

        function getResults(datas) {

          datas.forEach(item => {
            if (item.costCenters.length > 0) {
              item.costCenters.forEach(center => {
                const obj = {}
                obj['costCenterId'] = center.costCenterId
                obj['elementInfoId'] = center.elementInfoId
                obj['amount'] = center.amount !== null ? center.amount : 0

                items.push(obj)
              })
            }
            if (item.children && item.children.length > 0) {
              getResults(item.children)
            }
          })
        }

        result['items'] = items
        this.loading.save = true
        CostService.update(result).then(res => {
          this.loading.save = false
          this.disabled = false
          if (res.result.statusCode === 200) {
            if (type === 'audit') {
              const tempwindow = window.open('_blank')
              tempwindow.location = this.startBPMUrl
            } else {
              this.$message.info('修改成功')
              this.back()
            }
          }
        })
      },
      checkChange(e, record, costCenterId) {
        // 找到如果数据内存在旧数据，先移除，再添加
        this.isUpdate = false
        record.costCenters.forEach(center => {
          if (center.costCenterId === costCenterId) {
            center.amount = e.target.value
            this.isUpdate = true
          }
        })
        let totalCost = 0
        this.datas.forEach(item => {

          function childSum(datas,costCenterId) {
            let result = null
            for (var i in datas) {
              const data = datas[i]
              result += data['cost' + costCenterId]
              if (data.childs && data.childs.length > 0) {
                result += childSum(data.childs, costCenterId)
              }
            }
            return result
          }

          item.children.forEach(child => {
            let childCost = 0
            if (child.children) {
              childCost = childSum(child.children, costCenterId)
            } else {
              childCost += child['cost' + costCenterId]
            }
            child['cost' + costCenterId] = childCost
            totalCost += child['cost' + costCenterId]
          })
          item['cost' + costCenterId] = totalCost
        })
        if (!this.isUpdate) {
          const item = {}
          item['costCenterId'] = costCenterId
          item['elementInfoId'] = record.elementInfoId
          item['amount'] = e.target.value

          record.costCenters.push(item)
        }
        this.$forceUpdate()
      },
      changeLevel(index) {
        // 处理按钮的样式
        for (let i = 0; i < this.treeLevel.length; i++) {
          if (i === index) {
            this.treeLevel[i].type = 'primary'
          } else {
            this.treeLevel[i].type = 'dashed'
          }
          // 处理树的显示或者隐藏
          if (index !== 0) {
            const first = document.getElementsByClassName('ant-table-row ant-table-row-level-0')[0]
            first.getElementsByClassName('ant-table-row-expand-icon')[0].classList.remove('ant-table-row-collapsed')
            first.getElementsByClassName('ant-table-row-expand-icon')[0].classList.add('ant-table-row-expanded')
            // 低于此级别的全部显示
            for (let j = 1; j <= index; j++) {
              let className = 'ant-table-row ant-table-row-level-' + j
              document.getElementsByClassName(className).forEach(item => {
                if (index === j) {
                  item.getElementsByClassName('ant-table-row-expand-icon')[0].classList.remove('ant-table-row-expanded')
                  item.getElementsByClassName('ant-table-row-expand-icon')[0].classList.add('ant-table-row-collapsed')
                } else {
                  item.getElementsByClassName('ant-table-row-expand-icon')[0].classList.remove('ant-table-row-collapsed')
                  item.getElementsByClassName('ant-table-row-expand-icon')[0].classList.add('ant-table-row-expanded')
                }
                item.style.display = ''
              })
            }
            // 高于此级别的全部隐藏
            for (let j = index + 1; j < this.treeLevel.length; j++) {
              let className = 'ant-table-row ant-table-row-level-' + j
              document.getElementsByClassName(className).forEach(item => {
                item.style.display = 'none'
              })
            }
          } else {
            const first = document.getElementsByClassName('ant-table-row ant-table-row-level-0')[0]
            first.getElementsByClassName('ant-table-row-expand-icon')[0].classList.remove('ant-table-row-expanded')
            first.getElementsByClassName('ant-table-row-expand-icon')[0].classList.add('ant-table-row-collapsed')
            for (let j = 1; j < this.treeLevel.length; j++) {
              let className = 'ant-table-row ant-table-row-level-' + j
              document.getElementsByClassName(className).forEach(item => {
                item.style.display = 'none'
              })
              // document.getElementsByClassName('ant-table-row ant-table-row-level-0').getElementsByClassName('ant-table-row-expand-icon').addClass('ant-table-row-collapsed')
            }
          }
        }

      },
      getMaxlevel(treeData) {
        let level = 0
        let v = this
        let maxLevel = 0

        function loop(data, level) {
          data.forEach(item => {
            item.level = level
            if (level > maxLevel) {
              maxLevel = level
            }
            if ('children' in item) {
              if (item.children.length > 0) {
                loop(item.children, level + 1)
              }
            }
          })
        }

        loop(treeData, 1)
        return maxLevel
      },
      levelData(result) {
        const level = this.getMaxlevel(result)
        for (let i = 0; i < level; i++) {
          const obj = {}
          obj.index = i
          obj.type = 'dashed'
          this.treeLevel.push(obj)
        }
      },
      runAudit() {
        const _this = this
        if (this.startBPMUrl !== '') {
          this.handleToSave('audit')

        } else {
          _this.$message.error('启动审批链接不存在')
        }
      },
      viewAudit() {
        const _this = this
        if (this.viewBPMUrl !== '') {
          const tempwindow = window.open('_blank')
          tempwindow.location = this.viewBPMUrl
        } else {
          _this.$message.error('查看审批链接不存在')
        }
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

  /deep/ .ant-table-row-level-1 {
    background: #d7f4ff !important;
  }
</style>
