package com.fesc.salerts.services.interfaces;

import java.util.List;
import java.util.UUID;

import com.fesc.salerts.dtos.requests.CreateSubjectRequest;
import com.fesc.salerts.dtos.responses.SubjectResponse;

public interface SubjectService {
    SubjectResponse createSubject(CreateSubjectRequest request);
    SubjectResponse updateSubject(UUID id, CreateSubjectRequest request);
    List<SubjectResponse> getAllSubjects(String search, UUID programId);
    SubjectResponse getSubject(UUID identificator);
}
