package com.fesc.salerts.domain.entities.operation;

import java.math.BigDecimal;

import com.fesc.salerts.domain.entities.BaseEntity;
import com.fesc.salerts.domain.entities.security.User;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Enrollment")
@Getter @Setter
@NoArgsConstructor
public class Enrollment extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @Column(name = "final_grade", precision = 3, scale = 2)
    private BigDecimal finalGrade;
}
