INSERT IGNORE INTO admins (name, email, password, image_url)
VALUES ('Admin User', 'admin@vamint.com', 'admin123', NULL);

INSERT IGNORE INTO students (name, email, roll_no, password, image_url)
VALUES ('Pravin Kumar',  'pravin@vamint.com',  'STU001', 'student123', NULL);

INSERT IGNORE INTO students (name, email, roll_no, password, image_url)
VALUES ('Student Two',   'student2@vamint.com', 'STU002', 'student123', NULL);

INSERT IGNORE INTO lectures (id, title, description, date_time)
VALUES (1, 'Introduction to Vamint Club',   'Orientation lecture for all new members.',           '2026-05-05 10:00:00');

INSERT IGNORE INTO lectures (id, title, description, date_time)
VALUES (2, 'Web Development Basics',         'HTML, CSS and JavaScript fundamentals.',             '2026-05-07 11:00:00');

INSERT IGNORE INTO lectures (id, title, description, date_time)
VALUES (3, 'Spring Boot Deep Dive',          'REST APIs, JPA and Spring Boot best practices.',     '2026-05-10 09:30:00');
