package com.backend.patient;
import com.backend.doctor.Doctor;
import com.backend.user.User;
import com.backend.xRayImage.XRayImage;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.logging.XMLFormatter;

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

}
