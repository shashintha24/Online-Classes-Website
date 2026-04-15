package com.skproduct.ElectroPhysics.config;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.skproduct.ElectroPhysics.assignment.AssignmentSubmission;
import com.skproduct.ElectroPhysics.assignment.AssignmentSubmissionRepository;
import com.skproduct.ElectroPhysics.assignment.ClassAssignment;
import com.skproduct.ElectroPhysics.assignment.ClassAssignmentRepository;
import com.skproduct.ElectroPhysics.assignment.SubmissionLike;
import com.skproduct.ElectroPhysics.assignment.SubmissionLikeRepository;
import com.skproduct.ElectroPhysics.auth.Role;
import com.skproduct.ElectroPhysics.auth.User;
import com.skproduct.ElectroPhysics.auth.UserRepository;
import com.skproduct.ElectroPhysics.student.StudentProfile;
import com.skproduct.ElectroPhysics.student.StudentProfileRepository;
import com.skproduct.ElectroPhysics.teacher.TeacherProfile;
import com.skproduct.ElectroPhysics.teacher.TeacherProfileRepository;

@Configuration
public class DataInitializer {

    @SuppressWarnings("unused")
    @Bean
    CommandLineRunner seedUsers(
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository,
            TeacherProfileRepository teacherProfileRepository,
            PasswordEncoder passwordEncoder,
            ClassAssignmentRepository assignmentRepository,
            AssignmentSubmissionRepository submissionRepository,
            SubmissionLikeRepository likeRepository) {
        return args -> {
            if (userRepository.findByUsername("admin1").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin1");
                admin.setEmail("admin@electrophysics.lk");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
            }

            User teacher = userRepository.findByUsername("teacher1").orElse(null);
            if (teacher == null) {
                teacher = new User();
                teacher.setUsername("teacher1");
                teacher.setEmail("teacher@electrophysics.lk");
                teacher.setPassword(passwordEncoder.encode("teacher123"));
                teacher.setRole(Role.TEACHER);
                teacher = userRepository.save(teacher);
            }

            if (teacherProfileRepository.count() == 0) {
                TeacherProfile teacherProfile = new TeacherProfile();
                teacherProfile.setUser(teacher);
                teacherProfile.setFullName("Teacher One");
                teacherProfile.setSubject("Physics");
                teacherProfileRepository.save(teacherProfile);
            }

            User student = userRepository.findByUsername("student1").orElse(null);
            if (student == null) {
                student = new User();
                student.setUsername("student1");
                student.setEmail("student@electrophysics.lk");
                student.setPassword(passwordEncoder.encode("student123"));
                student.setRole(Role.STUDENT);
                student = userRepository.save(student);
            }

            if (studentProfileRepository.count() == 0) {
                StudentProfile studentProfile = new StudentProfile();
                studentProfile.setUser(student);
                studentProfile.setFullName("Student One");
                studentProfile.setGrade("Grade 10");
                studentProfileRepository.save(studentProfile);
            }

            if (assignmentRepository.count() == 0) {
                ClassAssignment physicsPaper4 = new ClassAssignment();
                physicsPaper4.setTitle("Physics Paper 4");
                physicsPaper4.setSubject("Physics");
                physicsPaper4.setDescription("Electromagnetic induction");
                physicsPaper4.setDueDate(LocalDate.of(2026, 4, 14));
                physicsPaper4.setTotalStudents(28);
                physicsPaper4.setStatus("In progress");
                physicsPaper4 = assignmentRepository.save(physicsPaper4);

                ClassAssignment mathsProblemSet7 = new ClassAssignment();
                mathsProblemSet7.setTitle("Maths Problem Set 7");
                mathsProblemSet7.setSubject("Maths");
                mathsProblemSet7.setDescription("Integration & differentiation");
                mathsProblemSet7.setDueDate(LocalDate.of(2026, 4, 16));
                mathsProblemSet7.setTotalStudents(28);
                mathsProblemSet7.setStatus("Open");
                assignmentRepository.save(mathsProblemSet7);

                ClassAssignment chemistryLabReport2 = new ClassAssignment();
                chemistryLabReport2.setTitle("Chemistry Lab Report 2");
                chemistryLabReport2.setSubject("Chemistry");
                chemistryLabReport2.setDescription("Titration experiment");
                chemistryLabReport2.setDueDate(LocalDate.of(2026, 4, 18));
                chemistryLabReport2.setTotalStudents(28);
                chemistryLabReport2.setStatus("Open");
                assignmentRepository.save(chemistryLabReport2);

                ClassAssignment physicsPaper3 = new ClassAssignment();
                physicsPaper3.setTitle("Physics Paper 3");
                physicsPaper3.setSubject("Physics");
                physicsPaper3.setDescription("Waves & optics");
                physicsPaper3.setDueDate(LocalDate.of(2026, 4, 3));
                physicsPaper3.setTotalStudents(28);
                physicsPaper3.setStatus("Graded");
                physicsPaper3 = assignmentRepository.save(physicsPaper3);

                AssignmentSubmission s1 = new AssignmentSubmission();
                s1.setAssignment(physicsPaper4);
                s1.setStudentName("Kavindu Perera");
                s1.setSubmittedAt(LocalDateTime.of(2026, 4, 12, 14, 14));
                s1.setFileName("physics_p4_kp.pdf");
                s1.setGraded(false);
                submissionRepository.save(s1);

                AssignmentSubmission s2 = new AssignmentSubmission();
                s2.setAssignment(physicsPaper4);
                s2.setStudentName("Amali Silva");
                s2.setSubmittedAt(LocalDateTime.of(2026, 4, 12, 9, 5));
                s2.setFileName("amali_phys4.pdf");
                s2.setGraded(false);
                submissionRepository.save(s2);

                AssignmentSubmission s3 = new AssignmentSubmission();
                s3.setAssignment(physicsPaper3);
                s3.setStudentName("Kavindu Perera");
                s3.setSubmittedAt(LocalDateTime.of(2026, 4, 1, 16, 20));
                s3.setFileName("physics_p3_kp.pdf");
                s3.setMark("26/28");
                s3.setGraded(true);
                submissionRepository.save(s3);

                AssignmentSubmission s4 = new AssignmentSubmission();
                s4.setAssignment(physicsPaper3);
                s4.setStudentName("Amali Silva");
                s4.setSubmittedAt(LocalDateTime.of(2026, 4, 1, 15, 45));
                s4.setFileName("physics_p3_as.pdf");
                s4.setMark("25/28");
                s4.setGraded(true);
                submissionRepository.save(s4);

                SubmissionLike like1 = new SubmissionLike();
                like1.setSubmission(s1);
                like1.setStudentUserId(student.getId());
                likeRepository.save(like1);

                SubmissionLike like2 = new SubmissionLike();
                like2.setSubmission(s2);
                like2.setStudentUserId(student.getId());
                likeRepository.save(like2);
            }
        };
    }
}

