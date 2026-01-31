package com.fesc.salerts.domain.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Getter
@Setter
@MappedSuperclass
public abstract class BaseEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Column(name = "identificator", updatable = false, nullable = false, unique = true, columnDefinition = "UUID DEFAULT gen_random_uuid()")
    @JdbcTypeCode(SqlTypes.UUID)
    private UUID identificator;

    @PrePersist
    protected void onCreate() {
        if (this.identificator == null) {
            this.identificator = UUID.randomUUID();
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BaseEntity that = (BaseEntity) o;
        return Objects.equals(identificator, that.identificator);
    }

    @Override
    public int hashCode() {
        return Objects.hash(identificator);
    }
}