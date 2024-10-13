package com.backend.appointment;

import com.backend.doctor.Doctor;
import com.backend.patient.Patient;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@RequiredArgsConstructor
@NoArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NonNull
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    @NonNull
    @ManyToOne
    private Doctor doctor;
    @NonNull
    private LocalDateTime appointmentDateTime;
    @NonNull
    @Enumerated(EnumType.STRING)
    private Status status;
//    private int  videoCallId; (For video conferencing)
    @NonNull
    private LocalDate createdAt;
    private LocalDate updatedAt;
}
