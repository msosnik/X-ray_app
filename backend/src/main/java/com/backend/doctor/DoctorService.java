package com.backend.doctor;

import com.backend.patient.Patient;
import com.backend.patient.PatientRepository;
import com.backend.user.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    // Convert Doctor entity to DoctorDTO
    public DoctorDTO convertToDTO(Doctor doctor) {
        List<Integer> patientIds = doctor.getPatients()
                .stream()
                .map(Patient::getId)
                .collect(Collectors.toList());

        return new DoctorDTO(
                doctor.getEmail(),
                doctor.getFirstName(),
                doctor.getPasswordHash(),
                doctor.getLastName(),
                doctor.getCreatedAt(),
                doctor.getUpdatedAt(),
                doctor.getMedicalLicenceId(),
                doctor.getPhoneNumber(),
                doctor.getClinicAddress(),
                doctor.getSpecialization(),
                doctor.getAvailability(),
                doctor.getWorkingHours(),
                patientIds
        );
    }

    // Convert DoctorDTO to Doctor entity
    public Doctor convertToEntity(DoctorDTO doctorDTO) {
        Doctor doctor = new Doctor(
                doctorDTO.getEmail(),
                doctorDTO.getPasswordHash(),
                doctorDTO.getFirstName(),
                doctorDTO.getLastName(),
                doctorDTO.getCreatedAt(),

                doctorDTO.getMedicalLicenceId(),
                doctorDTO.getPhoneNumber(),
                doctorDTO.getClinicAddress(),
                doctorDTO.getSpecialization(),
                doctorDTO.getAvailability(),
                doctorDTO.getWorkingHours()
        );

        // Set role as DOCTOR
        doctor.setRole(Role.DOCTOR);

        // Convert patient IDs to Patient entities
        if (doctorDTO.getPatientIds() != null && !doctorDTO.getPatientIds().isEmpty()) {
            List<Patient> patients = patientRepository.findAllById(doctorDTO.getPatientIds());
            doctor.setPatients(patients);
        }

        return doctor;
    }

    // Method to get all doctors
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Method to get a doctor by ID
    public DoctorDTO getDoctorById(int id) {
        return doctorRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    // Method to create a new doctor
    public DoctorDTO createDoctor(DoctorDTO doctorDTO) {
        Doctor doctor = convertToEntity(doctorDTO);
        return convertToDTO(doctorRepository.save(doctor));
    }

    // Method to update a doctor
    public DoctorDTO updateDoctor(int id, DoctorDTO updatedDoctorDTO) {
        return doctorRepository.findById(id)
                .map(doctor -> {
                    doctor.setFirstName(updatedDoctorDTO.getFirstName());
                    doctor.setLastName(updatedDoctorDTO.getLastName());
                    doctor.setMedicalLicenceId(updatedDoctorDTO.getMedicalLicenceId());
                    doctor.setPhoneNumber(updatedDoctorDTO.getPhoneNumber());
                    doctor.setClinicAddress(updatedDoctorDTO.getClinicAddress());
                    doctor.setSpecialization(updatedDoctorDTO.getSpecialization());
                    doctor.setAvailability(updatedDoctorDTO.getAvailability());
                    doctor.setWorkingHours(updatedDoctorDTO.getWorkingHours());

                    // Update patients list
                    List<Patient> patients = patientRepository.findAllById(updatedDoctorDTO.getPatientIds());
                    doctor.setPatients(patients);

                    return convertToDTO(doctorRepository.save(doctor));
                })
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    // Method to delete a doctor
    public void deleteDoctor(int id) {
        doctorRepository.deleteById(id);
    }

    public List<DoctorDTO> getDoctorsByPatientId(int patientId) {
        return doctorRepository.getDoctorByPatients_Id(patientId).stream().map(this::convertToDTO).toList();
    }
}
