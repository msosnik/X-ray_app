package com.backend.analysys;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@Data
public class AnalysisResultDTO {
    private int id;
    private int xrayImageId;
    private List<String> detectedAbnormalities;
    private LocalDate analysisDate;
    private boolean doctorReviewed;
    private String doctorComments;
}
