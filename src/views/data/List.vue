<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <s-table :data="loadData"></s-table>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { Ellipsis, STable } from '@/components'
import { DataService } from '@/views/data/data.service'

export default {
  name: 'DataList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      queryParam: {},
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return new Promise((resolve, reject) => {
          return resolve([1, 2])
        })
      }
    }
  },
  created () {
    DataService.items().then(res => {
      console.log(res)
    })
  }
}
</script>

<style scoped>

</style>
