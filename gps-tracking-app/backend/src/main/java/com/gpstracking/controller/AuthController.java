package com.gpstracking.controller;

import com.gpstracking.service.AuthenticationService;
import com.gpstracking.service.AuthenticationService.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8000")
public class AuthController {
    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register/business")
    public ResponseEntity<AuthResponse> registerBusinessUser(
            @Valid @RequestBody BusinessUserRequest request) {
        return ResponseEntity.ok(authenticationService.registerBusinessUser(request));
    }

    @PostMapping("/register/simple")
    public ResponseEntity<AuthResponse> registerSimpleUser(
            @Valid @RequestBody SimpleUserRequest request) {
        return ResponseEntity.ok(authenticationService.registerSimpleUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    // DTOs pour la validation des requêtes
    public record RegisterResponse(String message) {}

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity
                .badRequest()
                .body(e.getMessage());
    }
}
