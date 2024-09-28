package com.backend.xRayImage;

import com.backend.patient.Patient;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name="xray_image")
public class XRayImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NonNull
    @Column(unique = true)
    String imagePath;

    @NonNull
    @ManyToOne
    Patient patient;

    @NonNull
    LocalDate uploadDate;

    @NonNull
    String bodyPart;

}
