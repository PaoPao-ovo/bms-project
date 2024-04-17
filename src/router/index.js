import { createRouter, createWebHistory } from 'vue-router'
// import MainLayout from '@/views/MainLayout.vue'
// import LoginView from '@/views/LoginView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/bmu',
      name: 'LayoutMain',
      component: import('@/views/MainLayout.vue')
    },
    {
      path: '/',
      name: 'LoginMain',
      component: import('@/views/LoginView.vue')
    }
  ]
})

export default router
