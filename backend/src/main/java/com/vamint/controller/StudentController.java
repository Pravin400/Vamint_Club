package com.vamint.controller;

import com.vamint.dto.AttendanceStatsResponse;
import com.vamint.dto.LectureResponse;
import com.vamint.entity.Student;
import com.vamint.service.AttendanceService;
import com.vamint.service.LectureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class StudentController {

    private final LectureService lectureService;
    private final AttendanceService attendanceService;

    @GetMapping("/lectures/upcoming")
    public ResponseEntity<java.util.List<LectureResponse>> getUpcomingLectures() {
        java.util.List<LectureResponse> lectures = lectureService.getUpcomingLectures();
        return ResponseEntity.ok(lectures);
    }

    @GetMapping("/{studentId}/attendance-stats")
    public ResponseEntity<AttendanceStatsResponse> getAttendanceStats(@PathVariable Long studentId) {
        AttendanceStatsResponse stats = attendanceService.getStudentAttendanceStats(studentId);
        return ResponseEntity.ok(stats);
    }
}
