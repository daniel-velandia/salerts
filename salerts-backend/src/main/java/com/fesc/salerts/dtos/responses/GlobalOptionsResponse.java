package com.fesc.salerts.dtos.responses;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public record GlobalOptionsResponse(
    List<PeriodOption> periods,
    List<ProgramOption> programs,
    List<SubjectOption> subjects,
    List<TeacherOption> teachers,
    List<GroupOption> groups,
    List<RoleOption> roles
) {
    public record PeriodOption(UUID id, String name, boolean active) {}
    
    public record ProgramOption(UUID id, String name) {}

    public record SubjectOption(
        UUID id, 
        String name, 
        Set<UUID> programIds
    ) {}

    public record TeacherOption(
        UUID id, 
        String name, 
        Set<UUID> programIds,
        Set<UUID> subjectIds
    ) {}

    public record GroupOption(
        UUID id, 
        String label, 
        UUID subjectId, 
        UUID teacherId,
        UUID periodId
    ) {}

    public record RoleOption(String id, String name) {}
}