package com.fesc.salerts.infrastructure.bootstrap;

import com.fesc.salerts.domain.entities.academic.Program;
import com.fesc.salerts.domain.entities.academic.Subject;
import com.fesc.salerts.domain.entities.configPeriod.AcademicPeriod;
import com.fesc.salerts.domain.entities.operation.Enrollment;
import com.fesc.salerts.domain.entities.operation.Group;
import com.fesc.salerts.domain.entities.operation.GroupSchedule;
import com.fesc.salerts.domain.entities.security.Role;
import com.fesc.salerts.domain.entities.security.User;
import com.fesc.salerts.dtos.requests.StudentFilter;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class StudentSpecification {

    public static Specification<User> getStudentsByFilter(StudentFilter filter, UUID currentPeriodId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            Join<User, Role> rolesJoin = root.join("roles");
            predicates.add(cb.equal(rolesJoin.get("name"), "STUDENT"));

            if (StringUtils.hasText(filter.searchTerm())) {
                String searchLike = "%" + filter.searchTerm().toLowerCase().trim() + "%";
                Expression<String> fullName = cb.concat(cb.concat(cb.lower(root.get("name")), " "), cb.lower(root.get("lastname")));
                Expression<String> reverseName = cb.concat(cb.concat(cb.lower(root.get("lastname")), " "), cb.lower(root.get("name")));
                
                predicates.add(cb.or(
                        cb.like(fullName, searchLike),
                        cb.like(reverseName, searchLike),
                        cb.like(root.get("nit"), searchLike)
                ));
            }

            if (filter.programId() != null) {
                Join<User, Program> programJoin = root.join("program", JoinType.LEFT);
                predicates.add(cb.equal(programJoin.get("identificator"), filter.programId()));
            }
        
            boolean hasAcademicFilters = filter.subjectId() != null || 
                                       filter.groupScheduleId() != null || 
                                       filter.dayOfWeek() != null || 
                                       filter.teacherId() != null;

            if (hasAcademicFilters && currentPeriodId != null) {

                Subquery<Long> subquery = query.subquery(Long.class);
                Root<Enrollment> enrollmentRoot = subquery.from(Enrollment.class);
                Join<Enrollment, Group> groupJoin = enrollmentRoot.join("group");
                
                subquery.select(enrollmentRoot.get("student").get("id"));

                List<Predicate> subPredicates = new ArrayList<>();

                Join<Group, AcademicPeriod> periodJoin = groupJoin.join("academicPeriod");
                subPredicates.add(cb.equal(periodJoin.get("identificator"), currentPeriodId));

                if (filter.teacherId() != null) {
                    Join<Group, User> teacherJoin = groupJoin.join("teacher");
                    subPredicates.add(cb.equal(teacherJoin.get("identificator"), filter.teacherId()));
                }

                if (filter.subjectId() != null) {
                    Join<Group, Subject> subjectJoin = groupJoin.join("subject");
                    subPredicates.add(cb.equal(subjectJoin.get("identificator"), filter.subjectId()));
                }

                if (filter.groupScheduleId() != null || filter.dayOfWeek() != null) {
                    ListJoin<Group, GroupSchedule> scheduleJoin = groupJoin.joinList("schedules");
                    
                    if (filter.groupScheduleId() != null) {
                        subPredicates.add(cb.equal(scheduleJoin.get("identificator"), filter.groupScheduleId()));
                    }
                    if (filter.dayOfWeek() != null) {
                        subPredicates.add(cb.equal(scheduleJoin.get("dayOfWeek"), filter.dayOfWeek()));
                    }
                }

                subquery.where(subPredicates.toArray(new Predicate[0]));
                
                predicates.add(root.get("id").in(subquery));
            }

            query.distinct(true);
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}