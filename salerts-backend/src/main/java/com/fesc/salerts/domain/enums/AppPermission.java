package com.fesc.salerts.domain.enums;

public enum AppPermission {

    // 1. Students
    STUDENTS_WRITE(Constants.STUDENTS_WRITE_VALUE),
    STUDENTS_READ(Constants.STUDENTS_READ_VALUE),

    // 2. Coordinators
    COORDINATORS_WRITE(Constants.COORDINATORS_WRITE_VALUE),
    COORDINATORS_READ(Constants.COORDINATORS_READ_VALUE), // Agregado

    // 3. Teachers
    TEACHERS_WRITE(Constants.TEACHERS_WRITE_VALUE),
    TEACHERS_READ(Constants.TEACHERS_READ_VALUE), // Agregado

    // 4. Profiles
    PROFILES_WRITE(Constants.PROFILES_WRITE_VALUE),

    // 5. Subjects
    SUBJECTS_WRITE(Constants.SUBJECTS_WRITE_VALUE),
    SUBJECTS_READ(Constants.SUBJECTS_READ_VALUE),

    // 6. Programs
    PROGRAMS_WRITE(Constants.PROGRAMS_WRITE_VALUE),
    PROGRAMS_READ(Constants.PROGRAMS_READ_VALUE),

    // 7. Grades
    GRADES_WRITE(Constants.GRADES_WRITE_VALUE),
    GRADES_READ(Constants.GRADES_READ_VALUE),

    // 8. Attendance
    ATTENDANCE_WRITE(Constants.ATTENDANCE_WRITE_VALUE),
    ATTENDANCE_READ(Constants.ATTENDANCE_READ_VALUE),

    // 9. Absence Justifications
    ABSENCE_JUSTIFICATIONS_WRITE(Constants.ABSENCE_JUSTIFICATIONS_WRITE_VALUE),
    ABSENCE_JUSTIFICATIONS_READ(Constants.ABSENCE_JUSTIFICATIONS_READ_VALUE),

    // 10. Attendance Observations
    ATTENDANCE_OBSERVATIONS_WRITE(Constants.ATTENDANCE_OBSERVATIONS_WRITE_VALUE),
    ATTENDANCE_OBSERVATIONS_READ(Constants.ATTENDANCE_OBSERVATIONS_READ_VALUE),

    // 11. Student Observations
    STUDENT_OBSERVATIONS_WRITE(Constants.STUDENT_OBSERVATIONS_WRITE_VALUE),
    STUDENT_OBSERVATIONS_READ(Constants.STUDENT_OBSERVATIONS_READ_VALUE),

    // 12. Alert Observations
    ALERT_OBSERVATIONS_WRITE(Constants.ALERT_OBSERVATIONS_WRITE_VALUE),
    ALERT_OBSERVATIONS_READ(Constants.ALERT_OBSERVATIONS_READ_VALUE),

    // 13. Reports & Excel
    REPORTS_READ(Constants.REPORTS_READ_VALUE),
    EXCEL_IO_WRITE(Constants.EXCEL_IO_WRITE_VALUE),

    // 14. Groups (Nuevos sincronizados con Front)
    GROUPS_WRITE(Constants.GROUPS_WRITE_VALUE),
    GROUPS_READ(Constants.GROUPS_READ_VALUE),

    // 15. Configuration (Nuevos sincronizados con Front)
    CONFIGURATION_WRITE(Constants.CONFIGURATION_WRITE_VALUE),
    CONFIGURATION_READ(Constants.CONFIGURATION_READ_VALUE);

    private final String name;

    AppPermission(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static class Constants {
        public static final String STUDENTS_WRITE_VALUE = "STUDENTS_WRITE";
        public static final String STUDENTS_READ_VALUE = "STUDENTS_READ";
        
        public static final String COORDINATORS_WRITE_VALUE = "COORDINATORS_WRITE";
        public static final String COORDINATORS_READ_VALUE = "COORDINATORS_READ";
        
        public static final String TEACHERS_WRITE_VALUE = "TEACHERS_WRITE";
        public static final String TEACHERS_READ_VALUE = "TEACHERS_READ";
        
        public static final String PROFILES_WRITE_VALUE = "PROFILES_WRITE";
        
        public static final String SUBJECTS_WRITE_VALUE = "SUBJECTS_WRITE";
        public static final String SUBJECTS_READ_VALUE = "SUBJECTS_READ";
        
        public static final String PROGRAMS_WRITE_VALUE = "PROGRAMS_WRITE";
        public static final String PROGRAMS_READ_VALUE = "PROGRAMS_READ";
        
        public static final String GRADES_WRITE_VALUE = "GRADES_WRITE";
        public static final String GRADES_READ_VALUE = "GRADES_READ";
        
        public static final String ATTENDANCE_WRITE_VALUE = "ATTENDANCE_WRITE";
        public static final String ATTENDANCE_READ_VALUE = "ATTENDANCE_READ";
        
        public static final String ABSENCE_JUSTIFICATIONS_WRITE_VALUE = "ABSENCE_JUSTIFICATIONS_WRITE";
        public static final String ABSENCE_JUSTIFICATIONS_READ_VALUE = "ABSENCE_JUSTIFICATIONS_READ";
        
        public static final String ATTENDANCE_OBSERVATIONS_WRITE_VALUE = "ATTENDANCE_OBSERVATIONS_WRITE";
        public static final String ATTENDANCE_OBSERVATIONS_READ_VALUE = "ATTENDANCE_OBSERVATIONS_READ";
        
        public static final String STUDENT_OBSERVATIONS_WRITE_VALUE = "STUDENT_OBSERVATIONS_WRITE";
        public static final String STUDENT_OBSERVATIONS_READ_VALUE = "STUDENT_OBSERVATIONS_READ";
        
        public static final String ALERT_OBSERVATIONS_WRITE_VALUE = "ALERT_OBSERVATIONS_WRITE";
        public static final String ALERT_OBSERVATIONS_READ_VALUE = "ALERT_OBSERVATIONS_READ";
        
        public static final String REPORTS_READ_VALUE = "REPORTS_READ";
        public static final String EXCEL_IO_WRITE_VALUE = "EXCEL_IO_WRITE";

        public static final String GROUPS_WRITE_VALUE = "GROUPS_WRITE";
        public static final String GROUPS_READ_VALUE = "GROUPS_READ";

        public static final String CONFIGURATION_WRITE_VALUE = "CONFIGURATION_WRITE";
        public static final String CONFIGURATION_READ_VALUE = "CONFIGURATION_READ";
    }
}