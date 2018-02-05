<template>
  <b-row class="row justify-content-center">
    <b-col sm="12" md="10">
      <div class="card mx-12">
        <div class="card-body p-12" @keyup.enter="update(item)">
          <h1>Role</h1>
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
            </b-col>
            <b-col class="mb-3">
              <b-btn v-b-toggle.togglePermission data-cy="addLink" variant="primary">Add permission</b-btn>
              <b-collapse id="togglePermission" data-cy="tableLink" class="mt-2">
                <permissions-table :addItemHandler="addItemHandler"></permissions-table>
              </b-collapse>
            </b-col>
            <b-col class="mb-3">
              <b-row class="row">
                <b-col sm="12" lg="10" data-cy="associationLink">
                  <c-table
                    :table-data="item.permissions"
                    :fields="fields"
                    :offset="0"
                    :perPage="500"
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
            <b-col class="mb-3">
              <b-btn v-b-toggle.togglegroup variant="primary">Add group</b-btn>
              <b-collapse id="togglegroup" class="mt-2">
                <groups-table :addItemHandler="addItemGroupHandler"></groups-table>
              </b-collapse>
            </b-col>
            <b-col class="mb-3">
              <b-row class="row">
                <b-col sm="12" lg="10">
                  <c-table
                    :table-data="item.groups"
                    :fields="groupFields"
                    :offset="0"
                    :perPage="500"
                    :per-page="10"
                    hover
                    striped
                    bordered
                    :count="item.groups.length"
                    :pagination="false"
                    :contextChanged="contextChanged"
                    @removeItemEvent="removeItemGroupHandler"
                    @filterEvent="filterHandler"
                    @nbItemsEvent="nbItemsHandler"
                    @deleteItemEvent="deleteItemHandler"
                    caption="<i class='fa fa-align-justify'></i> Groups"
                  ></c-table>
                </b-col>
              </b-row>
            </b-col>
            <b-modal
              ref="modal"
              @ok="acceptDelete"
              ok-title="Yes"
              data-cy="deleteModal"
              title="Do you really want to delete this item?"
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
import groupsTable from "@/components/Groups";

import { get, sync } from "vuex-pathify";

export default {
  name: "RoleDetail",
  async asyncData(context) {
    let [getDataRes, getListRes] = await Promise.all([
      context.store.dispatch("roles/getItem", context),
      context.store.dispatch("permissions/getList", {
        query: { limit: 2 },
        componentBehavior: "addItem"
      }),
      context.store.dispatch("groups/getList", {
        query: { limit: 2 },
        componentBehavior: "addItem"
      })
    ]);
  },
  data() {
    return {
      error: null,
      success: null,
      dismissCountDown: 0,
      dismissCountErrorDown: 0,
      groupFields: [
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
      ],
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
    item: get("roles/item")
  },
  components: {
    cTable,
    permissionsTable,
    groupsTable
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
        .dispatch("roles/updateItem", data)
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
            //   .dispatch("roles/getItem", thus.$router.currentRoute)
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
              path: "/admin/role/" + response.data.data.id
            });
          }
        })
        .catch(function(error) {
          console.log("Error updating role ", error);
          thus.error = error.error;
          thus.dismissCountErrorDown = 10;
        });
    },
    contextChanged(ctx) {
      console.log("context has changed ", ctx);
    },
    filterHandler(ctx) {
      console.log("filterHandler", ctx);
    },
    nbItemsHandler(ctx) {
      console.log("nbItemsHandler", ctx);
    },
    deleteItemHandler(ctx) {
      var thus = this;
      return thus.$store
        .dispatch("roles/deleteItem", ctx)
        .then(res => {
          return thus.$store
            .dispatch("roles/getItem", thus.$router.currentRoute)
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
    addItemGroupHandler(ctx) {
      var item = _.cloneDeep(
        _.find(this.$store.state.groups.list.items, function(o) {
          if (o) {
            return o.id == ctx;
          } else {
            return false;
          }
        })
      );

      item.actions = [
        {
          class: "btn btn-info",
          path: "/admin/group/" + item.id,
          icon: "fa fa-edit",
          id: item.id,
          show: true
        },
        {
          class: "btn btn-danger",
          path: "/admin/group/" + item.id,
          icon: "fa fa-trash-o",
          id: item.id,
          removeItem: true,
          show: true
        }
      ];

      if (!_.find(this.item.groups, { id: item.id })) {
        this.item.groups.push(item);
      }
    },
    removeItemGroupHandler(ctx) {
      var index = _.findIndex(this.item.groups, {
        id: ctx
      });
      //this.$delete(this.item.applications, index);
      this.item.groups.splice(index, 1);
    },
    addItemHandler(ctx) {
      var item = _.cloneDeep(
        _.find(this.$store.state.permissions.list.items, function(o) {
          if (o) {
            return o.id == ctx;
          } else {
            return false;
          }
        })
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
      //this.$delete(this.item.applications, index);
      this.item.permissions.splice(index, 1);
    },
    acceptDelete(evt) {
      // Prevent modal from closing
      console.log("Handle Ok modal event ", this.item.id);
      this.$store
        .dispatch("roles/deleteItem", this.item.id)
        .then(res => {
          this.$router.push({
            path: "/admin/roles/"
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
