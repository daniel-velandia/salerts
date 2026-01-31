package com.fesc.salerts.services.implementations;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.fesc.salerts.domain.entities.configPeriod.CalendarConfig;
import com.fesc.salerts.domain.entities.operation.Enrollment;
import com.fesc.salerts.domain.entities.operation.Grade;
import com.fesc.salerts.domain.entities.operation.Group;
import com.fesc.salerts.domain.entities.security.User;
import com.fesc.salerts.domain.repositories.CalendarConfigRepository;
import com.fesc.salerts.domain.repositories.EnrollmentRepository;
import com.fesc.salerts.domain.repositories.GradeRepository;
import com.fesc.salerts.domain.repositories.GroupRepository;
import com.fesc.salerts.domain.repositories.SubjectProgramRepository;
import com.fesc.salerts.domain.repositories.UserRepository;
import com.fesc.salerts.dtos.requests.EnrollStudentRequest;
import com.fesc.salerts.dtos.requests.SaveGradeRequest;
import com.fesc.salerts.dtos.responses.ExcelExportResponse;
import com.fesc.salerts.dtos.responses.GroupGradesResponse;
import com.fesc.salerts.infrastructure.exceptions.ResourceNotFoundException;
import com.fesc.salerts.services.interfaces.AcademicOperationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AcademicOperationServiceImpl implements AcademicOperationService {

    private final EnrollmentRepository enrollmentRepository;
    private final GradeRepository gradeRepository;
    private final CalendarConfigRepository calendarRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final SubjectProgramRepository subjectProgramRepository;

    @Override
    @Transactional
    public void enrollStudent(EnrollStudentRequest request) {
        Group group = groupRepository.findByIdentificator(request.groupId())
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        boolean alreadyEnrolledInSubject = enrollmentRepository.existsByStudentAndSubjectInPeriod(
                request.studentId(),
                group.getSubject().getIdentificator(),
                group.getAcademicPeriod().getIdentificator());

        if (alreadyEnrolledInSubject) {
            throw new IllegalArgumentException(
                    "El estudiante ya está matriculado en esta materia en el periodo actual (en este u otro grupo).");
        }

        if (enrollmentRepository.existsByGroupIdentificatorAndStudentIdentificator(request.groupId(),
                request.studentId())) {
            throw new IllegalArgumentException("El estudiante ya se encuentra inscrito en este grupo.");
        }

        User student = userRepository.findByIdentificator(request.studentId())
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));

        Enrollment enrollment = new Enrollment();
        enrollment.setGroup(group);
        enrollment.setStudent(student);
        enrollment.setFinalGrade(BigDecimal.ZERO);
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        initializeGrades(savedEnrollment);
    }

    private void initializeGrades(Enrollment enrollment) {
        List<Grade> initialGrades = new ArrayList<>();
        for (int i = 1; i <= 4; i++) {
            Grade grade = new Grade();
            grade.setEnrollment(enrollment);
            grade.setTermNumber(i);
            grade.setValue(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
            grade.setRegistrationDate(LocalDateTime.now());
            initialGrades.add(grade);
        }
        gradeRepository.saveAll(initialGrades);
    }

    @Override
    @Transactional
    public void saveGrade(SaveGradeRequest request) {
        Enrollment enrollment = enrollmentRepository.findByIdentificator(request.enrollmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Matrícula no encontrada"));

        UUID periodId = enrollment.getGroup().getAcademicPeriod().getIdentificator();
        CalendarConfig config = calendarRepository
                .findByPeriodIdentificatorAndNoteNumber(periodId, request.termNumber())
                .orElseThrow(() -> new IllegalArgumentException(
                        "No hay configuración de calendario para el corte " + request.termNumber()));

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(config.getStartDate()) || now.isAfter(config.getEndDate())) {
            throw new IllegalArgumentException(
                    "El sistema de notas está cerrado para el corte " + request.termNumber());
        }

        Grade grade = gradeRepository.findByEnrollmentAndTermNumber(enrollment, request.termNumber())
                .orElseThrow(() -> new IllegalArgumentException("La nota para este corte no ha sido inicializada."));

        grade.setValue(request.value().setScale(2, RoundingMode.HALF_UP));
        grade.setRegistrationDate(now);

        gradeRepository.saveAndFlush(grade);

        calculateFinalGrade(enrollment);
    }

    private void calculateFinalGrade(Enrollment enrollment) {
        List<Grade> grades = gradeRepository.findByEnrollment(enrollment);

        BigDecimal finalGrade = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        for (Grade g : grades) {
            BigDecimal gradeValue = (g.getValue() != null)
                    ? g.getValue()
                    : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

            BigDecimal weight = switch (g.getTermNumber()) {
                case 1 -> new BigDecimal("0.25");
                case 2 -> new BigDecimal("0.25");
                case 3 -> new BigDecimal("0.20");
                case 4 -> new BigDecimal("0.30");
                default -> BigDecimal.ZERO;
            };

            BigDecimal weightedNote = gradeValue.multiply(weight)
                    .setScale(2, RoundingMode.HALF_UP);

            finalGrade = finalGrade.add(weightedNote);
        }

        enrollment.setFinalGrade(finalGrade.setScale(2, RoundingMode.HALF_UP));
        enrollmentRepository.save(enrollment);
    }

    @Override
    @Transactional
    public GroupGradesResponse getGroupGrades(UUID groupId, UUID teacherId) {
        User me = currentUser();
        Group group = groupRepository.findByIdentificator(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        validateAccess(me, group, teacherId);

        List<Enrollment> enrollments = enrollmentRepository.findAllByGroupIdentificatorWithStudent(groupId);
        if (enrollments.isEmpty()) {
            return buildEmptyResponse(group);
        }

        List<Grade> allGrades = gradeRepository.findByEnrollmentIn(enrollments);

        Map<Long, Map<Integer, BigDecimal>> byEnrollmentAndTerm = allGrades.stream()
                .collect(Collectors.groupingBy(
                        g -> g.getEnrollment().getId(),
                        Collectors.toMap(Grade::getTermNumber, Grade::getValue, (a, b) -> b)));

        BigDecimal zero = new BigDecimal("0.00");

        List<GroupGradesResponse.StudentRow> rows = enrollments.stream().map(e -> {
            Map<Integer, BigDecimal> m = byEnrollmentAndTerm.getOrDefault(e.getId(), Map.of());
            User st = e.getStudent();

            return new GroupGradesResponse.StudentRow(
                    e.getIdentificator(),
                    new GroupGradesResponse.StudentInfo(st.getIdentificator(), st.getName(), st.getLastname(),
                            st.getEmail()),
                    m.getOrDefault(1, zero),
                    m.getOrDefault(2, zero),
                    m.getOrDefault(3, zero),
                    m.getOrDefault(4, zero),
                    e.getFinalGrade() == null ? zero : e.getFinalGrade());
        }).toList();

        return new GroupGradesResponse(
                group.getIdentificator(),
                group.getGroupName(),
                new GroupGradesResponse.SubjectInfo(group.getSubject().getIdentificator(), group.getSubject().getCode(),
                        group.getSubject().getName()),
                new GroupGradesResponse.TeacherInfo(group.getTeacher().getIdentificator(), group.getTeacher().getName(),
                        group.getTeacher().getLastname()),
                new GroupGradesResponse.PeriodInfo(group.getAcademicPeriod().getIdentificator(),
                        group.getAcademicPeriod().getName()),
                rows);
    }

    @Override
    @Transactional
    public ExcelExportResponse exportGradesToExcel(UUID groupId) {
        GroupGradesResponse data = getGroupGrades(groupId, null);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Notas");

            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle gradeStyle = workbook.createCellStyle();
            gradeStyle.setDataFormat(workbook.createDataFormat().getFormat("0.00"));

            sheet.createRow(0).createCell(0).setCellValue("Materia: " + data.subject().name());
            sheet.createRow(1).createCell(0)
                    .setCellValue("Docente: " + data.teacher().name() + " " + data.teacher().lastname());
            sheet.createRow(2).createCell(0).setCellValue("Grupo: " + data.groupName());
            sheet.createRow(3).createCell(0).setCellValue("Periodo: " + data.period().name());

            String[] columns = { "Estudiante", "Correo", "Corte 1 (25%)", "Corte 2 (25%)", "Corte 3 (20%)",
                    "Corte 4 (30%)", "Definitiva" };
            Row headerRow = sheet.createRow(5);
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            int startRowIdx = 7;
            int currentRow = startRowIdx;

            for (var studentRow : data.students()) {
                Row row = sheet.createRow(currentRow - 1);

                var info = studentRow.student();
                row.createCell(0).setCellValue(info.name() + " " + info.lastname());
                row.createCell(1).setCellValue(info.email());

                createNumericCell(row, 2, studentRow.term1(), gradeStyle);
                createNumericCell(row, 3, studentRow.term2(), gradeStyle);
                createNumericCell(row, 4, studentRow.term3(), gradeStyle);
                createNumericCell(row, 5, studentRow.term4(), gradeStyle);

                String colC = CellReference.convertNumToColString(2) + currentRow;
                String colD = CellReference.convertNumToColString(3) + currentRow;
                String colE = CellReference.convertNumToColString(4) + currentRow;
                String colF = CellReference.convertNumToColString(5) + currentRow;

                Cell cellDef = row.createCell(6);
                cellDef.setCellFormula(
                        String.format("(%s*0.25)+(%s*0.25)+(%s*0.20)+(%s*0.30)", colC, colD, colE, colF));
                cellDef.setCellStyle(gradeStyle);

                currentRow++;
            }

            for (int i = 0; i < columns.length; i++)
                sheet.autoSizeColumn(i);

            workbook.write(out);
            String cleanName = data.groupName().replaceAll("[^a-zA-Z0-9.-]", "_");
            return new ExcelExportResponse(new ByteArrayInputStream(out.toByteArray()), "Notas_" + cleanName + ".xlsx");

        } catch (IOException e) {
            throw new RuntimeException("Error generando Excel", e);
        }
    }

    @Override
    @Transactional
    public void unenrollStudent(UUID enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findByIdentificator(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("La matrícula no existe"));

        if (enrollment.getGroup().getAcademicPeriod().getEndDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "No se puede desvincular un estudiante de un periodo académico que ya ha finalizado.");
        }

        enrollmentRepository.delete(enrollment);
    }

    private void createNumericCell(Row row, int col, BigDecimal val, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(val != null ? val.doubleValue() : 0.0);
        cell.setCellStyle(style);
    }

    private CellStyle createHeaderStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setBold(true);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }

    private void validateAccess(User me, Group group, UUID teacherId) {
        boolean isTeacher = hasRole(me, "TEACHER");
        boolean isCoordinator = hasRole(me, "COORDINATOR");
        boolean isAdmin = hasRole(me, "ADMINISTRATOR");

        if (isTeacher && !isCoordinator && !isAdmin) {
            if (!group.getTeacher().getIdentificator().equals(me.getIdentificator())) {
                throw new AccessDeniedException("No tiene acceso a este grupo");
            }
        }

        if (isCoordinator && !isAdmin) {
            boolean allowed = subjectProgramRepository.coordinatorOwnsSubject(group.getSubject().getIdentificator(),
                    me.getIdentificator());
            if (!allowed)
                throw new AccessDeniedException("No tiene acceso a este grupo");
        }

        if (isCoordinator && teacherId != null) {
            if (!group.getTeacher().getIdentificator().equals(teacherId)) {
                throw new IllegalArgumentException("El grupo no corresponde al docente filtrado");
            }
        }
    }

    private GroupGradesResponse buildEmptyResponse(Group group) {
        return new GroupGradesResponse(group.getIdentificator(), group.getGroupName(),
                new GroupGradesResponse.SubjectInfo(group.getSubject().getIdentificator(), group.getSubject().getCode(),
                        group.getSubject().getName()),
                new GroupGradesResponse.TeacherInfo(group.getTeacher().getIdentificator(), group.getTeacher().getName(),
                        group.getTeacher().getLastname()),
                new GroupGradesResponse.PeriodInfo(group.getAcademicPeriod().getIdentificator(),
                        group.getAcademicPeriod().getName()),
                List.of());
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    private boolean hasRole(User user, String roleName) {
        return user.getRoles() != null && user.getRoles().stream().anyMatch(r -> roleName.equals(r.getName()));
    }
}