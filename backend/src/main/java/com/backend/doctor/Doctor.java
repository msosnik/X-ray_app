package com.backend.doctor;

import com.backend.patient.Patient;
import com.backend.user.User;
import jakarta.persistence.*;
import lombok.*;

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
    private String clinicAdress;

    private String specialization;
    private String availability;
    private String workingHours;

    @ManyToMany
    @JoinTable(
            name = "doctor_patient", // Name of the join table
            joinColumns = @JoinColumn(name = "doctor_id"),
            inverseJoinColumns = @JoinColumn(name = "patient_id")
    )
    private List<Patient> patients;

}
