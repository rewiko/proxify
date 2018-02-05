import axios from '../plugins/axios.js'

export default {
  login: (data) => axios.post('/admin/auth/login', data),
  register: (data) => axios.post('/admin/auth/signup', data),
  me: () => axios.get('/admin/user/me'),
  updateProfile: (data) => axios.put('/admin/user/me', data),
  list: function (data) {
    return axios.get(
      "/admin/users?offset=" +
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
      "/admin/user/" + data);
  },
  updateItem: function (data) {
    return axios.put(
      "/admin/user/" + data.id, data.data);
  },
  createItem: function (data) {
    return axios.post(
      "/admin/user/", data.data);
  },
  getItem: function (data) {
    return axios.get(
      "/admin/user/" + data);
  }
}
