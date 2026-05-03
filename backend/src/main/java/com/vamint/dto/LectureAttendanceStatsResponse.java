package com.vamint.dto;

import lombok.Data;

import java.util.List;

@Data
public class LectureAttendanceStatsResponse {
    private Long lectureId;
    private String lectureTitle;
    private String lectureDate;
    private Long totalStudents;
    private Long presentCount;
    private Long absentCount;
    private Double attendancePercentage;
    private List<AttendanceResponse> attendanceDetails;
    
    public LectureAttendanceStatsResponse(Long lectureId, String lectureTitle, String lectureDate, 
                                        Long totalStudents, Long presentCount, Long absentCount, 
                                        Double attendancePercentage, List<AttendanceResponse> attendanceDetails) {
        this.lectureId = lectureId;
        this.lectureTitle = lectureTitle;
        this.lectureDate = lectureDate;
        this.totalStudents = totalStudents;
        this.presentCount = presentCount;
        this.absentCount = absentCount;
        this.attendancePercentage = attendancePercentage;
        this.attendanceDetails = attendanceDetails;
    }
}
