package com.backend.doctor;

import com.backend.patient.Patient;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name="doctor")
public class Doctor {

    @Id
    @GeneratedValue
    private int id;
    @NonNull
    private String first_name;
    @NonNull
    private String last_name;
    @ManyToMany
    @JoinTable(
            name = "doctor_patient", // Name of the join table
            joinColumns = @JoinColumn(name = "doctor_id"),
            inverseJoinColumns = @JoinColumn(name = "patient_id")
    )
    private List<Patient> patients;

}
