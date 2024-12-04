package com.backend.user;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDate;

//@MappedSuperclass
@NoArgsConstructor
@Getter
@Setter
@RequiredArgsConstructor
@Entity
@Table(name="app_user")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "role", discriminatorType = DiscriminatorType.STRING)
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
    @Column(insertable = false, updatable = false)
    private Role role; //(Enum: 'general_user', 'patient', 'doctor')

    @NonNull
    private LocalDate createdAt;

    private LocalDate updatedAt = createdAt;
}
