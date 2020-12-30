<template>
  <page-header-wrapper>
    <a-card id="reportCard" :bordered="false">
      <iframe :style="{height: height}" id="iframe" :src="url"></iframe>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { ReportService } from '@/views/report/report.service'

  export default {
    name: 'ReportEnd',
    data () {
      return {
        url: '',
        height: 0
      }
    },
    created () {
      ReportService.item('CostExpenseEndLevelReport').then(res => {
        this.url = res.result.data
        const $main = { w: document.querySelector('.ant-pro-basicLayout-content').offsetWidth, h: document.querySelector('.ant-pro-basicLayout-content').offsetHeight }
        this.height = $main.h + 'px'
        console.log(this.height)
        this.$forceUpdate()
      })
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .ant-card {
    height: 100%;
    iframe {
      width: 100%;
      border: none;
    }
  }
</style>
