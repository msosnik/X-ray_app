package com.backend.doctor;

import com.backend.user.UserRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
//public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
public interface DoctorRepository extends UserRepository<Doctor> {

    default Optional<Doctor> findDoctorById(int id) {
        return findById(id).filter(user -> user instanceof Doctor).map(user -> (Doctor) user);
    }

    default List<Doctor> findAllDoctors() {
        return findAll().stream().filter(user ->user instanceof Doctor).map(user -> (Doctor) user).toList();
    }

    default List<Doctor> findAllDoctorsByIds(List<Integer> ids) {
        return findAllById(ids).stream()
                .filter(user -> user instanceof Doctor)
                .map(user -> (Doctor) user)
                .toList();
    }

    @Query("SELECT d FROM Doctor d WHERE d.id = :id")
    List<Doctor> getDoctorByPatients_Id(int id);

}
