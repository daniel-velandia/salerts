package com.fesc.salerts.domain.repositories;

import com.fesc.salerts.domain.entities.academic.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    boolean existsByCodeIgnoreCase(String code);
    Optional<Subject> findByIdentificator(UUID identificator);
}