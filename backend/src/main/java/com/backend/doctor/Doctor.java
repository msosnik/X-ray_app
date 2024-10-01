package com.backend.doctor;

import com.backend.patient.Patient;
import com.backend.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name="doctor")
public class Doctor extends User {

    @Column(unique = true)
    private int medicalLicenceId;
    @Column(unique = true)
    private int PhoneNumber;
    @NonNull
    private String clinicAddress;
    private String specialization;
    private String availability;
    private String workingHours;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "doctor_patient", // Name of the join table
            joinColumns = @JoinColumn(name = "doctor_id"),
            inverseJoinColumns = @JoinColumn(name = "patient_id")
    )
    private List<Patient> patients;

    public Doctor(String email, String passwordHash, String firstName, String lastName, LocalDate createdAt, int medicalLicenceId, int phoneNumber, String clinicAddress, String specialization, String availability, String workingHours) {
        super(email, passwordHash, firstName, lastName, createdAt);
        this.setMedicalLicenceId(medicalLicenceId);
        this.setPhoneNumber(phoneNumber);
        this.setClinicAddress(clinicAddress);
        this.setSpecialization(specialization);
        this.setAvailability(availability);
        this.setWorkingHours(workingHours);

    }
}
