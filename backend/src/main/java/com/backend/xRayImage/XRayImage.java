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
    private String imagePath;

    @NonNull
    @ManyToOne
    private Patient patient;

    @NonNull
    private LocalDate uploadDate;

    @NonNull
    private String bodyPart;

}
