<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="中央合同编号"> {{ form.contract.contractNo }}</a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="合同名称">{{ form.contract.contractName }}</a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-row>
        <a-col :md="24" :sm="24">
          <div
            style="padding-top:5px; padding-bottom:5px;padding-left:30px;background-color:#f5f5f5;border-bottom:0;border:1px solid #ccc;">
            <a-button icon="plus" @click="add()">
              新增发票
            </a-button>
          </div>
          <a-table
            ref="table"
            :row-key="record => record._id"
            :columns="columns"
            :data-source="billList | filterDeleted"
            :scroll="{  x: 'calc(700px + 50%)' }"
            :pagination="pagination"
            bordered
          >
          <span slot="action" slot-scope="text,record,index">
            <a-button @click="edit(record)"
                      icon="edit"
                      v-if="record.show"
                      style="margin-right: 5px;margin-bottom: 5px">编辑</a-button>
            <a-button @click="save(record)"
                      :disabled="disabled"
                      icon="save"
                      v-if="!record.show"
                      style="margin-right: 5px;margin-bottom: 5px">
                  保存
                </a-button>
            <a-upload name="file"
                      :multiple="false"
                      v-if="record.invoiceType && !record.show && !record.billFileName"
                      :before-upload="beforeUpload">
                  <a-button @click="choose(index)">请选择</a-button>
                </a-upload>
                <a-button @click="del(index)" icon="close">
                  删除
                </a-button>
          </span>


            <span slot="invoiceType" slot-scope="text,record">
            <a-select
              placeholder="请选择"
              @change="onchange"
              v-model="record.invoiceType"
              v-decorator="['item.invoiceType', { rules: [{required: true, message: '请选择票据类型'}] }]">
                  <a-select-option
                    v-for="type in billTypeList"
                    :value="type"
                    :key="type">{{ type }}
                  </a-select-option>
                </a-select>
          </span>

            <span slot="paymentCode" slot-scope="text,record,index">
              <a-input
                :value="record.paymentCode"
                @click="showSelect(''+((pageNumber-1)*10 + index))"
                :read-only="true"></a-input>
              <select-payment-modal :ref="'payment'+((pageNumber-1)*10 + index)"
                                    :contractGID="id"
                                    :visible="visibles[''+((pageNumber-1)*10 + index)] ? visibles[''+((pageNumber-1)*10 + index)] : false"
                                    @cancel="handleCancel(''+((pageNumber-1)*10 + index))"
                                    @ok="handleOk((pageNumber-1)*10 + index)"></select-payment-modal>
            </span>

            <span slot="billNum" slot-scope="text,record">
            <a-input v-model="record.billNum"></a-input>
          </span>

            <span slot="billAmount" slot-scope="text,record,index">
            <a-input-number v-model="record.billAmount"
                            @change="e => billAmountChange(e,record,'billAmount')"
                            :min="0"
                            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :precision="2"></a-input-number>
          </span>

            <span slot="taxRate" slot-scope="text,record">
            <a-input-number v-model="record.taxRate"
                            @change="e => taxRateChange(e,record,'taxRate')"
                            :min="0"
                            :max="100"
                            :formatter="value => `${value}%`"
                            :parser="value => value.replace('%', '')"></a-input-number>
          </span>

            <span slot="taxAmount" slot-scope="text,record">
            <a-input-number v-model="record.taxAmount"
                            @change="taxAmountChange(e,record,'taxAmount')"
                            :min="0"
                            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :precision="2"></a-input-number>
          </span>

            <span slot="noTaxAmount" slot-scope="text,record">
            <a-input-number :disabled="true"
                            v-model="record.noTaxAmount"
                            @change="noTaxAmountChange"
                            :min="0"
                            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :precision="2"></a-input-number>
          </span>

            <span slot="billDate" slot-scope="text,record">
            <a-date-picker v-model="record.billDate"></a-date-picker>
          </span>

            <span slot="billFileName" slot-scope="text,record">
            <a :href="record.billFileUrl" target="_blank" v-if="record.billFileName">{{record.billFileName}}</a>
          </span>

            <span slot="remark" slot-scope="text,record">
            <a-input v-model="record.remark"></a-input>
          </span>
          </a-table>
        </a-col>
        <a-col sm="24" :md="24" style="margin-top: 10px">
          <a-button-group>
            <a-button type="danger" @click="back">关闭</a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
    import { SignedService } from '@/views/pay/signed/signed.service'
    import SelectPaymentModal from '../modules/SelectPaymentModal'
    import { ContractService } from '@/views/contract/contract.service'
    import { SwaggerService } from '@/api/swagger.service'
    import { Base as BaseService } from '@/api/base'

    const columns = [
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            width: 210
        },
        {
            title: '付款单号',
            dataIndex: 'paymentCode',
            scopedSlots: { customRender: 'paymentCode' },
            width: 200
        },
        {
            title: '票据类型',
            dataIndex: 'invoiceType',
            scopedSlots: { customRender: 'invoiceType' },
            width: 180
        },
        {
            title: '发票编号',
            dataIndex: 'billNum',
            scopedSlots: { customRender: 'billNum' },
            width: 150
        },
        {
            title: '发票金额',
            dataIndex: 'billAmount',
            scopedSlots: { customRender: 'billAmount' },
            width: 180,
        },
        {
            title: '税率',
            dataIndex: 'taxRate',
            scopedSlots: { customRender: 'taxRate' },
            width: 150
        },
        {
            title: '税额',
            dataIndex: 'taxAmount',
            scopedSlots: { customRender: 'taxAmount' },
            width: 180,
        },
        {
            title: '不含税金额',
            dataIndex: 'noTaxAmount',
            scopedSlots: { customRender: 'noTaxAmount' },
            width: 180,
        },
        {
            title: '发票日期',
            dataIndex: 'billDate',
            scopedSlots: { customRender: 'billDate' },
            width: 180
        },
        {
            title: '发票附件',
            dataIndex: 'billFileName',
            scopedSlots: { customRender: 'billFileName' },
            width: 180
        },
        {
            title: '备注',
            dataIndex: 'remark',
            scopedSlots: { customRender: 'remark' },
            width: 150
        }
    ]

    export default {
        name: 'List',
        components: { SelectPaymentModal },
        data () {
            return {
                columns: columns,
                billList: [],
                billType: '',
                billTypeList: [],
                visibles: {},
                form: SwaggerService.getForm('ContractAllInfoDto'),
                masterID: 0,
                disabled: false,
                pageNumber: 1
            }
        },
        computed: {
            id () {
                return this.$route.params.id
            },
            pagination () {
                const that = this
                return {
                    onChange: function (pageNumber) {
                        that.pageNumber = pageNumber
                        that.$forceUpdate()
                    }
                }
            }
        },
        created () {
            SignedService.billList().then(res => {
                this.billTypeList = res.result.data
            })
            ContractService.item(this.id).then(res => {
                this.form = res.result.data
            })
            this.getData()
        },
        filters: {
            filterDeleted (items) {
                return items.filter(item => !item.isDeleted)
            }
        },
        methods: {
            edit (record) {
                record.show = false
            },
            getData () {
                SignedService.getBillList(this.id, '').then(res => {
                    if (res.result.data.length > 0) {
                        res.result.data.forEach(item => {
                            item.isTemp = false
                            item.isDeleted = false
                            item.show = true
                        })
                    }
                    this.billList = res.result.data
                    this.billList = this.billList.sort((a, b) => b.billNum - a.billNum)
                    this.$forceUpdate()
                })
            },
            handleOk (index) {
                const data = this.$refs['payment' + index].selected
                this.billList[index].paymentGID = data.gid
                this.billList[index].paymentCode = data.paymentCode
                this.$forceUpdate()
                this.visibles['' + index] = false
            },
            handleCancel (key) {
                this.visibles[key] = false
            },
            showSelect (key) {
                this.$set(this.visibles, key, true)
            },
            billAmountChange (value, record, key) {
                record[key] = value
                if (record['taxRate']) {
                    record['taxAmount'] = record[key] * (record['taxRate'] / 100) / (record['taxRate'] / 100 + 1)
                    record['noTaxAmount'] = record[key] - record['taxAmount']
                }
                this.$forceUpdate()
            },
            taxRateChange (value, record, key) {
                record[key] = value
                if (record['billAmount']) {
                    record['taxAmount'] = (record[key] / 100) * record['billAmount'] / (record[key] / 100 + 1)
                    record['noTaxAmount'] = record['billAmount'] - record['taxAmount']
                }
                this.$forceUpdate()
            },
            taxAmountChange (value, record, key) {
                record[key] = value
                record['noTaxAmount'] = record['billAmount'] - record[key]
                this.$forceUpdate()
            },
            noTaxAmountChange (value) {
                this.$forceUpdate()
            },
            add () {
                const item = {
                    isDeleted: false,
                    isTemp: true,
                    id: 0,
                    gid: '00000000-0000-0000-0000-000000000000',
                    contractGID: this.id,
                    billType: '',
                    billNum: '',
                    billAmount: '',
                    taxRate: '',
                    noTaxAmount: '',
                    billDate: '',
                    billFileID: '',
                    billFileName: '',
                    billFileUrl: '',
                    remark: ''
                }
                if (this.billList.length < 1) {
                    this.billList.push(item)
                } else {
                    this.billList.unshift(item)
                }

            },
            del (index) {
                if (this.billList[index].isTemp) {
                    if (this.billList[index].billFileID) {
                        this.removeFile(this.billList[index].billFileID)
                    }
                    this.billList.splice(index, 1)
                } else {
                    this.removeFile(this.billList[index].billFileID)
                    this.deleteBill(this.billList[index].gid)
                    this.billList[index].isDeleted = true
                }
                this.$forceUpdate()
            },
            beforeUpload (file) {
                this.handleUpload(file)
                return false
            },
            handleUpload (file) {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('masterId', this.masterID)
                formData.append('businessID', this.id)
                formData.append('businessType', 'bill')
                formData.append('remark', '发票')
                formData.append('subInfo1', this.billType) //文件类型
                formData.append('subInfo2', '') // 文件名
                formData.append('subInfo3', '') // 合同id
                this.uploading = true
                const _this = this
                this.$http.post('/api/services/app/UploadAppservice/CommonUpload', formData, {
                    contentType: false,
                    processData: false,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                    .then((response) => {
                        this.billList[this.index].billFileID = response.result.data.id
                        this.billList[this.index].billFileName = response.result.data.fileName
                        this.billList[this.index].billFileUrl = response.result.data.fileUrl
                        this.masterID = response.result.data.masterID
                        this.$forceUpdate()
                        _this.$message.success('上传成功')
                        _this.$emit('ok', response.url)
                        _this.visible = false
                    })
            },
            removeFile (id) {
                BaseService.removeFile(id).then(res => {
                    console.log(res)
                })
            },
            deleteBill (gid) {
                SignedService.delete(gid).then(res => {
                    if (res.result.statusCode === 200) {
                        this.$message.success('删除成功！')
                    }
                })
            },
            choose (index) {
                this.index = index
            },
            onchange (value) {
                this.billType = value
            },
            back () {
                this.$router.push({
                    path: '/pay/signed/list'
                })
            },
            save (record) {
                this.disabled = true
                SignedService[record.isTemp ? 'createBill' : 'updateBill'](record).then(res => {
                    if (res.result.statusCode === 200) {
                        this.$message.success('保存成功！')
                        this.disabled = false
                        this.getData()
                    } else {
                        this.disabled = false
                    }
                })

            }
        }
    }
</script>

<style lang="less" scoped>
  .ant-btn-group {
    margin-right: 8px;
  }
</style>