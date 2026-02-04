package com.fesc.salerts.services.implementations;

import com.fesc.salerts.domain.entities.configPeriod.CalendarConfig;
import com.fesc.salerts.domain.entities.operation.Enrollment;
import com.fesc.salerts.domain.entities.operation.Grade;
import com.fesc.salerts.domain.entities.operation.Group;
import com.fesc.salerts.domain.entities.security.User;
import com.fesc.salerts.domain.repositories.CalendarConfigRepository;
import com.fesc.salerts.domain.repositories.EnrollmentRepository;
import com.fesc.salerts.domain.repositories.GradeRepository;
import com.fesc.salerts.domain.repositories.GroupRepository;
import com.fesc.salerts.dtos.responses.BulkUploadResponse;
import com.fesc.salerts.infrastructure.exceptions.ResourceNotFoundException;
import com.fesc.salerts.services.interfaces.GradeFileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.XSSFDataValidationHelper;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GradeFileServiceImpl implements GradeFileService {

    private final GroupRepository groupRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CalendarConfigRepository calendarConfigRepository;
    private final GradeRepository gradeRepository;

    @Override
    @Transactional(readOnly = true)
    public Resource generateGradeTemplate(Long groupId, Integer noteNumber) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));

        List<Enrollment> enrollments = enrollmentRepository.findByGroupId(groupId);
        enrollments.sort(Comparator.comparing((Enrollment e) -> e.getStudent().getLastname())
                .thenComparing(e -> e.getStudent().getName()));

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Notas Corte " + noteNumber);

            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle lockedStyle = createLockedStyle(workbook);
            CellStyle inputStyle = createInputStyle(workbook);

            createContextSection(sheet, group, noteNumber, headerStyle, lockedStyle);

            String[] headers = {"NIT/Código", "Apellidos", "Nombres", "Correo", "Nota (0.00 - 5.00)"};
            Row headerRow = sheet.createRow(5);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 6;
            for (Enrollment enrollment : enrollments) {
                User student = enrollment.getStudent();
                Row row = sheet.createRow(rowIdx++);

                createCell(row, 0, student.getNit(), lockedStyle);
                createCell(row, 1, student.getLastname(), lockedStyle);
                createCell(row, 2, student.getName(), lockedStyle);
                createCell(row, 3, student.getEmail(), lockedStyle);
                
                Cell gradeCell = row.createCell(4);
                gradeCell.setCellStyle(inputStyle);
            }

            for (int i = 0; i < 5; i++) sheet.autoSizeColumn(i);
            sheet.setColumnWidth(4, 5000);

            if (rowIdx > 6) addGradeValidation(sheet, 6, rowIdx - 1);

            sheet.protectSheet("");

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayResource(out.toByteArray());

        } catch (IOException e) {
            log.error("Error creating template", e);
            throw new RuntimeException("Error interno generando plantilla");
        }
    }

    @Override
    @Transactional
    public BulkUploadResponse uploadGrades(Long groupId, Integer noteNumber, MultipartFile file) {
        if (!isExcelFile(file)) throw new IllegalArgumentException("El archivo debe ser Excel (.xlsx)");
        
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));

        validateTermIsOpen(group.getAcademicPeriod().getId(), noteNumber);

        Map<String, Enrollment> enrollmentMap = enrollmentRepository.findByGroupId(groupId).stream()
                .collect(Collectors.toMap(
                        e -> e.getStudent().getEmail().trim().toLowerCase(),
                        Function.identity()
                ));

        Map<Long, Grade> existingGradesMap = gradeRepository.findByGroupIdAndTermNumber(groupId, noteNumber).stream()
                .collect(Collectors.toMap(
                        g -> g.getEnrollment().getId(),
                        Function.identity()
                ));

        List<Grade> gradesToSave = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        int rowsProcessed = 0;

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            validateExcelIntegrity(sheet, noteNumber);

            Iterator<Row> rowIterator = sheet.iterator();
            while (rowIterator.hasNext()) {
                Row currentRow = rowIterator.next();
                if (currentRow.getRowNum() < 6) continue;

                rowsProcessed++;
                int visualRow = currentRow.getRowNum() + 1;

                try {
                    String email = getCellStringValue(currentRow.getCell(3)); 
                    BigDecimal gradeValue = getCellNumericValue(currentRow.getCell(4));

                    if (email == null || email.isBlank()) continue;
                    if (gradeValue == null) continue;

                    if (gradeValue.compareTo(BigDecimal.ZERO) < 0 || gradeValue.compareTo(new BigDecimal("5.00")) > 0) {
                        errors.add("Fila " + visualRow + ": Nota fuera de rango (0-5)");
                        continue;
                    }

                    Enrollment enrollment = enrollmentMap.get(email.toLowerCase());
                    if (enrollment == null) {
                        errors.add("Fila " + visualRow + ": Estudiante no pertenece al grupo (" + email + ")");
                        continue;
                    }

                    Grade grade = existingGradesMap.getOrDefault(enrollment.getId(), new Grade());
                    if (grade.getId() == null) {
                        grade.setEnrollment(enrollment);
                        grade.setTermNumber(noteNumber);
                        grade.setRegistrationDate(LocalDateTime.now());
                    } else {
                        grade.setLastModifiedDate(LocalDateTime.now());
                    }
                    grade.setValue(gradeValue);
                    gradesToSave.add(grade);

                } catch (Exception e) {
                    errors.add("Fila " + visualRow + ": Error procesando datos");
                }
            }

            if (!gradesToSave.isEmpty()) {
                gradeRepository.saveAll(gradesToSave);
            }

        } catch (IOException e) {
            throw new RuntimeException("Error leyendo archivo Excel: " + e.getMessage());
        }

        return BulkUploadResponse.builder()
                .rowsProcessed(rowsProcessed)
                .gradesSaved(gradesToSave.size())
                .errorsCount(errors.size())
                .errorDetails(errors)
                .build();
    }

    private void validateTermIsOpen(Long periodId, Integer noteNumber) {
        CalendarConfig config = calendarConfigRepository.findByPeriodIdAndNoteNumber(periodId, noteNumber)
                .orElseThrow(() -> new IllegalArgumentException("No hay configuración para el Corte " + noteNumber));

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(config.getStartDate()) || now.isAfter(config.getEndDate())) {
            throw new IllegalArgumentException("El periodo de carga para el Corte " + noteNumber + " está cerrado.");
        }
    }

    private void validateExcelIntegrity(Sheet sheet, Integer expectedNoteNumber) {
        Row infoRow = sheet.getRow(3);
        if (infoRow == null) throw new IllegalArgumentException("Formato de plantilla inválido");
        
        Cell termCell = infoRow.getCell(3);
        String val = getCellStringValue(termCell);
        
        try {
            int fileNoteNumber = Integer.parseInt(val);
            if (fileNoteNumber != expectedNoteNumber) {
                throw new IllegalArgumentException("Plantilla incorrecta. Estás intentando subir notas del Corte " 
                        + fileNoteNumber + " en el espacio del Corte " + expectedNoteNumber);
            }
        } catch (NumberFormatException e) {
             throw new IllegalArgumentException("No se pudo verificar el corte de la plantilla");
        }
    }

    private void createContextSection(XSSFSheet sheet, Group group, Integer noteNumber, CellStyle headerStyle, CellStyle lockedStyle) {
        Row row0 = sheet.createRow(0);
        createCell(row0, 0, "INSTITUCIÓN EDUCATIVA FESC - SALERTS", headerStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 4));

        createContextRow(sheet, 2, "Asignatura:", group.getSubject().getName(), "Grupo:", group.getName(), lockedStyle);
        createContextRow(sheet, 3, "Periodo:", group.getAcademicPeriod().getName(), "Corte:", noteNumber.toString(), lockedStyle);
    }
    
    private void createContextRow(XSSFSheet sheet, int r, String l1, String v1, String l2, String v2, CellStyle style) {
        Row row = sheet.createRow(r);
        createCell(row, 0, l1, style); createCell(row, 1, v1, style);
        createCell(row, 2, l2, style); createCell(row, 3, v2, style);
    }

    private void addGradeValidation(XSSFSheet sheet, int start, int end) {
        XSSFDataValidationHelper dvHelper = new XSSFDataValidationHelper(sheet);
        CellRangeAddressList addressList = new CellRangeAddressList(start, end, 4, 4);
        DataValidationConstraint constraint = dvHelper.createDecimalConstraint(
                DataValidationConstraint.OperatorType.BETWEEN, "0.00", "5.00");
        DataValidation validation = dvHelper.createValidation(constraint, addressList);
        validation.setShowErrorBox(true);
        sheet.addValidationData(validation);
    }

    private CellStyle createHeaderStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont(); font.setBold(true); font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font); style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND); style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle createLockedStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle(); style.setLocked(true); return style;
    }

    private CellStyle createInputStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle(); style.setLocked(false);
        style.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN); style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN); style.setBorderRight(BorderStyle.THIN);
        style.setDataFormat(wb.createDataFormat().getFormat("0.00"));
        return style;
    }

    private void createCell(Row row, int col, String val, CellStyle style) {
        Cell cell = row.createCell(col); cell.setCellValue(val); cell.setCellStyle(style);
    }

    private boolean isExcelFile(MultipartFile file) {
        return Objects.equals(file.getContentType(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    private String getCellStringValue(Cell cell) {
        if (cell == null) return null;
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((int)cell.getNumericCellValue());
            default -> null;
        };
    }

    private BigDecimal getCellNumericValue(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC) return BigDecimal.valueOf(cell.getNumericCellValue()).setScale(2, RoundingMode.HALF_UP);
        if (cell.getCellType() == CellType.STRING) {
            try { return new BigDecimal(cell.getStringCellValue().replace(",", ".")).setScale(2, RoundingMode.HALF_UP); } 
            catch (Exception e) { return null; }
        }
        return null;
    }
}