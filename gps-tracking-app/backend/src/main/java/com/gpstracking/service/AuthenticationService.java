package com.gpstracking.service;

import com.gpstracking.model.BusinessUser;
import com.gpstracking.model.SimpleUser;
import com.gpstracking.model.User;
import com.gpstracking.repository.BusinessUserRepository;
import com.gpstracking.repository.SimpleUserRepository;
import com.gpstracking.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final BusinessUserRepository businessUserRepository;
    private final SimpleUserRepository simpleUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            BusinessUserRepository businessUserRepository,
            SimpleUserRepository simpleUserRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.businessUserRepository = businessUserRepository;
        this.simpleUserRepository = simpleUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse registerBusinessUser(BusinessUserRequest request) {
        BusinessUser user = new BusinessUser();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setCompanyName(request.getCompanyName());
        user.setRegistrationNumber(request.getRegistrationNumber());
        user.setManagerFullName(request.getManagerFullName());

        businessUserRepository.save(user);
        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    public AuthResponse registerSimpleUser(SimpleUserRequest request) {
        SimpleUser user = new SimpleUser();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setIdCardNumber(request.getIdCardNumber());
        user.setFullName(request.getFullName());

        simpleUserRepository.save(user);
        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    public AuthResponse authenticate(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = businessUserRepository.findByEmail(request.getEmail())
                .map(User.class::cast)
                .orElseGet(() -> simpleUserRepository.findByEmail(request.getEmail())
                        .orElseThrow(() -> new RuntimeException("User not found")));

        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    // Classes DTO internes
    public record AuthResponse(String token) {}

    public record LoginRequest(String email, String password) {}

    public record BusinessUserRequest(
            String email,
            String password,
            String phoneNumber,
            String companyName,
            String registrationNumber,
            String managerFullName
    ) {}

    public record SimpleUserRequest(
            String email,
            String password,
            String phoneNumber,
            String idCardNumber,
            String fullName
    ) {}
}
