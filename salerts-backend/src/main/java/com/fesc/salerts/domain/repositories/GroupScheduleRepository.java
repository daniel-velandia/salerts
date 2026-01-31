package com.fesc.salerts.domain.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.fesc.salerts.domain.entities.operation.Group;
import com.fesc.salerts.domain.entities.operation.GroupSchedule;

@Repository
public interface GroupScheduleRepository extends JpaRepository<GroupSchedule, Long> {
    @Query("SELECT gs FROM GroupSchedule gs " +
            "JOIN FETCH gs.group g " +
            "JOIN FETCH g.subject s " +
            "JOIN FETCH g.teacher t " +
            "JOIN FETCH g.academicPeriod p " +
            "WHERE p.activeState = true")
    List<GroupSchedule> findAllActiveSchedules();
    void deleteByGroup(Group group);
    List<GroupSchedule> findAllByGroup(Group group);
}
