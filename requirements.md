# Student Attendance Management System (SAMS)

## Problem Statement
In many universities, attendance tracking is still handled manually or using fragmented systems that are inefficient, error-prone, and time-consuming. Students often lack real-time visibility into their attendance percentage, while teachers struggle with managing large class attendance records accurately. Administrative staff also face difficulties managing users and permissions without technical intervention.

## Proposed Solution
The Attendance Tracker is a web-based system that provides an integrated platform for students, teachers, and administrators to manage attendance efficiently. The system automates attendance recording, calculation, reporting, and user management, ensuring accuracy, transparency, and ease of use.

## Why the System Is Needed
- Manual attendance leads to mistakes and data loss  
- Students need instant access to attendance status and grades  
- Teachers require fast and reliable tools for marking attendance  
- Admins need a simple way to manage users without coding  
- Universities need a scalable and secure digital solution  

## Target Users
- **Students:** View attendance, courses, grades, and alerts  
- **Teachers:** Manage courses, mark attendance, view student performance  
- **Administrators:** Manage users, roles, and system access  

## Main Goal of the System
To provide a centralized, secure, and user-friendly attendance management system that:  
- Tracks attendance automatically  
- Calculates attendance percentages and grades  
- Improves transparency between students and teachers  
- Reduces administrative workload  

## Platform
Web Application

## Technology Stack 
- Frontend: React.js  
- Backend: Django + Django REST Framework  
- Authentication: JWT (JSON Web Tokens)  
- Database: PostgreSQL / SQLite  
- Admin Panel: Django Admin  

---

# Project Requirements

## Functional Requirements

### Authentication & User Management
- The system shall allow users to log in using email or username.  
- The system shall authenticate users using JWT tokens.  
- The system shall redirect users based on their role (Student / Teacher).  
- The system shall allow users to securely log out.  
- The system shall allow administrators to create, edit, and delete users.  

### Student Features
- The system shall display a student dashboard showing enrolled courses.  
- The system shall show attendance percentage for each course.  
- The system shall calculate grades based on attendance.  
- The system shall display past attendance records (Present / Absent / Late).  
- The system shall display today's attendance summary.  
- The system shall allow students to view detailed course information.  

### Teacher Features
- The system shall display a teacher dashboard with assigned courses.  
- The system shall allow teachers to view all students in a course.  
- The system shall allow teachers to mark attendance by date.  
- The system shall support attendance statuses (Present, Absent, Late).  
- The system shall allow teachers to add notes for each student.  
- The system shall support bulk actions such as "Mark All Present".  

### Admin Features
- The system shall provide an admin dashboard for managing users.  
- The system shall allow role assignment (Student, Teacher, Admin).  
- The system shall provide search and filtering for user records.  

---

## Non-Functional Requirements

### Performance
- The system shall respond to user actions within 2 seconds.  
- The system shall support concurrent users without performance degradation.  

### Security
- Passwords shall be stored using secure hashing.  
- JWT tokens shall be used for API authentication.  
- Unauthorized users shall not access protected endpoints.  

### Usability
- The system shall have a clean and intuitive user interface.  
- The system shall support responsive design for different screen sizes.  

### Availability
- The system shall be available 24/7 except during scheduled maintenance.  

### Maintainability
- The system shall follow modular architecture.  
- Code shall be readable and documented.  

---

## Constraints
- Project must be completed within the university semester timeline.  
- Development tools must comply with university guidelines.  
- Team size is limited (solo or small team).  
- Internet connection is required to access the system.
