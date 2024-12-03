package com.backend.annotation;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnnotationDTO {
    private int annotationId;
    private int analysisResultId;
    private int doctorId;
    private String annotationData; // JSON as a string
    private LocalDateTime createdAt;
}
