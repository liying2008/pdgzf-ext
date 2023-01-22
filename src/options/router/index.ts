import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

import Layout from '../layout/Layout.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/configuration',
    children: [
      {
        path: '/configuration',
        name: 'Configuration',
        component: () => import('../pages/configuration/Index.vue'),
      },
      {
        path: '/import-export',
        name: 'ImportExport',
        component: () => import('../pages/import-export/Index.vue'),
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('../pages/about/Index.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
