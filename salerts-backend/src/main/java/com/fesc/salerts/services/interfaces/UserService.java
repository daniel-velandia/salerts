package com.fesc.salerts.services.interfaces;

import com.fesc.salerts.dtos.requests.ChangePasswordRequest;
import com.fesc.salerts.dtos.requests.StaffFilter;
import com.fesc.salerts.dtos.requests.UpdateProfileRequest;
import com.fesc.salerts.dtos.requests.UserRequest;
import com.fesc.salerts.dtos.responses.StaffResponse;
import com.fesc.salerts.dtos.responses.UserResponse;
import java.util.List;
import java.util.UUID;

public interface UserService {
    List<UserResponse> getAllUsers();
    UserResponse getUserById(UUID id);
    UserResponse createUser(UserRequest request);
    UserResponse updateUser(UUID id, UserRequest request);
    void deleteUser(Long id);
    List<StaffResponse> getStaff(StaffFilter filter);
    void updateMyProfile(String email, UpdateProfileRequest request);
    void changePassword(String email, ChangePasswordRequest request);
    UserResponse getMyProfile(String email);
}
