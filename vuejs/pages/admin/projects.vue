<template>
  <b-row class="row justify-content-center">
    <b-col sm="12" lg="10">
      <projects-table></projects-table>
    </b-col>
  </b-row>
</template>

<script>
import projectsTable from "@/components/Projects";

export default {
  name: 'Projects',
  watchQuery: true,
  async asyncData(context) {
    context.componentBehavior = "fullList";
    let [getListRes] = await Promise.all([
      context.store.dispatch("projects/getList", context)
    ]);
    return { projects: getListRes };
  },
  components: {
    projectsTable
  },
  methods: {}
};
</script>
