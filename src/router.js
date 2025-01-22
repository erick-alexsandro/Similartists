import { createWebHistory, createRouter } from 'vue-router'

import MainPage from './components/MainPage.vue'
import FinderView from './components/FinderView.vue'

const routes = [
  { path: '/', component: MainPage },
  { path: '/#about', component: MainPage },
  { path: '/search', component: FinderView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;