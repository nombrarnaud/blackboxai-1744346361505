<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center">
    <main class="flex-grow flex items-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-max mx-auto">
          <main class="sm:flex">
            <!-- Illustration d'erreur -->
            <div class="sm:ml-6">
              <div class="sm:border-l sm:border-gray-200 sm:pl-6">
                <div class="text-center sm:text-left">
                  <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                    Page non trouvée
                  </h1>
                  <p class="mt-2 text-base text-gray-500">
                    Désolé, nous n'avons pas trouvé la page que vous recherchez.
                  </p>
                  <div class="mt-6 flex space-x-3 sm:border-l-0 sm:border-t sm:border-gray-200 sm:pt-6">
                    <router-link
                      to="/"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <i class="fas fa-home mr-2"></i>
                      Retour à l'accueil
                    </router-link>
                    <button
                      @click="goBack"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <i class="fas fa-arrow-left mr-2"></i>
                      Page précédente
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </main>

    <!-- Suggestions de pages -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-center text-lg font-medium text-gray-900">
            Pages suggérées
          </h2>
          <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <router-link
              v-for="link in suggestedLinks"
              :key="link.path"
              :to="link.path"
              class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-indigo-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <div class="flex-shrink-0">
                <i
                  class="fas text-indigo-600 text-xl"
                  :class="link.icon"
                ></i>
              </div>
              <div class="flex-1 min-w-0">
                <span class="absolute inset-0" aria-hidden="true"></span>
                <p class="text-sm font-medium text-gray-900">
                  {{ link.name }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ link.description }}
                </p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Support -->
    <div class="bg-gray-50">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-lg font-medium text-gray-900">
            Besoin d'aide ?
          </h2>
          <p class="mt-2 text-sm text-gray-500">
            Notre équipe de support est disponible pour vous aider.
          </p>
          <div class="mt-4">
            <a
              href="mailto:support@gpstracking.com"
              class="text-indigo-600 hover:text-indigo-500"
            >
              <i class="fas fa-envelope mr-2"></i>
              support@gpstracking.com
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Liens suggérés en fonction du type d'utilisateur
const suggestedLinks = computed(() => {
  const commonLinks = [
    {
      name: 'Tableau de bord',
      path: '/dashboard',
      icon: 'fa-tachometer-alt',
      description: 'Accédez à votre tableau de bord'
    },
    {
      name: 'Historique',
      path: '/vehicles/history',
      icon: 'fa-history',
      description: 'Consultez l\'historique des véhicules'
    },
    {
      name: 'Profil',
      path: '/profile',
      icon: 'fa-user',
      description: 'Gérez vos informations personnelles'
    }
  ];

  if (authStore.isBusinessUser) {
    return [
      ...commonLinks,
      {
        name: 'Gestion des véhicules',
        path: '/vehicles',
        icon: 'fa-car',
        description: 'Gérez votre flotte de véhicules'
      }
    ];
  }

  return commonLinks;
});

// Méthodes
const goBack = () => {
  router.back();
};
</script>

<style scoped>
/* Animation pour les cartes de suggestion */
.router-link-active {
  @apply border-indigo-500;
}

.router-link-enter-active,
.router-link-leave-active {
  transition: all 0.3s ease-out;
}

.router-link-enter-from,
.router-link-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Animation pour les icônes au survol */
.fas {
  transition: transform 0.2s ease-in-out;
}

.router-link-active .fas,
a:hover .fas {
  transform: scale(1.2);
}
</style>
