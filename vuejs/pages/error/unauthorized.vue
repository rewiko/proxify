<template>
  <div class="nuxt-error">
    <component :is="errorPage" :error="error" />
  </div>
</template>

<script>
import error403 from '~/components/error/403.vue';
export default {
  name: 'nuxt-error',
  layout: 'blank', // optional
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    errorPage() {
      return error403;
    },
  }
};
</script>
