-- =============================================================================
-- SAlerts Seed Data - Roles & Permissions REFINED (Teacher Restricted)
-- Target: PostgreSQL
-- Author: SAlerts Architect
-- =============================================================================

-- 1. ROLES
INSERT INTO role (id, name, identificator) VALUES 
(1, 'ADMINISTRATOR', gen_random_uuid()),
(2, 'COORDINATOR', gen_random_uuid()),
(3, 'TEACHER', gen_random_uuid()),
(4, 'STUDENT', gen_random_uuid())
ON CONFLICT (id) DO NOTHING;

-- 2. PERMISSIONS (IDs 1-29)
-- Mantener la misma lista de 29 permisos del archivo anterior...
INSERT INTO permission (id, name, permission_type, identificator) VALUES 
(1, 'STUDENTS', 'WRITE', gen_random_uuid()), (2, 'STUDENTS', 'READ', gen_random_uuid()),
(3, 'COORDINATORS', 'WRITE', gen_random_uuid()), (4, 'COORDINATORS', 'READ', gen_random_uuid()),
(5, 'TEACHERS', 'WRITE', gen_random_uuid()), (6, 'TEACHERS', 'READ', gen_random_uuid()),
(7, 'PROFILES', 'WRITE', gen_random_uuid()),
(8, 'SUBJECTS', 'WRITE', gen_random_uuid()), (9, 'SUBJECTS', 'READ', gen_random_uuid()),
(10, 'PROGRAMS', 'WRITE', gen_random_uuid()), (11, 'PROGRAMS', 'READ', gen_random_uuid()),
(12, 'GRADES', 'WRITE', gen_random_uuid()), (13, 'GRADES', 'READ', gen_random_uuid()),
(14, 'ATTENDANCE', 'WRITE', gen_random_uuid()), (15, 'ATTENDANCE', 'READ', gen_random_uuid()),
(16, 'ABSENCE_JUSTIFICATIONS', 'WRITE', gen_random_uuid()), (17, 'ABSENCE_JUSTIFICATIONS', 'READ', gen_random_uuid()),
(18, 'ATTENDANCE_OBSERVATIONS', 'WRITE', gen_random_uuid()), (19, 'ATTENDANCE_OBSERVATIONS', 'READ', gen_random_uuid()),
(20, 'STUDENT_OBSERVATIONS', 'WRITE', gen_random_uuid()), (21, 'STUDENT_OBSERVATIONS', 'READ', gen_random_uuid()),
(22, 'ALERT_OBSERVATIONS', 'WRITE', gen_random_uuid()), (23, 'ALERT_OBSERVATIONS', 'READ', gen_random_uuid()),
(24, 'REPORTS', 'READ', gen_random_uuid()), (25, 'EXCEL_IO', 'WRITE', gen_random_uuid()),
(26, 'GROUPS', 'WRITE', gen_random_uuid()), (27, 'GROUPS', 'READ', gen_random_uuid()),
(28, 'CONFIGURATION', 'WRITE', gen_random_uuid()), (29, 'CONFIGURATION', 'READ', gen_random_uuid())
ON CONFLICT (id) DO NOTHING;

-- 3. ROLE PERMISSIONS

-- ADMINISTRADOR: Acceso Total
INSERT INTO role_permission (role_id, permission_id) 
SELECT 1, id FROM permission ON CONFLICT DO NOTHING;

-- COORDINADOR: Gestión Operativa (Sin modificar configuración crítica si se desea)
INSERT INTO role_permission (role_id, permission_id) VALUES 
(2, 1), (2, 2), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10), (2, 11), 
(2, 13), (2, 15), (2, 16), (2, 19), (2, 20), (2, 22), (2, 24), (2, 25), (2, 26), (2, 27), (2, 29)
ON CONFLICT DO NOTHING;

-- PROFESOR: Acceso mínimo operativo
INSERT INTO role_permission (role_id, permission_id) VALUES 
(3, 2),  -- STUDENTS_READ
(3, 12), -- GRADES_WRITE
(3, 13), -- GRADES_READ
(3, 14), -- ATTENDANCE_WRITE
(3, 15), -- ATTENDANCE_READ
(3, 18), -- ATTENDANCE_OBS_WRITE
(3, 21), -- STUDENT_OBS_READ
(3, 23), -- ALERT_OBS_READ
(3, 25)  -- EXCEL_IO_WRITE
ON CONFLICT DO NOTHING;

-- ESTUDIANTE: Consulta básica
INSERT INTO role_permission (role_id, permission_id) VALUES 
(4, 13), (4, 15), (4, 23)
ON CONFLICT DO NOTHING;

-- 5. SEQUENCE RESET
SELECT setval('role_id_seq', (SELECT MAX(id) FROM role));
SELECT setval('permission_id_seq', (SELECT MAX(id) FROM permission));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));