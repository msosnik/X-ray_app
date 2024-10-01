package com.backend.analysys;
import com.backend.xRayImage.XRayImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AnalysisResultService {

    @Autowired
    private AnalysisResultRepository analysisResultRepository;

    public List<AnalysisResultDTO> getAllAnalysisResults() {
        return analysisResultRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<AnalysisResultDTO> getAnalysisResultById(int id) {
        return analysisResultRepository.findById(id).map(this::convertToDTO);
    }

    public Optional<AnalysisResultDTO> getAnalysisResultByImageId(int id) {
        return analysisResultRepository.findByxRayImage_Id(id).map(this::convertToDTO);
    }

    public AnalysisResult createAnalysisResult(AnalysisResult analysisResult) {
        return analysisResultRepository.save(analysisResult);
    }

    public AnalysisResult updateAnalysisResult(int id, AnalysisResult updatedResult) {
        return analysisResultRepository.findById(id)
                .map(result -> {
                    result.setDetectedAbnormalities(updatedResult.getDetectedAbnormalities());
                    result.setDoctorComments(updatedResult.getDoctorComments());
                    result.setDoctorReviewed(updatedResult.isDoctorReviewed());
                    return analysisResultRepository.save(result);
                })
                .orElseThrow(() -> new RuntimeException("AnalysisResult not found with id " + id));
    }

    public void deleteAnalysisResult(int id) {
        analysisResultRepository.deleteById(id);
    }

    private AnalysisResultDTO convertToDTO(AnalysisResult result) {
        AnalysisResultDTO dto = new AnalysisResultDTO();
        dto.setId(result.getId());
        dto.setXrayImageId(result.getXRayImage().getId());
        dto.setAnalysisDate(result.getAnalysisDate());
        dto.setDetectedAbnormalities(result.getDetectedAbnormalities());
        dto.setDoctorReviewed(result.isDoctorReviewed());
        dto.setDoctorComments(result.getDoctorComments());
        return dto;
    }

    private AnalysisResult convertToEntity(AnalysisResultDTO dto, XRayImage image) {
        AnalysisResult result = new AnalysisResult();
        result.setId(dto.getId());
        result.setXRayImage(image);
        result.setAnalysisDate(dto.getAnalysisDate());
        result.setDetectedAbnormalities(dto.getDetectedAbnormalities());
        result.setDoctorReviewed(dto.isDoctorReviewed());
        result.setDoctorComments(dto.getDoctorComments());
        return result;
    }

}
