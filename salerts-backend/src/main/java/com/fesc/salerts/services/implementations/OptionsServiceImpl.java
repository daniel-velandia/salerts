package com.fesc.salerts.services.implementations;

import com.fesc.salerts.domain.entities.academic.*;
import com.fesc.salerts.domain.entities.configPeriod.AcademicPeriod;
import com.fesc.salerts.domain.entities.operation.*;
import com.fesc.salerts.domain.entities.security.Role;
import com.fesc.salerts.domain.entities.security.User;
import com.fesc.salerts.domain.repositories.*;
import com.fesc.salerts.dtos.responses.GlobalOptionsResponse;
import com.fesc.salerts.dtos.responses.GlobalOptionsResponse.*;
import com.fesc.salerts.services.interfaces.OptionsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OptionsServiceImpl implements OptionsService {

        private final ProgramRepository programRepository;
        private final SubjectRepository subjectRepository;
        private final SubjectProgramRepository subjectProgramRepository;
        private final GroupRepository groupRepository;
        private final AcademicPeriodRepository periodRepository;
        private final RoleRepository roleRepository;
        private final UserRepository userRepository;

        @Override
        @Transactional(readOnly = true)
        public GlobalOptionsResponse getGlobalOptions() {
                log.info("Iniciando carga global de opciones para filtros");

                // 1. CARGA DE UNIVERSOS (Catálogos base completos)
                List<AcademicPeriod> allPeriods = periodRepository.findAll();
                List<Program> allPrograms = programRepository.findAll();
                List<Subject> allSubjects = subjectRepository.findAll();
                List<Group> allGroups = groupRepository.findAll();
                List<User> allTeachers = userRepository.findByRoleName("TEACHER");
                List<Role> allRoles = roleRepository.findAll();

                // 2. MAPEO DE RELACIONES (Construcción de grafos de dependencia)

                // Relación Materia -> Programas (a través de SubjectProgram)
                List<SubjectProgram> allSubjectPrograms = subjectProgramRepository.findAllWithRelations();
                Map<UUID, Set<UUID>> subjectToProgramsMap = allSubjectPrograms.stream()
                                .collect(Collectors.groupingBy(
                                                sp -> sp.getSubject().getIdentificator(),
                                                Collectors.mapping(sp -> sp.getProgram().getIdentificator(),
                                                                Collectors.toSet())));

                // Relaciones originadas en los Grupos (Profesor <-> Materia <-> Programa)
                Map<UUID, Set<UUID>> teacherToSubjects = new HashMap<>();
                Map<UUID, Set<UUID>> teacherToPrograms = new HashMap<>();

                for (Group group : allGroups) {
                        if (group.getTeacher() == null || group.getSubject() == null)
                                continue;

                        UUID teacherId = group.getTeacher().getIdentificator();
                        UUID subjectId = group.getSubject().getIdentificator();

                        // Vincular Profe con Materia
                        teacherToSubjects.computeIfAbsent(teacherId, k -> new HashSet<>()).add(subjectId);

                        // Vincular Profe con los Programas de esa materia
                        Set<UUID> programsForSubject = subjectToProgramsMap.getOrDefault(subjectId,
                                        Collections.emptySet());
                        teacherToPrograms.computeIfAbsent(teacherId, k -> new HashSet<>()).addAll(programsForSubject);
                }

                // 3. TRANSFORMACIÓN A DTOS (Garantizando respuesta de todos los elementos)

                List<PeriodOption> periods = allPeriods.stream()
                                .map(p -> new PeriodOption(p.getIdentificator(), p.getName(), p.getActiveState()))
                                .toList();

                List<ProgramOption> programs = allPrograms.stream()
                                .map(p -> new ProgramOption(p.getIdentificator(), p.getName()))
                                .toList();

                List<SubjectOption> subjects = allSubjects.stream()
                                .map(s -> new SubjectOption(
                                                s.getIdentificator(),
                                                s.getName(),
                                                subjectToProgramsMap.getOrDefault(s.getIdentificator(),
                                                                Collections.emptySet())))
                                .toList();

                List<TeacherOption> teacherOptions = allTeachers.stream()
                                .map(t -> new TeacherOption(
                                                t.getIdentificator(),
                                                t.getName() + " " + t.getLastname(),
                                                teacherToPrograms.getOrDefault(t.getIdentificator(),
                                                                Collections.emptySet()),
                                                teacherToSubjects.getOrDefault(t.getIdentificator(),
                                                                Collections.emptySet())))
                                .toList();

                List<GroupOption> groupOptions = allGroups.stream()
                                .map(this::mapToGroupOption)
                                .filter(Objects::nonNull)
                                .toList();

                List<RoleOption> roles = allRoles.stream()
                                .filter(r -> !r.getName().equals("STUDENT") && !r.getName().equals("ADMINISTRATOR"))
                                .map(r -> new RoleOption(r.getName(), r.getName()))
                                .toList();

                return new GlobalOptionsResponse(periods, programs, subjects, teacherOptions, groupOptions, roles);
        }

        private GroupOption mapToGroupOption(Group group) {
                if (group.getSubject() == null) {
                        log.warn("Grupo detectado sin materia asociada: {}", group.getIdentificator());
                        return null;
                }

                String label = String.format("%s (%s)",
                                group.getGroupName(),
                                group.getSubject().getName());

                return new GroupOption(
                                group.getIdentificator(),
                                label,
                                group.getSubject().getIdentificator(),
                                group.getTeacher() != null ? group.getTeacher().getIdentificator() : null,
                                group.getAcademicPeriod() != null ? group.getAcademicPeriod().getIdentificator()
                                                : null);
        }
}