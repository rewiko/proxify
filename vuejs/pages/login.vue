<template>
  <login/>
</template>

<script>
import Login from "~/components/Login.vue";

export default {
  layout: "blank",
  head: {
    bodyAttrs: {
      class: "app flex-row align-items-center"
    }
  },
  components: {
    Login
  }
};
</script>

