<template>
  <div class="map-container">
    <!-- Conteneur de la carte -->
    <div
      :id="mapId"
      :style="{ height: height }"
      class="w-full rounded-lg overflow-hidden"
    ></div>

    <!-- Légende -->
    <div
      v-if="showLegend"
      class="map-legend absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg"
    >
      <h4 class="text-sm font-semibold mb-2">Légende</h4>
      <div class="space-y-2">
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          <span class="text-sm">Actif</span>
        </div>
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          <span class="text-sm">En maintenance</span>
        </div>
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          <span class="text-sm">Inactif</span>
        </div>
      </div>
    </div>

    <!-- Contrôles de suivi en temps réel -->
    <div
      v-if="showLiveTracking && selectedVehicle"
      class="map-controls absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg"
    >
      <div class="flex items-center space-x-4">
        <button
          @click="toggleLiveTracking"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
          :class="{
            'bg-indigo-600 text-white': isLiveTrackingEnabled,
            'bg-gray-200 text-gray-700': !isLiveTrackingEnabled
          }"
        >
          <i
            class="fas"
            :class="{
              'fa-satellite-dish': isLiveTrackingEnabled,
              'fa-satellite': !isLiveTrackingEnabled
            }"
          ></i>
          <span class="ml-2">Suivi en temps réel</span>
        </button>

        <button
          @click="centerOnSelectedVehicle"
          class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          <i class="fas fa-crosshairs"></i>
          <span class="ml-2">Centrer</span>
        </button>
      </div>
    </div>

    <!-- Indicateur de chargement -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <LoadingSpinner color="white" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { mapService } from '@/services/map';
import LoadingSpinner from './LoadingSpinner.vue';
import type { Vehicle, TrackingData } from '@/types';

// Props
interface Props {
  height?: string;
  vehicles?: Vehicle[];
  selectedVehicle?: Vehicle | null;
  trackingHistory?: TrackingData[];
  showLegend?: boolean;
  showLiveTracking?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  vehicles: () => [],
  selectedVehicle: null,
  trackingHistory: () => [],
  showLegend: false,
  showLiveTracking: false
});

// Émissions
const emit = defineEmits<{
  (e: 'map-ready'): void;
  (e: 'vehicle-click', vehicle: Vehicle): void;
}>();

// État local
const mapId = ref(`map-${Math.random().toString(36).substr(2, 9)}`);
const loading = ref(false);
const isLiveTrackingEnabled = ref(false);
let liveTrackingInterval: number | null = null;

// Méthodes
const initializeMap = () => {
  mapService.initMap(mapId.value);
  emit('map-ready');
};

const updateVehicles = () => {
  if (!props.vehicles) return;

  props.vehicles.forEach(vehicle => {
    mapService.updateVehicleMarker(vehicle);
  });
};

const showHistory = () => {
  if (!props.selectedVehicle || !props.trackingHistory) return;

  mapService.showTrackingHistory(props.selectedVehicle.id, props.trackingHistory);
};

const toggleLiveTracking = () => {
  isLiveTrackingEnabled.value = !isLiveTrackingEnabled.value;

  if (isLiveTrackingEnabled.value && props.selectedVehicle) {
    startLiveTracking();
  } else {
    stopLiveTracking();
  }
};

const startLiveTracking = () => {
  if (liveTrackingInterval) return;

  // Centrer immédiatement sur le véhicule
  centerOnSelectedVehicle();

  // Configurer l'intervalle de mise à jour
  liveTrackingInterval = window.setInterval(() => {
    if (props.selectedVehicle) {
      mapService.enableLiveTracking(props.selectedVehicle.id);
    }
  }, 5000); // Mettre à jour toutes les 5 secondes
};

const stopLiveTracking = () => {
  if (liveTrackingInterval) {
    clearInterval(liveTrackingInterval);
    liveTrackingInterval = null;
  }
};

const centerOnSelectedVehicle = () => {
  if (props.selectedVehicle) {
    mapService.centerOnVehicle(props.selectedVehicle.id);
  }
};

// Observateurs
watch(() => props.vehicles, updateVehicles, { deep: true });
watch(() => props.trackingHistory, showHistory, { deep: true });
watch(() => props.selectedVehicle, (newVehicle) => {
  if (newVehicle && isLiveTrackingEnabled.value) {
    centerOnSelectedVehicle();
  }
});

// Cycle de vie
onMounted(() => {
  loading.value = true;
  try {
    initializeMap();
    updateVehicles();
    if (props.trackingHistory.length > 0) {
      showHistory();
    }
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  stopLiveTracking();
  mapService.cleanup();
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
}

.map-legend {
  z-index: 1000;
}

.map-controls {
  z-index: 1000;
}

/* Styles pour les marqueurs de véhicules */
:deep(.vehicle-marker) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

:deep(.vehicle-marker.active) {
  border: 2px solid #10B981;
}

:deep(.vehicle-marker.inactive) {
  border: 2px solid #EF4444;
}

:deep(.vehicle-marker.maintenance) {
  border: 2px solid #F59E0B;
}

:deep(.vehicle-marker i) {
  font-size: 16px;
  color: #374151;
}

/* Styles pour les popups */
:deep(.vehicle-popup),
:deep(.history-popup) {
  min-width: 200px;
}

:deep(.status-active) {
  color: #10B981;
}

:deep(.status-inactive) {
  color: #EF4444;
}

:deep(.status-maintenance) {
  color: #F59E0B;
}
</style>
