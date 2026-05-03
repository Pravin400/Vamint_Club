package com.vamint.service;

import com.vamint.dto.CreateLectureRequest;
import com.vamint.dto.LectureResponse;
import com.vamint.entity.Lecture;
import com.vamint.repository.LectureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LectureService {

    private final LectureRepository lectureRepository;

    public LectureResponse createLecture(CreateLectureRequest request) {
        Lecture lecture = new Lecture();
        lecture.setTitle(request.getTitle());
        lecture.setDescription(request.getDescription());
        lecture.setDateTime(request.getDateTime());

        Lecture savedLecture = lectureRepository.save(lecture);
        return new LectureResponse(
                savedLecture.getId(),
                savedLecture.getTitle(),
                savedLecture.getDescription(),
                savedLecture.getDateTime());
    }

    public List<LectureResponse> getAllLectures() {
        return lectureRepository.findAllOrderByDateTimeDesc()
                .stream()
                .map(lecture -> new LectureResponse(
                        lecture.getId(),
                        lecture.getTitle(),
                        lecture.getDescription(),
                        lecture.getDateTime()))
                .collect(Collectors.toList());
    }

    public List<LectureResponse> getUpcomingLectures() {
        return lectureRepository.findUpcomingLectures(LocalDateTime.now())
                .stream()
                .map(lecture -> new LectureResponse(
                        lecture.getId(),
                        lecture.getTitle(),
                        lecture.getDescription(),
                        lecture.getDateTime()))
                .collect(Collectors.toList());
    }

    public Lecture findById(Long id) {
        return lectureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecture not found with id: " + id));
    }

    public LectureResponse updateLecture(Long id, com.vamint.dto.CreateLectureRequest request) {
        Lecture lecture = findById(id);
        lecture.setTitle(request.getTitle());
        lecture.setDescription(request.getDescription());
        lecture.setDateTime(request.getDateTime());
        Lecture updated = lectureRepository.save(lecture);
        return new LectureResponse(
                updated.getId(),
                updated.getTitle(),
                updated.getDescription(),
                updated.getDateTime());
    }

    public void deleteLecture(Long id) {
        Lecture lecture = findById(id);
        lectureRepository.delete(lecture);
    }
}
