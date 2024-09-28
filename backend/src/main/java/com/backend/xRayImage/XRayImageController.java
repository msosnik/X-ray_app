package com.backend.xRayImage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/xray-images")
public class XRayImageController {

    @Autowired
    private XRayImageService xRayImageService;

    @GetMapping
    public List<XRayImageDTO> getAllImages() {
        return xRayImageService.getAllImages();
    }

    @GetMapping("/{id}")
    public ResponseEntity<XRayImageDTO> getImageById(@PathVariable int id) {
        Optional<XRayImageDTO> image = xRayImageService.getImageById(id);
        return image.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/body-part/{bodyPart}")
    public List<XRayImageDTO> getImagesByBodyPart(@PathVariable String bodyPart) {
        return xRayImageService.getImagesByBodyPart(bodyPart);
    }

    @GetMapping("/patient/{patientId}")
    public List<XRayImageDTO> getImagesByPatientId(@PathVariable int patientId) {
        return xRayImageService.getImagesByPatientId(patientId);
    }
}
