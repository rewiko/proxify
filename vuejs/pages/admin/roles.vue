<template>
  <b-row class="row justify-content-center">
    <b-col sm="12" lg="10">
      <roles-table></roles-table>
    </b-col>
  </b-row>
</template>

<script>
import rolesTable from "@/components/Roles";

export default {
  name: 'Roles',
  watchQuery: true,
  async asyncData(context) {
    context.componentBehavior = "fullList";
    let [getListRes] = await Promise.all([
      context.store.dispatch("roles/getList", context)
    ]);
    return { roles: getListRes };
  },
  components: {
    rolesTable
  },
  methods: {}
};
</script>
