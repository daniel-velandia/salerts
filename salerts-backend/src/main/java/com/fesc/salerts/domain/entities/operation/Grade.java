package com.fesc.salerts.domain.entities.operation;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fesc.salerts.domain.entities.BaseEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Grade")
@Getter @Setter
@NoArgsConstructor
public class Grade extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "enrollment_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Enrollment enrollment;

    @Column(name = "term_number")
    private Integer termNumber;

    @Column(precision = 3, scale = 2)
    private BigDecimal value;

    @Column(name = "registration_date")
    private LocalDateTime registrationDate;

    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;
    
}
