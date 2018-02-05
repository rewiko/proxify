<template>
  <b-row class="row justify-content-center">
    <b-col sm="12" md="10">
      <div class="card mx-12">
        <div class="card-body p-12" @keyup.enter="update(item)">
          <h1>User</h1>
          <form>
            <b-col md="6">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Login</span>
                </div>
                <input
                  data-cy="nameField"
                  type="text"
                  v-model="item.username"
                  placeholder="Name"
                  v-bind:class="{ 'is-invalid' : error, 'is-valid' : success , 'form-control' : true }"
                >
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Firstname</span>
                </div>
                <input
                  data-cy="firstNameField"
                  type="text"
                  v-model="item.firstName"
                  placeholder="FistName"
                  v-bind:class="{ 'is-invalid' : error, 'is-valid' : success , 'form-control' : true }"
                >
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Lastname</span>
                </div>
                <input
                  data-cy="lastNameField"
                  type="text"
                  v-model="item.lastName"
                  placeholder="lastName"
                  v-bind:class="{ 'is-invalid' : error, 'is-valid' : success , 'form-control' : true }"
                >
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Email</span>
                </div>
                <input
                  data-cy="emailField"
                  type="text"
                  v-model="item.email"
                  placeholder="Email"
                  v-bind:class="{ 'is-invalid' : error, 'is-valid' : success , 'form-control' : true }"
                >
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Password</span>
                </div>
                <input
                  data-cy="passwordField"
                  type="password"
                  v-model="item.password"
                  placeholder="Password"
                  v-bind:class="{ 'is-invalid' : error, 'is-valid' : success , 'form-control' : true }"
                >
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Re-Password</span>
                </div>
                <input
                  data-cy="rePasswordField"
                  type="password"
                  v-model="item.rePassword"
                  placeholder="Password"
                  v-bind:class="{ 'is-invalid' : error, 'is-valid' : success , 'form-control' : true }"
                >
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Language</span>
                </div>
                <input
                  data-cy="languageField"
                  type="text"
                  v-model="item.language"
                  placeholder="Language"
                  v-bind:class="{ 'is-invalid' : error, 'is-valid' : success , 'form-control' : true }"
                >
              </div>
              <div class="input-group mb-3">
                <b-form-checkbox
                  id="checkboxAdmin"
                  v-model="item.admin"
                  v-bind:class="{ 'is-invalid' : error, 'is-valid' : success }"
                >Admin</b-form-checkbox>
              </div>
            </b-col>
            <b-col class="mb-3">
              <b-btn v-b-toggle.toggleGroup data-cy="addLink" variant="primary">Add group</b-btn>
              <b-collapse id="toggleGroup" data-cy="tableLink" class="mt-2">
                <groups-table :addItemHandler="addItemHandler"></groups-table>
              </b-collapse>
            </b-col>
            <b-col class="mb-3">
              <b-row class="row">
                <b-col sm="12" lg="10" data-cy="associationLink">
                  <c-table
                    :table-data="item.groups"
                    :fields="fields"
                    :offset="0"
                    :perPage="10"
                    :per-page="10"
                    hover
                    striped
                    bordered
                    :count="item.groups.length"
                    :pagination="false"
                    :contextChanged="contextChanged"
                    @removeItemEvent="removeItemHandler"
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
import groupsTable from "@/components/Groups";

import { get, sync } from "vuex-pathify";

export default {
  name: "GroupDetail",
  async asyncData(context) {
    let [getDataRes, getListRes] = await Promise.all([
      context.store.dispatch("users/getItem", context),
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
    item: get("users/item")
  },
  components: {
    cTable,
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
        .dispatch("users/updateItem", data)
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
            //   .dispatch("users/getItem", thus.$router.currentRoute)
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
              path: "/admin/user/" + response.data.data.id
            });
          }
        })
        .catch(function(error) {
          console.log("Error updating user ", error);
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
        .dispatch("users/deleteItem", ctx)
        .then(res => {
          return thus.$store
            .dispatch("users/getItem", thus.$router.currentRoute)
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
    removeItemHandler(ctx) {
      var index = _.findIndex(this.item.groups, {
        id: ctx
      });
      //this.$delete(this.item.groups, index);
      this.item.groups.splice(index, 1);
    },
    acceptDelete(evt) {
      // Prevent modal from closing
      console.log("Handle Ok modal event ", this.item.id);
      this.$store
        .dispatch("users/deleteItem", this.item.id)
        .then(res => {
          this.$router.push({
            path: "/admin/users/"
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
