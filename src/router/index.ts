/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import {createRouter, createWebHistory} from 'vue-router/auto'
import {setupLayouts} from 'virtual:generated-layouts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: setupLayouts,
})

router.beforeEach(async (to, from, next) => {
  const authToken = localStorage.getItem('auth-token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !authToken) {
    next('/login');
  } else {
    next();
  }
})

export default router
