package com.backend.patient;

import com.backend.user.UserRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
//public interface PatientRepository extends JpaRepository<Patient, Integer> {
public interface PatientRepository extends UserRepository<Patient> {

    default Optional<Patient> findPatientById(int id) {
        return findById(id).filter(user -> user instanceof Patient).map(user -> (Patient) user);
    }
    default List<Patient> findAllPatients() {
        return findAll().stream()
                .filter(user -> user instanceof Patient)
                .map(user -> (Patient) user)
                .toList();
    }

    default List<Patient> findAllPatientsByIds(List<Integer> ids) {
        return findAllById(ids).stream()
                .filter(user -> user instanceof Patient)
                .map(user -> (Patient) user)
                .toList();
    }

    List<Patient> getPatientByDoctors_Id(int id);
}
