package com.fesc.salerts.services.implementations;

import com.fesc.salerts.domain.entities.academic.Program;
import com.fesc.salerts.domain.entities.academic.Subject;
import com.fesc.salerts.domain.entities.alerts.Alert;
import com.fesc.salerts.domain.entities.alerts.AlertView;
import com.fesc.salerts.domain.entities.configPeriod.AcademicPeriod;
import com.fesc.salerts.domain.entities.operation.Enrollment;
import com.fesc.salerts.domain.entities.operation.Grade;
import com.fesc.salerts.domain.entities.operation.Group;
import com.fesc.salerts.domain.entities.security.Role;
import com.fesc.salerts.domain.entities.security.User;
import com.fesc.salerts.domain.enums.AppRole;
import com.fesc.salerts.domain.repositories.AcademicPeriodRepository;
import com.fesc.salerts.domain.repositories.AlertRepository;
import com.fesc.salerts.domain.repositories.AlertViewRepository;
import com.fesc.salerts.domain.repositories.EnrollmentRepository;
import com.fesc.salerts.domain.repositories.GradeRepository;
import com.fesc.salerts.domain.repositories.ProgramRepository;
import com.fesc.salerts.domain.repositories.RoleRepository;
import com.fesc.salerts.domain.repositories.UserRepository;
import com.fesc.salerts.dtos.requests.CreateStudentRequest;
import com.fesc.salerts.dtos.requests.StudentFilter;
import com.fesc.salerts.dtos.responses.StudentDashboardResponse;
import com.fesc.salerts.dtos.responses.StudentDashboardResponse.AlertDetail;
import com.fesc.salerts.dtos.responses.StudentDashboardResponse.AlertInfo;
import com.fesc.salerts.dtos.responses.StudentDashboardResponse.StudentInfo;
import com.fesc.salerts.dtos.responses.StudentDashboardResponse.SubjectDetail;
import com.fesc.salerts.dtos.responses.StudentDashboardResponse.SubjectInfo;
import com.fesc.salerts.dtos.responses.StudentResponse;
import com.fesc.salerts.infrastructure.bootstrap.StudentSpecification;
import com.fesc.salerts.infrastructure.exceptions.ResourceNotFoundException;
import com.fesc.salerts.services.interfaces.StudentService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

        private final UserRepository userRepository;
        private final RoleRepository roleRepository;
        private final PasswordEncoder passwordEncoder;
        private final AcademicPeriodRepository academicPeriodRepository;
        private final EnrollmentRepository enrollmentRepository;
        private final GradeRepository gradeRepository;
        private final AlertRepository alertRepository;
        private final ProgramRepository programRepository;
        private final AlertViewRepository alertViewRepository;

        @Override
        @Transactional
        public StudentResponse createStudent(CreateStudentRequest request) {
                if (userRepository.existsByEmail(request.email())) {
                        throw new IllegalArgumentException("El email ya está registrado: " + request.email());
                }
                if (userRepository.existsByNit(request.nit())) {
                        throw new IllegalArgumentException(
                                        "El número de documento (NIT/CC) ya está registrado: " + request.nit());
                }

                Role studentRole = roleRepository.findByName(AppRole.STUDENT.name())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Rol STUDENT no encontrado en base de datos"));

                Program program = programRepository.findByIdentificator(request.programId())
                                .orElseThrow(() -> new ResourceNotFoundException("Programa no encontrado"));

                User student = new User();
                student.setName(request.name());
                student.setLastname(request.lastname());
                student.setNit(request.nit());
                student.setAddress(request.address());
                student.setCellphone(request.cellphone());
                student.setEmail(request.email());
                student.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                student.setRoles(Collections.singleton(studentRole));
                student.setProgram(program);

                User savedStudent = userRepository.save(student);

                return mapToResponse(savedStudent);
        }

        @Override
        @Transactional
        public StudentResponse updateStudent(CreateStudentRequest request, UUID identificator) {
                User student = userRepository.findByIdentificator(identificator)
                                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));

                Role studentRole = roleRepository.findByName(AppRole.STUDENT.name())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Rol STUDENT no encontrado en base de datos"));

                Program program = programRepository.findByIdentificator(request.programId())
                                .orElseThrow(() -> new ResourceNotFoundException("Programa no encontrado"));

                student.setName(request.name());
                student.setLastname(request.lastname());
                student.setNit(request.nit());
                student.setAddress(request.address());
                student.setCellphone(request.cellphone());
                student.setEmail(request.email());
                student.setRoles(Collections.singleton(studentRole));
                student.setProgram(program);

                User savedStudent = userRepository.save(student);
                return mapToResponse(savedStudent);
        }

        @Override
        @Transactional(readOnly = true)
        public List<StudentDashboardResponse> getAllStudents(StudentFilter filter) {
                AcademicPeriod activePeriod = academicPeriodRepository.findByActiveStateTrue()
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Operación no disponible: No se ha configurado un periodo académico como ACTIVO en el sistema."));

                List<User> students = userRepository.findAll(
                                StudentSpecification.getStudentsByFilter(filter, activePeriod.getIdentificator()));

                return students.stream()
                                .map(student -> mapToDashboardResponse(student, activePeriod))
                                .collect(Collectors.toList());
        }

        private StudentDashboardResponse mapToDashboardResponse(User student, AcademicPeriod activePeriod) {

                String programName = (student.getProgram() != null)
                                ? student.getProgram().getName()
                                : "Sin Programa Asignado";

                StudentInfo studentInfo = new StudentInfo(
                                student.getIdentificator(),
                                student.getName(),
                                student.getLastname(),
                                student.getNit(),
                                student.getEmail(),
                                student.getCellphone(),
                                student.getAddress(),
                                programName);

                if (activePeriod == null) {
                        return new StudentDashboardResponse(
                                        studentInfo,
                                        new SubjectInfo("N/A", BigDecimal.ZERO, List.of()),
                                        new AlertInfo(0, List.of()));
                }

                List<Enrollment> enrollments = enrollmentRepository.findByStudentAndGroup_AcademicPeriod(student,
                                activePeriod);
                SubjectInfo subjectInfo = calculateSubjectInfo(enrollments, activePeriod.getName());

                User currentUser = getCurrentUser();
                AlertInfo alertInfo = calculateAlertInfo(enrollments, currentUser);

                return new StudentDashboardResponse(studentInfo, subjectInfo, alertInfo);
        }

        private SubjectInfo calculateSubjectInfo(List<Enrollment> enrollments, String periodName) {
                if (enrollments.isEmpty()) {
                        return new SubjectInfo(periodName, BigDecimal.ZERO, List.of());
                }

                List<Grade> allGrades = gradeRepository.findByEnrollmentIn(enrollments);

                List<SubjectDetail> details = new ArrayList<>();
                BigDecimal sumDefinitives = BigDecimal.ZERO;

                for (Enrollment enrollment : enrollments) {
                        List<Grade> studentGrades = allGrades.stream()
                                        .filter(g -> g.getEnrollment().getId().equals(enrollment.getId()))
                                        .toList();

                        BigDecimal t1 = getGradeValue(studentGrades, 1);
                        BigDecimal t2 = getGradeValue(studentGrades, 2);
                        BigDecimal t3 = getGradeValue(studentGrades, 3);
                        BigDecimal t4 = getGradeValue(studentGrades, 4);

                        BigDecimal def = BigDecimal.ZERO
                                        .add(t1.multiply(new BigDecimal("0.25")))
                                        .add(t2.multiply(new BigDecimal("0.25")))
                                        .add(t3.multiply(new BigDecimal("0.20")))
                                        .add(t4.multiply(new BigDecimal("0.30")))
                                        .setScale(1, RoundingMode.HALF_UP);

                        sumDefinitives = sumDefinitives.add(def);

                        Group group = enrollment.getGroup();
                        Subject subject = group.getSubject();

                        details.add(new SubjectDetail(
                                        enrollment.getIdentificator(),
                                        subject.getName(),
                                        subject.getCode(),
                                        subject.getCredits(),
                                        group.getGroupName(),
                                        t1, t2, t3, t4, def));
                }

                BigDecimal overallAverage = details.isEmpty()
                                ? BigDecimal.ZERO
                                : sumDefinitives.divide(new BigDecimal(details.size()), 2, RoundingMode.HALF_UP);

                return new SubjectInfo(periodName, overallAverage, details);
        }

        private BigDecimal getGradeValue(List<Grade> grades, Integer term) {
                return grades.stream()
                                .filter(g -> g.getTermNumber().equals(term))
                                .findFirst()
                                .map(Grade::getValue)
                                .orElse(BigDecimal.ZERO);
        }

        private AlertInfo calculateAlertInfo(List<Enrollment> enrollments, User currentUser) {
                if (enrollments.isEmpty()) {
                        return new AlertInfo(0, List.of());
                }

                List<Alert> alerts = alertRepository.findByEnrollmentIn(enrollments);

                List<AlertView> userViews = alertViewRepository.findByUserAndAlertIn(currentUser, alerts);

                List<UUID> viewedAlertIds = userViews.stream()
                                .map(view -> view.getAlert().getIdentificator())
                                .toList();

                List<AlertDetail> alertDetails = alerts.stream()
                                .map(alert -> {
                                        boolean isReadByMe = viewedAlertIds.contains(alert.getIdentificator());
                                        return new AlertDetail(
                                                        alert.getIdentificator(),
                                                        alert.getType(),
                                                        alert.getDescription(),
                                                        alert.getRegistrationDate(),
                                                        isReadByMe);
                                })
                                .collect(Collectors.toList());

                long unreadCount = alertDetails.stream().filter(a -> !a.viewed()).count();

                return new AlertInfo(unreadCount, alertDetails);
        }

        @Override
        @Transactional(readOnly = true)
        public StudentResponse getStudentProfile(UUID identificator) {
                User student = userRepository.findByIdentificator(identificator)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Estudiante no encontrado con ID: " + identificator));

                return mapToResponse(student);
        }

        @Override
        @Transactional
        public void markStudentAlertsAsRead(UUID studentId) {
                User currentUser = getCurrentUser();

                AcademicPeriod activePeriod = academicPeriodRepository.findByActiveStateTrue()
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "No se pueden marcar alertas: No hay un periodo académico activo."));

                User student = userRepository.findByIdentificator(studentId)
                                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));

                List<Enrollment> enrollments = enrollmentRepository.findByStudentAndGroup_AcademicPeriod(student,
                                activePeriod);

                List<Alert> alerts = alertRepository.findByEnrollmentIn(enrollments);

                for (Alert alert : alerts) {
                        if (!alertViewRepository.existsByAlertAndUser(alert, currentUser)) {
                                AlertView view = new AlertView();
                                view.setAlert(alert);
                                view.setUser(currentUser);
                                view.setViewedAt(LocalDateTime.now());
                                alertViewRepository.save(view);
                        }
                }
        }

        private StudentResponse mapToResponse(User user) {
                return new StudentResponse(
                                user.getIdentificator(),
                                user.getName(),
                                user.getLastname(),
                                user.getNit(),
                                user.getCellphone(),
                                user.getAddress(),
                                user.getEmail(),
                                AppRole.STUDENT.name(),
                                user.getProgram().getIdentificator(),
                                user.getProgram().getName());
        }

        private User getCurrentUser() {
                String email = SecurityContextHolder.getContext().getAuthentication().getName();
                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Usuario en sesión no encontrado. Por favor, vuelva a iniciar sesión."));
        }
}
