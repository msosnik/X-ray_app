package com.backend.xRayImage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface XRayImageRepository extends JpaRepository<XRayImage, Integer> {
    List<XRayImage> findByBodyPart(String bodyPart);
    List<XRayImage> findByPatient_Id(int patientId);

    @Query("SELECT x FROM XRayImage x WHERE x.patient.consentToUseImages = true")
    List<XRayImage> findAllByPatientConsentTrue();

}
