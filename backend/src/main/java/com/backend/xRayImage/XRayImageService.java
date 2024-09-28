package com.backend.xRayImage;

import com.backend.patient.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class XRayImageService {

    @Autowired
    private XRayImageRepository xRayImageRepository;

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

    private XRayImage convertToEntity(XRayImageDTO dto, Patient patient) {
        XRayImage image = new XRayImage();
        image.setImagePath(dto.getImagePath());
        image.setPatient(patient);
        image.setUploadDate(dto.getUploadDate());
        image.setBodyPart(dto.getBodyPart());
        return image;
    }
}
