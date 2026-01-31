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

            // 1. REGLA BASE: Solo usuarios con rol STUDENT
            Join<User, Role> rolesJoin = root.join("roles");
            predicates.add(cb.equal(rolesJoin.get("name"), "STUDENT"));

            // 2. Filtro de Texto Inteligente (Nombre Completo, Invertido o NIT)
            if (StringUtils.hasText(filter.searchTerm())) {
                String searchLike = "%" + filter.searchTerm().toLowerCase().trim() + "%";

                // A. Busqueda normal: "Pepito Perez" (Nombre + Apellido)
                Expression<String> fullName = cb.concat(
                    cb.concat(cb.lower(root.get("name")), " "), 
                    cb.lower(root.get("lastname"))
                );
                Predicate matchFullName = cb.like(fullName, searchLike);

                // B. Busqueda invertida: "Perez Pepito" (Apellido + Nombre)
                Expression<String> reverseName = cb.concat(
                    cb.concat(cb.lower(root.get("lastname")), " "), 
                    cb.lower(root.get("name"))
                );
                Predicate matchReverseName = cb.like(reverseName, searchLike);

                // C. Búsqueda por NIT (Documento)
                Predicate matchNit = cb.like(root.get("nit"), searchLike);

                // D. Unimos con OR
                predicates.add(cb.or(matchFullName, matchReverseName, matchNit));
            }

            if (filter.programId() != null) {
                Join<User, Program> programJoin = root.join("program", JoinType.LEFT);
                predicates.add(cb.equal(programJoin.get("identificator"), filter.programId()));
            }
        
            // 3. Filtros Académicos (Relaciones complejas)
            if (filter.programId() != null || filter.subjectId() != null || 
                filter.groupScheduleId() != null || filter.dayOfWeek() != null || 
                filter.teacherId() != null) {

                // SUBQUERY: Buscamos IDs de estudiantes matriculados que cumplan las condiciones
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<Enrollment> enrollmentRoot = subquery.from(Enrollment.class);
                Join<Enrollment, Group> groupJoin = enrollmentRoot.join("group");

                // Seleccionamos el ID del estudiante
                subquery.select(enrollmentRoot.get("student").get("id"));
                
                List<Predicate> subPredicates = new ArrayList<>();

                if (currentPeriodId != null) {
                    Join<Group, AcademicPeriod> periodJoin = groupJoin.join("academicPeriod");
                    subPredicates.add(cb.equal(periodJoin.get("identificator"), currentPeriodId));
                }

                // A. Filtro por Profesor
                if (filter.teacherId() != null) {
                    Join<Group, User> teacherJoin = groupJoin.join("teacher");
                    subPredicates.add(cb.equal(teacherJoin.get("identificator"), filter.teacherId()));
                }

                // B. Filtro por Materia
                if (filter.subjectId() != null) {
                    Join<Group, Subject> subjectJoin = groupJoin.join("subject");
                    subPredicates.add(cb.equal(subjectJoin.get("identificator"), filter.subjectId()));
                    
                    // Si hay materia, validamos el programa a través de ella
                    if (filter.programId() != null) {
                        Join<Subject, Program> programJoin = subjectJoin.join("program");
                        subPredicates.add(cb.equal(programJoin.get("identificator"), filter.programId()));
                    }
                }

                // D. Filtro por Horario
                if (filter.groupScheduleId() != null || filter.dayOfWeek() != null) {
                    Join<Group, GroupSchedule> scheduleJoin = groupJoin.join("schedules"); 

                    if (filter.groupScheduleId() != null) {
                        subPredicates.add(cb.equal(scheduleJoin.get("identificator"), filter.groupScheduleId()));
                    }
                    if (filter.dayOfWeek() != null) {
                        subPredicates.add(cb.equal(scheduleJoin.get("dayOfWeek"), filter.dayOfWeek()));
                    }
                }

                subquery.where(subPredicates.toArray(new Predicate[0]));
                
                // Aplicamos: El ID del usuario principal debe estar en la Subquery
                predicates.add(root.get("id").in(subquery));
            }

            query.distinct(true);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}