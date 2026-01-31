package com.fesc.salerts.domain.entities.security;

import com.fesc.salerts.domain.entities.BaseEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "permission")
@Getter @Setter
@NoArgsConstructor
public class Permission extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "permission_type", length = 20)
    private String permissionType;
}
