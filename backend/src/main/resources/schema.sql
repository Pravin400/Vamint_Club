CREATE TABLE IF NOT EXISTS admins (
    id        BIGINT       NOT NULL AUTO_INCREMENT,
    name      VARCHAR(255) NOT NULL,
    email     VARCHAR(255) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL,
    image_url VARCHAR(512),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS students (
    id        BIGINT       NOT NULL AUTO_INCREMENT,
    name      VARCHAR(255) NOT NULL,
    email     VARCHAR(255) NOT NULL UNIQUE,
    roll_no   VARCHAR(255) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL,
    image_url VARCHAR(512),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS lectures (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    date_time   DATETIME     NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS attendances (
    id         BIGINT  NOT NULL AUTO_INCREMENT,
    student_id BIGINT  NOT NULL,
    lecture_id BIGINT  NOT NULL,
    present    TINYINT(1) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_lecture FOREIGN KEY (lecture_id) REFERENCES lectures  (id) ON DELETE CASCADE
);
