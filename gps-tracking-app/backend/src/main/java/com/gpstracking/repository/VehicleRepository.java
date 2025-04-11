package com.gpstracking.repository;

import com.gpstracking.model.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Page<Vehicle> findByUserId(Long userId, Pageable pageable);
    
    List<Vehicle> findByUserId(Long userId);
    
    Optional<Vehicle> findByIdAndUserId(Long id, Long userId);
    
    @Query("SELECT v FROM Vehicle v WHERE v.user.id = :userId AND v.id = :vehicleId")
    Optional<Vehicle> findVehicleWithTrackingHistory(
        @Param("userId") Long userId, 
        @Param("vehicleId") Long vehicleId
    );
    
    boolean existsByIdAndUserId(Long id, Long userId);
    
    @Query("SELECT COUNT(v) FROM Vehicle v WHERE v.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
}
