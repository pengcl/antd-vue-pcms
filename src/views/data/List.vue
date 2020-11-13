<template>
  <div>
    DataList
  </div>
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
      return {}
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
