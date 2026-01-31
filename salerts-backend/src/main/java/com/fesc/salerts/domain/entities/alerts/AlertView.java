package com.fesc.salerts.domain.entities.alerts;

import java.time.LocalDateTime;

import com.fesc.salerts.domain.entities.BaseEntity;
import com.fesc.salerts.domain.entities.security.User;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "alert_view")
@Getter @Setter
@NoArgsConstructor
public class AlertView extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "alert_id", nullable = false)
    private Alert alert;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "viewed_at")
    private LocalDateTime viewedAt;
}
