package com.vamint.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MarkAttendanceRequest {
    
    @NotNull(message = "Student ID is required")
    private Long studentId;
    
    @NotNull(message = "Lecture ID is required")
    private Long lectureId;
    
    @NotNull(message = "Present status is required")
    private Boolean present;
}
