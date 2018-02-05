import axios from '../plugins/axios.js'

export default {
  list: function (data) {
    return axios.get(
      "/admin/roles?offset=" +
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
      "/admin/role/" + data);
  },
  updateItem: function (data) {
    return axios.put(
      "/admin/role/" + data.id, data.data);
  },
  createItem: function (data) {
    return axios.post(
      "/admin/role/", data.data);
  },
  getItem: function (data) {
    return axios.get(
      "/admin/role/" + data);
  }
}
