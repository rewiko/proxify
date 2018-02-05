<template>
  <div class="row justify-content-center">
      <div class="text-center">
        <div>
        <h1 class="display-3">403</h1>
        <h4 class="pt-3">Access Forbidden</h4>
        <p class="text-muted">This page is forbidden.</p>
          <button-custom
            name="Back Home"
            url="/"
            class="link-color"
            btnClasses="btn-primary active mt-3"
          />
        </div>
    </div>
  </div>
</template>
<script>
import ButtonCustom from "../ButtonCustom";

export default {
  name: 'error-403',
  components: {
    ButtonCustom
  },
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
