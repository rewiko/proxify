import axios from 'axios'
import {baseURL, browserBaseURL} from '~/config'
import cookies from 'js-cookie'
import {setAuthToken, resetAuthToken} from '~/utils/token'

const token = cookies.get('Authorization')

if (token) setAuthToken("Bearer " + token)
else resetAuthToken()

var configBaseURL = process.browser ? browserBaseURL : baseURL;

export default axios.create({
  baseURL: configBaseURL,
  timeout: 3000,
})
