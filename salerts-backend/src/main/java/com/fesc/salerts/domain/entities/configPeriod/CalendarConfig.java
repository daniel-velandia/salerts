package com.fesc.salerts.domain.entities.configPeriod;

import java.time.LocalDateTime;

import com.fesc.salerts.domain.entities.BaseEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "calendar_config")
@Getter @Setter
@NoArgsConstructor
public class CalendarConfig extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "period_id")
    private AcademicPeriod period;

    @Column(name = "note_number")
    private Integer noteNumber;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;
}
