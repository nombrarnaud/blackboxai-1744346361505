package com.gpstracking.controller;

import com.gpstracking.model.TrackingData;
import com.gpstracking.model.User;
import com.gpstracking.model.Vehicle;
import com.gpstracking.service.VehicleService;
import com.gpstracking.service.VehicleService.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:8000")
public class VehicleController {
    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    public ResponseEntity<Vehicle> addVehicle(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody VehicleRequest request) {
        Vehicle vehicle = new Vehicle();
        vehicle.setName(request.name());
        return ResponseEntity.ok(vehicleService.addVehicle(vehicle, user));
    }

    @GetMapping
    public ResponseEntity<Page<Vehicle>> getUserVehicles(
            @AuthenticationPrincipal User user,
            Pageable pageable) {
        return ResponseEntity.ok(vehicleService.getUserVehicles(user.getId(), pageable));
    }

    @GetMapping("/{vehicleId}")
    public ResponseEntity<Vehicle> getVehicle(
            @AuthenticationPrincipal User user,
            @PathVariable Long vehicleId) {
        return ResponseEntity.ok(vehicleService.getVehicle(vehicleId, user.getId()));
    }

    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<Void> deleteVehicle(
            @AuthenticationPrincipal User user,
            @PathVariable Long vehicleId) {
        vehicleService.deleteVehicle(vehicleId, user.getId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{vehicleId}/tracking")
    public ResponseEntity<TrackingData> addTrackingData(
            @PathVariable Long vehicleId,
            @Valid @RequestBody TrackingDataRequest request) {
        TrackingData trackingData = new TrackingData();
        trackingData.setLatitude(request.latitude());
        trackingData.setLongitude(request.longitude());
        trackingData.setSpeed(request.speed());
        trackingData.setAltitude(request.altitude());
        trackingData.setBatteryLevel(request.batteryLevel());
        trackingData.setSignalStrength(request.signalStrength());
        trackingData.setTemperature(request.temperature());
        
        return ResponseEntity.ok(vehicleService.addTrackingData(vehicleId, trackingData));
    }

    @GetMapping("/{vehicleId}/tracking/history")
    public ResponseEntity<Page<TrackingData>> getVehicleTrackingHistory(
            @PathVariable Long vehicleId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate,
            Pageable pageable) {
        return ResponseEntity.ok(
            vehicleService.getVehicleTrackingHistory(vehicleId, startDate, endDate, pageable)
        );
    }

    @GetMapping("/{vehicleId}/tracking/recent")
    public ResponseEntity<List<TrackingData>> getRecentTrackingData(
            @PathVariable Long vehicleId,
            @RequestParam LocalDateTime since) {
        return ResponseEntity.ok(vehicleService.getRecentTrackingData(vehicleId, since));
    }

    @GetMapping("/tracking/latest")
    public ResponseEntity<List<TrackingData>> getLatestTrackingData(
            @RequestParam List<Long> vehicleIds) {
        return ResponseEntity.ok(vehicleService.getLatestTrackingData(vehicleIds));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity
                .badRequest()
                .body(e.getMessage());
    }
}
