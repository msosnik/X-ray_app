package com.backend.user;
import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDate;

@Data
@MappedSuperclass
@NoArgsConstructor
@RequiredArgsConstructor
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NonNull
    @Column(unique = true)
    private String email;

    @NonNull
    private String passwordHash;

    @NonNull
    private String firstName;

    @NonNull
    private String lastName;

    @Enumerated(EnumType.STRING)
    private Role role; //(Enum: 'general_user', 'patient', 'doctor')

    @NonNull
    private LocalDate createdAt;

    private LocalDate updatedAt = createdAt;
}
