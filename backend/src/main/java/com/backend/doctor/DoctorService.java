package com.backend.doctor;

import com.backend.exception.ResourceNotFoundException;
import com.backend.patient.Patient;
import com.backend.patient.PatientRepository;
import com.backend.user.EmailValidator;
import com.backend.user.PasswordUtil;
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
    @Autowired
    private PasswordUtil passwordUtil;

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

    public void validate(DoctorDTO doctorDto) {
        if (doctorDto.getFirstName().trim().isEmpty()) {
            throw new IllegalArgumentException("Doctors first name cannot be empty");
        }
        for (char letter : doctorDto.getFirstName().toCharArray()) {
            if (!Character.isLetter(letter) && letter != ' ') {
                throw new IllegalArgumentException("Doctors first name must consists only of letters or spaces");
            }
        }
        if (doctorDto.getLastName().trim().isEmpty()) {
            throw new IllegalArgumentException("Doctors second name cannot be empty");
        }
        for (char letter : doctorDto.getLastName().toCharArray()) {
            if (!Character.isLetter(letter) && letter != ' ') {
                throw new IllegalArgumentException("Doctors second name must consists only of letters or spaces");
            }
        }
        EmailValidator.validate(doctorDto.getEmail());
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
        validate(doctorDTO);
        String hashedPassword = passwordUtil.hashPassword(doctorDTO.getPasswordHash());
        doctorDTO.setPasswordHash(hashedPassword);
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

                    // Update Doctors list
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

    public void addPatientToDoctor(int doctorId, int patientId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + doctorId));

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));

        // Add patient to doctor's patient list
        doctor.getPatients().add(patient);

        // Add doctor to patient's doctor list (bidirectional)
        patient.getDoctors().add(doctor);

        // Save both doctor and patient
        doctorRepository.save(doctor);
        patientRepository.save(patient);
    }
}
