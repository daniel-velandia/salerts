package com.fesc.salerts.domain.entities.academic;

import com.fesc.salerts.domain.entities.BaseEntity;
import com.fesc.salerts.domain.entities.security.User;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "program")
@Getter @Setter
@NoArgsConstructor
public class Program extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @ManyToOne
    @JoinColumn(name = "coordinator_id")
    private User coordinator;
}
