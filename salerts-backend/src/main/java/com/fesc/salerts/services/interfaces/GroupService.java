package com.fesc.salerts.services.interfaces;

import java.util.List;
import java.util.UUID;

import com.fesc.salerts.dtos.requests.CreateGroupRequest;
import com.fesc.salerts.dtos.requests.UpdateGroupRequest;
import com.fesc.salerts.dtos.responses.GroupDetailResponse;

public interface GroupService {
    GroupDetailResponse createGroup(CreateGroupRequest request);
    GroupDetailResponse updateGroup(UUID groupId, UpdateGroupRequest request);
    List<GroupDetailResponse> getGroups(UUID periodId, UUID teacherId, UUID subjectId);
    GroupDetailResponse getGroupDetail(UUID groupId);
}