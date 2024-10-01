package com.backend.patient;

import com.backend.exception.ResourceNotFoundException;
import com.backend.doctor.DoctorRepository;
import com.backend.doctor.Doctor;
import com.backend.xRayImage.XRayImage;
import com.backend.xRayImage.XRayImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private XRayImageRepository xRayImageRepository;
    @Autowired
    private DoctorRepository doctorRepository;

    // Convert Patient entity to PatientDTO
    public PatientDTO convertToDTO(Patient patient) {
        List<Integer> xrayImageList = patient.getXrayImages()
                .stream()
                .map(XRayImage::getId)
                .collect(Collectors.toList());
        List<Integer> doctorsList = patient.getDoctors()
                .stream()
                .map(Doctor::getId)
                .collect(Collectors.toList());
        return new PatientDTO(
                patient.getEmail(),
                patient.getPasswordHash(),
                patient.getFirstName(),
                patient.getLastName(),
                patient.getCreatedAt(),
                patient.getUpdatedAt(),
                patient.getDateOfBirth(),
                patient.getAddress(),
                patient.getPhoneNumber(),
                patient.isConsentToUseImages(),
                doctorsList,
                xrayImageList
        );
    }

    // Convert PatientDTO to Patient entity
    public Patient convertToEntity(PatientDTO patientDTO) {
        Patient patient = new Patient(
                patientDTO.getEmail(),
                patientDTO.getPasswordHash(),
                patientDTO.getFirstName(),
                patientDTO.getLastName(),
                patientDTO.getCreatedAt(),

                patientDTO.getDateOfBirth(),
                patientDTO.getAddress(),
                patientDTO.getPhoneNumber()
        );
        patient.setConsentToUseImages(patientDTO.isConsentToUseImages());
        if (patientDTO.getXrayImages() != null && !patientDTO.getXrayImages().isEmpty()) {
            List<XRayImage> xrayImages = xRayImageRepository.findAllById(patientDTO.getXrayImages());
            patient.setXrayImages(xrayImages);
        }
        if (patientDTO.getDoctorList() != null && !patientDTO.getDoctorList().isEmpty()) {
            List<Doctor> doctors = doctorRepository.findAllById(patientDTO.getDoctorList());
            patient.setDoctors(doctors);
        }
        return patient;
    }

    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PatientDTO getPatientById(int id) {
        return patientRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    public PatientDTO createPatient(PatientDTO patientDTO) {
        Patient patient = convertToEntity(patientDTO);
        return convertToDTO(patientRepository.save(patient));
    }

    public PatientDTO updatePatient(int id, PatientDTO updatedPatientDTO) {
        return patientRepository.findById(id)
                .map(patient -> {
                    patient.setFirstName(updatedPatientDTO.getFirstName());
                    patient.setLastName(updatedPatientDTO.getLastName());
                    patient.setDateOfBirth(updatedPatientDTO.getDateOfBirth());
                    patient.setAddress(updatedPatientDTO.getAddress());
                    patient.setPhoneNumber(updatedPatientDTO.getPhoneNumber());
                    patient.setConsentToUseImages(updatedPatientDTO.isConsentToUseImages());
                    return convertToDTO(patientRepository.save(patient));
                })
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    public void deletePatientById(int id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        // This will remove the patient's association with any XRayImages if using orphan removal
        patient.getXrayImages().clear();

        patientRepository.delete(patient);
    }

    public List<PatientDTO> getPatientByDoctorId(int id) {
        return patientRepository.getPatientByDoctors_Id(id).stream().map(this::convertToDTO).toList();
    }
}
