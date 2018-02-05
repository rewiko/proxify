<template>
  <c-table
    :table-data="projects.items"
    :fields="projects.fields"
    :offset="projects.offset"
    :perPage="projects.perPage"
    :per-page="10"
    hover
    striped
    bordered
    :sortBy="projects.sortBy"
    :sortDesc="projects.sortDesc"
    :limit="projects.limit"
    :componentBehavior="projects.componentBehavior"
    :filter="projects.filter"
    :count="projects.count"
    :busySync="projects.isBusy"
    :contextChanged="contextChanged"
    :nbItems="projects.nbItems"
    @filterEvent="filterHandler"
    @nbItemsEvent="nbItemsHandler"
    @deleteItemEvent="deleteItemHandler"
    @addItemEvent="addItemHandler"
    caption="<i class='fa fa-align-justify'></i> Projects"
  ></c-table>
</template>

<script>
import cTable from "@/components/Base/Table";
import { get, sync } from "vuex-pathify";

export default {
  name: "projects-table",
  inheritAttrs: false,
  props: {
    addItemHandler: {
      type: Function,
      default: function() {}
    }
  },
  computed: {
    projects: get("projects/list")
  },
  components: {
    cTable
  },
  methods: {
    contextChanged(ctx) {
      var data = {
        offset: ctx.perPage * (ctx.currentPage - 1),
        limit: ctx.perPage,
        sortBy: ctx.sortBy,
        sortDesc: ctx.sortDesc
      };

      var thus = this;
      this.$store.dispatch("projects/updateList", data).then(function(success) {
        thus.updateRoute();
      });
    },
    filterHandler(ctx) {
      var replaceFilter = {};
      // cleanup null value
      _.forEach(ctx, function(value, key) {
        if (value) replaceFilter[key] = value;
      });
      console.log("filterHandler ", ctx);

      var thus = this;
      this.$store
        .dispatch("projects/updateList", { filter: replaceFilter })
        .then(function(success) {
          thus.updateRoute();
        });
    },
    nbItemsHandler(ctx) {
      this.$store.dispatch("projects/updateList", { perPage: ctx });
    },
    deleteItemHandler(ctx) {
      var thus = this;

      this.$store
        .dispatch("projects/deleteItem", ctx)
        .then(res => {
          thus.$store.dispatch("projects/getList", thus.$router.currentRoute);
        })
        .catch(error => {
          console.log("error deletion id ", ctx);
          return {};
        });
    },
    updateRoute() {
      // order="name|ASC,description|DESC"
      var order = this.projects.sortBy;
      if (this.projects.sortDesc) order = order + "|DESC";
      else order = order + "|ASC";
      console.log("update Route ", this.projects.componentBehavior);
      if (this.projects.componentBehavior == "addItem") {
        this.$store.dispatch("projects/getList", {
          query: {
            offset: this.projects.offset,
            limit: this.projects.limit,
            filter: JSON.stringify(this.projects.filter),
            order: order
          },
          componentBehavior: "addItem"
        });
      } else {
        console.log(
          "updateRoute",
          this.projects.sortDesc,
          this.projects.sortBy
        );

        if (this.projects.componentBehavior == "fullList") {
          var path = "/admin/projects";
        } else if (this.projects.componentBehavior == "userList") {
          var path = "/proxy/projects";
        }

        this.$router.push({
          path: path,
          query: {
            offset: this.projects.offset,
            limit: this.projects.limit,
            filter: JSON.stringify(this.projects.filter),
            order: order
          }
        });
      }
    }
  }
};
</script>
