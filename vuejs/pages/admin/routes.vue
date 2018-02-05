<template>
  <b-row class="row justify-content-center">
    <b-col sm="12" lg="10">
      <routes-table></routes-table>
    </b-col>
  </b-row>
</template>

<script>
import routesTable from "@/components/Routes";

export default {
  name: 'Routes',
  watchQuery: true,
  async asyncData(context) {
    context.componentBehavior = "fullList";
    let [getListRes] = await Promise.all([
      context.store.dispatch("routes/getList", context)
    ]);
    return { routes: getListRes };
  },
  components: {
    routesTable
  },
  methods: {}
};
</script>
