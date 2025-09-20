package com.vamint.service;

import com.vamint.dto.CreateAdminRequest;
import com.vamint.entity.Admin;
import com.vamint.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Admin findById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
    }

    public Admin findByEmail(String email) {
        return adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found with email: " + email));
    }

    public Admin createAdmin(CreateAdminRequest request) {
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Admin with email " + request.getEmail() + " already exists");
        }

        Admin admin = new Admin();
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPassword(request.getPassword());

        return adminRepository.save(admin);
    }

    public boolean authenticateAdmin(String email, String password) {
        try {
            Admin admin = findByEmail(email);
            return admin.getPassword().equals(password);
        } catch (RuntimeException e) {
            return false;
        }
    }

    public Admin updateAdmin(Long id, CreateAdminRequest request) {
        Admin admin = findById(id);

        // Check if email is being changed and if it already exists
        if (!admin.getEmail().equals(request.getEmail()) && adminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Admin with email " + request.getEmail() + " already exists");
        }

        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPassword(request.getPassword());

        return adminRepository.save(admin);
    }

    public void deleteAdmin(Long id) {
        Admin admin = findById(id);
        adminRepository.delete(admin);
    }
}
