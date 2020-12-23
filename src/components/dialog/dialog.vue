<template>
  <a-modal
    :title="title"
    :visible="visible"
    :maskClosable="false"
    :confirm-loading="confirmLoading"
    @ok="confirm"
    @cancel="cancel"
  >
    <p>{{ content }}</p>
  </a-modal>
</template>
<script>
  export default {
    name: 'DialogService',
    data () {
      return {
        title: '',
        content: '',
        confirmText: '',
        cancelTExt: '',
        visible: false,
        confirmLoading: false
      }
    },
    methods: {
      show (body) {
        this.title = body.title || ''
        this.content = body.content || ''
        this.confirmText = body.confirmText || ''
        this.cancelText = body.cancelText || ''
        this.visible = true
      },
      confirm (fn) {
        this.visible = false
        fn()
      },
      cancel (fn) {
        this.visible = false
        fn()
      }
    }
  }
</script>
