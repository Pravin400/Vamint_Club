package com.vamint.repository;

import com.vamint.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {
    
    @Query("SELECT l FROM Lecture l WHERE l.dateTime >= :currentDateTime ORDER BY l.dateTime ASC")
    List<Lecture> findUpcomingLectures(LocalDateTime currentDateTime);
    
    @Query("SELECT l FROM Lecture l ORDER BY l.dateTime DESC")
    List<Lecture> findAllOrderByDateTimeDesc();
}
