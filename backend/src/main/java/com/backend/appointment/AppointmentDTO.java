package com.backend.appointment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentDTO {

    private int id;
    private int patientId;
    private int doctorId;
    @NonNull
    private LocalDateTime appointmentDateTime;
    private String status;
    @NonNull
    private LocalDate createdAt;
    private LocalDate updatedAt;
}

