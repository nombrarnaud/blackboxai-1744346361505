import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService } from '@/services/api';
import { notificationService } from '@/services/notification';
import type { Vehicle, TrackingData, VehicleMetrics, VehicleFilters, PaginatedResponse } from '@/types';
import { VehicleStatus } from '@/types';

export const useVehicleStore = defineStore('vehicles', () => {
  // État
  const vehicles = ref<Vehicle[]>([]);
  const selectedVehicle = ref<Vehicle | null>(null);
  const trackingHistory = ref<TrackingData[]>([]);
  const vehicleMetrics = ref<{ [key: number]: VehicleMetrics }>({});
  const loading = ref(false);
  const historyLoading = ref(false);
  const filters = ref<VehicleFilters>({});
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });

  // Getters
  const filteredVehicles = computed(() => {
    let filtered = [...vehicles.value];

    if (filters.value.search) {
      const search = filters.value.search.toLowerCase();
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(search) ||
        v.registrationNumber.toLowerCase().includes(search)
      );
    }

    if (filters.value.status) {
      filtered = filtered.filter(v => v.status === filters.value.status);
    }

    if (filters.value.dateRange) {
      filtered = filtered.filter(v => {
        const updateDate = new Date(v.lastUpdate);
        return updateDate >= new Date(filters.value.dateRange!.start) &&
               updateDate <= new Date(filters.value.dateRange!.end);
      });
    }

    return filtered;
  });

  const activeVehicles = computed(() => 
    vehicles.value.filter(v => v.status === VehicleStatus.ACTIVE)
  );

  const vehiclesInMaintenance = computed(() => 
    vehicles.value.filter(v => v.status === VehicleStatus.MAINTENANCE)
  );

  const inactiveVehicles = computed(() => 
    vehicles.value.filter(v => v.status === VehicleStatus.INACTIVE)
  );

  // Actions
  const fetchVehicles = async () => {
    try {
      loading.value = true;
      const response = await apiService.get<PaginatedResponse<Vehicle>>('/vehicles', {
        params: {
          page: pagination.value.currentPage - 1,
          size: pagination.value.pageSize,
          ...filters.value
        }
      });

      vehicles.value = response.content;
      pagination.value = {
        currentPage: response.number + 1,
        totalPages: response.totalPages,
        totalItems: response.totalElements,
        pageSize: response.size
      };
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error);
      notificationService.error('Impossible de charger les véhicules');
    } finally {
      loading.value = false;
    }
  };

  const fetchVehicleHistory = async (vehicleId: number, startDate?: Date, endDate?: Date) => {
    try {
      historyLoading.value = true;
      const params: Record<string, string> = {};
      
      if (startDate && endDate) {
        params.startDate = startDate.toISOString();
        params.endDate = endDate.toISOString();
      }

      const response = await apiService.get<TrackingData[]>(
        `/vehicles/${vehicleId}/history`,
        { params }
      );
      trackingHistory.value = response;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      notificationService.error('Impossible de charger l\'historique');
    } finally {
      historyLoading.value = false;
    }
  };

  const fetchVehicleMetrics = async (vehicleId: number) => {
    try {
      const metrics = await apiService.get<VehicleMetrics>(
        `/vehicles/${vehicleId}/metrics`
      );
      vehicleMetrics.value[vehicleId] = metrics;
    } catch (error) {
      console.error('Erreur lors du chargement des métriques:', error);
      notificationService.error('Impossible de charger les métriques');
    }
  };

  const addVehicle = async (vehicleData: Partial<Vehicle>) => {
    try {
      loading.value = true;
      const newVehicle = await apiService.post<Vehicle>('/vehicles', vehicleData);
      vehicles.value.push(newVehicle);
      notificationService.success('Véhicule ajouté avec succès');
      return newVehicle;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du véhicule:', error);
      notificationService.error('Impossible d\'ajouter le véhicule');
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateVehicle = async (vehicleId: number, vehicleData: Partial<Vehicle>) => {
    try {
      loading.value = true;
      const updatedVehicle = await apiService.put<Vehicle>(
        `/vehicles/${vehicleId}`,
        vehicleData
      );
      const index = vehicles.value.findIndex(v => v.id === vehicleId);
      if (index !== -1) {
        vehicles.value[index] = updatedVehicle;
      }
      notificationService.success('Véhicule mis à jour avec succès');
      return updatedVehicle;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du véhicule:', error);
      notificationService.error('Impossible de mettre à jour le véhicule');
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const deleteVehicle = async (vehicleId: number) => {
    try {
      loading.value = true;
      await apiService.delete(`/vehicles/${vehicleId}`);
      vehicles.value = vehicles.value.filter(v => v.id !== vehicleId);
      if (selectedVehicle.value?.id === vehicleId) {
        selectedVehicle.value = null;
      }
      notificationService.success('Véhicule supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du véhicule:', error);
      notificationService.error('Impossible de supprimer le véhicule');
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const selectVehicle = (vehicle: Vehicle | null) => {
    selectedVehicle.value = vehicle;
    if (vehicle) {
      fetchVehicleMetrics(vehicle.id);
    }
  };

  const updateFilters = (newFilters: Partial<VehicleFilters>) => {
    filters.value = { ...filters.value, ...newFilters };
    pagination.value.currentPage = 1; // Réinitialiser la pagination
    fetchVehicles();
  };

  const setPage = (page: number) => {
    pagination.value.currentPage = page;
    fetchVehicles();
  };

  // Initialisation
  const initialize = () => {
    fetchVehicles();
  };

  return {
    // État
    vehicles,
    selectedVehicle,
    trackingHistory,
    vehicleMetrics,
    loading,
    historyLoading,
    filters,
    pagination,

    // Getters
    filteredVehicles,
    activeVehicles,
    vehiclesInMaintenance,
    inactiveVehicles,

    // Actions
    fetchVehicles,
    fetchVehicleHistory,
    fetchVehicleMetrics,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    selectVehicle,
    updateFilters,
    setPage,
    initialize
  };
});
