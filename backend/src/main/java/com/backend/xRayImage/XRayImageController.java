package com.backend.xRayImage;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
//  All get endpoints return only image url. you then need to get it using getImageFileById. I don't pass url as header in get cause of the / chars
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

    @GetMapping("/file/{id}")
    public ResponseEntity<Resource> getImageFile(@PathVariable int id) {
        Resource file = xRayImageService.getImageFileById(id);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"");
        headers.add(HttpHeaders.CONTENT_TYPE, "image/jpeg"); // Or detect type dynamically
        return new ResponseEntity<>(file, headers, HttpStatus.OK);
    }

    @PostMapping("/data")
    public ResponseEntity<XRayImageDTO> saveImageData(@RequestBody XRayImageDTO xRayImageDTO) {
        XRayImageDTO savedImage = xRayImageService.saveImageData(xRayImageDTO);
        return ResponseEntity.ok(savedImage);
    }

    @PostMapping("/{id}/upload")
    public ResponseEntity<String> uploadImage(@PathVariable int id, @RequestParam("file") MultipartFile file) {
        String imagePath = xRayImageService.saveImageFile(id, file);
        return ResponseEntity.ok(imagePath);
    }

    @PostMapping("/full")
    public ResponseEntity<XRayImageDTO> saveFullXRayImage(
            @RequestPart("data") XRayImageDTO xRayImageDTO,
            @RequestPart("file") MultipartFile file) {

        XRayImageDTO savedImage = xRayImageService.saveFullImage(xRayImageDTO, file);
        return ResponseEntity.ok(savedImage);
    }
}
