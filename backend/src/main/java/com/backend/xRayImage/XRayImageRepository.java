package com.backend.xRayImage;

import com.backend.patient.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface XRayImageRepository extends JpaRepository<XRayImage, Integer> {
    List<XRayImage> findByBodyPart(String bodyPart);
    List<XRayImage> findByPatient_Id(int patientId);
}
