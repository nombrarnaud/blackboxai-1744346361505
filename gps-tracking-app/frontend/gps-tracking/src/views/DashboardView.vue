<template>
  <div class="min-h-screen bg-gray-100">
    <MainNavigation />

    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- En-tête -->
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-gray-900">
            Tableau de bord
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            Gérez et suivez vos véhicules en temps réel
          </p>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <i class="fas fa-car text-green-600 text-3xl"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Véhicules actifs
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ activeVehicles.length }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <i class="fas fa-tools text-yellow-600 text-3xl"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      En maintenance
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ vehiclesInMaintenance.length }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <i class="fas fa-power-off text-red-600 text-3xl"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Inactifs
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ inactiveVehicles.length }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <i class="fas fa-satellite-dish text-blue-600 text-3xl"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Signal moyen
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ averageSignalStrength }}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Liste des véhicules -->
          <div class="lg:col-span-1">
            <VehicleList
              :vehicles="vehicles"
              :selected-vehicle="selectedVehicle"
              :loading="loading"
              @select-vehicle="handleSelectVehicle"
              @add-vehicle="showVehicleModal = true"
              @edit-vehicle="handleEditVehicle"
              @delete-vehicle="handleDeleteVehicle"
            />
          </div>

          <!-- Carte et métriques -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Carte -->
            <div class="bg-white shadow rounded-lg">
              <MapComponent
                :vehicles="vehicles"
                :selected-vehicle="selectedVehicle"
                :show-legend="true"
                :show-live-tracking="true"
                height="500px"
                @map-ready="handleMapReady"
              />
            </div>

            <!-- Métriques du véhicule sélectionné -->
            <div v-if="selectedVehicle">
              <VehicleMetrics
                :vehicle="selectedVehicle"
                :metrics="selectedVehicleMetrics"
                :show-stats="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/modification de véhicule -->
    <VehicleFormModal
      :show="showVehicleModal"
      :vehicle="editingVehicle"
      @close="handleCloseModal"
      @submit="handleSaveVehicle"
    />

    <!-- Modal de confirmation de suppression -->
    <ConfirmDialog
      :show="showDeleteConfirm"
      title="Supprimer le véhicule"
      :message="deleteConfirmMessage"
      type="danger"
      confirm-label="Supprimer"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useVehicleStore } from '@/stores/vehicles';
import MainNavigation from '@/components/MainNavigation.vue';
import VehicleList from '@/components/VehicleList.vue';
import MapComponent from '@/components/MapComponent.vue';
import VehicleMetrics from '@/components/VehicleMetrics.vue';
import VehicleFormModal from '@/components/VehicleFormModal.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import type { Vehicle } from '@/types';

const vehicleStore = useVehicleStore();

// État local
const showVehicleModal = ref(false);
const showDeleteConfirm = ref(false);
const editingVehicle = ref<Vehicle | null>(null);
const vehicleToDelete = ref<Vehicle | null>(null);
const refreshInterval = ref<number | null>(null);

// Computed properties
const vehicles = computed(() => vehicleStore.vehicles);
const selectedVehicle = computed(() => vehicleStore.selectedVehicle);
const loading = computed(() => vehicleStore.loading);
const activeVehicles = computed(() => vehicleStore.activeVehicles);
const vehiclesInMaintenance = computed(() => vehicleStore.vehiclesInMaintenance);
const inactiveVehicles = computed(() => vehicleStore.inactiveVehicles);
const selectedVehicleMetrics = computed(() => {
  if (!selectedVehicle.value) return null;
  return vehicleStore.vehicleMetrics[selectedVehicle.value.id];
});

const averageSignalStrength = computed(() => {
  const activeVehiclesWithSignal = activeVehicles.value.filter(
    v => vehicleStore.vehicleMetrics[v.id]?.signalStrength
  );
  
  if (activeVehiclesWithSignal.length === 0) return 0;

  const totalSignal = activeVehiclesWithSignal.reduce(
    (sum, v) => sum + (vehicleStore.vehicleMetrics[v.id]?.signalStrength || 0),
    0
  );

  return Math.round(totalSignal / activeVehiclesWithSignal.length);
});

const deleteConfirmMessage = computed(() => {
  if (!vehicleToDelete.value) return '';
  return `Êtes-vous sûr de vouloir supprimer le véhicule "${vehicleToDelete.value.name}" ? Cette action est irréversible.`;
});

// Méthodes
const handleMapReady = () => {
  // Initialiser les mises à jour en temps réel
  startRealTimeUpdates();
};

const startRealTimeUpdates = () => {
  // Mettre à jour les données toutes les 10 secondes
  refreshInterval.value = window.setInterval(() => {
    vehicleStore.fetchVehicles();
    if (selectedVehicle.value) {
      vehicleStore.fetchVehicleMetrics(selectedVehicle.value.id);
    }
  }, 10000);
};

const handleSelectVehicle = (vehicle: Vehicle) => {
  vehicleStore.selectVehicle(vehicle);
};

const handleEditVehicle = (vehicle: Vehicle) => {
  editingVehicle.value = vehicle;
  showVehicleModal.value = true;
};

const handleDeleteVehicle = (vehicle: Vehicle) => {
  vehicleToDelete.value = vehicle;
  showDeleteConfirm.value = true;
};

const handleCloseModal = () => {
  showVehicleModal.value = false;
  editingVehicle.value = null;
};

const handleSaveVehicle = async (vehicleData: Partial<Vehicle>) => {
  try {
    if (editingVehicle.value) {
      await vehicleStore.updateVehicle(editingVehicle.value.id, vehicleData);
    } else {
      await vehicleStore.addVehicle(vehicleData);
    }
    handleCloseModal();
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du véhicule:', error);
  }
};

const confirmDelete = async () => {
  if (!vehicleToDelete.value) return;

  try {
    await vehicleStore.deleteVehicle(vehicleToDelete.value.id);
    showDeleteConfirm.value = false;
    vehicleToDelete.value = null;
  } catch (error) {
    console.error('Erreur lors de la suppression du véhicule:', error);
  }
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  vehicleToDelete.value = null;
};

// Cycle de vie
onMounted(() => {
  vehicleStore.initialize();
});

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
});
</script>
