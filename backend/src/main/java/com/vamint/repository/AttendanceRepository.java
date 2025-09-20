package com.vamint.repository;

import com.vamint.entity.Attendance;
import com.vamint.entity.Lecture;
import com.vamint.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface




















AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByLecture(Lecture lecture);

    List<Attendance> findByStudent(Student student);

    Optional<Attendance> findByStudentAndLecture(Student student, Lecture lecture);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = :student AND a.present = true")
    Long countPresentByStudent(@Param("student") Student student);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = :student AND a.present = false")
    Long countAbsentByStudent(@Param("student") Student student);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = :student")
    Long countTotalByStudent(@Param("student") Student student);
}
