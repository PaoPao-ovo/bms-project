import { createRouter, createWebHistory } from 'vue-router'
import getDeviceType from '@/utils/system'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/bmu',
      name: 'LayoutMain',
      component: () => import('@/views/MainLayout.vue')
    },
    {
      path: '/',
      name: 'LoginMain',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/mobile',
      name: 'MobileView',
      component: () => import('@/views/MobileView.vue')
    }
  ]
})

router.beforeEach(async (to) => {
  // ...
  // 返回 false 以取消导航
  if (getDeviceType() === 'Mobile' && to.name !== 'MobileView') {
    return { name: 'MobileView' }
  } else if (getDeviceType() === 'PC' && to.name !== 'LayoutMain') {
    return { name: 'LayoutMain' }
  }
})
export default router
