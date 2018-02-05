import axios from '../plugins/axios.js'

export default {
  list: function (data) {
    return axios.get(
      "/admin/groups?offset=" +
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
      "/admin/group/" + data);
  },
  updateItem: function (data) {
    return axios.put(
      "/admin/group/" + data.id, data.data);
  },
  createItem: function (data) {
    return axios.post(
      "/admin/group/", data.data);
  },
  getItem: function (data) {
    return axios.get(
      "/admin/group/" + data);
  }
}
