import axios from 'axios'

const baseURL = 'http://47.103.46.185:5002'
// const baseURL = ''
const timeout = 10000

const request = axios.create({
  baseURL,
  timeout,
  headers: {
    'Access-Control-Allow-Origin': '*',
    setContentType: 'application/json;charset=UTF-8'
  }
})

request.interceptors.request.use(
  (config) => {
    return config
  },
  () => {
    // ElMessage('请求失败')
    return null
  }
)

request.interceptors.response.use(
  (res) => {
    return res
  },
  () => {
    // ElMessage('响应失败')
    return null
  }
)

export default request
