import '@/assets/css/main.css'
import '@/assets/js/flexible.js'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import 'default-passive-events'
import App from './App.vue'
import router from '@/router/index.js'
import pinia from './stores'
const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn
})
app.use(router)
app.use(pinia)
app.mount('#app')
