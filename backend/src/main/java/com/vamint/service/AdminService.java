package com.vamint.service;

import com.vamint.dto.CreateAdminRequest;
import com.vamint.entity.Admin;
import com.vamint.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    @Value("${default.profile.imageUrl:}")
    private String defaultProfileImageUrl;

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

    // Create admin with imageUrl required
    public Admin createAdmin(CreateAdminRequest request, String imageUrl) {
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Admin with email " + request.getEmail() + " already exists");
        }

        Admin admin = new Admin();
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPassword(request.getPassword());
        String toSave = imageUrl != null ? imageUrl
                : (defaultProfileImageUrl != null && !defaultProfileImageUrl.isBlank() ? defaultProfileImageUrl : null);
        if (toSave != null)
            admin.setImageUrl(toSave);

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

    public Admin updateAdmin(Long id, CreateAdminRequest request, String imageUrl) {
        Admin admin = updateAdmin(id, request);
        if (imageUrl != null) {
            admin.setImageUrl(imageUrl);
            admin = adminRepository.save(admin);
        } else if ((admin.getImageUrl() == null || admin.getImageUrl().isBlank()) && defaultProfileImageUrl != null
                && !defaultProfileImageUrl.isBlank()) {
            admin.setImageUrl(defaultProfileImageUrl);
            admin = adminRepository.save(admin);
        }
        return admin;
    }

    public void deleteAdmin(Long id) {
        Admin admin = findById(id);
        adminRepository.delete(admin);
    }
}
