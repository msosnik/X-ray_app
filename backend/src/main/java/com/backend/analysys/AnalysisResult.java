package com.backend.analysys;

import com.backend.xRayImage.XRayImage;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
public class AnalysisResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NonNull
    @OneToOne
    private XRayImage xRayImage;

    @NonNull
    private List<String> detectedAbnormalities;
//    List<Annotation> annotationList;

    @NonNull
    private LocalDate analysisDate;

    private boolean doctorReviewed = false;
    private String doctorComments;
}
