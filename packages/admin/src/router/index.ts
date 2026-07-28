import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/',
      component: () => import('@/components/AppLayout.vue'),
      children: [
        { path: 'dashboard', component: () => import('@/views/dashboard/index.vue') },
        { path: 'users', component: () => import('@/views/users/list.vue') },
        { path: 'reviews', component: () => import('@/views/reviews/list.vue') },
        { path: 'reviews/edit/:id?', component: () => import('@/views/reviews/edit.vue') },
        { path: 'articles', component: () => import('@/views/articles/list.vue') },
        { path: 'articles/edit/:id?', component: () => import('@/views/articles/edit.vue') },
        { path: 'hustles', component: () => import('@/views/side-hustles/list.vue') },
        { path: 'scams', component: () => import('@/views/scams/list.vue') },
        { path: 'banners', component: () => import('@/views/banners/list.vue') },
        { path: 'community', component: () => import('@/views/community/posts.vue') },
        { path: 'categories', component: () => import('@/views/settings/index.vue') },
        { path: 'guides', component: () => import('@/views/guides/list.vue') },
        { path: 'guides/edit/:id?', component: () => import('@/views/guides/edit.vue') },
        { path: 'guides/tools', component: () => import('@/views/guides/tools.vue') },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
