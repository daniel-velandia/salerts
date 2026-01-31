package com.fesc.salerts.domain.entities.configPeriod;

import java.time.LocalDate;

import com.fesc.salerts.domain.entities.BaseEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "academic_period")
@Getter @Setter
@NoArgsConstructor
public class AcademicPeriod extends BaseEntity {

    @Column(length = 50)
    private String name;

    @Column(name = "initial_date")
    private LocalDate initialDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "active_state")
    private Boolean activeState;
}
