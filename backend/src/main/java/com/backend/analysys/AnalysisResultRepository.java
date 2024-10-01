package com.backend.analysys;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, Integer> {
    Optional<AnalysisResult> findByxRayImage_Id(int XRayImageId);
}