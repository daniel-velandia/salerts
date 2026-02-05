package com.fesc.salerts.infrastructure.bootstrap;

import com.fesc.salerts.domain.entities.academic.Program;
import com.fesc.salerts.domain.entities.academic.SubjectProgram;
import com.fesc.salerts.domain.entities.operation.Group;
import com.fesc.salerts.domain.entities.security.Role;
import com.fesc.salerts.domain.entities.security.User;
import com.fesc.salerts.dtos.requests.StaffFilter;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class StaffSpecification {

    public static Specification<User> getStaffByFilter(StaffFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<User, Role> rolesJoin = root.join("roles");

            if (StringUtils.hasText(filter.roleName())) {
                predicates.add(cb.equal(rolesJoin.get("name"), filter.roleName()));
            } else {
                predicates.add(rolesJoin.get("name").in("TEACHER", "COORDINATOR"));
            }

            if (StringUtils.hasText(filter.searchTerm())) {
                String searchLike = "%" + filter.searchTerm().toLowerCase().trim() + "%";
                Expression<String> fullName = cb.concat(cb.concat(cb.lower(root.get("name")), " "), cb.lower(root.get("lastname")));
                predicates.add(cb.or(
                    cb.like(fullName, searchLike),
                    cb.like(root.get("nit"), searchLike),
                    cb.like(root.get("email"), searchLike)
                ));
            }

            if (filter.programId() != null) {
                
                Join<User, Program> programJoin = root.join("program", JoinType.LEFT);
                Predicate isAssignedUser = cb.equal(programJoin.get("identificator"), filter.programId());

                Subquery<Long> coordSubquery = query.subquery(Long.class);
                Root<Program> programRoot = coordSubquery.from(Program.class);
                coordSubquery.select(programRoot.get("coordinator").get("id"));
                coordSubquery.where(cb.equal(programRoot.get("identificator"), filter.programId()));
                Predicate isCoordinator = root.get("id").in(coordSubquery);

                Subquery<Long> subjectIdSubquery = query.subquery(Long.class);
                Root<SubjectProgram> spRoot = subjectIdSubquery.from(SubjectProgram.class);
                subjectIdSubquery.select(spRoot.get("subject").get("id")); // Seleccionamos el ID long interno de la materia
                subjectIdSubquery.where(cb.equal(spRoot.get("program").get("identificator"), filter.programId()));

                Subquery<Long> teacherIdSubquery = query.subquery(Long.class);
                Root<Group> groupRoot = teacherIdSubquery.from(Group.class);
                teacherIdSubquery.select(groupRoot.get("teacher").get("id"));
                teacherIdSubquery.where(groupRoot.get("subject").get("id").in(subjectIdSubquery));

                Predicate isTeacherOfProgram = root.get("id").in(teacherIdSubquery);

                predicates.add(cb.or(isAssignedUser, isCoordinator, isTeacherOfProgram));
            }

            query.distinct(true);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}