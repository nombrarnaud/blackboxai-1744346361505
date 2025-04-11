<template>
  <div class="vehicle-list bg-white rounded-lg shadow-lg">
    <!-- En-tête avec filtres -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex-1">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un véhicule..."
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <select
            v-model="statusFilter"
            class="rounded-lg border border-gray-300 py-2 pl-3 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
            <option value="maintenance">En maintenance</option>
          </select>
          <button
            @click="$emit('add-vehicle')"
            class="btn-primary"
          >
            <i class="fas fa-plus mr-2"></i>
            Ajouter
          </button>
        </div>
      </div>
    </div>

    <!-- Liste des véhicules -->
    <div class="divide-y divide-gray-200">
      <div
        v-for="vehicle in filteredVehicles"
        :key="vehicle.id"
        :class="[
          'p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer',
          { 'bg-primary-50': selectedVehicle?.id === vehicle.id }
        ]"
        @click="$emit('select-vehicle', vehicle)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Icône du véhicule -->
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center',
              getStatusColorClass(vehicle.status)
            ]">
              <i :class="getVehicleIcon(vehicle.type)" class="text-lg"></i>
            </div>

            <!-- Informations du véhicule -->
            <div>
              <h3 class="text-sm font-medium text-gray-900">{{ vehicle.name }}</h3>
              <p class="text-sm text-gray-500">{{ vehicle.registrationNumber }}</p>
            </div>
          </div>

          <!-- Métriques et statut -->
          <div class="flex items-center space-x-6">
            <!-- Vitesse -->
            <div v-if="vehicle.lastLocation" class="text-right">
              <p class="text-sm text-gray-900">{{ vehicle.lastLocation.speed }} km/h</p>
              <p class="text-xs text-gray-500">Vitesse</p>
            </div>

            <!-- Batterie -->
            <div v-if="vehicle.lastLocation" class="text-right">
              <p class="text-sm text-gray-900">{{ vehicle.lastLocation.batteryLevel }}%</p>
              <p class="text-xs text-gray-500">Batterie</p>
            </div>

            <!-- Statut -->
            <div :class="[
              'px-2.5 py-0.5 rounded-full text-xs font-medium',
              getStatusBadgeClass(vehicle.status)
            ]">
              {{ getStatusLabel(vehicle.status) }}
            </div>

            <!-- Menu d'actions -->
            <div class="relative" @click.stop>
              <button
                @click="toggleMenu(vehicle.id)"
                class="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
              >
                <i class="fas fa-ellipsis-v text-gray-500"></i>
              </button>

              <!-- Menu déroulant -->
              <div
                v-if="activeMenu === vehicle.id"
                class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
              >
                <div class="py-1">
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="$emit('edit-vehicle', vehicle)"
                  >
                    <i class="fas fa-edit mr-2"></i>
                    Modifier
                  </a>
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="$emit('view-history', vehicle)"
                  >
                    <i class="fas fa-history mr-2"></i>
                    Historique
                  </a>
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    @click="$emit('delete-vehicle', vehicle)"
                  >
                    <i class="fas fa-trash-alt mr-2"></i>
                    Supprimer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div
        v-if="filteredVehicles.length === 0"
        class="p-8 text-center"
      >
        <div class="text-gray-400 mb-4">
          <i class="fas fa-car text-6xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Aucun véhicule trouvé
        </h3>
        <p class="text-gray-500">
          {{ vehicles.length === 0 
            ? "Commencez par ajouter un véhicule à suivre"
            : "Aucun véhicule ne correspond aux critères de recherche" }}
        </p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="showPagination" class="p-4 border-t border-gray-200">
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="$emit('page-change', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Vehicle } from '@/types';
import { VehicleStatus } from '@/types';
import Pagination from './Pagination.vue';

// Props
const props = defineProps<{
  vehicles: Vehicle[];
  selectedVehicle?: Vehicle | null;
  currentPage?: number;
  totalPages?: number;
  showPagination?: boolean;
}>();

// Émissions
defineEmits<{
  (e: 'select-vehicle', vehicle: Vehicle): void;
  (e: 'add-vehicle'): void;
  (e: 'edit-vehicle', vehicle: Vehicle): void;
  (e: 'delete-vehicle', vehicle: Vehicle): void;
  (e: 'view-history', vehicle: Vehicle): void;
  (e: 'page-change', page: number): void;
}>();

// État local
const searchQuery = ref('');
const statusFilter = ref('');
const activeMenu = ref<number | null>(null);

// Véhicules filtrés
const filteredVehicles = computed(() => {
  let filtered = [...props.vehicles];

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(v => 
      v.name.toLowerCase().includes(query) ||
      v.registrationNumber.toLowerCase().includes(query)
    );
  }

  // Filtre par statut
  if (statusFilter.value) {
    filtered = filtered.filter(v => v.status === statusFilter.value);
  }

  return filtered;
});

// Méthodes utilitaires
const getStatusColorClass = (status: VehicleStatus) => {
  const classes = {
    [VehicleStatus.ACTIVE]: 'bg-green-100 text-green-600',
    [VehicleStatus.INACTIVE]: 'bg-red-100 text-red-600',
    [VehicleStatus.MAINTENANCE]: 'bg-yellow-100 text-yellow-600'
  };
  return classes[status];
};

const getStatusBadgeClass = (status: VehicleStatus) => {
  const classes = {
    [VehicleStatus.ACTIVE]: 'bg-green-100 text-green-800',
    [VehicleStatus.INACTIVE]: 'bg-red-100 text-red-800',
    [VehicleStatus.MAINTENANCE]: 'bg-yellow-100 text-yellow-800'
  };
  return classes[status];
};

const getStatusLabel = (status: VehicleStatus) => {
  const labels = {
    [VehicleStatus.ACTIVE]: 'Actif',
    [VehicleStatus.INACTIVE]: 'Inactif',
    [VehicleStatus.MAINTENANCE]: 'Maintenance'
  };
  return labels[status];
};

const getVehicleIcon = (type: string) => {
  const icons: { [key: string]: string } = {
    CAR: 'fas fa-car',
    TRUCK: 'fas fa-truck',
    VAN: 'fas fa-shuttle-van',
    MOTORCYCLE: 'fas fa-motorcycle',
    OTHER: 'fas fa-truck-pickup'
  };
  return icons[type] || icons.OTHER;
};

const toggleMenu = (vehicleId: number) => {
  activeMenu.value = activeMenu.value === vehicleId ? null : vehicleId;
};

// Fermer le menu au clic en dehors
const closeMenu = (event: MouseEvent) => {
  if (activeMenu.value !== null) {
    const target = event.target as HTMLElement;
    if (!target.closest('.vehicle-menu')) {
      activeMenu.value = null;
    }
  }
};

// Ajouter/supprimer l'écouteur d'événement pour fermer le menu
onMounted(() => {
  document.addEventListener('click', closeMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenu);
});
</script>

<style scoped>
.btn-primary {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}

/* Animation du menu */
.menu-enter-active,
.menu-leave-active {
  @apply transition-all duration-200;
}

.menu-enter-from,
.menu-leave-to {
  @apply opacity-0 scale-95;
}
</style>
