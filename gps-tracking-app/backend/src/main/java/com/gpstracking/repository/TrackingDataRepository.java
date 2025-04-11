package com.gpstracking.repository;

import com.gpstracking.model.TrackingData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TrackingDataRepository extends JpaRepository<TrackingData, Long> {
    
    @Query("SELECT td FROM TrackingData td WHERE td.vehicle.id = :vehicleId " +
           "AND td.timestamp BETWEEN :startDate AND :endDate " +
           "ORDER BY td.timestamp DESC")
    Page<TrackingData> findVehicleTrackingHistory(
        @Param("vehicleId") Long vehicleId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );

    @Query("SELECT td FROM TrackingData td WHERE td.vehicle.id = :vehicleId " +
           "AND td.timestamp >= :since " +
           "ORDER BY td.timestamp DESC")
    List<TrackingData> findRecentTrackingData(
        @Param("vehicleId") Long vehicleId,
        @Param("since") LocalDateTime since
    );

    @Query("SELECT td FROM TrackingData td " +
           "WHERE td.vehicle.id IN :vehicleIds " +
           "AND td.id IN (SELECT MAX(td2.id) FROM TrackingData td2 " +
           "WHERE td2.vehicle.id IN :vehicleIds GROUP BY td2.vehicle.id)")
    List<TrackingData> findLatestTrackingDataForVehicles(
        @Param("vehicleIds") List<Long> vehicleIds
    );

    @Query("SELECT COUNT(td) FROM TrackingData td " +
           "WHERE td.vehicle.id = :vehicleId " +
           "AND td.timestamp BETWEEN :startDate AND :endDate")
    long countTrackingDataInPeriod(
        @Param("vehicleId") Long vehicleId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}
