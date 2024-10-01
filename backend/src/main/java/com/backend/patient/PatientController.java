package com.backend.patient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping
    public List<PatientDTO> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> getPatientById(@PathVariable int id) {
        try {
            return ResponseEntity.ok(patientService.getPatientById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/by-doctor/{id}")
    public ResponseEntity<List<PatientDTO>> getPatientByDoctorId(@PathVariable int id) {
        try {
            return ResponseEntity.ok(patientService.getPatientByDoctorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<PatientDTO> createPatient(@RequestBody PatientDTO patientDTO) {
        PatientDTO createdPatient = patientService.createPatient(patientDTO);
        return ResponseEntity.ok(createdPatient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientDTO> updatePatient(@PathVariable int id, @RequestBody PatientDTO patientDTO) {
        try {
            return ResponseEntity.ok(patientService.updatePatient(id, patientDTO));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable int id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}

