package com.fesc.salerts.services.implementations;

import com.fesc.salerts.domain.entities.security.Role;
import com.fesc.salerts.domain.entities.security.User;
import com.fesc.salerts.domain.repositories.RoleRepository;
import com.fesc.salerts.domain.repositories.UserRepository;
import com.fesc.salerts.dtos.requests.ChangePasswordRequest;
import com.fesc.salerts.dtos.requests.StaffFilter;
import com.fesc.salerts.dtos.requests.UpdateProfileRequest;
import com.fesc.salerts.dtos.requests.UserRequest;
import com.fesc.salerts.dtos.responses.StaffResponse;
import com.fesc.salerts.dtos.responses.UserResponse;
import com.fesc.salerts.infrastructure.bootstrap.StaffSpecification;
import com.fesc.salerts.infrastructure.exceptions.ResourceNotFoundException;
import com.fesc.salerts.services.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findByIdentificator(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("El correo electrónico ya está registrado: " + request.email());
        }

        if (userRepository.existsByNit(request.nit())) {
            throw new IllegalArgumentException("Ya existe un usuario con el NIT/Documento: " + request.nit());
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setLastname(request.lastname());
        user.setNit(request.nit());
        user.setAddress(request.address());
        user.setCellphone(request.cellphone());
        user.setPassword(passwordEncoder.encode(request.password()));

        assignRoles(user, request.rolesName());

        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse updateUser(UUID id, UserRequest request) {
        User user = userRepository.findByIdentificator(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getEmail().equals(request.email()) && userRepository.existsByEmail(request.email())) {
            throw new ResourceNotFoundException("Email already taken");
        }

        user.setName(request.name());
        user.setLastname(request.lastname());
        user.setNit(request.nit());
        user.setAddress(request.address());
        user.setCellphone(request.cellphone());
        user.setEmail(request.email());

        assignRoles(user, request.rolesName());

        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    private void assignRoles(User user, Set<String> rolesName) {
        Set<Role> roles = new HashSet<>(roleRepository.findByNameIn(rolesName));
        if (roles.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron los roles especificados: " + rolesName);
        }
        user.setRoles(roles);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StaffResponse> getStaff(StaffFilter filter) {
        List<User> users = userRepository.findAll(StaffSpecification.getStaffByFilter(filter));

        return users.stream()
                .map(this::mapToStaffResponse)
                .collect(Collectors.toList());
    }

    private StaffResponse mapToStaffResponse(User user) {
        String roleName = user.getRoles().stream()
                .findFirst()
                .map(Role::getName)
                .orElse("UNKNOWN");

        String programName = (user.getProgram() != null)
                ? user.getProgram().getName()
                : "Sin Programa Asignado";

        return new StaffResponse(
                user.getIdentificator(),
                user.getName(),
                user.getLastname(),
                user.getEmail(),
                user.getNit(),
                roleName,
                programName);
    }

    @Override
    @Transactional
    public void updateMyProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        user.setName(request.name());
        user.setLastname(request.lastname());
        user.setCellphone(request.cellphone());
        user.setAddress(request.address());

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual no es correcta.");
        }

        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new IllegalArgumentException("La nueva contraseña y su confirmación no coinciden.");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        return mapToResponse(user);
    }

    private UserResponse mapToResponse(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new UserResponse(
                user.getIdentificator(),
                user.getName(),
                user.getLastname(),
                user.getNit(),
                user.getAddress(),
                user.getCellphone(),
                user.getEmail(),
                roleNames);
    }
}