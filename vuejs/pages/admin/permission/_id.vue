<template>
  <b-row class="row justify-content-center">
    <b-col sm="12" md="10">
      <div class="card mx-12">
        <div class="card-body p-12" @keyup.enter="update(item)">
          <h1>Permission</h1>
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
                <b-form-checkbox
                  id="checkboxPortalOnly"
                  v-model="item.portalonly"
                  v-bind:class="{ 'is-invalid' : error, 'is-valid' : success }"
                >Portal Only</b-form-checkbox>
              </div>
            </b-col>
            <b-col class="mb-3">
              <b-btn v-b-toggle.toggleApplication data-cy="addLink" variant="primary">Add project</b-btn>
              <b-collapse id="toggleApplication" data-cy="permissionTableLink" class="mt-2">
                <projects-table :addItemHandler="addItemHandler"></projects-table>
              </b-collapse>
            </b-col>
            <b-col class="mb-3">
              <b-row class="row">
                <b-col sm="12" lg="10" data-cy="permissionAssociation">
                  <c-table
                    :table-data="item.applications"
                    :fields="fields"
                    :offset="0"
                    :perPage="500"
                    :per-page="10"
                    hover
                    striped
                    bordered
                    :count="item.applications.length"
                    :pagination="false"
                    :contextChanged="contextChanged"
                    @removeItemEvent="removeItemHandler"
                    @filterEvent="filterHandler"
                    @nbItemsEvent="nbItemsHandler"
                    @deleteItemEvent="deleteItemHandler"
                    caption="<i class='fa fa-align-justify'></i> Project"
                  ></c-table>
                </b-col>
              </b-row>
            </b-col>
            <b-col class="mb-3">
              <b-btn v-b-toggle.toggleRole variant="primary">Add role</b-btn>
              <b-collapse id="toggleRole" class="mt-2">
                <roles-table :addItemHandler="addItemRoleHandler"></roles-table>
              </b-collapse>
            </b-col>
            <b-col class="mb-3">
              <b-row class="row">
                <b-col sm="12" lg="10">
                  <c-table
                    :table-data="item.roles"
                    :fields="rolesFields"
                    :offset="0"
                    :perPage="500"
                    :per-page="10"
                    hover
                    striped
                    bordered
                    :count="item.roles.length"
                    :pagination="false"
                    :contextChanged="contextChanged"
                    @removeItemEvent="removeItemRoleHandler"
                    @filterEvent="filterHandler"
                    @nbItemsEvent="nbItemsHandler"
                    @deleteItemEvent="deleteItemHandler"
                    caption="<i class='fa fa-align-justify'></i> Roles"
                  ></c-table>
                </b-col>
              </b-row>
            </b-col>
            <b-col class="mb-3">
              <b-btn v-b-toggle.toggleroute variant="primary">Add route</b-btn>
              <b-collapse id="toggleroute" class="mt-2">
                <routes-table :addItemHandler="addItemRouteHandler"></routes-table>
              </b-collapse>
            </b-col>
            <b-col class="mb-3">
              <b-row class="row">
                <b-col sm="12" lg="10">
                  <c-table
                    :table-data="item.routes"
                    :fields="routesFields"
                    :offset="0"
                    :perPage="500"
                    :per-page="10"
                    hover
                    striped
                    bordered
                    :count="item.routes.length"
                    :pagination="false"
                    :contextChanged="contextChanged"
                    @removeItemEvent="removeItemRouteHandler"
                    @filterEvent="filterHandler"
                    @nbItemsEvent="nbItemsHandler"
                    @deleteItemEvent="deleteItemHandler"
                    caption="<i class='fa fa-align-justify'></i> Routes"
                  ></c-table>
                </b-col>
              </b-row>
            </b-col>
            <!-- <b-col class="mb-3">
              <b-btn v-b-toggle.toggleReferer variant="primary">Add referer</b-btn>
              <b-collapse id="toggleReferer" class="mt-2">
                <b-card>
                  <p class="card-text">TODO</p>
                </b-card>
              </b-collapse>
            </b-col>
            <b-col class="mb-3" v-if="item.referers">
              <b-row class="row">
                <b-col sm="12" lg="10">
                  <c-table
                    :table-data="item.referers"
                    :fields="fields"
                    :offset="offset"
                    :perPage="perPage"
                    :per-page="10"
                    hover
                    striped
                    bordered
                    :sortBy="sortBy"
                    :sortDesc="sortDesc"
                    :limit="limit"
                    :count="count"
                    :busySync="isBusy"
                    :pagination="false"
                    :contextChanged="contextChanged"
                    @filterEvent="filterHandler"
                    @nbItemsEvent="nbItemsHandler"
                    @deleteItemEvent="deleteItemHandler"
                    caption="<i class='fa fa-align-justify'></i> Referers"
                  ></c-table>
                </b-col>
              </b-row>
            </b-col>-->
            <b-col class="mb-3" v-if="item.applications.length == 1">
              <!-- <div class="content-frame content" style="min-height: 910px;"> -->
              <!-- window.innerWidth window.innerHeight -->
              <!-- width="{{width}}" height="{{height}} -->
              <p>Preview :</p>
              <iframe
                allowfullscreen
                frameborder="0"
                :src="'http://localhost:8087/comp/private/status?tokenapp=' + item.token"
              ></iframe>
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
import projectsTable from "@/components/Projects";
import rolesTable from "@/components/Roles";
import routesTable from "@/components/Routes";

import { get, sync } from "vuex-pathify";

export default {
  name: "PermissionDetail",
  async asyncData(context) {
    let [getDataRes, getListRes] = await Promise.all([
      context.store.dispatch("permissions/getItem", context),
      context.store.dispatch("projects/getList", {
        query: { limit: 2 },
        componentBehavior: "addItem"
      }),
      context.store.dispatch("roles/getList", {
        query: { limit: 2 },
        componentBehavior: "addItem"
      }),
      context.store.dispatch("routes/getList", {
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
      routesFields: [
        {
          key: "path",
          label: "Path",
          sortable: false,
          filterable: false,
          class: "text-center align-middle"
        },
        {
          key: "method",
          label: "Method",
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
      rolesFields: [
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
          key: "url",
          label: "Url",
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
    item: get("permissions/item")
  },
  components: {
    cTable,
    projectsTable,
    rolesTable,
    routesTable
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
        .dispatch("permissions/updateItem", data)
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
            //   .dispatch("permissions/getItem", thus.$router.currentRoute)
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
              path: "/admin/permission/" + response.data.data.id
            });
          }
        })
        .catch(function(error) {
          console.log("Error updating permission ", error);
          thus.error = error.error;
          thus.dismissCountErrorDown = 10;
        });
    },
    contextChanged(ctx) {},
    filterHandler(ctx) {},
    nbItemsHandler(ctx) {},
    deleteItemHandler(ctx) {},
    addItemRouteHandler(ctx) {
      var item = _.cloneDeep(
        _.find(this.$store.state.routes.list.items, function(o) {
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
          path: "/admin/route/" + item.id,
          icon: "fa fa-edit",
          id: item.id,
          show: true
        },
        {
          class: "btn btn-danger",
          path: "/admin/route/" + item.id,
          icon: "fa fa-trash-o",
          id: item.id,
          removeItem: true,
          show: true
        }
      ];

      if (!_.find(this.item.routes, { id: item.id })) {
        this.item.routes.push(item);
      }
    },
    addItemRoleHandler(ctx) {
      var item = _.cloneDeep(
        _.find(this.$store.state.roles.list.items, function(o) {
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
          path: "/admin/role/" + item.id,
          icon: "fa fa-edit",
          id: item.id,
          show: true
        },
        {
          class: "btn btn-danger",
          path: "/admin/role/" + item.id,
          icon: "fa fa-trash-o",
          id: item.id,
          removeItem: true,
          show: true
        }
      ];

      if (!_.find(this.item.roles, { id: item.id })) {
        this.item.roles.push(item);
      }
    },
    removeItemHandler(ctx) {
      var index = _.findIndex(this.item.applications, {
        id: ctx
      });
      //this.$delete(this.item.applications, index);
      this.item.applications.splice(index, 1);
    },
    addItemHandler(ctx) {
      var item = _.cloneDeep(
        _.find(this.$store.state.projects.list.items, function(o) {
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
          path: "/admin/project/" + item.id,
          icon: "fa fa-edit",
          id: item.id,
          show: true
        },
        {
          class: "btn btn-danger",
          path: "/admin/project/" + item.id,
          icon: "fa fa-trash-o",
          id: item.id,
          removeItem: true,
          show: true
        }
      ];

      if (this.item.applications.length == 0) {
        this.item.applications.push(item);
      }
    },
    removeItemRouteHandler(ctx) {
      var index = _.findIndex(this.item.routes, {
        id: ctx
      });
      //this.$delete(this.item.applications, index);
      this.item.routes.splice(index, 1);
    },
    removeItemRoleHandler(ctx) {
      var index = _.findIndex(this.item.roles, {
        id: ctx
      });
      //this.$delete(this.item.applications, index);
      this.item.roles.splice(index, 1);
    },
    acceptDelete(evt) {
      // Prevent modal from closing
      console.log("Handle Ok modal event ", this.item.id);
      this.$store
        .dispatch("permissions/deleteItem", this.item.id)
        .then(res => {
          this.$router.push({
            path: "/admin/permissions/"
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
