package com.vamint.service;

import com.vamint.dto.LoginRequest;
import com.vamint.dto.LoginResponse;
import com.vamint.entity.Admin;
import com.vamint.entity.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminService adminService;
    private final StudentService studentService;

    public LoginResponse authenticate(LoginRequest request) {
        if ("admin".equals(request.getUserType())) {
            return authenticateAdmin(request);
        } else if ("student".equals(request.getUserType())) {
            return authenticateStudent(request);
        } else {
            return new LoginResponse(false, "Invalid user type", null, null, null, null);
        }
    }

    private LoginResponse authenticateAdmin(LoginRequest request) {
        try {
            Admin admin = adminService.findByEmail(request.getEmail());
            if (admin.getPassword().equals(request.getPassword())) {
                return new LoginResponse(true, "Login successful", "admin", admin.getId(), admin.getName(),
                        admin.getEmail());
            } else {
                return new LoginResponse(false, "Invalid password", null, null, null, null);
            }
        } catch (RuntimeException e) {
            return new LoginResponse(false, "Admin not found", null, null, null, null);
        }
    }

    private LoginResponse authenticateStudent(LoginRequest request) {
        try {
            Student student = studentService.findByEmail(request.getEmail());
            if (student.getPassword().equals(request.getPassword())) {
                return new LoginResponse(true, "Login successful", "student", student.getId(), student.getName(),
                        student.getEmail());
            } else {
                return new LoginResponse(false, "Invalid credentials", null, null, null, null);
            }
        } catch (RuntimeException e) {
            return new LoginResponse(false, "Student not found", null, null, null, null);
        }
    }
}
