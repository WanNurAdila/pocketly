import { createRouter, createWebHistory } from 'vue-router'
import LoginView    from '../views/LoginView.vue'
import HomeView     from '../views/HomeView.vue'
import ListView     from '../views/ListView.vue'
import DetailView   from '../views/DetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',               redirect: '/login' },
    { path: '/login',          name: 'login',        component: LoginView  },
    { path: '/home',           name: 'home',          component: HomeView   },
    { path: '/transactions',   name: 'transactions',  component: ListView   },
    { path: '/transaction/:id',name: 'detail',        component: DetailView },
  ],
})

router.beforeEach((to) => {
  const isAuth = localStorage.getItem('pocketly_auth') === '1'
  if (to.name !== 'login' && !isAuth) return { name: 'login' }
})

export default router
