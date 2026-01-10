package com.example.backend;

import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (!userRepository.existsByEmail("admin@cod.com")) {
				User admin = new User();
				admin.setName("System Admin");
				admin.setEmail("admin@cod.com");
				admin.setPhone("0000000000");
				admin.setPassword(passwordEncoder.encode("admin"));
				admin.setRole(Role.ADMIN);
				userRepository.save(admin);
				System.out.println("Default Admin account created: admin@cod.com / admin");
			}
		};
	}
}
