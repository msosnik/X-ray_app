package com.backend.patient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PatientDTO {

    private int id;

    private String email;
    
    private String passwordHash;
    
    private String firstName;
    
    private String lastName;
    
    private LocalDate createdAt;

    private LocalDate updatedAt;
    
    private LocalDate dateOfBirth;
    
    private String address;

    private int phoneNumber;

    private boolean consentToUseImages;

    private List<Integer> xrayImages;

    private List<Integer> doctorList;

    private List<Integer> appointmentList;

//    public PatientDTO(@NonNull String email, @NonNull String passwordHash, @NonNull String firstName, @NonNull String lastName, @NonNull LocalDate createdAt, LocalDate updatedAt, Object o, @NonNull LocalDate dateOfBirth, @NonNull String address, int phoneNumber, boolean consentToUseImages, List<Integer> list, List<Integer> list1) {}
}

