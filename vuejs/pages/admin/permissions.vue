<template>
  <b-row class="row justify-content-center">
    <b-col sm="12" lg="10">
      <permissions-table></permissions-table>
    </b-col>
  </b-row>
</template>

<script>
import permissionsTable from "@/components/Permissions";

export default {
  name: 'Permissions',
  watchQuery: true,
  async asyncData(context) {
    context.componentBehavior = "fullList";
    let [getListRes] = await Promise.all([
      context.store.dispatch("permissions/getList", context)
    ]);
    return { permissions: getListRes };
  },
  components: {
    permissionsTable
  },
  methods: {}
};
</script>
