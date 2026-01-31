package com.fesc.salerts.domain.entities.academic;

import com.fesc.salerts.domain.entities.BaseEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "subject_program")
@Getter @Setter
@NoArgsConstructor
public class SubjectProgram extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "program_id")
    private Program program;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @Column(name = "suggested_semester")
    private Integer suggestedSemester;
}
