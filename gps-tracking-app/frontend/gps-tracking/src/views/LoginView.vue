<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo -->
      <div class="text-center">
        <i class="fas fa-satellite-dish text-5xl text-indigo-600"></i>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Connexion
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Ou
        <router-link
          to="/register/business"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          créer un compte entreprise
        </router-link>
        /
        <router-link
          to="/register/simple"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          particulier
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700"
            >
              Adresse email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :class="{ 'border-red-500': errors.email }"
              />
              <p
                v-if="errors.email"
                class="mt-2 text-sm text-red-600"
              >
                {{ errors.email }}
              </p>
            </div>
          </div>

          <!-- Mot de passe -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :class="{ 'border-red-500': errors.password }"
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i
                  class="fas"
                  :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                ></i>
              </button>
              <p
                v-if="errors.password"
                class="mt-2 text-sm text-red-600"
              >
                {{ errors.password }}
              </p>
            </div>
          </div>

          <!-- Options de connexion -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                for="remember-me"
                class="ml-2 block text-sm text-gray-900"
              >
                Se souvenir de moi
              </label>
            </div>

            <div class="text-sm">
              <a
                href="#"
                @click.prevent="handleForgotPassword"
                class="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <!-- Bouton de connexion -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i
                v-if="loading"
                class="fas fa-spinner fa-spin mr-2"
              ></i>
              {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
            </button>
          </div>
        </form>

        <!-- Séparateur -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                Ou continuer avec
              </span>
            </div>
          </div>

          <!-- Boutons de connexion sociale -->
          <div class="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <i class="fab fa-google text-red-600 mr-2"></i>
              Google
            </button>
            <button
              type="button"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <i class="fab fa-microsoft text-blue-600 mr-2"></i>
              Microsoft
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de réinitialisation du mot de passe -->
    <div
      v-if="showResetModal"
      class="fixed inset-0 z-10 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="showResetModal = false"
        ></div>

        <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div>
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
              <i class="fas fa-key text-indigo-600"></i>
            </div>
            <div class="mt-3 text-center sm:mt-5">
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                Réinitialisation du mot de passe
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Entrez votre adresse email pour recevoir les instructions de réinitialisation.
                </p>
              </div>
              <div class="mt-4">
                <input
                  v-model="resetEmail"
                  type="email"
                  required
                  placeholder="Votre adresse email"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-6 space-y-2">
            <button
              type="button"
              @click="handleResetPassword"
              :disabled="resetLoading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
            >
              <i
                v-if="resetLoading"
                class="fas fa-spinner fa-spin mr-2"
              ></i>
              {{ resetLoading ? 'Envoi en cours...' : 'Envoyer les instructions' }}
            </button>
            <button
              type="button"
              @click="showResetModal = false"
              class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { LoginCredentials } from '@/types';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// État du formulaire
const form = ref<LoginCredentials & { rememberMe: boolean }>({
  email: '',
  password: '',
  rememberMe: false
});

const errors = ref({
  email: '',
  password: ''
});

const loading = ref(false);
const showPassword = ref(false);

// État de la réinitialisation du mot de passe
const showResetModal = ref(false);
const resetEmail = ref('');
const resetLoading = ref(false);

// Méthodes
const validateForm = (): boolean => {
  let isValid = true;
  errors.value = {
    email: '',
    password: ''
  };

  if (!form.value.email) {
    errors.value.email = 'L\'adresse email est requise';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'L\'adresse email n\'est pas valide';
    isValid = false;
  }

  if (!form.value.password) {
    errors.value.password = 'Le mot de passe est requis';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    loading.value = true;
    await authStore.login(form.value);
    
    // Rediriger vers la page demandée ou le tableau de bord
    const redirectPath = route.query.redirect as string || '/dashboard';
    router.push(redirectPath);
  } catch (error) {
    console.error('Erreur de connexion:', error);
  } finally {
    loading.value = false;
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleForgotPassword = () => {
  showResetModal.value = true;
  resetEmail.value = form.value.email;
};

const handleResetPassword = async () => {
  if (!resetEmail.value) return;

  try {
    resetLoading.value = true;
    await authStore.resetPassword(resetEmail.value);
    showResetModal.value = false;
  } catch (error) {
    console.error('Erreur de réinitialisation:', error);
  } finally {
    resetLoading.value = false;
  }
};
</script>

<style scoped>
/* Animation pour le modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Animation pour les erreurs */
.error-enter-active,
.error-leave-active {
  transition: all 0.3s ease-out;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
