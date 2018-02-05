<template>
  <c-table
    :table-data="groups.items"
    :fields="groups.fields"
    :offset="groups.offset"
    :perPage="groups.perPage"
    :per-page="10"
    hover
    striped
    bordered
    :sortBy="groups.sortBy"
    :sortDesc="groups.sortDesc"
    :limit="groups.limit"
    :componentBehavior="groups.componentBehavior"
    :filter="groups.filter"
    :count="groups.count"
    :busySync="groups.isBusy"
    :contextChanged="contextChanged"
    :nbItems="groups.nbItems"
    @filterEvent="filterHandler"
    @nbItemsEvent="nbItemsHandler"
    @deleteItemEvent="deleteItemHandler"
    @addItemEvent="addItemHandler"
    caption="<i class='fa fa-align-justify'></i> Groups"
  ></c-table>
</template>

<script>
import cTable from "@/components/Base/Table";
import { get, sync } from "vuex-pathify";

export default {
  name: "groups-table",
  inheritAttrs: false,
  props: {
    addItemHandler: {
      type: Function,
      default: function() {}
    }
  },
  computed: {
    groups: get("groups/list")
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
        .dispatch("groups/updateList", data)
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
        .dispatch("groups/updateList", { filter: replaceFilter })
        .then(function(success) {
          thus.updateRoute();
        });
    },
    nbItemsHandler(ctx) {
      this.$store.dispatch("groups/updateList", { perPage: ctx });
    },
    deleteItemHandler(ctx) {
      var thus = this;
      this.$store
        .dispatch("groups/deleteItem", ctx)
        .then(res => {
          thus.$store.dispatch(
            "groups/getList",
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
      var order = this.groups.sortBy;
      if (this.groups.sortDesc) order = order + "|DESC";
      else order = order + "|ASC";
      console.log("update Route ", this.groups.componentBehavior);
      if (this.groups.componentBehavior == "addItem") {
        this.$store.dispatch("groups/getList", {
          query: {
            offset: this.groups.offset,
            limit: this.groups.limit,
            filter: JSON.stringify(this.groups.filter),
            order: order
          },
          componentBehavior: "addItem"
        });
      } else {
        console.log(
          "updateRoute",
          this.groups.sortDesc,
          this.groups.sortBy
        );

        if (this.groups.componentBehavior == "fullList") {
          var path = "/admin/groups";
        } else if (this.groups.componentBehavior == "userList") {
          var path = "/proxy/projects";
        }

        this.$router.push({
          path: path,
          query: {
            offset: this.groups.offset,
            limit: this.groups.limit,
            filter: JSON.stringify(this.groups.filter),
            order: order
          }
        });
      }
    }
  }
};
</script>
