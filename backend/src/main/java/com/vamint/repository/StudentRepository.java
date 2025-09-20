package com.vamint.repository;

import com.vamint.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    Optional<Student> findByRollNo(String rollNo);
    boolean existsByEmail(String email);
    boolean existsByRollNo(String rollNo);
}
