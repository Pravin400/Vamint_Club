package com.vamint.controller;

import com.vamint.dto.*;
import com.vamint.entity.Student;
import com.vamint.service.AdminService;
import com.vamint.service.AttendanceService;
import com.vamint.service.LectureService;
import com.vamint.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AdminController {

    private final LectureService lectureService;
    private final AttendanceService attendanceService;
    private final StudentService studentService;
    private final AdminService adminService;

    @PostMapping("/lectures")
    public ResponseEntity<LectureResponse> createLecture(@Valid @RequestBody CreateLectureRequest request) {
        LectureResponse response = lectureService.createLecture(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/lectures")
    public ResponseEntity<List<LectureResponse>> getAllLectures() {
        List<LectureResponse> lectures = lectureService.getAllLectures();
        return ResponseEntity.ok(lectures);
    }

    @PutMapping("/lectures/{id}")
    public ResponseEntity<LectureResponse> updateLecture(@PathVariable Long id,
            @Valid @RequestBody CreateLectureRequest request) {
        LectureResponse response = lectureService.updateLecture(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/lectures/{id}")
    public ResponseEntity<Void> deleteLecture(@PathVariable Long id) {
        lectureService.deleteLecture(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/attendance")
    public ResponseEntity<AttendanceResponse> markAttendance(@Valid @RequestBody MarkAttendanceRequest request) {
        AttendanceResponse response = attendanceService.markAttendance(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/lectures/{lectureId}/attendance")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceForLecture(@PathVariable Long lectureId) {
        List<AttendanceResponse> attendance = attendanceService.getAttendanceForLecture(lectureId);
        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        try {
            List<com.vamint.dto.StudentResponse> students = studentService.getAllStudentsDto();
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/students")
    public ResponseEntity<com.vamint.dto.StudentResponse> createStudent(
            @Valid @RequestBody CreateStudentRequest request) {
        com.vamint.entity.Student student = studentService.createStudent(request);
        return ResponseEntity.ok(studentService.toDto(student));
    }

    @GetMapping("/admins")
    public ResponseEntity<List<com.vamint.entity.Admin>> getAllAdmins() {
        List<com.vamint.entity.Admin> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    @PostMapping("/admins")
    public ResponseEntity<com.vamint.entity.Admin> createAdmin(@Valid @RequestBody CreateAdminRequest request) {
        com.vamint.entity.Admin admin = adminService.createAdmin(request);
        return ResponseEntity.ok(admin);
    }

    @GetMapping("/lectures/{lectureId}/attendance-stats")
    public ResponseEntity<LectureAttendanceStatsResponse> getLectureAttendanceStats(@PathVariable Long lectureId) {
        LectureAttendanceStatsResponse stats = attendanceService.getLectureAttendanceStats(lectureId);
        return ResponseEntity.ok(stats);
    }

    // Student CRUD Operations
    @GetMapping("/students/{id}")
    public ResponseEntity<com.vamint.dto.StudentResponse> getStudent(@PathVariable Long id) {
        com.vamint.entity.Student student = studentService.findById(id);
        return ResponseEntity.ok(studentService.toDto(student));
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<com.vamint.dto.StudentResponse> updateStudent(@PathVariable Long id,
            @Valid @RequestBody CreateStudentRequest request) {
        com.vamint.entity.Student student = studentService.updateStudent(id, request);
        return ResponseEntity.ok(studentService.toDto(student));
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok().build();
    }

    // Admin CRUD Operations
    @GetMapping("/admins/{id}")
    public ResponseEntity<com.vamint.entity.Admin> getAdmin(@PathVariable Long id) {
        com.vamint.entity.Admin admin = adminService.findById(id);
        return ResponseEntity.ok(admin);
    }

    @PutMapping("/admins/{id}")
    public ResponseEntity<com.vamint.entity.Admin> updateAdmin(@PathVariable Long id,
            @Valid @RequestBody CreateAdminRequest request) {
        com.vamint.entity.Admin admin = adminService.updateAdmin(id, request);
        return ResponseEntity.ok(admin);
    }

    @DeleteMapping("/admins/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.ok().build();
    }
}
