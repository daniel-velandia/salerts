package com.fesc.salerts.domain.repositories;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fesc.salerts.domain.entities.security.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
    Optional<Role> findByIdentificator(UUID identificator);
    Set<Role> findByIdentificatorIn(Set<UUID> identificators);
    Set<Role> findByNameIn(Set<String> rolesName);
}
