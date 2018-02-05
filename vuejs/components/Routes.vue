<template>
  <c-table
    :table-data="routes.items"
    :fields="routes.fields"
    :offset="routes.offset"
    :perPage="routes.perPage"
    :per-page="10"
    hover
    striped
    bordered
    :sortBy="routes.sortBy"
    :sortDesc="routes.sortDesc"
    :limit="routes.limit"
    :componentBehavior="routes.componentBehavior"
    :filter="routes.filter"
    :count="routes.count"
    :busySync="routes.isBusy"
    :contextChanged="contextChanged"
    :nbItems="routes.nbItems"
    @filterEvent="filterHandler"
    @nbItemsEvent="nbItemsHandler"
    @deleteItemEvent="deleteItemHandler"
    @addItemEvent="addItemHandler"
    caption="<i class='fa fa-align-justify'></i> Routes"
  ></c-table>
</template>

<script>
import cTable from "@/components/Base/Table";
import { get, sync } from "vuex-pathify";

export default {
  name: "routes-table",
  inheritAttrs: false,
  props: {
    addItemHandler: {
      type: Function,
      default: function() {}
    }
  },
  computed: {
    routes: get("routes/list")
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
      this.$store
        .dispatch("routes/updateList", data)
        .then(function(success) {
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
        .dispatch("routes/updateList", { filter: replaceFilter })
        .then(function(success) {
          thus.updateRoute();
        });
    },
    nbItemsHandler(ctx) {
      this.$store.dispatch("routes/updateList", { perPage: ctx });
    },
    deleteItemHandler(ctx) {
      var thus = this;
      this.$store
        .dispatch("routes/deleteItem", ctx)
        .then(res => {
          thus.$store.dispatch(
            "routes/getList",
            thus.$router.currentRoute
          );
        })
        .catch(error => {
          console.log("error deletion id ", ctx);
          return {};
        });
    },
    updateRoute() {
      // order="name.ASC,description.DESC"
      var order = this.routes.sortBy;
      if (this.routes.sortDesc) order = order + "|DESC";
      else order = order + "|ASC";
      console.log("update Route ", this.routes.componentBehavior);
      if (this.routes.componentBehavior == "addItem") {
        this.$store.dispatch("routes/getList", {
          query: {
            offset: this.routes.offset,
            limit: this.routes.limit,
            filter: JSON.stringify(this.routes.filter),
            order: order
          },
          componentBehavior: "addItem"
        });
      } else {
        console.log(
          "updateRoute",
          this.routes.sortDesc,
          this.routes.sortBy
        );

        if (this.routes.componentBehavior == "fullList") {
          var path = "/admin/routes";
        } else if (this.routes.componentBehavior == "userList") {
          var path = "/proxy/projects";
        }

        this.$router.push({
          path: path,
          query: {
            offset: this.routes.offset,
            limit: this.routes.limit,
            filter: JSON.stringify(this.routes.filter),
            order: order
          }
        });
      }
    }
  }
};
</script>
