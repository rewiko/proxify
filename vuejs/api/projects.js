import axios from '../plugins/axios.js'

export default {
  list: function (data) {
    return axios.get(
      "/proxy/applications?offset=" +
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
      "/proxy/application/" + data);
  },
  updateItem: function (data) {
    return axios.put(
      "/proxy/application/" + data.id, data.data);
  },
  createItem: function (data) {
    return axios.post(
      "/proxy/application/", data.data);
  },
  getItem: function (data) {
    return axios.get(
      "/proxy/application/" + data);
  }
}
