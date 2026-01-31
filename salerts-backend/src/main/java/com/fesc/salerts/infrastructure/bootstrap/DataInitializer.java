package com.fesc.salerts.infrastructure.bootstrap;

import com.fesc.salerts.domain.entities.security.Role;
import com.fesc.salerts.domain.entities.security.User;
import com.fesc.salerts.domain.repositories.RoleRepository;
import com.fesc.salerts.domain.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@fesc.edu.co").isEmpty()) {
            
            Optional<Role> adminRole = roleRepository.findByName("ADMINISTRATOR");
            
            if (adminRole.isPresent()) {
                User admin = new User();
                admin.setName("Admin");
                admin.setLastname("super user");
                admin.setNit("1002043829");
                admin.setCellphone("3110078123");
                admin.setAddress("direccion del admin");
                admin.setEmail("admin@fesc.edu.co");
                admin.setPassword(passwordEncoder.encode("admin123")); 
                admin.setRoles(Collections.singleton(adminRole.get()));
                
                userRepository.save(admin);
                System.out.println("Admin user created successfully via DataInitializer");
            }
        }
    }
}