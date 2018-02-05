import axios from 'axios'

export function setAuthToken (token) {
  console.log("Set token ", token);
  axios.defaults.headers.common['Authorization'] = token
}

export function resetAuthToken () {
  delete axios.defaults.headers.common['Authorization']
}
