import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/Dashboard/dashboard.vue'
import RoleAndTask from '@/components/RoleAndTask/RoleAndTask.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Dashboard,
    },
    {
      path: '/roleAndTask',
      name: 'RoleAndTask',
      component: RoleAndTask,
    },
  ],
})

export default router
