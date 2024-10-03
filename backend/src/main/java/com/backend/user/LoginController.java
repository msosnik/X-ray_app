package com.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private AuthService authService;

    // Endpoint to login both doctors and patients
    @PostMapping
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        return authService.authenticate(loginDTO.getEmail(), loginDTO.getPassword())
                .map(user -> ResponseEntity.ok("Login successful for user: " + user.getRole()))
                .orElseGet(() -> ResponseEntity.status(401).body("Invalid email or password"));
    }
}

