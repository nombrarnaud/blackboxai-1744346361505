<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="handleClose"
  >
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

    <!-- Modal -->
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <!-- En-tête -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            {{ vehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule' }}
          </h3>
          <button
            @click="handleClose"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="handleSubmit">
          <div class="px-6 py-4">
            <div class="grid grid-cols-1 gap-6">
              <!-- Nom du véhicule -->
              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700"
                >
                  Nom du véhicule
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="form-input"
                  :class="{ 'border-red-500': errors.name }"
                />
                <p
                  v-if="errors.name"
                  class="mt-1 text-sm text-red-600"
                >
                  {{ errors.name }}
                </p>
              </div>

              <!-- Type de véhicule -->
              <div>
                <label
                  for="type"
                  class="block text-sm font-medium text-gray-700"
                >
                  Type de véhicule
                </label>
                <select
                  id="type"
                  v-model="form.type"
                  required
                  class="form-select"
                  :class="{ 'border-red-500': errors.type }"
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="car">Voiture</option>
                  <option value="truck">Camion</option>
                  <option value="bus">Bus</option>
                  <option value="motorcycle">Moto</option>
                </select>
                <p
                  v-if="errors.type"
                  class="mt-1 text-sm text-red-600"
                >
                  {{ errors.type }}
                </p>
              </div>

              <!-- Numéro d'immatriculation -->
              <div>
                <label
                  for="registrationNumber"
                  class="block text-sm font-medium text-gray-700"
                >
                  Numéro d'immatriculation
                </label>
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
                  class="mt-1 text-sm text-red-600"
                >
                  {{ errors.registrationNumber }}
                </p>
              </div>

              <!-- ID du dispositif -->
              <div>
                <label
                  for="deviceId"
                  class="block text-sm font-medium text-gray-700"
                >
                  ID du dispositif Notecard
                </label>
                <input
                  id="deviceId"
                  v-model="form.deviceId"
                  type="text"
                  required
                  class="form-input"
                  :class="{ 'border-red-500': errors.deviceId }"
                />
                <p
                  v-if="errors.deviceId"
                  class="mt-1 text-sm text-red-600"
                >
                  {{ errors.deviceId }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  L'identifiant unique du dispositif Notecard installé sur le véhicule
                </p>
              </div>

              <!-- Statut -->
              <div>
                <label
                  for="status"
                  class="block text-sm font-medium text-gray-700"
                >
                  Statut
                </label>
                <select
                  id="status"
                  v-model="form.status"
                  required
                  class="form-select"
                  :class="{ 'border-red-500': errors.status }"
                >
                  <option value="active">Actif</option>
                  <option value="maintenance">En maintenance</option>
                  <option value="inactive">Inactif</option>
                </select>
                <p
                  v-if="errors.status"
                  class="mt-1 text-sm text-red-600"
                >
                  {{ errors.status }}
                </p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              @click="handleClose"
              class="btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary"
            >
              <i
                v-if="loading"
                class="fas fa-spinner fa-spin mr-2"
              ></i>
              {{ vehicle ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Vehicle } from '@/types';

// Props
interface Props {
  show: boolean;
  vehicle?: Vehicle | null;
}

const props = withDefaults(defineProps<Props>(), {
  vehicle: null
});

// Émissions
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', data: Partial<Vehicle>): void;
}>();

// État local
const loading = ref(false);
const form = ref({
  name: '',
  type: '',
  registrationNumber: '',
  deviceId: '',
  status: 'active'
});

const errors = ref({
  name: '',
  type: '',
  registrationNumber: '',
  deviceId: '',
  status: ''
});

// Observateurs
watch(() => props.vehicle, (newVehicle) => {
  if (newVehicle) {
    form.value = {
      name: newVehicle.name,
      type: newVehicle.type,
      registrationNumber: newVehicle.registrationNumber,
      deviceId: newVehicle.deviceId,
      status: newVehicle.status
    };
  } else {
    resetForm();
  }
});

// Méthodes
const resetForm = () => {
  form.value = {
    name: '',
    type: '',
    registrationNumber: '',
    deviceId: '',
    status: 'active'
  };
  errors.value = {
    name: '',
    type: '',
    registrationNumber: '',
    deviceId: '',
    status: ''
  };
};

const validateForm = (): boolean => {
  let isValid = true;
  errors.value = {
    name: '',
    type: '',
    registrationNumber: '',
    deviceId: '',
    status: ''
  };

  if (!form.value.name.trim()) {
    errors.value.name = 'Le nom est requis';
    isValid = false;
  }

  if (!form.value.type) {
    errors.value.type = 'Le type est requis';
    isValid = false;
  }

  if (!form.value.registrationNumber.trim()) {
    errors.value.registrationNumber = 'Le numéro d\'immatriculation est requis';
    isValid = false;
  }

  if (!form.value.deviceId.trim()) {
    errors.value.deviceId = 'L\'ID du dispositif est requis';
    isValid = false;
  }

  if (!form.value.status) {
    errors.value.status = 'Le statut est requis';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    loading.value = true;
    emit('submit', form.value);
    handleClose();
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  resetForm();
  emit('close');
};
</script>

<style scoped>
.form-input,
.form-select {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm;
}

.btn-primary {
  @apply inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
}
</style>
