<template>
      <register/>
</template>

<script>
import Register from '~/components/Register.vue'

export default {
  layout: 'blank',
  head: {
    bodyAttrs: {
      class: 'app flex-row align-items-center'
    }
  },
  components: {
    Register
  }
}
</script>

