package com.fesc.salerts.infrastructure.bootstrap;

import com.fesc.salerts.domain.entities.academic.Program;
import com.fesc.salerts.domain.entities.configPeriod.AcademicPeriod;
import com.fesc.salerts.domain.entities.operation.Enrollment;
import com.fesc.salerts.domain.entities.operation.Group;
import com.fesc.salerts.domain.entities.security.Role;
import com.fesc.salerts.domain.entities.security.User;
import com.fesc.salerts.domain.enums.AppRole;
import com.fesc.salerts.dtos.requests.StudentFilter;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class StudentSpecification {

    public static Specification<User> getStudentsByFilter(StudentFilter filter, UUID activePeriodId) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();


            Join<User, Role> rolesJoin = root.join("roles", JoinType.INNER);
            predicates.add(criteriaBuilder.equal(rolesJoin.get("name"), AppRole.STUDENT.name()));


            if (filter.searchTerm() != null && !filter.searchTerm().isBlank()) {
                String likePattern = "%" + filter.searchTerm().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), likePattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("lastname")), likePattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("nit")), likePattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), likePattern)
                ));
            }

            if (filter.programId() != null) {
                Join<User, Program> programJoin = root.join("program", JoinType.LEFT);
                predicates.add(criteriaBuilder.equal(programJoin.get("identificator"), filter.programId()));
            }

            boolean hasAcademicFilters = filter.groupScheduleId() != null || 
                                         filter.subjectId() != null || 
                                         filter.teacherId() != null;

            if (hasAcademicFilters) {
                
                Join<User, Enrollment> enrollmentJoin = root.join("enrollments", JoinType.INNER);
                
                Join<Enrollment, Group> groupJoin = enrollmentJoin.join("group", JoinType.INNER);

                if (activePeriodId != null) {
                    Join<Group, AcademicPeriod> periodJoin = groupJoin.join("academicPeriod", JoinType.INNER);
                    predicates.add(criteriaBuilder.equal(periodJoin.get("identificator"), activePeriodId));
                }

                if (filter.subjectId() != null) {
                    predicates.add(criteriaBuilder.equal(groupJoin.get("subject").get("identificator"), filter.subjectId()));
                }

                if (filter.teacherId() != null) {
                    predicates.add(criteriaBuilder.equal(groupJoin.get("teacher").get("identificator"), filter.teacherId()));
                }

                if (filter.groupScheduleId() != null) {
                    predicates.add(criteriaBuilder.equal(groupJoin.get("identificator"), filter.groupScheduleId()));
                }
            }

            query.distinct(true);

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}