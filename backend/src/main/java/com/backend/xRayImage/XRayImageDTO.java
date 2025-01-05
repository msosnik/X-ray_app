package com.backend.xRayImage;

import lombok.Data;
import java.time.LocalDate;

@Data
public class XRayImageDTO {
    private int id;
//    private String imagePath;
    private int patientId;
    private LocalDate uploadDate;
    private String bodyPart;
}
