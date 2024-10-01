package com.backend.patient;
import com.backend.doctor.Doctor;
import com.backend.user.Role;
import com.backend.user.User;
import com.backend.xRayImage.XRayImage;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name="patient")
public class Patient extends User {

    @NonNull
    private LocalDate dateOfBirth;
    @NonNull
    private String address;
    @Column(unique = true)
    private int phoneNumber;
    private boolean consentToUseImages = false;
    @OneToMany
    private List<XRayImage> xrayImages;

    @ManyToMany(mappedBy = "patients")
    private List<Doctor> doctors = new ArrayList<>();

    private Role role = Role.PATIENT;

    public Patient(String email, String passwordHash, String firstName, String lastName, LocalDate createdAt, LocalDate dateOfBirth, String address, int phoneNumber) {
        super(email, passwordHash, firstName, lastName, createdAt);
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.phoneNumber = phoneNumber;
    }
//    public Patient(String email, String passwordHash, String firstName, String lastName, LocalDate createdAt, LocalDate updatedAt, @NonNull LocalDate dateOfBirth, @NonNull String adress, int phoneNumber) {
//        super(email, passwordHash, firstName, lastName, createdAt); // Call User constructor
//        this.setUpdatedAt(updatedAt); // Set the updated date
//        this.dateOfBirth = dateOfBirth;
//        this.address = adress;
//        this.consentToUseImages =false;
//    }
}
