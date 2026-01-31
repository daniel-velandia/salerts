package com.fesc.salerts.infrastructure.bootstrap;

import com.fesc.salerts.domain.entities.academic.Program;
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
                Expression<String> reverseName = cb.concat(cb.concat(cb.lower(root.get("lastname")), " "), cb.lower(root.get("name")));
                
                predicates.add(cb.or(
                    cb.like(fullName, searchLike),
                    cb.like(reverseName, searchLike),
                    cb.like(root.get("nit"), searchLike)
                ));
            }

            if (filter.programId() != null) {
                Join<User, Program> programJoin = root.join("program", JoinType.LEFT);
                Predicate isAssignedUser = cb.equal(programJoin.get("identificator"), filter.programId());

                Subquery<Long> subquery = query.subquery(Long.class);
                Root<Program> programRoot = subquery.from(Program.class);
                subquery.select(programRoot.get("coordinator").get("id"));
                subquery.where(cb.equal(programRoot.get("identificator"), filter.programId()));
                
                Predicate isCoordinator = root.get("id").in(subquery);

                predicates.add(cb.or(isAssignedUser, isCoordinator));
            }

            query.distinct(true);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}