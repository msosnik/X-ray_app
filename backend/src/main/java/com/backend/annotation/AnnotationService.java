package com.backend.annotation;

import com.backend.analysys.AnalysisResultRepository;
import com.backend.doctor.DoctorRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnotationService {

    @Autowired
    private AnnotationRepository annotationRepository;

    @Autowired
    private AnalysisResultRepository analysisResultRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public AnnotationDTO convertToDTO(Annotation annotation) {
        return new AnnotationDTO(
                annotation.getAnnotationId(),
                annotation.getAnalysisResult().getId(),
                annotation.getDoctor().getId(),
                annotation.getAnnotationData(),
                annotation.getCreatedAt()
        );
    }

    public Annotation convertToEntity(AnnotationDTO annotationDTO) {
        Annotation annotation = new Annotation();
        annotation.setAnnotationId(annotationDTO.getAnnotationId());
        annotation.setAnalysisResult(
                analysisResultRepository.findById(annotationDTO.getAnalysisResultId())
                        .orElseThrow(() -> new RuntimeException("AnalysisResult not found"))
        );
        annotation.setDoctor(
                doctorRepository.findDoctorById(annotationDTO.getDoctorId())
                        .orElseThrow(() -> new RuntimeException("Doctor not found"))
        );
        annotation.setAnnotationData(annotationDTO.getAnnotationData());
        annotation.setCreatedAt(annotationDTO.getCreatedAt());
        return annotation;
    }

    public AnnotationDTO saveAnnotation(AnnotationDTO annotationDTO) {
        Annotation annotation = convertToEntity(annotationDTO);
        Annotation savedAnnotation = annotationRepository.save(annotation);
        return convertToDTO(savedAnnotation);
    }

    public List<AnnotationDTO> getAllAnnotations() {
        return annotationRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AnnotationDTO getAnnotationById(int id) {
        Annotation annotation = annotationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Annotation not found"));
        return convertToDTO(annotation);
    }

    public JsonNode getAnnotationJsonDataById(int id) {
        Annotation annotation = annotationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Annotation not found"));
        try {
            return objectMapper.readTree(annotation.getAnnotationData());
        } catch (Exception e) {
            throw new RuntimeException("Error parsing JSON data", e);
        }
    }

    public void deleteAnnotation(int id) {
        annotationRepository.deleteById(id);
    }
}
