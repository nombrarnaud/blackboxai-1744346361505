<template>
  <div class="bg-white rounded-lg shadow p-4">
    <!-- En-tête avec les informations du véhicule -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">
          {{ vehicle.name }}
        </h3>
        <p class="text-sm text-gray-500">
          {{ vehicle.registrationNumber }}
        </p>
      </div>
      <div
        class="px-3 py-1 rounded-full text-sm font-medium"
        :class="{
          'bg-green-100 text-green-800': vehicle.status === 'active',
          'bg-yellow-100 text-yellow-800': vehicle.status === 'maintenance',
          'bg-red-100 text-red-800': vehicle.status === 'inactive'
        }"
      >
        {{ formatStatus(vehicle.status) }}
      </div>
    </div>

    <!-- Grille des métriques -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Vitesse -->
      <div class="metric-card">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-500">Vitesse</span>
          <i class="fas fa-tachometer-alt text-indigo-500"></i>
        </div>
        <div class="mt-2">
          <span class="text-2xl font-bold text-gray-900">
            {{ metrics?.currentSpeed.toFixed(1) || '0.0' }}
          </span>
          <span class="text-sm text-gray-500 ml-1">km/h</span>
        </div>
        <div v-if="showStats" class="mt-2 text-xs text-gray-500">
          Max: {{ metrics?.maxSpeed.toFixed(1) || '0.0' }} km/h
          <br>
          Moy: {{ metrics?.averageSpeed.toFixed(1) || '0.0' }} km/h
        </div>
      </div>

      <!-- Altitude -->
      <div class="metric-card">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-500">Altitude</span>
          <i class="fas fa-mountain text-indigo-500"></i>
        </div>
        <div class="mt-2">
          <span class="text-2xl font-bold text-gray-900">
            {{ lastTrackingData?.altitude.toFixed(0) || '0' }}
          </span>
          <span class="text-sm text-gray-500 ml-1">m</span>
        </div>
      </div>

      <!-- Batterie -->
      <div class="metric-card">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-500">Batterie</span>
          <i
            class="fas"
            :class="getBatteryIcon(metrics?.batteryLevel || 0)"
          ></i>
        </div>
        <div class="mt-2">
          <span
            class="text-2xl font-bold"
            :class="getBatteryTextColor(metrics?.batteryLevel || 0)"
          >
            {{ metrics?.batteryLevel || '0' }}
          </span>
          <span class="text-sm text-gray-500 ml-1">%</span>
        </div>
      </div>

      <!-- Signal -->
      <div class="metric-card">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-500">Signal</span>
          <i
            class="fas"
            :class="getSignalIcon(metrics?.signalStrength || 0)"
          ></i>
        </div>
        <div class="mt-2">
          <span class="text-2xl font-bold text-gray-900">
            {{ metrics?.signalStrength || '0' }}
          </span>
          <span class="text-sm text-gray-500 ml-1">dBm</span>
        </div>
      </div>

      <!-- Distance (si showStats est true) -->
      <div v-if="showStats" class="metric-card">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-500">Distance</span>
          <i class="fas fa-road text-indigo-500"></i>
        </div>
        <div class="mt-2">
          <span class="text-2xl font-bold text-gray-900">
            {{ formatDistance(metrics?.distance || 0) }}
          </span>
          <span class="text-sm text-gray-500 ml-1">km</span>
        </div>
      </div>

      <!-- Température -->
      <div v-if="showStats" class="metric-card">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-500">Température</span>
          <i
            class="fas"
            :class="getTemperatureIcon(metrics?.temperature || 0)"
          ></i>
        </div>
        <div class="mt-2">
          <span class="text-2xl font-bold text-gray-900">
            {{ metrics?.temperature || '0' }}
          </span>
          <span class="text-sm text-gray-500 ml-1">°C</span>
        </div>
      </div>

      <!-- État du moteur -->
      <div v-if="showStats" class="metric-card">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-500">Moteur</span>
          <i class="fas fa-engine text-indigo-500"></i>
        </div>
        <div class="mt-2">
          <span
            class="text-lg font-bold"
            :class="getEngineStatusColor(metrics?.engineStatus)"
          >
            {{ formatEngineStatus(metrics?.engineStatus) }}
          </span>
        </div>
      </div>

      <!-- Dernière mise à jour -->
      <div v-if="showStats" class="metric-card">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-500">Mise à jour</span>
          <i class="fas fa-clock text-indigo-500"></i>
        </div>
        <div class="mt-2">
          <span class="text-sm font-medium text-gray-900">
            {{ formatLastUpdate(metrics?.lastUpdate) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Vehicle, VehicleMetrics, TrackingData } from '@/types';

// Props
interface Props {
  vehicle: Vehicle;
  metrics?: VehicleMetrics | null;
  lastTrackingData?: TrackingData | null;
  showStats?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  metrics: null,
  lastTrackingData: null,
  showStats: false
});

// Formatage des statuts
const formatStatus = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Actif';
    case 'maintenance':
      return 'En maintenance';
    case 'inactive':
      return 'Inactif';
    default:
      return status;
  }
};

// Formatage de la distance
const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return (distance * 1000).toFixed(0) + ' m';
  }
  return distance.toFixed(1);
};

// Formatage de la dernière mise à jour
const formatLastUpdate = (date?: string): string => {
  if (!date) return 'Non disponible';
  
  const updateDate = new Date(date);
  const now = new Date();
  const diff = now.getTime() - updateDate.getTime();
  
  // Moins d'une minute
  if (diff < 60000) {
    return 'À l\'instant';
  }
  
  // Moins d'une heure
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `Il y a ${minutes} min`;
  }
  
  // Moins d'un jour
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `Il y a ${hours}h`;
  }
  
  // Plus d'un jour
  return updateDate.toLocaleDateString();
};

// Icônes et couleurs pour la batterie
const getBatteryIcon = (level: number): string => {
  if (level >= 90) return 'fa-battery-full text-green-500';
  if (level >= 60) return 'fa-battery-three-quarters text-green-500';
  if (level >= 40) return 'fa-battery-half text-yellow-500';
  if (level >= 20) return 'fa-battery-quarter text-orange-500';
  return 'fa-battery-empty text-red-500';
};

const getBatteryTextColor = (level: number): string => {
  if (level >= 40) return 'text-gray-900';
  if (level >= 20) return 'text-orange-600';
  return 'text-red-600';
};

// Icônes pour le signal
const getSignalIcon = (strength: number): string => {
  const absStrength = Math.abs(strength);
  if (absStrength <= 70) return 'fa-signal text-green-500';
  if (absStrength <= 85) return 'fa-signal text-yellow-500';
  if (absStrength <= 100) return 'fa-signal text-orange-500';
  return 'fa-signal-slash text-red-500';
};

// Icônes pour la température
const getTemperatureIcon = (temp: number): string => {
  if (temp <= 0) return 'fa-thermometer-empty text-blue-500';
  if (temp <= 25) return 'fa-thermometer-half text-green-500';
  if (temp <= 50) return 'fa-thermometer-three-quarters text-orange-500';
  return 'fa-thermometer-full text-red-500';
};

// Formatage et couleurs pour l'état du moteur
const formatEngineStatus = (status?: string): string => {
  switch (status) {
    case 'running':
      return 'En marche';
    case 'stopped':
      return 'Arrêté';
    case 'idle':
      return 'Au ralenti';
    default:
      return 'Inconnu';
  }
};

const getEngineStatusColor = (status?: string): string => {
  switch (status) {
    case 'running':
      return 'text-green-600';
    case 'stopped':
      return 'text-red-600';
    case 'idle':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
};
</script>

<style scoped>
.metric-card {
  @apply bg-gray-50 rounded-lg p-4;
}

.metric-card i {
  @apply text-lg;
}
</style>
