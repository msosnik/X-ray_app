package com.backend.user;
import com.backend.doctor.Doctor;
import com.backend.doctor.DoctorRepository;
import com.backend.patient.Patient;
import com.backend.patient.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordUtil passwordUtil;

    // Authenticate by email for both doctors and patients
    public Optional<User> authenticate(String email, String plainPassword) {
        // First, check for a matching doctor
        Optional<Doctor> doctor = doctorRepository.findByEmail(email);
        if (doctor.isPresent() && passwordUtil.isPasswordCorrect(plainPassword, doctor.get().getPasswordHash())) {
            return Optional.of(doctor.get());
        }

        // Then, check for a matching patient
        Optional<Patient> patient = patientRepository.findByEmail(email);
        if (patient.isPresent() && passwordUtil.isPasswordCorrect(plainPassword, patient.get().getPasswordHash())) {
            return Optional.of(patient.get());
        }

        return Optional.empty(); // Invalid credentials
    }
}
