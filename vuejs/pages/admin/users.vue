<template>
  <b-row class="row justify-content-center">
    <b-col sm="12" lg="10">
      <users-table></users-table>
    </b-col>
  </b-row>
</template>

<script>
import usersTable from "@/components/Users";

export default {
  name: 'Users',
  watchQuery: true,
  async asyncData(context) {
    context.componentBehavior = "fullList";
    let [getListRes] = await Promise.all([
      context.store.dispatch("users/getList", context)
    ]);
    return { users: getListRes };
  },
  components: {
    usersTable
  },
  methods: {}
};
</script>
