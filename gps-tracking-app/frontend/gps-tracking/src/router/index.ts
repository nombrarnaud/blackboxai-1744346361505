import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { notificationService } from '@/services/notification';

// Vues
import LoginView from '@/views/LoginView.vue';
import BusinessRegisterView from '@/views/BusinessRegisterView.vue';
import SimpleRegisterView from '@/views/SimpleRegisterView.vue';
import DashboardView from '@/views/DashboardView.vue';
import VehicleHistoryView from '@/views/VehicleHistoryView.vue';
import ProfileView from '@/views/ProfileView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        requiresGuest: true,
        title: 'Connexion'
      }
    },
    {
      path: '/register/business',
      name: 'business-register',
      component: BusinessRegisterView,
      meta: {
        requiresGuest: true,
        title: 'Inscription Entreprise'
      }
    },
    {
      path: '/register/simple',
      name: 'simple-register',
      component: SimpleRegisterView,
      meta: {
        requiresGuest: true,
        title: 'Inscription Particulier'
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        requiresAuth: true,
        title: 'Tableau de bord'
      }
    },
    {
      path: '/vehicles/:id/history',
      name: 'vehicle-history',
      component: VehicleHistoryView,
      meta: {
        requiresAuth: true,
        title: 'Historique du véhicule'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        requiresAuth: true,
        title: 'Profil'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: {
        title: 'Page non trouvée'
      }
    }
  ]
});

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Mettre à jour le titre de la page
  document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_NAME}` || import.meta.env.VITE_APP_NAME;

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = authStore.isAuthenticated;

  // Si la route nécessite une authentification
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      notificationService.error('Veuillez vous connecter pour accéder à cette page');
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      });
      return;
    }

    // Si l'utilisateur n'a pas encore été chargé, le charger
    if (isAuthenticated && !authStore.user) {
      try {
        await authStore.fetchCurrentUser();
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        authStore.logout();
        next({
          name: 'login',
          query: { redirect: to.fullPath }
        });
        return;
      }
    }
  }

  // Si la route est réservée aux invités (non authentifiés)
  if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'dashboard' });
    return;
  }

  next();
});

// Gestion du scroll
router.afterEach((to, from) => {
  // Remonter en haut de la page après chaque navigation
  window.scrollTo(0, 0);
});

export default router;
