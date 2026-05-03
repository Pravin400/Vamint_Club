package com.vamint.dto;

import lombok.Data;

@Data
public class AttendanceStatsResponse {
    private Long totalLectures;
    private Long presentCount;
    private Long absentCount;
    private Double attendancePercentage;
    
    public AttendanceStatsResponse(Long totalLectures, Long presentCount, Long absentCount, Double attendancePercentage) {
        this.totalLectures = totalLectures;
        this.presentCount = presentCount;
        this.absentCount = absentCount;
        this.attendancePercentage = attendancePercentage;
    }
}
