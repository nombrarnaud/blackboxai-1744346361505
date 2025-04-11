<template>
  <div class="min-h-screen bg-gray-100">
    <MainNavigation />

    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- En-tête -->
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-gray-900">
            Historique des déplacements
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            Consultez l'historique détaillé des déplacements de vos véhicules
          </p>
        </div>

        <!-- Filtres -->
        <div class="bg-white shadow rounded-lg p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Sélection du véhicule -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Véhicule
              </label>
              <select
                v-model="selectedVehicleId"
                class="form-select"
                @change="handleVehicleChange"
              >
                <option value="">Sélectionnez un véhicule</option>
                <option
                  v-for="vehicle in vehicles"
                  :key="vehicle.id"
                  :value="vehicle.id"
                >
                  {{ vehicle.name }}
                </option>
              </select>
            </div>

            <!-- Période -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Période
              </label>
              <select
                v-model="selectedPeriod"
                class="form-select"
                @change="handlePeriodChange"
              >
                <option value="today">Aujourd'hui</option>
                <option value="yesterday">Hier</option>
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
                <option value="custom">Période personnalisée</option>
              </select>
            </div>

            <!-- Date de début (pour période personnalisée) -->
            <div v-if="selectedPeriod === 'custom'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                v-model="startDate"
                type="date"
                class="form-input"
                :max="endDate"
              />
            </div>

            <!-- Date de fin (pour période personnalisée) -->
            <div v-if="selectedPeriod === 'custom'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                v-model="endDate"
                type="date"
                class="form-input"
                :min="startDate"
                :max="today"
              />
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="mt-4 flex justify-end space-x-3">
            <button
              @click="resetFilters"
              class="btn-secondary"
            >
              Réinitialiser
            </button>
            <button
              @click="applyFilters"
              class="btn-primary"
              :disabled="!selectedVehicleId"
            >
              Appliquer
            </button>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Carte -->
          <div class="lg:col-span-2">
            <div class="bg-white shadow rounded-lg">
              <MapComponent
                :tracking-history="trackingHistory"
                height="600px"
                @map-ready="handleMapReady"
              />
            </div>
          </div>

          <!-- Métriques et statistiques -->
          <div class="lg:col-span-1 space-y-8">
            <!-- Métriques globales -->
            <div class="bg-white shadow rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Statistiques globales
              </h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">Distance totale</span>
                  <span class="text-sm font-medium text-gray-900">
                    {{ formatDistance(historyMetrics.totalDistance) }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">Vitesse moyenne</span>
                  <span class="text-sm font-medium text-gray-900">
                    {{ historyMetrics.averageSpeed.toFixed(1) }} km/h
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">Vitesse maximale</span>
                  <span class="text-sm font-medium text-gray-900">
                    {{ historyMetrics.maxSpeed.toFixed(1) }} km/h
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">Durée totale</span>
                  <span class="text-sm font-medium text-gray-900">
                    {{ formatDuration(historyMetrics.totalDuration) }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">Nombre d'arrêts</span>
                  <span class="text-sm font-medium text-gray-900">
                    {{ historyMetrics.stops }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Liste des événements -->
            <div class="bg-white shadow rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Événements
              </h3>
              <div class="space-y-4">
                <div
                  v-for="(event, index) in events"
                  :key="index"
                  class="flex items-start space-x-3"
                >
                  <div
                    class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    :class="getEventTypeClass(event.type)"
                  >
                    <i
                      class="fas"
                      :class="getEventTypeIcon(event.type)"
                    ></i>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ event.description }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ formatEventDate(event.timestamp) }}
                    </p>
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
import { ref, computed } from 'vue';
import { useVehicleStore } from '@/stores/vehicles';
import MainNavigation from '@/components/MainNavigation.vue';
import MapComponent from '@/components/MapComponent.vue';
import type { Vehicle, TrackingData, HistoryMetrics } from '@/types';

const vehicleStore = useVehicleStore();

// État local
const selectedVehicleId = ref<number | null>(null);
const selectedPeriod = ref('today');
const startDate = ref(new Date().toISOString().split('T')[0]);
const endDate = ref(new Date().toISOString().split('T')[0]);
const trackingHistory = ref<TrackingData[]>([]);
const historyMetrics = ref<HistoryMetrics>({
  totalDistance: 0,
  averageSpeed: 0,
  maxSpeed: 0,
  totalDuration: 0,
  stops: 0,
  alerts: 0
});

// Computed
const vehicles = computed(() => vehicleStore.vehicles);
const today = computed(() => new Date().toISOString().split('T')[0]);

const events = computed(() => {
  if (!trackingHistory.value.length) return [];

  const events = [];
  let lastPoint = trackingHistory.value[0];

  for (let i = 1; i < trackingHistory.value.length; i++) {
    const point = trackingHistory.value[i];
    
    // Détection des arrêts
    if (point.speed === 0 && lastPoint.speed > 0) {
      events.push({
        type: 'stop',
        description: 'Arrêt du véhicule',
        timestamp: point.timestamp
      });
    }
    
    // Détection des départs
    if (point.speed > 0 && lastPoint.speed === 0) {
      events.push({
        type: 'start',
        description: 'Départ du véhicule',
        timestamp: point.timestamp
      });
    }
    
    // Détection des excès de vitesse (> 90 km/h par exemple)
    if (point.speed > 90 && lastPoint.speed <= 90) {
      events.push({
        type: 'speed',
        description: 'Excès de vitesse détecté',
        timestamp: point.timestamp
      });
    }

    lastPoint = point;
  }

  return events;
});

// Méthodes
const handleVehicleChange = () => {
  if (selectedVehicleId.value) {
    loadHistoryData();
  } else {
    resetHistory();
  }
};

const handlePeriodChange = () => {
  if (selectedPeriod.value === 'today') {
    startDate.value = today.value;
    endDate.value = today.value;
  } else if (selectedPeriod.value === 'yesterday') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    startDate.value = yesterday.toISOString().split('T')[0];
    endDate.value = yesterday.toISOString().split('T')[0];
  } else if (selectedPeriod.value === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    startDate.value = weekAgo.toISOString().split('T')[0];
    endDate.value = today.value;
  } else if (selectedPeriod.value === 'month') {
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    startDate.value = monthAgo.toISOString().split('T')[0];
    endDate.value = today.value;
  }

  if (selectedVehicleId.value) {
    loadHistoryData();
  }
};

const loadHistoryData = async () => {
  if (!selectedVehicleId.value) return;

  try {
    await vehicleStore.fetchVehicleHistory(
      selectedVehicleId.value,
      new Date(startDate.value),
      new Date(endDate.value)
    );
    trackingHistory.value = vehicleStore.trackingHistory;
    calculateMetrics();
  } catch (error) {
    console.error('Erreur lors du chargement de l\'historique:', error);
  }
};

const calculateMetrics = () => {
  if (!trackingHistory.value.length) {
    resetMetrics();
    return;
  }

  const history = trackingHistory.value;
  let totalDistance = 0;
  let totalSpeed = 0;
  let maxSpeed = 0;
  let stops = 0;
  let wasMoving = false;

  for (let i = 1; i < history.length; i++) {
    const point = history[i];
    const prevPoint = history[i - 1];

    // Calcul de la distance
    totalDistance += calculateDistance(
      prevPoint.latitude,
      prevPoint.longitude,
      point.latitude,
      point.longitude
    );

    // Vitesse
    totalSpeed += point.speed;
    maxSpeed = Math.max(maxSpeed, point.speed);

    // Arrêts
    if (point.speed === 0 && wasMoving) {
      stops++;
    }
    wasMoving = point.speed > 0;
  }

  historyMetrics.value = {
    totalDistance,
    averageSpeed: totalSpeed / history.length,
    maxSpeed,
    totalDuration: (new Date(history[history.length - 1].timestamp).getTime() -
      new Date(history[0].timestamp).getTime()) / 1000,
    stops,
    alerts: events.value.length
  };
};

const resetMetrics = () => {
  historyMetrics.value = {
    totalDistance: 0,
    averageSpeed: 0,
    maxSpeed: 0,
    totalDuration: 0,
    stops: 0,
    alerts: 0
  };
};

const resetHistory = () => {
  trackingHistory.value = [];
  resetMetrics();
};

const resetFilters = () => {
  selectedVehicleId.value = null;
  selectedPeriod.value = 'today';
  startDate.value = today.value;
  endDate.value = today.value;
  resetHistory();
};

const applyFilters = () => {
  loadHistoryData();
};

// Utilitaires
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}min`;
};

const formatEventDate = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};

const getEventTypeClass = (type: string): string => {
  switch (type) {
    case 'stop':
      return 'bg-red-100 text-red-600';
    case 'start':
      return 'bg-green-100 text-green-600';
    case 'speed':
      return 'bg-yellow-100 text-yellow-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getEventTypeIcon = (type: string): string => {
  switch (type) {
    case 'stop':
      return 'fa-stop';
    case 'start':
      return 'fa-play';
    case 'speed':
      return 'fa-tachometer-alt';
    default:
      return 'fa-info';
  }
};

// Initialisation
onMounted(() => {
  vehicleStore.fetchVehicles();
});
</script>

<style scoped>
.form-select,
.form-input {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm;
}

.btn-primary {
  @apply inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
}
</style>
