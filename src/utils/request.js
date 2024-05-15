import axios from 'axios'
import { ElMessage } from 'element-plus'
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
  (err) => {
    ElMessage("请求失败")
    return Promise.reject(err.message)
  }
)

request.interceptors.response.use(
  (res) => {
    return res
  },
  (err) => {
    ElMessage("响应失败")
    return Promise.reject(err.message)
  }
)

export default request
