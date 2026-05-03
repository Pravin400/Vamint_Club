package com.vamint.service;

import com.vamint.dto.CreateStudentRequest;
import com.vamint.entity.Student;
import com.vamint.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    @Value("${default.profile.imageUrl:}")
    private String defaultProfileImageUrl;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public java.util.List<com.vamint.dto.StudentResponse> getAllStudentsDto() {
        return studentRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(java.util.stream.Collectors.toList());
    }

    public Student findById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public Student findByRollNo(String rollNo) {
        return studentRepository.findByRollNo(rollNo)
                .orElseThrow(() -> new RuntimeException("Student not found with roll number: " + rollNo));
    }

    public Student findByEmail(String email) {
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found with email: " + email));
    }

    public Student createStudent(CreateStudentRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Student with email " + request.getEmail() + " already exists");
        }
        if (studentRepository.existsByRollNo(request.getRollNo())) {
            throw new RuntimeException("Student with roll number " + request.getRollNo() + " already exists");
        }

        Student student = new Student();
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setRollNo(request.getRollNo());
        student.setPassword(request.getPassword());

        return studentRepository.save(student);
    }

    // new helper to create with imageUrl
    public Student createStudent(CreateStudentRequest request, String imageUrl) {
        Student student = createStudent(request);
        String toSave = imageUrl != null ? imageUrl
                : (defaultProfileImageUrl != null && !defaultProfileImageUrl.isBlank() ? defaultProfileImageUrl : null);
        if (toSave != null) {
            student.setImageUrl(toSave);
            student = studentRepository.save(student);
        }
        return student;
    }

    public Student updateStudent(Long id, CreateStudentRequest request) {
        Student student = findById(id);

        // Check if email is being changed and if it already exists
        if (!student.getEmail().equals(request.getEmail()) && studentRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Student with email " + request.getEmail() + " already exists");
        }

        // Check if roll number is being changed and if it already exists
        if (!student.getRollNo().equals(request.getRollNo()) && studentRepository.existsByRollNo(request.getRollNo())) {
            throw new RuntimeException("Student with roll number " + request.getRollNo() + " already exists");
        }

        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setRollNo(request.getRollNo());
        student.setPassword(request.getPassword());

        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, CreateStudentRequest request, String imageUrl) {
        Student student = updateStudent(id, request);
        if (imageUrl != null) {
            student.setImageUrl(imageUrl);
            student = studentRepository.save(student);
        } else if ((student.getImageUrl() == null || student.getImageUrl().isBlank()) && defaultProfileImageUrl != null
                && !defaultProfileImageUrl.isBlank()) {
            student.setImageUrl(defaultProfileImageUrl);
            student = studentRepository.save(student);
        }
        return student;
    }

    public void deleteStudent(Long id) {
        Student student = findById(id);
        studentRepository.delete(student);
    }

    public com.vamint.dto.StudentResponse toDto(Student student) {
        return new com.vamint.dto.StudentResponse(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getRollNo(),
                student.getImageUrl());
    }
}
