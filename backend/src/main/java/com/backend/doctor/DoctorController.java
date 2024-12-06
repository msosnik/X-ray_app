package com.backend.doctor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // Get all doctors
    @GetMapping("/")
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    // Get doctor by ID
    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable int id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    // Get doctors by patient ID
    @GetMapping("/by-patient/{patientId}")
    public ResponseEntity<List<DoctorDTO>> getDoctorsByPatientId(@PathVariable int patientId) {
        return ResponseEntity.ok(doctorService.getDoctorsByPatientId(patientId));
    }

    // Create a new doctor
    @PostMapping("/")
    public ResponseEntity<DoctorDTO> createDoctor(@RequestBody DoctorDTO doctorDTO) {
        return ResponseEntity.ok(doctorService.createDoctor(doctorDTO));
    }

    // Update doctor by ID
    @PutMapping("/{id}")
    public ResponseEntity<DoctorDTO> updateDoctor(@PathVariable int id, @RequestBody DoctorDTO doctorDTO) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, doctorDTO));
    }

//    @PostMapping("/{doctorId}/patients/{patientId}")
//    public ResponseEntity<String> addPatientToDoctor(@PathVariable int doctorId, @PathVariable int patientId) {
//        doctorService.addPatientToDoctor(doctorId, patientId);
//        return ResponseEntity.ok("Patient added to doctor successfully.");
//    }

    @PutMapping("/{doctorId}/patients/{patientId}")
    public ResponseEntity<String> addPatientToDoctor(@PathVariable int doctorId, @PathVariable int patientId) {
        doctorService.addPatientToDoctor(doctorId, patientId);
        return ResponseEntity.ok("Patient added to doctor successfully.");
    }


    @DeleteMapping("/{doctorId}/patients/{patientId}")
    public ResponseEntity<String> removePatientFromDoctor(@PathVariable int doctorId, @PathVariable int patientId) {
        doctorService.removePatientFromDoctor(doctorId, patientId);
        return ResponseEntity.ok("Patient removed from doctor successfully.");
    }



    // Delete doctor by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable int id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }
}

