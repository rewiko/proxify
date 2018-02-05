<template>
  <b-row class="row justify-content-center">
    <b-col sm="12" lg="10">
      <groups-table></groups-table>
    </b-col>
  </b-row>
</template>

<script>
import groupsTable from "@/components/Groups";

export default {
  name: 'Groups',
  watchQuery: true,
  async asyncData(context) {
    context.componentBehavior = "fullList";
    let [getListRes] = await Promise.all([
      context.store.dispatch("groups/getList", context)
    ]);
    return { groups: getListRes };
  },
  components: {
    groupsTable
  },
  methods: {}
};
</script>
