package com.fesc.salerts.domain.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fesc.salerts.domain.entities.alerts.Alert;
import com.fesc.salerts.domain.entities.alerts.AlertView;
import com.fesc.salerts.domain.entities.security.User;

@Repository
public interface AlertViewRepository extends JpaRepository<AlertView, Long> {
    boolean existsByAlertAndUser(Alert alert, User user);
    List<AlertView> findByUserAndAlertIn(User user, List<Alert> alerts);
}
