package com.example.backend.repository;

import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

import com.example.backend.model.Role;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);
}
