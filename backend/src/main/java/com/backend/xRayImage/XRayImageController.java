package com.backend.xRayImage;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@RestController
@RequestMapping("/xray-images")
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

//    @GetMapping("/file/{id}")
//    public ResponseEntity<Resource> getImageFile(@PathVariable int id) {
//        Resource file = xRayImageService.getImageFileById(id);
//        HttpHeaders headers = new HttpHeaders();
//
//        String contentType;
//        try {
//            Path filePath = file.getFile().toPath();
//            contentType = Files.probeContentType(filePath);
//        } catch (IOException e) {
//            contentType = "application/octet-stream"; // Default fallback
//        }
//
//        if (contentType == null || !contentType.startsWith("image/")) {
//            contentType = "application/octet-stream";
//        }
//
//        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"");
//        headers.add(HttpHeaders.CONTENT_TYPE, contentType);
//
////        headers.add(HttpHeaders.CONTENT_TYPE, "image/jpeg"); // Or detect type dynamically
//        return new ResponseEntity<>(file, headers, HttpStatus.OK);
//    }

    @PostMapping("/data")
    public ResponseEntity<XRayImageDTO> saveImageData(@RequestBody XRayImageDTO xRayImageDTO) {
        XRayImageDTO savedImage = xRayImageService.saveImageData(xRayImageDTO);
        return ResponseEntity.ok(savedImage);
    }

    @PostMapping("/{id}/upload")
    public ResponseEntity<XRayImageDTO> uploadImage(@PathVariable int id, @RequestParam("file") MultipartFile file) {
        XRayImageDTO image = xRayImageService.saveImageFile(id, file);
        return ResponseEntity.ok(image);
    }

    @PostMapping("/full")
    public ResponseEntity<XRayImageDTO> saveFullXRayImage(
            @RequestPart("data") XRayImageDTO xRayImageDTO,
            @RequestPart("file") MultipartFile file) {

        XRayImageDTO savedImage = xRayImageService.saveFullImage(xRayImageDTO, file);
        return ResponseEntity.ok(savedImage);
    }

    @PutMapping("/{id}")
    public ResponseEntity<XRayImageDTO> updateImage(
            @PathVariable int id,
            @RequestBody XRayImageDTO xRayImageDTO) {
        XRayImageDTO updatedImage = xRayImageService.updateImage(id, xRayImageDTO);
        return ResponseEntity.ok(updatedImage);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable int id) {
        boolean isDeleted = xRayImageService.deleteImageData(id);
        return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    private HttpHeaders createHeadersForFile(Resource file) {
        HttpHeaders headers = new HttpHeaders();
        String contentType;

        try {
            Path filePath = file.getFile().toPath();
            contentType = Files.probeContentType(filePath);
        } catch (IOException e) {
            contentType = "application/octet-stream"; // Default fallback
        }

        if (contentType == null || !contentType.startsWith("image/")) {
            contentType = "application/octet-stream";
        }

        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"");
        headers.add(HttpHeaders.CONTENT_TYPE, contentType);

        return headers;
    }

    @GetMapping("/file/{id}")
    public ResponseEntity<Resource> getImageFile(@PathVariable int id) {
        Resource file = xRayImageService.getImageFileById(id);
        HttpHeaders headers = createHeadersForFile(file);
        return new ResponseEntity<>(file, headers, HttpStatus.OK);
    }

//    @GetMapping("/files/consented")
//    public ResponseEntity<List<Resource>> getConsentedImages() {
//        List<Resource> files = xRayImageService.getConsentedImages();
//        List<HttpHeaders> headersList = new ArrayList<>();
//
//        // Prepare headers for each file
//        files.forEach(file -> headersList.add(createHeadersForFile(file)));
//
//        // This example does not include the headersList in the response body;
//        // usually, the headers apply directly to individual files in the response.
//        return ResponseEntity.ok(files);
//    }

    @GetMapping("/files/consented")
    public ResponseEntity<Resource> getConsentedImagesAsZip() {
        List<Resource> files = xRayImageService.getConsentedImages();

        try {
            // Create a temporary ZIP file
            Path tempZip = Files.createTempFile("consented-images", ".zip");
            try (ZipOutputStream zos = new ZipOutputStream(Files.newOutputStream(tempZip))) {
                for (Resource file : files) {
                    Path filePath = file.getFile().toPath();
                    zos.putNextEntry(new ZipEntry(Objects.requireNonNull(file.getFilename())));
                    Files.copy(filePath, zos);
                    zos.closeEntry();
                }
            }

            Resource zipResource = new UrlResource(tempZip.toUri());
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"consented-images.zip\"");
            headers.add(HttpHeaders.CONTENT_TYPE, "application/zip");

            return new ResponseEntity<>(zipResource, headers, HttpStatus.OK);
        } catch (IOException e) {
            throw new RuntimeException("Error creating ZIP file", e);
        }
    }




}
