<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo -->
      <div class="text-center">
        <i class="fas fa-building text-5xl text-indigo-600"></i>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Inscription Entreprise
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Déjà inscrit ?
        <router-link
          to="/login"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Se connecter
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Nom de l'entreprise -->
          <div>
            <label
              for="companyName"
              class="block text-sm font-medium text-gray-700"
            >
              Nom de l'entreprise
            </label>
            <div class="mt-1">
              <input
                id="companyName"
                v-model="form.companyName"
                type="text"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.companyName }"
              />
              <p
                v-if="errors.companyName"
                class="mt-2 text-sm text-red-600"
              >
                {{ errors.companyName }}
              </p>
            </div>
          </div>

          <!-- Numéro d'enregistrement -->
          <div>
            <label
              for="registrationNumber"
              class="block text-sm font-medium text-gray-700"
            >
              Numéro d'enregistrement
            </label>
            <div class="mt-1">
              <input
                id="registrationNumber"
                v-model="form.registrationNumber"
                type="text"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.registrationNumber }"
              />
              <p
                v-if="errors.registrationNumber"
                class="mt-2 text-sm text-red-600"
              >
                {{ errors.registrationNumber }}
              </p>
            </div>
          </div>

          <!-- Nom complet du gérant -->
          <div>
            <label
              for="managerFullName"
              class="block text-sm font-medium text-gray-700"
            >
              Nom complet du gérant
            </label>
            <div class="mt-1">
              <input
                id="managerFullName"
                v-model="form.managerFullName"
                type="text"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.managerFullName }"
              />
              <p
                v-if="errors.managerFullName"
                class="mt-2 text-sm text-red-600"
              >
                {{ errors.managerFullName }}
              </p>
            </div>
          </div>

          <!-- Numéro de téléphone -->
          <div>
            <label
              for="phoneNumber"
              class="block text-sm font-medium text-gray-700"
            >
              Numéro de téléphone
            </label>
            <div class="mt-1">
              <input
                id="phoneNumber"
                v-model="form.phoneNumber"
                type="tel"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.phoneNumber }"
              />
              <p
                v-if="errors.phoneNumber"
                class="mt-2 text-sm text-red-600"
              >
                {{ errors.phoneNumber }}
              </p>
            </div>
          </div>

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
                class="form-input"
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
                class="form-input pr-10"
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
            <!-- Indicateur de force du mot de passe -->
            <div class="mt-2">
              <div class="flex items-center">
                <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full transition-all duration-300"
                    :class="passwordStrengthClass"
                    :style="{ width: `${passwordStrength}%` }"
                  ></div>
                </div>
                <span class="ml-2 text-xs text-gray-500">
                  {{ passwordStrengthText }}
                </span>
              </div>
            </div>
          </div>

          <!-- Conditions d'utilisation -->
          <div class="flex items-center">
            <input
              id="terms"
              v-model="form.acceptTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              for="terms"
              class="ml-2 block text-sm text-gray-900"
            >
              J'accepte les
              <a
                href="#"
                class="text-indigo-600 hover:text-indigo-500"
              >
                conditions d'utilisation
              </a>
              et la
              <a
                href="#"
                class="text-indigo-600 hover:text-indigo-500"
              >
                politique de confidentialité
              </a>
            </label>
          </div>

          <!-- Bouton d'inscription -->
          <div>
            <button
              type="submit"
              :disabled="loading || !form.acceptTerms"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i
                v-if="loading"
                class="fas fa-spinner fa-spin mr-2"
              ></i>
              {{ loading ? 'Inscription en cours...' : 'S\'inscrire' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { BusinessRegistration } from '@/types';

const router = useRouter();
const authStore = useAuthStore();

// État du formulaire
const form = ref({
  companyName: '',
  registrationNumber: '',
  managerFullName: '',
  phoneNumber: '',
  email: '',
  password: '',
  acceptTerms: false
});

const errors = ref({
  companyName: '',
  registrationNumber: '',
  managerFullName: '',
  phoneNumber: '',
  email: '',
  password: ''
});

const loading = ref(false);
const showPassword = ref(false);

// Validation du mot de passe
const passwordStrength = computed(() => {
  const password = form.value.password;
  let strength = 0;

  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  if (/[^A-Za-z0-9]/.test(password)) strength += 25;

  return strength;
});

const passwordStrengthClass = computed(() => {
  if (passwordStrength.value <= 25) return 'bg-red-500';
  if (passwordStrength.value <= 50) return 'bg-yellow-500';
  if (passwordStrength.value <= 75) return 'bg-blue-500';
  return 'bg-green-500';
});

const passwordStrengthText = computed(() => {
  if (passwordStrength.value <= 25) return 'Faible';
  if (passwordStrength.value <= 50) return 'Moyen';
  if (passwordStrength.value <= 75) return 'Fort';
  return 'Très fort';
});

// Méthodes
const validateForm = (): boolean => {
  let isValid = true;
  errors.value = {
    companyName: '',
    registrationNumber: '',
    managerFullName: '',
    phoneNumber: '',
    email: '',
    password: ''
  };

  // Validation du nom de l'entreprise
  if (!form.value.companyName.trim()) {
    errors.value.companyName = 'Le nom de l\'entreprise est requis';
    isValid = false;
  }

  // Validation du numéro d'enregistrement
  if (!form.value.registrationNumber.trim()) {
    errors.value.registrationNumber = 'Le numéro d\'enregistrement est requis';
    isValid = false;
  }

  // Validation du nom du gérant
  if (!form.value.managerFullName.trim()) {
    errors.value.managerFullName = 'Le nom du gérant est requis';
    isValid = false;
  }

  // Validation du numéro de téléphone
  if (!form.value.phoneNumber.trim()) {
    errors.value.phoneNumber = 'Le numéro de téléphone est requis';
    isValid = false;
  } else if (!/^\+?[\d\s-]{8,}$/.test(form.value.phoneNumber)) {
    errors.value.phoneNumber = 'Le numéro de téléphone n\'est pas valide';
    isValid = false;
  }

  // Validation de l'email
  if (!form.value.email) {
    errors.value.email = 'L\'adresse email est requise';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'L\'adresse email n\'est pas valide';
    isValid = false;
  }

  // Validation du mot de passe
  if (!form.value.password) {
    errors.value.password = 'Le mot de passe est requis';
    isValid = false;
  } else if (form.value.password.length < 8) {
    errors.value.password = 'Le mot de passe doit contenir au moins 8 caractères';
    isValid = false;
  } else if (passwordStrength.value < 75) {
    errors.value.password = 'Le mot de passe n\'est pas assez fort';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    loading.value = true;
    await authStore.registerBusiness(form.value as BusinessRegistration);
    router.push('/dashboard');
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
  } finally {
    loading.value = false;
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.form-input {
  @apply appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm;
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
