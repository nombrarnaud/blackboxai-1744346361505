<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Notifications -->
    <div
      aria-live="assertive"
      class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
        <TransitionGroup
          enter-active-class="transform ease-out duration-300 transition"
          enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5"
          >
            <div class="p-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <i
                    class="fas text-2xl"
                    :class="getNotificationIcon(notification.type)"
                  ></i>
                </div>
                <div class="ml-3 w-0 flex-1">
                  <p
                    class="text-sm font-medium"
                    :class="getNotificationTextClass(notification.type)"
                  >
                    {{ notification.title }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ notification.message }}
                  </p>
                </div>
                <div class="ml-4 flex-shrink-0 flex">
                  <button
                    @click="dismissNotification(notification.id)"
                    class="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span class="sr-only">Fermer</span>
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- Contenu principal -->
    <RouterView v-slot="{ Component }">
      <Transition
        name="page"
        mode="out-in"
      >
        <Suspense>
          <template #default>
            <component :is="Component" />
          </template>
          <template #fallback>
            <div class="min-h-screen flex items-center justify-center">
              <LoadingSpinner
                size="60"
                message="Chargement..."
              />
            </div>
          </template>
        </Suspense>
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

// Computed
const notifications = computed(() => notificationStore.notifications);

// Méthodes
const getNotificationIcon = (type: string): string => {
  switch (type) {
    case 'success':
      return 'fa-check-circle text-green-500';
    case 'error':
      return 'fa-exclamation-circle text-red-500';
    case 'warning':
      return 'fa-exclamation-triangle text-yellow-500';
    case 'info':
      return 'fa-info-circle text-blue-500';
    default:
      return 'fa-bell text-gray-500';
  }
};

const getNotificationTextClass = (type: string): string => {
  switch (type) {
    case 'success':
      return 'text-green-800';
    case 'error':
      return 'text-red-800';
    case 'warning':
      return 'text-yellow-800';
    case 'info':
      return 'text-blue-800';
    default:
      return 'text-gray-800';
  }
};

const dismissNotification = (id: string) => {
  notificationStore.removeNotification(id);
};

// Initialisation de l'application
const initializeApp = async () => {
  try {
    // Vérifier si l'utilisateur est déjà connecté
    if (authStore.token) {
      await authStore.initialize();
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'application:', error);
  }
};

// Gestionnaire de déconnexion automatique
let tokenCheckInterval: number | null = null;

const startTokenCheck = () => {
  tokenCheckInterval = window.setInterval(() => {
    if (!authStore.checkTokenExpiration()) {
      notificationStore.show({
        type: 'warning',
        title: 'Session expirée',
        message: 'Votre session a expiré. Veuillez vous reconnecter.'
      });
    }
  }, 60000); // Vérifier toutes les minutes
};

// Cycle de vie
onMounted(() => {
  initializeApp();
  startTokenCheck();
});

onUnmounted(() => {
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval);
  }
  authStore.cleanup();
});
</script>

<style>
/* Transitions de page */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Styles globaux */
html {
  scroll-behavior: smooth;
}

body {
  @apply antialiased text-gray-900;
}

/* Personnalisation de la barre de défilement */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-400 rounded;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500;
}

/* Classes d'utilitaires personnalisées */
.text-shadow {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Focus visible uniquement lors de la navigation au clavier */
.focus-visible:focus {
  @apply outline-none ring-2 ring-offset-2 ring-indigo-500;
}

/* Styles pour les éléments désactivés */
.disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* Styles pour le texte sélectionné */
::selection {
  @apply bg-indigo-500 text-white;
}
</style>
