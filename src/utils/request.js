import axios from 'axios'

const baseURL = 'http://47.103.46.185:5002'
const timeout = 10000

const request = axios.create({
  baseURL,
  timeout,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
})

request.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => Promise.reject(err)
)

request.interceptors.response.use(
  (res) => {
    return res
  },
  (err) => {
    return Promise.reject(err.message)
  }
)

export default request
