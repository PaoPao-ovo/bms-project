import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from '@/router/index.js'
import pinia from './stores'
import 'vant/lib/index.css'
import Vant from 'vant'
const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn
})
app.use(router)
app.use(pinia)
app.use(Vant)
app.mount('#app')
