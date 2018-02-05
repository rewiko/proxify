import { make } from 'vuex-pathify'

import api from '~/api/users'
import { setAuthToken, resetAuthToken } from '~/utils/token'
import cookies from 'js-cookie'

function state() {
  return {
    list: {},
    item: {},
    user: null
  }
}

const getters = {
  //getUser: (state, getters, rootState) => {
  //return state.user;
  //}
  getUser: state => state.user,
  ...make.getters(state)
}

const actions = {
  fetch({ commit }) {
    return api.me()
      .then(response => {
        commit('setUser', response.data.data)
        return response
      })
      .catch(error => {
        commit('resetUser')
        return error
      })
  },
  reset({ commit }) {
    commit('resetUser')
    resetAuthToken()
    cookies.remove('Authorization')
    return Promise.resolve()
  },
  login({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      return api.login(data)
        .then(function (response) {
          console.log('data returned ', response.data);
          commit('setUser', response.data)
          setAuthToken("Bearer " + response.data.token)
          cookies.set('Authorization', response.data.token, { expires: 7 })
          resolve(response.data);
        }, function (err) {
          console.log('Error', err);
          reject(err);
        });
    });
  },
  register({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      return api.register(data)
        .then(function (response) {
          console.log('data returned ', response.data);
          commit('setUser', response.data.data)
          setAuthToken("Bearer " + response.data.token)
          cookies.set('Authorization', response.data.token, { expires: 7 })
          resolve(response.data);
        }, function (err) {
          console.log('Error', err);
          reject(err);
        });
    });
  },
  updateProfile({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      return api.updateProfile(data)
        .then(function (response) {
          console.log('data returned ', response.data);
          resolve(response.data);
        }, function (err) {
          console.log('Error', err);
          reject(err);
        });
    });
  },
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

      if (data.password != data.rePassword){
        data.error = "Password doesn't match";
        return reject(data);
      }

      var dataToSend = {
        data: {
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password,
          language: data.language || 'en',
          groups: data.groups,
          admin: data.admin || false
        }
      }
      console.log('dta.pasword', data.password)

      if (typeof(data.password) == 'undefined' )
        delete data.password;

      if (data.password == '' )
        delete data.password;

      return api[httpCall]({ id: id, data: dataToSend }).then(function (response) {
        response.error = null;
        response.success = "User Updated.";
        return resolve(response);
      })
        .catch(function (error) {
          console.log("Error updating user ", error);
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
      var sortBy = "username";
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

      if (context.componentBehavior == 'userList') {
        var tmpFilter = JSON.parse(filter);
        if (typeof (tmpFilter["application.username"]) == 'undefined')
          tmpFilter["application.username"] = "";
        filter = JSON.stringify(tmpFilter);
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
            } else if (context.componentBehavior == 'userList') {
              value.actions = [
                {
                  class: "btn btn-success",
                  path: "/proxy/project/" + value.id,
                  icon: "fa fa-eye",
                  id: value.id,
                  show: value.token
                },
              ];
            } else {
              value.actions = [
                {
                  class: "btn btn-success",
                  path: "/proxy/project/" + value.id,
                  icon: "fa fa-eye",
                  id: value.id,
                  show: value.token
                },
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

          var keyusername = "username"
          var keyEmail = "email"

          var fields = [
            {
              key: keyusername,
              label: "Name",
              sortable: true,
              filterable: true,
              class: "text-center align-middle"
            },
            {
              key: keyEmail,
              label: "Email",
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
            console.log("provider data perm", res.data);

            if (typeof res.data.data.groups != "undefined") {
              _.forEach(res.data.data.groups, function (value) {
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
                    removeItem: true,
                    show: true
                  }
                ];
              });
            } else {
              res.data.data.groups = [];
            }

            var dataToReturn = {
              item: res.data.data
            };

            commit('SET_ITEM', dataToReturn.item);
            resolve(dataToReturn);
          })
          .catch(error => {
            console.log("ERROR user get id ", context);
            throw context.error({
              statusCode: 404,
              message: "Post not found"
            });
          });
      } else {
        var dataToReturn = {
          item: { groups: [] }
        };
        commit('SET_ITEM', dataToReturn.item);
        resolve(dataToReturn);
      }
    });
  }
}

const mutations = {
  ...make.mutations(state),
  add(state, text) {
    state.list.push({
      text: text,
      done: false
    })
  },
  remove(state, { users }) {
    state.list.splice(state.list.indexOf(users), 1)
  },
  toggle(state, users) {
    users.done = !users.done
  },
  resetUser(store) {
    store.user = null
  },
  setUser(store, data) {
    console.log(state, data);
    store.user = data
    console.log('setUser');
  },
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
