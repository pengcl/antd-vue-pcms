<template>
  <div>
    <a-col :md="24" :sm="24">
      <table>
        <thead>
        <tr>
          <th colspan="6">
            <a-button icon="plus">
              新增
            </a-button>
          </th>
        </tr>
        <tr>
          <th>操作</th>
          <th>文件名称</th>
          <th>附件名称</th>
          <th>附件页数</th>
          <th>上传时间</th>
          <th>上传人</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </a-col>
  </div>
</template>

<script>
    import { SignedService } from '../../signed.service'

    export default {
        name: 'BaseInfoAttachment',
        data () {
            return {
                selection: {},
                loading: false,
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
            }
        },
        watch: {
            /*'data.mainContractGID' (value) {
                this.getAttachmentList(this.data['id'], this.data['mainContractGID'], this.data['secondaryContractGID'])
            },*/
        },
        created () {

        },
        methods: {
            getAttachmentList (paymentGID, mainContractGID, secondaryContractGID) {
                SignedService.attachmentList(paymentGID, mainContractGID, secondaryContractGID).then(res => {
                        console.log(res)
                    }
                )
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