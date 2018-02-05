<template>
  <c-table
    :table-data="permissions.items"
    :fields="permissions.fields"
    :offset="permissions.offset"
    :perPage="permissions.perPage"
    :per-page="10"
    hover
    striped
    bordered
    :sortBy="permissions.sortBy"
    :sortDesc="permissions.sortDesc"
    :limit="permissions.limit"
    :componentBehavior="permissions.componentBehavior"
    :filter="permissions.filter"
    :count="permissions.count"
    :busySync="permissions.isBusy"
    :contextChanged="contextChanged"
    :nbItems="permissions.nbItems"
    @filterEvent="filterHandler"
    @nbItemsEvent="nbItemsHandler"
    @deleteItemEvent="deleteItemHandler"
    @addItemEvent="addItemHandler"
    caption="<i class='fa fa-align-justify'></i> Permissions"
  ></c-table>
</template>

<script>
import cTable from "@/components/Base/Table";
import { get, sync } from "vuex-pathify";

export default {
  name: "permissions-table",
  inheritAttrs: false,
  props: {
    addItemHandler: {
      type: Function,
      default: function() {}
    }
  },
  computed: {
    permissions: get("permissions/list")
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
        .dispatch("permissions/updateList", data)
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
        .dispatch("permissions/updateList", { filter: replaceFilter })
        .then(function(success) {
          thus.updateRoute();
        });
    },
    nbItemsHandler(ctx) {
      this.$store.dispatch("permissions/updateList", { perPage: ctx });
    },
    deleteItemHandler(ctx) {
      var thus = this;
      this.$store
        .dispatch("permissions/deleteItem", ctx)
        .then(res => {
          thus.$store.dispatch(
            "permissions/getList",
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
      var order = this.permissions.sortBy;
      if (this.permissions.sortDesc) order = order + "|DESC";
      else order = order + "|ASC";
      console.log("update Route ", this.permissions.componentBehavior);
      if (this.permissions.componentBehavior == "addItem") {
        this.$store.dispatch("permissions/getList", {
          query: {
            offset: this.permissions.offset,
            limit: this.permissions.limit,
            filter: JSON.stringify(this.permissions.filter),
            order: order
          },
          componentBehavior: "addItem"
        });
      } else {
        console.log(
          "updateRoute",
          this.permissions.sortDesc,
          this.permissions.sortBy
        );

        if (this.permissions.componentBehavior == "fullList") {
          var path = "/admin/permissions";
        } else if (this.permissions.componentBehavior == "userList") {
          var path = "/proxy/projects";
        }

        this.$router.push({
          path: path,
          query: {
            offset: this.permissions.offset,
            limit: this.permissions.limit,
            filter: JSON.stringify(this.permissions.filter),
            order: order
          }
        });
      }
    }
  }
};
</script>