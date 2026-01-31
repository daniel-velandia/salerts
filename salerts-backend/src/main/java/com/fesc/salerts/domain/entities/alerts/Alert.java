package com.fesc.salerts.domain.entities.alerts;

import java.time.LocalDateTime;

import com.fesc.salerts.domain.entities.BaseEntity;
import com.fesc.salerts.domain.entities.operation.Enrollment;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "alert")
@Getter @Setter
@NoArgsConstructor
public class Alert extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "enrollment_id")
    private Enrollment enrollment;

    private String type;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "term_number")
    private Integer termNumber;

    @Column(name = "registration_date")
    private LocalDateTime registrationDate;

    private Boolean viewed = false;
}
