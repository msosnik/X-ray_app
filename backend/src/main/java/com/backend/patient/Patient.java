package com.backend.patient;
import com.backend.doctor.Doctor;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name="patient")
public class Patient {

    @Id
    @GeneratedValue
    private int id;
    @NonNull
    private String first_name;
    @NonNull
    private String last_name;
    @ManyToMany(mappedBy = "patients")
    private List<Doctor> doctor;
}
