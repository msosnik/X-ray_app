package com.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BaseUserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
}
