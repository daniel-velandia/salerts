package com.fesc.salerts.domain.entities.academic;

import com.fesc.salerts.domain.entities.BaseEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "subject")
@Getter @Setter
@NoArgsConstructor
public class Subject extends BaseEntity {

    @Column(unique = true, length = 20)
    private String code;

    @Column(length = 150)
    private String name;

    private Integer credits;
}
