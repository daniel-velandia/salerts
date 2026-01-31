package com.fesc.salerts.domain.entities.operation;

import java.util.ArrayList;
import java.util.List;

import com.fesc.salerts.domain.entities.BaseEntity;
import com.fesc.salerts.domain.entities.academic.Subject;
import com.fesc.salerts.domain.entities.configPeriod.AcademicPeriod;
import com.fesc.salerts.domain.entities.security.User;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "groups")
@Getter
@Setter
@NoArgsConstructor
public class Group extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private User teacher;

    @ManyToOne
    @JoinColumn(name = "academic_period_id")
    private AcademicPeriod academicPeriod;

    @Column(name = "group_name", length = 100)
    private String groupName;

    @Column(length = 500)
    private String schedule;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupSchedule> schedules = new ArrayList<>();
}