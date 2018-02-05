<template>
  <c-table
    :table-data="roles.items"
    :fields="roles.fields"
    :offset="roles.offset"
    :perPage="roles.perPage"
    :per-page="10"
    hover
    striped
    bordered
    :sortBy="roles.sortBy"
    :sortDesc="roles.sortDesc"
    :limit="roles.limit"
    :componentBehavior="roles.componentBehavior"
    :filter="roles.filter"
    :count="roles.count"
    :busySync="roles.isBusy"
    :contextChanged="contextChanged"
    :nbItems="roles.nbItems"
    @filterEvent="filterHandler"
    @nbItemsEvent="nbItemsHandler"
    @deleteItemEvent="deleteItemHandler"
    @addItemEvent="addItemHandler"
    caption="<i class='fa fa-align-justify'></i> Roles"
  ></c-table>
</template>

<script>
import cTable from "@/components/Base/Table";
import { get, sync } from "vuex-pathify";

export default {
  name: "roles-table",
  inheritAttrs: false,
  props: {
    addItemHandler: {
      type: Function,
      default: function() {}
    }
  },
  computed: {
    roles: get("roles/list")
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
        .dispatch("roles/updateList", data)
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
        .dispatch("roles/updateList", { filter: replaceFilter })
        .then(function(success) {
          thus.updateRoute();
        });
    },
    nbItemsHandler(ctx) {
      this.$store.dispatch("roles/updateList", { perPage: ctx });
    },
    deleteItemHandler(ctx) {
      var thus = this;
      this.$store
        .dispatch("roles/deleteItem", ctx)
        .then(res => {
          thus.$store.dispatch(
            "roles/getList",
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
      var order = this.roles.sortBy;
      if (this.roles.sortDesc) order = order + "|DESC";
      else order = order + "|ASC";
      console.log("update Route ", this.roles.componentBehavior);
      if (this.roles.componentBehavior == "addItem") {
        this.$store.dispatch("roles/getList", {
          query: {
            offset: this.roles.offset,
            limit: this.roles.limit,
            filter: JSON.stringify(this.roles.filter),
            order: order
          },
          componentBehavior: "addItem"
        });
      } else {
        console.log(
          "updateRoute",
          this.roles.sortDesc,
          this.roles.sortBy
        );

        if (this.roles.componentBehavior == "fullList") {
          var path = "/admin/roles";
        } else if (this.roles.componentBehavior == "userList") {
          var path = "/proxy/projects";
        }

        this.$router.push({
          path: path,
          query: {
            offset: this.roles.offset,
            limit: this.roles.limit,
            filter: JSON.stringify(this.roles.filter),
            order: order
          }
        });
      }
    }
  }
};
</script>
