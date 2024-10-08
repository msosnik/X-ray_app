package com.backend.appointment;

import com.backend.doctor.Doctor;
import com.backend.doctor.DoctorRepository;
import com.backend.exception.ResourceNotFoundException;
import com.backend.patient.Patient;
import com.backend.patient.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    // Convert DTO to Entity
    public Appointment convertToEntity(AppointmentDTO dto) {
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id " + dto.getDoctorId()));
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id " + dto.getPatientId()));

        return new Appointment(
            dto.getId(),
            patient,
            doctor,
            dto.getAppointmentDateTime(),
            Status.valueOf(dto.getStatus()),
            dto.getCreatedAt(),
            dto.getUpdatedAt()
        );
    }

    // Convert Entity to DTO
    public AppointmentDTO convertToDTO(Appointment appointment) {
        return new AppointmentDTO(
            appointment.getId(),
            appointment.getPatient().getId(),
            appointment.getDoctor().getId(),
            appointment.getAppointmentDateTime(),
            appointment.getStatus().toString(),
            appointment.getCreatedAt(),
            appointment.getUpdatedAt()
        );
    }

    // Get all appointments as DTOs
    public List<AppointmentDTO> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get appointment by ID as DTO
    public AppointmentDTO getAppointmentById(int id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id " + id));
        return convertToDTO(appointment);
    }

    // Get appointments by doctor ID as DTOs
    public List<AppointmentDTO> getAppointmentsByDoctorId(int doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        return appointments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get appointments by patient ID as DTOs
    public List<AppointmentDTO> getAppointmentsByPatientId(int patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        return appointments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Create a new appointment from DTO
    public AppointmentDTO createAppointment(AppointmentDTO appointmentDTO) {
        Appointment appointment = convertToEntity(appointmentDTO);
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return convertToDTO(savedAppointment);
    }

    // Update an existing appointment from DTO
    public AppointmentDTO updateAppointment(int id, AppointmentDTO updatedAppointmentDTO) {
        Appointment updatedAppointment = convertToEntity(updatedAppointmentDTO);
        Appointment savedAppointment = appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setDoctor(updatedAppointment.getDoctor());
                    appointment.setPatient(updatedAppointment.getPatient());
                    appointment.setAppointmentDateTime(updatedAppointment.getAppointmentDateTime());
                    appointment.setStatus(updatedAppointment.getStatus());
                    appointment.setUpdatedAt(updatedAppointment.getUpdatedAt());
                    return appointmentRepository.save(appointment);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id " + id));
        return convertToDTO(savedAppointment);
    }

    // Delete an appointment
    public void deleteAppointment(int id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id " + id));
        appointmentRepository.delete(appointment);
    }
}
