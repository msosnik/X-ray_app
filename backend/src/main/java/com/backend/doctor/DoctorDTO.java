package com.backend.doctor;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DoctorDTO {

    private int id;

    private String email;

    private String passwordHash;

    private String firstName;

    private String lastName;

    private LocalDate createdAt;

    private LocalDate updatedAt;

    private int medicalLicenceId;

    private int phoneNumber;

    private String clinicAddress;

    private String specialization;

    private String availability;

    private String workingHours;

    private List<Integer> patientIds;

    private List<Integer> appointmentList;
}
