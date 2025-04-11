package com.gpstracking.service;

import com.gpstracking.model.TrackingData;
import com.gpstracking.model.User;
import com.gpstracking.model.Vehicle;
import com.gpstracking.repository.TrackingDataRepository;
import com.gpstracking.repository.VehicleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VehicleService {
    private final VehicleRepository vehicleRepository;
    private final TrackingDataRepository trackingDataRepository;

    public VehicleService(VehicleRepository vehicleRepository, TrackingDataRepository trackingDataRepository) {
        this.vehicleRepository = vehicleRepository;
        this.trackingDataRepository = trackingDataRepository;
    }

    @Transactional
    public Vehicle addVehicle(Vehicle vehicle, User user) {
        vehicle.setUser(user);
        return vehicleRepository.save(vehicle);
    }

    public Page<Vehicle> getUserVehicles(Long userId, Pageable pageable) {
        return vehicleRepository.findByUserId(userId, pageable);
    }

    public Vehicle getVehicle(Long vehicleId, Long userId) {
        return vehicleRepository.findByIdAndUserId(vehicleId, userId)
                .orElseThrow(() -> new UsernameNotFoundException("Vehicle not found"));
    }

    @Transactional
    public void deleteVehicle(Long vehicleId, Long userId) {
        if (!vehicleRepository.existsByIdAndUserId(vehicleId, userId)) {
            throw new UsernameNotFoundException("Vehicle not found");
        }
        vehicleRepository.deleteById(vehicleId);
    }

    @Transactional
    public TrackingData addTrackingData(Long vehicleId, TrackingData trackingData) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new UsernameNotFoundException("Vehicle not found"));
        
        trackingData.setVehicle(vehicle);
        trackingData.setTimestamp(LocalDateTime.now());
        return trackingDataRepository.save(trackingData);
    }

    public Page<TrackingData> getVehicleTrackingHistory(
            Long vehicleId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable) {
        return trackingDataRepository.findVehicleTrackingHistory(vehicleId, startDate, endDate, pageable);
    }

    public List<TrackingData> getLatestTrackingData(List<Long> vehicleIds) {
        return trackingDataRepository.findLatestTrackingDataForVehicles(vehicleIds);
    }

    public List<TrackingData> getRecentTrackingData(Long vehicleId, LocalDateTime since) {
        return trackingDataRepository.findRecentTrackingData(vehicleId, since);
    }

    // DTO pour les requêtes
    public record VehicleRequest(String name) {}

    public record TrackingDataRequest(
        Double latitude,
        Double longitude,
        Double speed,
        Double altitude,
        Double batteryLevel,
        String signalStrength,
        Double temperature
    ) {}
}
