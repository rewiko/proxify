<template>
  <b-row class="row justify-content-center">
    <b-col sm="12" md="10">
      <div class="card mx-12">
        <div class="card-body p-12" @keyup.enter="update(item)">
          <h1>Project</h1>
          <form>
            <b-col md="6">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Name</span>
                </div>
                <input
                  data-cy="nameField"
                  type="text"
                  v-model="item.name"
                  placeholder="Name"
                  v-bind:class="{ 'is-invalid' : error, 'is-valid' : success , 'form-control' : true }"
                >
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Description</span>
                </div>
                <input
                  data-cy="descriptionField"
                  type="text"
                  v-model="item.description"
                  placeholder="Description"
                  v-bind:class="{ 'is-invalid' : error, 'is-valid' : success , 'form-control' : true }"
                >
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Url</span>
                </div>
                <input
                  data-cy="urlField"
                  type="text"
                  v-model="item.url"
                  placeholder="Url"
                  v-bind:class="{ 'is-invalid' : error, 'is-valid' : success , 'form-control' : true }"
                >
              </div>
            </b-col>
            <b-col class="mb-3">
              <b-btn v-b-toggle.togglePermission data-cy="addLink" variant="primary">Add permissions</b-btn>
              <b-collapse id="togglePermission" data-cy="permissionTableLink" class="mt-2">
                <permissions-table :addItemHandler="addItemHandler"></permissions-table>
              </b-collapse>
            </b-col>
            <b-col class="mb-3">
              <b-row class="row">
                <b-col sm="12" lg="10" data-cy="permissionAssociation">
                  <c-table
                    :table-data="item.permissions"
                    :fields="fields"
                    :offset="0"
                    :perPage="10"
                    :per-page="10"
                    hover
                    striped
                    bordered
                    :count="item.permissions.length"
                    :pagination="false"
                    :contextChanged="contextChanged"
                    @removeItemEvent="removeItemHandler"
                    @filterEvent="filterHandler"
                    @nbItemsEvent="nbItemsHandler"
                    @deleteItemEvent="deleteItemHandler"
                    caption="<i class='fa fa-align-justify'></i> Permissions"
                  ></c-table>
                </b-col>
              </b-row>
            </b-col>
            <b-modal
              ref="modal"
              @ok="acceptDelete"
              ok-title="Yes"
              title="Do you really want to delete this item?"
              data-cy="deleteModal"
            ></b-modal>
            <b-col class="mb-3" lg="10">
              <b-alert
                :show="dismissCountErrorDown"
                dismissible
                @dismissed="dismissCountErrorDown=0"
                @dismiss-count-down="countDownErrorChanged"
                variant="danger"
              >{{ error }}</b-alert>
              <b-alert
                :show="dismissCountDown"
                dismissible
                @dismissed="dismissCountDown=0"
                @dismiss-count-down="countDownChanged"
                variant="success"
              >{{ success }}</b-alert>
            </b-col>
            <b-col class="mb-3" lg="10">
              <b-row class="row justify-content-center">
                <b-col sm="6" class="text-center">
                  <b-btn
                    v-show="item.id"
                    data-cy="deleteForm"
                    @click="requestDelete(item.id)"
                    class="btn btn-danger"
                  >
                    <!-- <i class="fa fa-trash-o"></i> -->
                    Delete
                  </b-btn>
                </b-col>
                <b-col sm="6" class="text-center">
                  <button
                    type="button"
                    data-cy="submitForm"
                    @click="update(item)"
                    class="btn btn-success"
                  >{{ textSubmit }}</button>
                </b-col>
              </b-row>
            </b-col>
          </form>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import cTable from "@/components/Base/Table";
import permissionsTable from "@/components/Permissions";

import { get, sync } from "vuex-pathify";

export default {
  name: "ProjectDetail",
  async asyncData(context) {
    let [getDataRes, getListRes] = await Promise.all([
      context.store.dispatch("projects/getItem", context),
      context.store.dispatch("permissions/getList", {
        query: { limit: 2 },
        componentBehavior: "addItem"
      })
    ]);
    console.log("getDataRes ", getDataRes);
    // return getDataRes;
  },
  data() {
    return {
      error: null,
      success: null,
      dismissCountDown: 0,
      dismissCountErrorDown: 0,
      fields: [
        {
          key: "name",
          label: "Name",
          sortable: false,
          filterable: false,
          class: "text-center align-middle"
        },
        {
          key: "description",
          label: "Description",
          sortable: false,
          filterable: false,
          class: "text-center align-middle"
        },
        {
          key: "actions",
          label: "Actions",
          sortable: false,
          filterable: false,
          class: "text-center align-middle"
        }
      ]
    };
  },
  computed: {
    textSubmit: function() {
      return this.item.id ? "Update" : "Create";
    },
    item: get("projects/item")
  },
  components: {
    cTable,
    permissionsTable
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    countDownErrorChanged(dismissCountErrorDown) {
      this.dismissCountErrorDown = dismissCountErrorDown;
    },
    update(data) {
      var thus = this;
      thus.$store
        .dispatch("projects/updateItem", data)
        .then(function(response) {
          if (response.success) {
            thus.success = response.success;
            thus.dismissCountDown = 1;
          }
          if (response.error) {
            thus.error = response.error;
            thus.dismissCountErrorDown = 1;
          }
          if (typeof thus.$router.currentRoute.params.id != "undefined") {
            // return thus.$store
            //   .dispatch("projects/getItem", thus.$router.currentRoute)
            //   .then(function(data) {
            //     // _.forEach(data, function(value, key) {
            //     //   thus[key] = value;
            //     // });
            //   })
            //   .catch(error => {
            //     console.log("error fetching data ", ctx);
            //     return {};
            //   });
          } else {
            thus.$router.push({
              path: "/admin/project/" + response.data.data.id
            });
          }
        })
        .catch(function(error) {
          console.log("Error updating project ", error);
          thus.error = error.error;
          thus.dismissCountErrorDown = 10;
        });
    },
    contextChanged(ctx) {
      console.log("context has changed ", ctx);
      this.offset = ctx.perPage * (ctx.currentPage - 1);
      this.limit = ctx.perPage;
      this.sortBy = ctx.sortBy;
      this.sortDesc = ctx.sortDesc;
    },
    filterHandler(ctx) {
      console.log("filterHandler", ctx);
      var replaceFilter = {};
      // cleanup null value
      _.forEach(ctx, function(value, key) {
        if (value) replaceFilter[key] = value;
      });

      this.filter = replaceFilter;
    },
    nbItemsHandler(ctx) {
      console.log("nbItemsHandler", ctx);
      this.perPage = ctx;
    },
    deleteItemHandler(ctx) {
      var thus = this;
      return thus.$store
        .dispatch("projects/deletetem", ctx)
        .then(res => {
          return thus.$store
            .dispatch("projects/getItem", thus.$router.currentRoute)
            .then(function(data) {
              _.forEach(data, function(value, key) {
                thus[key] = value;
              });
            })
            .catch(error => {
              console.log("error fetching data ", ctx);
              return {};
            });
        })
        .catch(error => {
          console.log("error deletion id ", ctx);
          return {};
        });
    },
    addItemHandler(ctx) {
      var item = _.cloneDeep(
        _.find(this.$store.state.permissions.list.items, { id: ctx })
      );

      item.actions = [
        {
          class: "btn btn-info",
          path: "/admin/permission/" + item.id,
          icon: "fa fa-edit",
          id: item.id,
          show: true
        },
        {
          class: "btn btn-danger",
          path: "/admin/permission/" + item.id,
          icon: "fa fa-trash-o",
          id: item.id,
          removeItem: true,
          show: true
        }
      ];
      if (!_.find(this.item.permissions, { id: item.id })) {
        this.item.permissions.push(item);
      }
    },
    removeItemHandler(ctx) {
      var index = _.findIndex(this.item.permissions, {
        id: ctx
      });
      //this.$delete(this.item.permissions, index);
      this.item.permissions.splice(index, 1);
    },
    acceptDelete(evt) {
      // Prevent modal from closing
      console.log("Handle Ok modal event ", this.item.id);
      this.$store
        .dispatch("projects/deleteItem", this.item.id)
        .then(res => {
          this.$router.push({
            path: "/admin/projects/"
          });
        })
        .catch(error => {
          console.log("error deletion id ", error);
        });
    },
    requestDelete(data) {
      this.showModal();
    },
    showModal() {
      this.$refs.modal.show();
    },
    hideModal() {
      this.$refs.modal.hide();
    }
  }
};
</script>
