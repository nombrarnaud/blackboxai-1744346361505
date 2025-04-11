<template>
  <div class="min-h-screen bg-gray-100">
    <MainNavigation />

    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- En-tête -->
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-gray-900">
            Profil utilisateur
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <!-- Informations du profil -->
          <div class="lg:col-span-2">
            <div class="bg-white shadow rounded-lg">
              <div class="p-6">
                <h2 class="text-lg font-medium text-gray-900 mb-6">
                  Informations personnelles
                </h2>

                <form @submit.prevent="handleUpdateProfile">
                  <!-- Informations spécifiques aux entreprises -->
                  <template v-if="isBusinessUser">
                    <div class="grid grid-cols-1 gap-6 mb-6">
                      <div>
                        <label class="form-label">Nom de l'entreprise</label>
                        <input
                          v-model="form.companyName"
                          type="text"
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

                      <div>
                        <label class="form-label">Numéro d'enregistrement</label>
                        <input
                          v-model="form.registrationNumber"
                          type="text"
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

                      <div>
                        <label class="form-label">Nom du gérant</label>
                        <input
                          v-model="form.managerFullName"
                          type="text"
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
                  </template>

                  <!-- Informations pour les utilisateurs simples -->
                  <template v-else>
                    <div class="grid grid-cols-1 gap-6 mb-6">
                      <div>
                        <label class="form-label">Nom complet</label>
                        <input
                          v-model="form.fullName"
                          type="text"
                          class="form-input"
                          :class="{ 'border-red-500': errors.fullName }"
                        />
                        <p
                          v-if="errors.fullName"
                          class="mt-2 text-sm text-red-600"
                        >
                          {{ errors.fullName }}
                        </p>
                      </div>

                      <div>
                        <label class="form-label">Numéro de carte d'identité</label>
                        <input
                          v-model="form.idCardNumber"
                          type="text"
                          class="form-input"
                          :class="{ 'border-red-500': errors.idCardNumber }"
                        />
                        <p
                          v-if="errors.idCardNumber"
                          class="mt-2 text-sm text-red-600"
                        >
                          {{ errors.idCardNumber }}
                        </p>
                      </div>
                    </div>
                  </template>

                  <!-- Informations communes -->
                  <div class="grid grid-cols-1 gap-6">
                    <div>
                      <label class="form-label">Numéro de téléphone</label>
                      <input
                        v-model="form.phoneNumber"
                        type="tel"
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

                    <div>
                      <label class="form-label">Adresse email</label>
                      <input
                        v-model="form.email"
                        type="email"
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

                  <!-- Boutons d'action -->
                  <div class="mt-6 flex justify-end">
                    <button
                      type="submit"
                      :disabled="loading"
                      class="btn-primary"
                    >
                      <i
                        v-if="loading"
                        class="fas fa-spinner fa-spin mr-2"
                      ></i>
                      {{ loading ? 'Enregistrement...' : 'Enregistrer les modifications' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Sécurité -->
          <div class="lg:col-span-1">
            <div class="bg-white shadow rounded-lg">
              <div class="p-6">
                <h2 class="text-lg font-medium text-gray-900 mb-6">
                  Sécurité
                </h2>

                <form @submit.prevent="handleChangePassword" class="space-y-6">
                  <div>
                    <label class="form-label">Mot de passe actuel</label>
                    <div class="relative">
                      <input
                        v-model="passwordForm.currentPassword"
                        :type="showCurrentPassword ? 'text' : 'password'"
                        class="form-input pr-10"
                        :class="{ 'border-red-500': passwordErrors.currentPassword }"
                      />
                      <button
                        type="button"
                        @click="showCurrentPassword = !showCurrentPassword"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <i
                          class="fas"
                          :class="showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'"
                        ></i>
                      </button>
                    </div>
                    <p
                      v-if="passwordErrors.currentPassword"
                      class="mt-2 text-sm text-red-600"
                    >
                      {{ passwordErrors.currentPassword }}
                    </p>
                  </div>

                  <div>
                    <label class="form-label">Nouveau mot de passe</label>
                    <div class="relative">
                      <input
                        v-model="passwordForm.newPassword"
                        :type="showNewPassword ? 'text' : 'password'"
                        class="form-input pr-10"
                        :class="{ 'border-red-500': passwordErrors.newPassword }"
                      />
                      <button
                        type="button"
                        @click="showNewPassword = !showNewPassword"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <i
                          class="fas"
                          :class="showNewPassword ? 'fa-eye-slash' : 'fa-eye'"
                        ></i>
                      </button>
                    </div>
                    <p
                      v-if="passwordErrors.newPassword"
                      class="mt-2 text-sm text-red-600"
                    >
                      {{ passwordErrors.newPassword }}
                    </p>
                  </div>

                  <div>
                    <label class="form-label">Confirmer le nouveau mot de passe</label>
                    <div class="relative">
                      <input
                        v-model="passwordForm.confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        class="form-input pr-10"
                        :class="{ 'border-red-500': passwordErrors.confirmPassword }"
                      />
                      <button
                        type="button"
                        @click="showConfirmPassword = !showConfirmPassword"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <i
                          class="fas"
                          :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'"
                        ></i>
                      </button>
                    </div>
                    <p
                      v-if="passwordErrors.confirmPassword"
                      class="mt-2 text-sm text-red-600"
                    >
                      {{ passwordErrors.confirmPassword }}
                    </p>
                  </div>

                  <button
                    type="submit"
                    :disabled="passwordLoading"
                    class="w-full btn-primary"
                  >
                    <i
                      v-if="passwordLoading"
                      class="fas fa-spinner fa-spin mr-2"
                    ></i>
                    {{ passwordLoading ? 'Modification...' : 'Modifier le mot de passe' }}
                  </button>
                </form>
              </div>
            </div>

            <!-- Préférences -->
            <div class="mt-8 bg-white shadow rounded-lg">
              <div class="p-6">
                <h2 class="text-lg font-medium text-gray-900 mb-6">
                  Préférences
                </h2>

                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700">Notifications par email</span>
                    <button
                      type="button"
                      @click="toggleEmailNotifications"
                      class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      :class="[preferences.emailNotifications ? 'bg-indigo-600' : 'bg-gray-200']"
                    >
                      <span
                        class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                        :class="[preferences.emailNotifications ? 'translate-x-5' : 'translate-x-0']"
                      ></span>
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700">Notifications push</span>
                    <button
                      type="button"
                      @click="togglePushNotifications"
                      class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      :class="[preferences.pushNotifications ? 'bg-indigo-600' : 'bg-gray-200']"
                    >
                      <span
                        class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                        :class="[preferences.pushNotifications ? 'translate-x-5' : 'translate-x-0']"
                      ></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import MainNavigation from '@/components/MainNavigation.vue';
import type { User } from '@/types';

const authStore = useAuthStore();

// État local
const loading = ref(false);
const passwordLoading = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const form = ref({
  companyName: '',
  registrationNumber: '',
  managerFullName: '',
  fullName: '',
  idCardNumber: '',
  phoneNumber: '',
  email: ''
});

const errors = ref({
  companyName: '',
  registrationNumber: '',
  managerFullName: '',
  fullName: '',
  idCardNumber: '',
  phoneNumber: '',
  email: ''
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const passwordErrors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const preferences = ref({
  emailNotifications: true,
  pushNotifications: false
});

// Computed
const isBusinessUser = computed(() => authStore.isBusinessUser);
const user = computed(() => authStore.user);

// Méthodes
const initializeForm = () => {
  if (!user.value) return;

  if (isBusinessUser.value) {
    const businessUser = user.value;
    form.value = {
      companyName: businessUser.companyName || '',
      registrationNumber: businessUser.registrationNumber || '',
      managerFullName: businessUser.managerFullName || '',
      fullName: '',
      idCardNumber: '',
      phoneNumber: businessUser.phoneNumber || '',
      email: businessUser.email || ''
    };
  } else {
    const simpleUser = user.value;
    form.value = {
      companyName: '',
      registrationNumber: '',
      managerFullName: '',
      fullName: simpleUser.fullName || '',
      idCardNumber: simpleUser.idCardNumber || '',
      phoneNumber: simpleUser.phoneNumber || '',
      email: simpleUser.email || ''
    };
  }
};

const validateProfileForm = (): boolean => {
  let isValid = true;
  errors.value = {
    companyName: '',
    registrationNumber: '',
    managerFullName: '',
    fullName: '',
    idCardNumber: '',
    phoneNumber: '',
    email: ''
  };

  if (isBusinessUser.value) {
    if (!form.value.companyName.trim()) {
      errors.value.companyName = 'Le nom de l\'entreprise est requis';
      isValid = false;
    }
    if (!form.value.registrationNumber.trim()) {
      errors.value.registrationNumber = 'Le numéro d\'enregistrement est requis';
      isValid = false;
    }
    if (!form.value.managerFullName.trim()) {
      errors.value.managerFullName = 'Le nom du gérant est requis';
      isValid = false;
    }
  } else {
    if (!form.value.fullName.trim()) {
      errors.value.fullName = 'Le nom complet est requis';
      isValid = false;
    }
    if (!form.value.idCardNumber.trim()) {
      errors.value.idCardNumber = 'Le numéro de carte d\'identité est requis';
      isValid = false;
    }
  }

  if (!form.value.phoneNumber.trim()) {
    errors.value.phoneNumber = 'Le numéro de téléphone est requis';
    isValid = false;
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'L\'adresse email est requise';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'L\'adresse email n\'est pas valide';
    isValid = false;
  }

  return isValid;
};

const validatePasswordForm = (): boolean => {
  let isValid = true;
  passwordErrors.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  if (!passwordForm.value.currentPassword) {
    passwordErrors.value.currentPassword = 'Le mot de passe actuel est requis';
    isValid = false;
  }

  if (!passwordForm.value.newPassword) {
    passwordErrors.value.newPassword = 'Le nouveau mot de passe est requis';
    isValid = false;
  } else if (passwordForm.value.newPassword.length < 8) {
    passwordErrors.value.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
    isValid = false;
  }

  if (!passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'La confirmation du mot de passe est requise';
    isValid = false;
  } else if (passwordForm.value.confirmPassword !== passwordForm.value.newPassword) {
    passwordErrors.value.confirmPassword = 'Les mots de passe ne correspondent pas';
    isValid = false;
  }

  return isValid;
};

const handleUpdateProfile = async () => {
  if (!validateProfileForm()) return;

  try {
    loading.value = true;
    await authStore.updateProfile(form.value);
  } finally {
    loading.value = false;
  }
};

const handleChangePassword = async () => {
  if (!validatePasswordForm()) return;

  try {
    passwordLoading.value = true;
    await authStore.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    });
    
    // Réinitialiser le formulaire
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  } finally {
    passwordLoading.value = false;
  }
};

const toggleEmailNotifications = () => {
  preferences.value.emailNotifications = !preferences.value.emailNotifications;
  // TODO: Sauvegarder les préférences
};

const togglePushNotifications = () => {
  preferences.value.pushNotifications = !preferences.value.pushNotifications;
  // TODO: Sauvegarder les préférences
};

// Initialisation
onMounted(() => {
  initializeForm();
});
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm;
}

.btn-primary {
  @apply inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>
