package com.fesc.salerts.domain.entities.operation;

import java.time.LocalDate;

import com.fesc.salerts.domain.entities.BaseEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "attendance")
@Getter @Setter
@NoArgsConstructor
public class Attendance extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "enrollment_id")
    private Enrollment enrollment;

    private LocalDate date;

    private Boolean status; // true = Present, false = Absent
}
