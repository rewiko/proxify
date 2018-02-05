import { make } from 'vuex-pathify'

import api from '~/api/groups'

const state = {
  item: {},
  list: {}
}

const getters = {
  ...make.getters(state)
}

const actions = {
  deleteItem({ commit, state }, context) {
    return new Promise((resolve, reject) => {
      return api.deleteItem(context).then(res => {
        resolve(res);
      })
        .catch(error => {
          reject(error);
        });
    });
  },
  updateList({ commit, state }, context) {
    commit('updateList', context);
  },
  updateItem({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      data.error = null;
      data.success = null;

      var id = data.id || "";
      var httpCall = data.id ? "updateItem" : "createItem";

      var dataToSend = {
        data: {
          name: data.name,
          description: data.description,
          roles: data.roles,
          users: data.users,
          portalonly: data.portalonly || false
        }
      }

      return api[httpCall]({ id: id, data: dataToSend }).then(function (response) {
        response.error = null;
        response.success = "Group Updated.";
        return resolve(response);
      })
        .catch(function (error) {
          console.log("Error updating group ", error);
          if (error.response.data.error) data.error = error.response.data.error;

          return reject(data);
        });
    });
  },
  getList({ commit, state }, context) {
    return new Promise((resolve, reject) => {
      var offset = parseInt(context.query.offset) || 0;
      var limit = parseInt(context.query.limit) || 10;

      var sortDesc = true;
      var sortBy = "name";
      if (typeof context.query.order != "undefined") {
        console.log("context order ", context.query.order);
        var dataOrderSplit = context.query.order.split(",");
        var dataOrder = dataOrderSplit[0].split("|");
        sortBy = dataOrder[0];

        if (dataOrder[1].toUpperCase() != "DESC") sortDesc = false;
      }

      var filter = "{}";
      if (typeof context.query.filter != "undefined") {
        filter = context.query.filter;
      }

      var orderProp = "DESC";
      if (!sortDesc) orderProp = "ASC";

      return api.list({
        offset: offset,
        limit: limit,
        sortBy: sortBy,
        orderProp: orderProp,
        filter: filter
      }
      )
        .then(res => {
          _.forEach(res.data.data, function (value, key) {
            if (context.componentBehavior == 'addItem') {
              value.actions = [
                {
                  class: "btn btn-info",
                  icon: "fa fa-plus",
                  id: value.id,
                  addItem: true,
                  show: true
                }
              ];
            } else {
              value.actions = [
                               {
                  class: "btn btn-info",
                  path: "/admin/group/" + value.id,
                  icon: "fa fa-edit",
                  id: value.id,
                  show: true
                },
                {
                  class: "btn btn-danger",
                  path: "/admin/group/" + value.id,
                  icon: "fa fa-trash-o",
                  id: value.id,
                  deleteModal: true,
                  show: true
                }
              ];
            }
          });
          var itemArr = [];
          var i;
          for (i = 0; i < limit; i++) {
            if (typeof res.data.data[i] != "undefined")
              itemArr[offset + i] = res.data.data[i];
          }

          var currentPage = 1;
          if (res.data.meta.offset > 0)
            currentPage = res.data.meta.offset / res.data.meta.limit + 1;

          // if (typeof (context.componentBehavior) == 'undefined')
          //   context.componentBehavior = "listItem";

          var nbItems = [10, 25, 50, 75, 100];
          if (context.componentBehavior == 'addItem') {
            nbItems = [2, 10, 25, 50, 75, 100];
          }

          var keyName = "name"
          var keyDescription = "description"

          var fields = [
            {
              key: keyName,
              label: "Name",
              sortable: true,
              filterable: true,
              class: "text-center align-middle"
            },
            {
              key: keyDescription,
              label: "Description",
              sortable: true,
              filterable: true,
              class: "text-center align-middle"
            },
            {
              key: "actions",
              label: "Actions",
              sortable: false,
              searchButton: true,
              class: "text-center align-middle"
            }
          ];

          var dataToReturn = {
            componentBehavior: context.componentBehavior,
            items: itemArr,
            nbItems: nbItems,
            count: res.data.meta.count,
            limit: res.data.meta.limit,
            offset: res.data.meta.offset,
            perPage: res.data.meta.limit,
            currentPage: currentPage,
            sortBy: sortBy,
            sortDesc: sortDesc,
            filter: JSON.parse(filter),
            isBusy: false,
            fields: fields
          };
          commit('SET_LIST', dataToReturn)
          resolve(dataToReturn);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getItem({ commit, state }, context) {
    return new Promise((resolve, reject) => {
      console.log("data context ", context);
      var id = "";
      if (context) {
        if (context.params) {
          id = parseInt(context.params.id) || "";
        }
      }

      if (id != "") {
        let promise = api.getItem(id);
        return promise
          .then(res => {
 if (typeof res.data.data.roles != "undefined") {
              _.forEach(res.data.data.roles, function (value) {
                value.actions = [
                  {
                    class: "btn btn-info",
                    path: "/admin/role/" + value.id,
                    icon: "fa fa-edit",
                    id: value.id,
                    show: true
                  },
                  {
                    class: "btn btn-danger",
                    path: "/admin/role/" + value.id,
                    icon: "fa fa-trash-o",
                    id: value.id,
                    removeItem: true,
                    show: true
                  }
                ];
              });
            } else {
              res.data.data.roles = [];
            }

 if (typeof res.data.data.users != "undefined") {
              _.forEach(res.data.data.users, function (value) {
                value.actions = [
                  {
                    class: "btn btn-info",
                    path: "/admin/user/" + value.id,
                    icon: "fa fa-edit",
                    id: value.id,
                    show: true
                  },
                  {
                    class: "btn btn-danger",
                    path: "/admin/user/" + value.id,
                    icon: "fa fa-trash-o",
                    id: value.id,
                    removeItem: true,
                    show: true
                  }
                ];
              });
            } else {
              res.data.data.users = [];
            }

            var dataToReturn = {
              item: res.data.data
            };

            commit('SET_ITEM', dataToReturn.item);
            resolve(dataToReturn);
          })
          .catch(error => {
            console.log("ERROR group get id ", context);
            throw context.error({
              statusCode: 404,
              message: "Post not found"
            });
          });
      } else {
        var dataToReturn = {
          item: { roles: [], users: [] }
        };
        commit('SET_ITEM', dataToReturn.item);
        resolve(dataToReturn);
      }
    });
  }
}

const mutations = {
  ...make.mutations(state),
  updateList(store, data) {
    _.forEach(data, function (value, key) {
      store.list[key] = value;
    });
    console.log('updateList');
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
