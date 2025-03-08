import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'Login', component: () => import('../views/LoginView.vue') },
  { path: '/register', name: 'Register', component: () => import('../views/RegisterView.vue') },
  {
    path: '/',
    component: () => import('../components/layout/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { 
        path: '/admin', 
        name: 'AdminHome', 
        component: () => import('../views/AdminDashBoard.vue'),
        meta: { requiresRole: 'ROLE_ADMIN' }
      },
      { path: '', name: 'Home', component: () => import('../views/HomeView.vue') },
      { path: 'books', name: 'Books', component: () => import('../views/BookListView.vue') },
      {
        path: 'books/detail/:bookId',
        name: 'BookDetail',
        component: () => import('../views/BookDetailView.vue')
      },
      { path: 'borrowing', name: 'Borrowing', component: () => import('../views/BorrowingView.vue') },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/UsersView.vue'),
        meta: { requiresRole: 'ROLE_ADMIN' },
      },
      {
        path: 'users/:userId',
        name: 'UserDetail',
        component: () => import('../views/UserDetailView.vue'),
        meta: { requiresRole: 'ROLE_ADMIN' },
      },
      { path: 'profile', name: 'Profile', component: () => import('../views/ProfileView.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const { userRoles, hasRole } = useAuth()
  if (to.meta.requiresAuth && userRoles.value.length === 0) return next('/login')
  if (to.meta.requiresRole && !hasRole(to.meta.requiresRole as string)) return next('/')
  if ((to.name === 'Login' || to.name === 'Register') && userRoles.value.length > 0) return next('/')
  next()
})

export default router