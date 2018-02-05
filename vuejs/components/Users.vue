<template>
  <c-table
    :table-data="users.items"
    :fields="users.fields"
    :offset="users.offset"
    :perPage="users.perPage"
    :per-page="10"
    hover
    striped
    bordered
    :sortBy="users.sortBy"
    :sortDesc="users.sortDesc"
    :limit="users.limit"
    :componentBehavior="users.componentBehavior"
    :filter="users.filter"
    :count="users.count"
    :busySync="users.isBusy"
    :contextChanged="contextChanged"
    :nbItems="users.nbItems"
    @filterEvent="filterHandler"
    @nbItemsEvent="nbItemsHandler"
    @deleteItemEvent="deleteItemHandler"
    @addItemEvent="addItemHandler"
    caption="<i class='fa fa-align-justify'></i> Users"
  ></c-table>
</template>

<script>
import cTable from "@/components/Base/Table";
import { get, sync } from "vuex-pathify";

export default {
  name: "users-table",
  inheritAttrs: false,
  props: {
    addItemHandler: {
      type: Function,
      default: function() {}
    }
  },
  computed: {
    users: get("users/list")
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
        .dispatch("users/updateList", data)
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
        .dispatch("users/updateList", { filter: replaceFilter })
        .then(function(success) {
          thus.updateRoute();
        });
    },
    nbItemsHandler(ctx) {
      this.$store.dispatch("users/updateList", { perPage: ctx });
    },
    deleteItemHandler(ctx) {
      var thus = this;
      this.$store
        .dispatch("users/deleteItem", ctx)
        .then(res => {
          thus.$store.dispatch(
            "users/getList",
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
      var order = this.users.sortBy;
      if (this.users.sortDesc) order = order + "|DESC";
      else order = order + "|ASC";
      console.log("update Route ", this.users.componentBehavior);
      if (this.users.componentBehavior == "addItem") {
        this.$store.dispatch("users/getList", {
          query: {
            offset: this.users.offset,
            limit: this.users.limit,
            filter: JSON.stringify(this.users.filter),
            order: order
          },
          componentBehavior: "addItem"
        });
      } else {
        console.log(
          "updateRoute",
          this.users.sortDesc,
          this.users.sortBy
        );

        if (this.users.componentBehavior == "fullList") {
          var path = "/admin/users";
        } else if (this.users.componentBehavior == "userList") {
          var path = "/proxy/projects";
        }

        this.$router.push({
          path: path,
          query: {
            offset: this.users.offset,
            limit: this.users.limit,
            filter: JSON.stringify(this.users.filter),
            order: order
          }
        });
      }
    }
  }
};
</script>
