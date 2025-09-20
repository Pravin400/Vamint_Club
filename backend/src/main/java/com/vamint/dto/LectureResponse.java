package com.vamint.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LectureResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dateTime;
    
    public LectureResponse(Long id, String title, String description, LocalDateTime dateTime) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dateTime = dateTime;
    }
}
