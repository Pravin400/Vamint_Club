package com.vamint.service;

import com.vamint.dto.AttendanceResponse;
import com.vamint.dto.AttendanceStatsResponse;
import com.vamint.dto.LectureAttendanceStatsResponse;
import com.vamint.dto.MarkAttendanceRequest;
import com.vamint.entity.Attendance;
import com.vamint.entity.Lecture;
import com.vamint.entity.Student;
import com.vamint.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    
    private final AttendanceRepository attendanceRepository;
    private final StudentService studentService;
    private final LectureService lectureService;
    
    public AttendanceResponse markAttendance(MarkAttendanceRequest request) {
        Student student = studentService.findById(request.getStudentId());
        Lecture lecture = lectureService.findById(request.getLectureId());
        
        Optional<Attendance> existingAttendance = attendanceRepository.findByStudentAndLecture(student, lecture);
        
        Attendance attendance;
        if (existingAttendance.isPresent()) {
            attendance = existingAttendance.get();
            attendance.setPresent(request.getPresent());
        } else {
            attendance = new Attendance();
            attendance.setStudent(student);
            attendance.setLecture(lecture);
            attendance.setPresent(request.getPresent());
        }
        
        Attendance savedAttendance = attendanceRepository.save(attendance);
        
        return new AttendanceResponse(
            savedAttendance.getId(),
            savedAttendance.getStudent().getName(),
            savedAttendance.getStudent().getRollNo(),
            savedAttendance.getLecture().getTitle(),
            savedAttendance.getPresent()
        );
    }
    
    public List<AttendanceResponse> getAttendanceForLecture(Long lectureId) {
        Lecture lecture = lectureService.findById(lectureId);
        return attendanceRepository.findByLecture(lecture)
            .stream()
            .map(attendance -> new AttendanceResponse(
                attendance.getId(),
                attendance.getStudent().getName(),
                attendance.getStudent().getRollNo(),
                attendance.getLecture().getTitle(),
                attendance.getPresent()
            ))
            .collect(Collectors.toList());
    }
    
    public AttendanceStatsResponse getStudentAttendanceStats(Long studentId) {
        Student student = studentService.findById(studentId);
        
        Long presentCount = attendanceRepository.countPresentByStudent(student);
        Long absentCount = attendanceRepository.countAbsentByStudent(student);
        Long totalCount = attendanceRepository.countTotalByStudent(student);
        
        Double attendancePercentage = totalCount > 0 ? (presentCount.doubleValue() / totalCount.doubleValue()) * 100 : 0.0;
        
        return new AttendanceStatsResponse(totalCount, presentCount, absentCount, attendancePercentage);
    }
    
    public LectureAttendanceStatsResponse getLectureAttendanceStats(Long lectureId) {
        Lecture lecture = lectureService.findById(lectureId);
        List<AttendanceResponse> attendanceDetails = getAttendanceForLecture(lectureId);
        
        Long presentCount = attendanceDetails.stream().mapToLong(a -> a.getPresent() ? 1 : 0).sum();
        Long absentCount = attendanceDetails.stream().mapToLong(a -> !a.getPresent() ? 1 : 0).sum();
        Long totalStudents = (long) attendanceDetails.size();
        
        Double attendancePercentage = totalStudents > 0 ? (presentCount.doubleValue() / totalStudents.doubleValue()) * 100 : 0.0;
        
        return new LectureAttendanceStatsResponse(
            lecture.getId(),
            lecture.getTitle(),
            lecture.getDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")),
            totalStudents,
            presentCount,
            absentCount,
            attendancePercentage,
            attendanceDetails
        );
    }
}
