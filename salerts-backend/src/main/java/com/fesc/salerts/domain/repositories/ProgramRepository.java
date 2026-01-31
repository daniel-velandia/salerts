package com.fesc.salerts.domain.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fesc.salerts.domain.entities.academic.Program;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    boolean existsByNameIgnoreCase(String name);
    Optional<Program> findByIdentificator(UUID identificator);
}
