package com.gpstracking.repository;

import com.gpstracking.model.SimpleUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SimpleUserRepository extends JpaRepository<SimpleUser, Long> {
    Optional<SimpleUser> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByIdCardNumber(String idCardNumber);
}
