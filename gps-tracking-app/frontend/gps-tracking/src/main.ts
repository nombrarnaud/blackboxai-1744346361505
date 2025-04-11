import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

// Styles
import './assets/main.css';

// Composants
import LoadingSpinner from '@/components/LoadingSpinner.vue';

// Stores
import { useAuthStore } from '@/stores/auth';

// Configuration du router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register/business',
      name: 'register-business',
      component: () => import('@/views/BusinessRegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register/simple',
      name: 'register-simple',
      component: () => import('@/views/SimpleRegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/vehicles',
      name: 'vehicles',
      component: () => import('@/views/VehicleListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/vehicles/history',
      name: 'vehicle-history',
      component: () => import('@/views/VehicleHistoryView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    }
    return { top: 0 };
  }
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

  // Initialiser l'authentification si nécessaire
  if (authStore.token && !authStore.user) {
    try {
      await authStore.initialize();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
      authStore.logout();
      next('/login');
      return;
    }
  }

  // Redirection en fonction de l'état d'authentification
  if (requiresAuth && !authStore.isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  if (requiresGuest && authStore.isAuthenticated) {
    next('/dashboard');
    return;
  }

  next();
});

// Création de l'application
const app = createApp(App);

// Configuration de Pinia
const pinia = createPinia();
app.use(pinia);

// Configuration du router
app.use(router);

// Composants globaux
app.component('LoadingSpinner', LoadingSpinner);

// Directives personnalisées
app.directive('focus', {
  mounted: (el) => el.focus()
});

app.directive('click-outside', {
  mounted: (el, binding) => {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted: (el) => {
    document.removeEventListener('click', el.clickOutsideEvent);
  }
});

// Gestionnaire d'erreurs global
app.config.errorHandler = (error, vm, info) => {
  console.error('Erreur non gérée:', error);
  console.error('Info:', info);
  // TODO: Envoyer l'erreur à un service de monitoring
};

// Montage de l'application
app.mount('#app');

// Exportation des instances pour une utilisation dans les tests
export { app, router, pinia };
