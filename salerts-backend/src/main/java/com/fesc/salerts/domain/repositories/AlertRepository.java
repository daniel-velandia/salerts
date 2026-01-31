package com.fesc.salerts.domain.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fesc.salerts.domain.entities.alerts.Alert;
import com.fesc.salerts.domain.entities.operation.Enrollment;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByEnrollmentIn(List<Enrollment> enrollments);
    boolean existsByEnrollmentAndTermNumberAndType(
        Enrollment enrollment, 
        Integer termNumber, 
        String type
    );
}