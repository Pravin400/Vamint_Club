package com.vamint.dto;

import lombok.Data;

@Data
public class AttendanceResponse {
    private Long id;
    private String studentName;
    private String studentRollNo;
    private String lectureTitle;
    private Boolean present;
    
    public AttendanceResponse(Long id, String studentName, String studentRollNo, String lectureTitle, Boolean present) {
        this.id = id;
        this.studentName = studentName;
        this.studentRollNo = studentRollNo;
        this.lectureTitle = lectureTitle;
        this.present = present;
    }
}
