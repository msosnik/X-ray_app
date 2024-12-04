package com.backend.xRayImage;

import com.backend.exception.ResourceNotFoundException;
import com.backend.patient.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class XRayImageService {

    @Autowired
    private XRayImageRepository xRayImageRepository;
    @Autowired
    private PatientRepository patientRepository;

    public List<XRayImageDTO> getAllImages() {
        return xRayImageRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<XRayImageDTO> getImageById(int id) {
        return xRayImageRepository.findById(id).map(this::convertToDTO);
    }

    public List<XRayImageDTO> getImagesByBodyPart(String bodyPart) {
        return xRayImageRepository.findByBodyPart(bodyPart).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<XRayImageDTO> getImagesByPatientId(int patientId) {
        return xRayImageRepository.findByPatient_Id(patientId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private XRayImageDTO convertToDTO(XRayImage image) {
        XRayImageDTO dto = new XRayImageDTO();
        dto.setId(image.getId());
        dto.setImagePath(image.getImagePath());
        dto.setPatientId(image.getPatient().getId());
        dto.setUploadDate(image.getUploadDate());
        dto.setBodyPart(image.getBodyPart());
        return dto;
    }

    private XRayImage convertToEntity(XRayImageDTO dto) {
        XRayImage image = new XRayImage();
        image.setImagePath(dto.getImagePath());
        image.setPatient(patientRepository.findPatientById(dto.getPatientId()).orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: "+ dto.getPatientId())));
        image.setUploadDate(dto.getUploadDate());
        image.setBodyPart(dto.getBodyPart());
        return image;
    }

    public Resource getImageFileById(int id) {
        XRayImage image = xRayImageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found"));

        String imagePath = image.getImagePath();
        try {
            String baseDirectory = "uploads";
            Path filePath = Paths.get(baseDirectory, imagePath);

            if (!Files.exists(filePath) || !Files.isReadable(filePath)) {
                throw new RuntimeException("File not found or not readable: " + imagePath);
            }

            return new UrlResource(filePath.toUri());
        } catch (IOException e) {
            throw new RuntimeException("Error reading file: " + imagePath, e);
        }
    }


    public XRayImageDTO saveImageData(XRayImageDTO xRayImageDTO) {
        // Convert DTO to entity and save the data without image file
        XRayImage image = convertToEntity(xRayImageDTO);
        XRayImage savedImage = xRayImageRepository.save(image);
        return convertToDTO(savedImage);
    }

public String saveImageFile(int imageId, MultipartFile file) {
    String uploadDir = "uploads/images";
    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
    Path uploadPath = Paths.get(uploadDir);

    XRayImage savedImage = xRayImageRepository.findById(imageId)
            .orElseThrow(() -> new ResourceNotFoundException("Image not found"));

    try {
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, file.getBytes());

        savedImage.setImagePath("images/" + fileName);
        xRayImageRepository.save(savedImage);
    } catch (IOException e) {
        throw new RuntimeException("Error saving file", e);
    }
    return savedImage.getImagePath();
}


    public XRayImageDTO saveFullImage(XRayImageDTO xRayImageDTO, MultipartFile file) {
        // Save initial data to DB
        XRayImage image = convertToEntity(xRayImageDTO);
        XRayImage savedImage = xRayImageRepository.save(image);

        saveImageFile(image.getId(), file);
        return convertToDTO(savedImage);
    }

}
