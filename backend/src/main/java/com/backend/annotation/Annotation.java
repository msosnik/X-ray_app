package com.backend.annotation;

import com.backend.analysys.AnalysisResult;
import com.backend.doctor.Doctor;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "annotation")
public class Annotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int annotationId;

    @ManyToOne
    @NonNull
    private AnalysisResult analysisResult;

    @ManyToOne
    @NonNull
    private Doctor doctor;

    @Lob
    @Column(columnDefinition = "CLOB")
    @NonNull
    private String annotationData; // Store JSON data as a String.

    @NonNull
    private LocalDateTime createdAt;

}
