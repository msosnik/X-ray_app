package com.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private BaseUserRepository baseUserRepository;

    @Autowired
    private PasswordUtil passwordUtil;

    // Authenticate by email for both doctors and patients
    public Optional<User> authenticate(String email, String plainPassword) {
        Optional<User> user = baseUserRepository.findByEmail(email);

        // Check if the user exists and the password matches
        if (user.isPresent() && passwordUtil.isPasswordCorrect(plainPassword, user.get().getPasswordHash())) {
            return user;
        }

        return Optional.empty(); // Invalid credentials
    }
}
