package com.backend.patient;
import com.backend.doctor.Doctor;
import com.backend.user.Role;
import com.backend.user.User;
import com.backend.xRayImage.XRayImage;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
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
    private int phoneNumber;
    private boolean consentToUseImages = false;
    @OneToMany
    private List<XRayImage> xrayImages;

    @ManyToMany(mappedBy = "patients")
    private List<Doctor> doctor;

    public Patient(String email, String passwordHash, String firstName, String lastName, LocalDate createdAt, LocalDate updatedAt, @NonNull LocalDate dateOfBirth, @NonNull String adress, int phoneNumber) {
        super(email, passwordHash, firstName, lastName, createdAt); // Call User constructor
        this.setRole(Role.PATIENT); // Set the role to Patient
        this.setUpdatedAt(updatedAt); // Set the updated date
        this.dateOfBirth = dateOfBirth;
        this.address = adress;
        this.consentToUseImages =false;
        this.phoneNumber = phoneNumber;
    }
}
