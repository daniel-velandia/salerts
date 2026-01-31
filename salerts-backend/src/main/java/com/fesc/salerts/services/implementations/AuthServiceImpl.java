package com.fesc.salerts.services.implementations;

import com.fesc.salerts.domain.entities.security.User;
import com.fesc.salerts.domain.repositories.UserRepository;
import com.fesc.salerts.dtos.requests.LoginRequest;
import com.fesc.salerts.dtos.responses.AuthResponse;
import com.fesc.salerts.dtos.responses.PermissionResponse;
import com.fesc.salerts.infrastructure.exceptions.ResourceNotFoundException;
import com.fesc.salerts.infrastructure.security.JwtService;
import com.fesc.salerts.services.interfaces.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

        private final UserRepository userRepository;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        @Override
        public AuthResponse login(LoginRequest request) {
                Authentication auth = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

                UserDetails userDetails = (UserDetails) auth.getPrincipal();
                String token = jwtService.generateToken(userDetails);

                return new AuthResponse(token);
        }

        @Override
        @Transactional(readOnly = true)
        public Set<PermissionResponse> getMyPermissions() {
                String email = SecurityContextHolder.getContext().getAuthentication().getName();

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "No se encontró el perfil del usuario logueado en el sistema."));

                return user.getRoles().stream()
                                .flatMap(role -> role.getPermissions().stream())
                                .map(permission -> new PermissionResponse(
                                                permission.getName(),
                                                permission.getPermissionType()))
                                .collect(Collectors.toSet());
        }
}