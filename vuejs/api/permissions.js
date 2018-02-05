import axios from '../plugins/axios.js'

export default {
  list: function (data) {
    return axios.get(
      "/admin/permissions?offset=" +
      data.offset +
      "&limit=" +
      data.limit +
      "&order=" +
      data.sortBy +
      "|" +
      data.orderProp +
      "&filter=" +
      data.filter
    );
  },
  deleteItem: function (data) {
    return axios.delete(
      "/admin/permission/" + data);
  },
  updateItem: function (data) {
    return axios.put(
      "/admin/permission/" + data.id, data.data);
  },
  createItem: function (data) {
    return axios.post(
      "/admin/permission/", data.data);
  },
  getItem: function (data) {
    return axios.get(
      "/admin/permission/" + data);
  }
}
