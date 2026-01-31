package com.fesc.salerts.services.implementations;

import com.fesc.salerts.domain.entities.academic.Subject;
import com.fesc.salerts.domain.entities.configPeriod.AcademicPeriod;
import com.fesc.salerts.domain.entities.operation.Group;
import com.fesc.salerts.domain.entities.operation.GroupSchedule;
import com.fesc.salerts.domain.entities.security.User;
import com.fesc.salerts.domain.repositories.*;
import com.fesc.salerts.dtos.requests.CreateGroupRequest;
import com.fesc.salerts.dtos.requests.UpdateGroupRequest;
import com.fesc.salerts.dtos.responses.GroupDetailResponse;
import com.fesc.salerts.infrastructure.exceptions.ResourceNotFoundException;
import com.fesc.salerts.services.interfaces.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {

        private final GroupRepository groupRepository;
        private final GroupScheduleRepository groupScheduleRepository;
        private final SubjectRepository subjectRepository;
        private final UserRepository userRepository;
        private final AcademicPeriodRepository periodRepository;
        private final EnrollmentRepository enrollmentRepository;

        @Override
        @Transactional
        public GroupDetailResponse createGroup(CreateGroupRequest request) {
                if (request.schedules() == null || request.schedules().isEmpty()) {
                        throw new IllegalArgumentException("El grupo debe tener al menos un horario asignado.");
                }
                Subject subject = subjectRepository.findByIdentificator(request.subjectId())
                                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada"));
                User teacher = userRepository.findByIdentificator(request.teacherId())
                                .orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado"));
                AcademicPeriod period = periodRepository.findByIdentificator(request.periodId())
                                .orElseThrow(() -> new ResourceNotFoundException("Periodo no encontrado"));

                Group group = new Group();
                group.setSubject(subject);
                group.setTeacher(teacher);
                group.setAcademicPeriod(period);
                group.setGroupName(request.groupName());
                group.setSchedule(generateScheduleSummary(request.schedules()));

                Group savedGroup = groupRepository.save(group);

                List<GroupSchedule> schedulesToSave = request.schedules().stream().map(req -> {
                        validateScheduleTimes(req.startTime(), req.endTime());
                        GroupSchedule gs = new GroupSchedule();
                        gs.setGroup(savedGroup);
                        gs.setDayOfWeek(req.dayOfWeek());
                        gs.setStartTime(req.startTime());
                        gs.setEndTime(req.endTime());
                        return gs;
                }).toList();

                List<GroupSchedule> savedSchedules = groupScheduleRepository.saveAll(schedulesToSave);
                return mapToResponse(savedGroup, savedSchedules, List.of());
        }

        @Override
        @Transactional
        public GroupDetailResponse updateGroup(UUID groupId, UpdateGroupRequest request) {
                Group group = groupRepository.findByIdentificator(groupId)
                                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

                if (!group.getTeacher().getIdentificator().equals(request.teacherId())) {
                        User newTeacher = userRepository.findByIdentificator(request.teacherId())
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "El nuevo profesor asignado no existe en el sistema."));
                        group.setTeacher(newTeacher);
                }

                group.setGroupName(request.groupName());
                group.setSchedule(generateScheduleSummary(request.schedules()));

                groupScheduleRepository.deleteByGroup(group);

                group.getSchedules().clear();

                List<GroupSchedule> newSchedules = request.schedules().stream().map(req -> {
                        validateScheduleTimes(req.startTime(), req.endTime());
                        GroupSchedule gs = new GroupSchedule();
                        gs.setGroup(group);
                        gs.setDayOfWeek(req.dayOfWeek());
                        gs.setStartTime(req.startTime());
                        gs.setEndTime(req.endTime());
                        return gs;
                }).collect(Collectors.toList());

                List<GroupSchedule> savedSchedules = groupScheduleRepository.saveAll(newSchedules);
                group.getSchedules().addAll(savedSchedules);

                groupRepository.save(group);

                return mapToResponse(group, savedSchedules, List.of());
        }

        @Override
        @Transactional(readOnly = true)
        public List<GroupDetailResponse> getGroups(UUID periodId, UUID teacherId, UUID subjectId) {
                List<Group> groups = groupRepository.findByFilters(periodId, teacherId, subjectId);

                return groups.stream()
                                .map(g -> mapToResponse(g, g.getSchedules(), List.of()))
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional(readOnly = true)
        public GroupDetailResponse getGroupDetail(UUID groupId) {
                Group group = groupRepository.findByIdentificator(groupId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "No se encontró el grupo solicitado. Es posible que haya sido eliminado."));

                List<GroupDetailResponse.StudentRowResponse> students = enrollmentRepository
                                .findAllByGroupIdentificatorWithStudent(groupId)
                                .stream()
                                .map(e -> new GroupDetailResponse.StudentRowResponse(
                                                e.getIdentificator(),
                                                e.getStudent().getName() + " " + e.getStudent().getLastname(),
                                                e.getStudent().getEmail()))
                                .toList();

                return mapToResponse(group, group.getSchedules(), students);
        }

        private void validateScheduleTimes(java.time.LocalTime start, java.time.LocalTime end) {
                if (end.isBefore(start) || end.equals(start)) {
                        throw new IllegalArgumentException(
                                        "Horario inválido: La hora de finalización debe ser posterior a la hora de inicio.");
                }
        }

        private String generateScheduleSummary(List<CreateGroupRequest.CreateScheduleRequest> schedules) {
                Locale locale = Locale.forLanguageTag("es-CO");
                return schedules.stream()
                                .map(s -> {
                                        String dayName = s.dayOfWeek().getDisplayName(TextStyle.FULL, locale);
                                        dayName = dayName.substring(0, 1).toUpperCase() + dayName.substring(1);
                                        return dayName + " " + s.startTime() + "-" + s.endTime();
                                })
                                .collect(Collectors.joining(" / "));
        }

        private GroupDetailResponse mapToResponse(
                        Group group,
                        List<GroupSchedule> schedules,
                        List<GroupDetailResponse.StudentRowResponse> students) {

                List<GroupDetailResponse.ScheduleResponse> scheduleResponses = (schedules == null) ? new ArrayList<>()
                                : schedules.stream()
                                                .map(s -> new GroupDetailResponse.ScheduleResponse(
                                                                s.getIdentificator(),
                                                                s.getDayOfWeek(),
                                                                s.getStartTime(),
                                                                s.getEndTime()))
                                                .toList();

                GroupDetailResponse.SubjectResponse subjectDto = new GroupDetailResponse.SubjectResponse(
                                group.getSubject().getIdentificator(),
                                group.getSubject().getName(),
                                group.getSubject().getCode());

                GroupDetailResponse.TeacherResponse teacherDto = new GroupDetailResponse.TeacherResponse(
                                group.getTeacher().getIdentificator(),
                                group.getTeacher().getName() + " " + group.getTeacher().getLastname(),
                                group.getTeacher().getEmail());

                GroupDetailResponse.PeriodResponse periodDto = new GroupDetailResponse.PeriodResponse(
                                group.getAcademicPeriod().getIdentificator(),
                                group.getAcademicPeriod().getName(),
                                group.getAcademicPeriod().getActiveState());

                return new GroupDetailResponse(
                                group.getIdentificator(),
                                group.getGroupName(),
                                subjectDto,
                                teacherDto,
                                group.getSchedule(),
                                periodDto,
                                scheduleResponses,
                                students);
        }
}