<template>
  <nav class="bg-white shadow">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between">
        <!-- Logo et navigation principale -->
        <div class="flex">
          <!-- Logo -->
          <div class="flex flex-shrink-0 items-center">
            <router-link to="/dashboard" class="text-xl font-bold text-indigo-600">
              <i class="fas fa-satellite-dish mr-2"></i>
              GPS Tracking
            </router-link>
          </div>

          <!-- Navigation principale -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              v-for="item in navigationItems"
              :key="item.path"
              :to="item.path"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium"
              :class="[
                isCurrentRoute(item.path)
                  ? 'border-b-2 border-indigo-500 text-gray-900'
                  : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              ]"
            >
              <i :class="['mr-2', item.icon]"></i>
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <!-- Menu utilisateur -->
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <!-- Notifications -->
          <button
            type="button"
            class="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span class="sr-only">Voir les notifications</span>
            <i class="fas fa-bell"></i>
            <!-- Badge de notification -->
            <span
              v-if="unreadNotifications > 0"
              class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"
            >
              {{ unreadNotifications }}
            </span>
          </button>

          <!-- Menu profil -->
          <div class="relative ml-3">
            <div>
              <button
                type="button"
                @click="toggleProfileMenu"
                class="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span class="sr-only">Ouvrir le menu utilisateur</span>
                <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span class="text-indigo-600 font-medium">
                    {{ userInitials }}
                  </span>
                </div>
              </button>
            </div>

            <!-- Menu déroulant -->
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="showProfileMenu"
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showProfileMenu = false"
                >
                  <i class="fas fa-user mr-2"></i>
                  Mon profil
                </router-link>
                <a
                  href="#"
                  @click.prevent="handleLogout"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-sign-out-alt mr-2"></i>
                  Déconnexion
                </a>
              </div>
            </transition>
          </div>
        </div>

        <!-- Bouton menu mobile -->
        <div class="-mr-2 flex items-center sm:hidden">
          <button
            type="button"
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span class="sr-only">Ouvrir le menu principal</span>
            <i
              class="fas"
              :class="showMobileMenu ? 'fa-times' : 'fa-bars'"
            ></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Menu mobile -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showMobileMenu"
        class="sm:hidden"
      >
        <div class="space-y-1 pb-3 pt-2">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="block py-2 px-3 text-base font-medium"
            :class="[
              isCurrentRoute(item.path)
                ? 'bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50 hover:border-l-4 hover:border-gray-300 hover:text-gray-800'
            ]"
            @click="showMobileMenu = false"
          >
            <i :class="['mr-2', item.icon]"></i>
            {{ item.name }}
          </router-link>
        </div>

        <div class="border-t border-gray-200 pb-3 pt-4">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span class="text-indigo-600 font-medium">
                  {{ userInitials }}
                </span>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">
                {{ user?.fullName || user?.managerFullName }}
              </div>
              <div class="text-sm font-medium text-gray-500">
                {{ user?.email }}
              </div>
            </div>
            <button
              type="button"
              class="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span class="sr-only">Voir les notifications</span>
              <i class="fas fa-bell"></i>
              <span
                v-if="unreadNotifications > 0"
                class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"
              >
                {{ unreadNotifications }}
              </span>
            </button>
          </div>
          <div class="mt-3 space-y-1">
            <router-link
              to="/profile"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              @click="showMobileMenu = false"
            >
              <i class="fas fa-user mr-2"></i>
              Mon profil
            </router-link>
            <a
              href="#"
              @click.prevent="handleLogout"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              <i class="fas fa-sign-out-alt mr-2"></i>
              Déconnexion
            </a>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/types';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// État local
const showProfileMenu = ref(false);
const showMobileMenu = ref(false);
const unreadNotifications = ref(0);

// Computed
const user = computed<User | null>(() => authStore.user);

const userInitials = computed(() => {
  if (!user.value) return '';

  const name = user.value.type === 'business'
    ? user.value.managerFullName
    : user.value.fullName;

  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const navigationItems = [
  {
    name: 'Tableau de bord',
    path: '/dashboard',
    icon: 'fas fa-tachometer-alt'
  },
  {
    name: 'Véhicules',
    path: '/vehicles',
    icon: 'fas fa-car'
  },
  {
    name: 'Rapports',
    path: '/reports',
    icon: 'fas fa-chart-bar'
  },
  {
    name: 'Alertes',
    path: '/alerts',
    icon: 'fas fa-bell'
  }
];

// Méthodes
const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};

const isCurrentRoute = (path: string): boolean => {
  return route.path === path;
};

// Gestionnaire de clic en dehors du menu
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.profile-menu')) {
    showProfileMenu.value = false;
  }
};

// Cycle de vie
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Animation pour le menu mobile */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
