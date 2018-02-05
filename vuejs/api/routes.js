import axios from '../plugins/axios.js'

export default {
  list: function (data) {
    return axios.get(
      "/admin/routes?offset=" +
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
      "/admin/route/" + data);
  },
  updateItem: function (data) {
    return axios.put(
      "/admin/route/" + data.id, data.data);
  },
  createItem: function (data) {
    return axios.post(
      "/admin/route/", data.data);
  },
  getItem: function (data) {
    return axios.get(
      "/admin/route/" + data);
  }
}
